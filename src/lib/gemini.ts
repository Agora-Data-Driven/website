/**
 * Minimal Vertex AI (Gemini) client for the "Quiz from my notes" feature on the
 * Skill Tests page. Auth is Application Default Credentials — the Cloud Run
 * runtime service account in production, or `gcloud auth application-default
 * login` locally (same model the Mastery Engine uses). There is NO API key.
 *
 * It does two jobs:
 *   1. extractDocumentText() — read an uploaded PDF/image to plain text via
 *      Gemini's native multimodal reading (text files are decoded by the caller).
 *   2. generateQuizFromContent() — write a multiple-choice quiz GROUNDED in that
 *      material, each question carrying a one-sentence explanation, in the exact
 *      shape the Skill Tests overlay renders ({ question, options, correctIndex,
 *      explanation }).
 *
 * The Skill Tests overlay renders plain text (no KaTeX/markdown), so the model is
 * told to write math in plain readable form, unlike the Mastery Engine which
 * renders LaTeX.
 */
import { GoogleAuth } from 'google-auth-library';
import { serverEnv } from '@lib/env';

const MODEL = serverEnv('GEMINI_MODEL') || 'gemini-2.5-flash';
// "global" serves the 2.5 models everywhere and avoids regional capacity errors.
const LOCATION = serverEnv('GEMINI_LOCATION') || 'global';

const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
let projectIdPromise: Promise<string> | undefined;

async function projectId(): Promise<string> {
  if (!projectIdPromise) {
    projectIdPromise = auth.getProjectId().catch((e: unknown) => {
      projectIdPromise = undefined; // let a later call retry
      throw new Error(
        `Could not determine the GCP project for Vertex AI (set GOOGLE_CLOUD_PROJECT or run 'gcloud auth application-default login'): ${
          e instanceof Error ? e.message : String(e)
        }`,
      );
    });
  }
  return projectIdPromise;
}

async function vertexTarget(
  model: string,
  method: string,
): Promise<{ url: string; token: string }> {
  const project = await projectId();
  const host =
    LOCATION === 'global' ? 'aiplatform.googleapis.com' : `${LOCATION}-aiplatform.googleapis.com`;
  const url = `https://${host}/v1/projects/${project}/locations/${LOCATION}/publishers/google/models/${model}:${method}`;
  const token = await auth.getAccessToken();
  if (!token) throw new Error('Vertex AI auth failed: no access token from ADC');
  return { url, token };
}

interface TextPart {
  text: string;
}
interface InlineDataPart {
  inlineData: { mimeType: string; data: string };
}
type Part = TextPart | InlineDataPart;

interface GenConfig {
  responseMimeType?: string;
  responseSchema?: unknown;
  thinkingConfig?: { thinkingBudget: number };
  maxOutputTokens?: number;
}

interface GenOpts {
  json?: boolean;
  schema?: unknown;
  /** Extended thinking; off (fast) by default for these JSON-heavy calls. */
  thinking?: boolean;
  maxOutputTokens?: number;
}

function genConfig(model: string, opts: GenOpts): GenConfig | undefined {
  const gc: GenConfig = {};
  if (opts.json || opts.schema) gc.responseMimeType = 'application/json';
  if (opts.schema) gc.responseSchema = opts.schema;
  // Only Flash accepts a zero thinking budget; Pro rejects it, so leave it alone.
  if (opts.thinking === false && /flash/i.test(model)) gc.thinkingConfig = { thinkingBudget: 0 };
  if (opts.maxOutputTokens) gc.maxOutputTokens = opts.maxOutputTokens;
  return Object.keys(gc).length ? gc : undefined;
}

/** Blocking Gemini call over Vertex REST with an arbitrary parts array. */
async function callGeminiParts(parts: Part[], opts: GenOpts = {}): Promise<string> {
  const model = MODEL;
  const { url, token } = await vertexTarget(model, 'generateContent');
  const body: Record<string, unknown> = { contents: [{ role: 'user', parts }] };
  const gc = genConfig(model, opts);
  if (gc) body.generationConfig = gc;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Vertex Gemini ${res.status}: ${txt.slice(0, 300)}`);
  }
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? '').join('');
  if (!text) throw new Error('Gemini returned no content');
  return text;
}

/** Text-only convenience wrapper. */
function callGemini(prompt: string, opts: GenOpts = {}): Promise<string> {
  return callGeminiParts([{ text: prompt }], opts);
}

/* ----------------------------- JSON parsing ------------------------------- */

const CTRL_ESCAPES: Record<number, string> = {
  8: '\\b',
  9: '\\t',
  10: '\\n',
  12: '\\f',
  13: '\\r',
};
function escapeRawControlsInStrings(s: string): string {
  let out = '';
  let inStr = false;
  let esc = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (esc) {
        out += ch;
        esc = false;
        continue;
      }
      if (ch === '\\') {
        out += ch;
        esc = true;
        continue;
      }
      if (ch === '"') {
        inStr = false;
        out += ch;
        continue;
      }
      const code = s.charCodeAt(i);
      if (code < 0x20) {
        out += CTRL_ESCAPES[code] || `\\u${code.toString(16).padStart(4, '0')}`;
        continue;
      }
      out += ch;
    } else {
      if (ch === '"') inStr = true;
      out += ch;
    }
  }
  return out;
}

/**
 * Parse JSON returned by an LLM, tolerating a leading <think> block, a ```json
 * fence, prose around the payload, raw control chars inside strings, and stray
 * backslashes. Strict parse is always tried first, so valid JSON is untouched.
 */
function parseLooseJson(raw: string): unknown {
  let s = raw.trim();
  s = s.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  const open = s.search(/[{[]/);
  if (open > 0) s = s.slice(open);
  if (s[0] === '{' || s[0] === '[') {
    const close = s.lastIndexOf(s[0] === '{' ? '}' : ']');
    if (close > 0) s = s.slice(0, close + 1);
  }
  try {
    return JSON.parse(s);
  } catch (e) {
    const repaired = escapeRawControlsInStrings(s).replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
    if (repaired !== s) {
      try {
        return JSON.parse(repaired);
      } catch {
        /* fall through */
      }
    }
    throw e;
  }
}

/* ------------------------- Blog topic normalisation ----------------------- */

/**
 * Turn a rough idea from the "Create Blog" box (e.g. "data for marketing", or a
 * whole sentence) into ONE concrete, searchable blog topic the SEO pipeline can
 * use as its `--topic`. The pipeline looks the phrase up in DataForSEO and builds
 * a brief around it, so a vague phrase yields weak (or deferred) results — this
 * tightens it into a real keyword aligned to Agora's silos. Returns a clean
 * single-line phrase; on any failure returns the trimmed input unchanged so the
 * button still works.
 */
export async function topicFromDescription(raw: string): Promise<string> {
  const input = raw.trim().replace(/\s+/g, ' ').slice(0, 400);
  if (!input) return '';
  const prompt = `You are an SEO content strategist for Agora Data Driven, a data-driven marketing and analytics agency. Its blog covers three areas:
- Analytics & Measurement (GA4, server-side tracking, attribution, measurement, first-party data)
- Paid Acquisition & Creative Testing (paid media strategy, DOOH / out-of-home, ad creative testing, launching ad channels)
- Lead Conversion & Lifecycle (lead nurturing, lead scoring, lifecycle & automated email, conversion)

Turn the user's rough idea into ONE specific, searchable blog topic: a concise keyword phrase a real person would type into Google (about 3-8 words), tightly aligned to the agency's focus above. Prefer a phrase with genuine search demand over a clever title. Do NOT return a sentence, a question, quotes, or any explanation — output ONLY the phrase on a single line.

User's idea: "${input}"`;

  try {
    const out = await callGemini(prompt, { thinking: false, maxOutputTokens: 40 });
    // Take the first non-empty line, strip surrounding quotes / trailing punctuation.
    const phrase = (out.split('\n').find((l) => l.trim()) ?? '')
      .trim()
      .replace(/^["'`]+|["'`]+$/g, '')
      .replace(/[.?!]+$/g, '')
      .replace(/\s+/g, ' ')
      .slice(0, 120)
      .trim();
    return phrase || input.slice(0, 120);
  } catch {
    return input.slice(0, 120);
  }
}

/* ---------------------------- Quiz generation ----------------------------- */

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface RawMcq {
  question?: unknown;
  options?: unknown;
  answerIndex?: unknown;
  explanation?: unknown;
}

/** Validate + normalise one raw MCQ into the overlay's shape, or null if unusable. */
function normalizeMcq(raw: RawMcq): GeneratedQuestion | null {
  if (!raw || typeof raw.question !== 'string' || !Array.isArray(raw.options)) return null;
  const options = raw.options.map((o) => String(o).trim());
  if (options.length < 2 || options.some((o) => !o)) return null;

  let idx = raw.answerIndex;
  if (typeof idx === 'string' && /^\d+$/.test(idx.trim())) idx = parseInt(idx, 10);
  if (typeof idx !== 'number' || !Number.isInteger(idx) || idx < 0 || idx >= options.length)
    return null;

  const question = raw.question.trim();
  if (!question) return null;
  const explanation = typeof raw.explanation === 'string' ? raw.explanation.trim() : '';
  return { question, options, correctIndex: idx, explanation };
}

const DIFFICULTY_DIRECTIVE: Record<string, string> = {
  core: `DIFFICULTY: CORE (first pass). Write a FAIR question that checks the learner can APPLY the core idea in a straightforward, representative case. Do NOT use trick questions, obscure edge cases, or answers that hinge on an exception they could not anticipate. Distractors are honest common mistakes, not adversarial traps.`,
  balanced: `DIFFICULTY: BALANCED. Write a question that needs genuine understanding: apply the idea in a slightly non-obvious case, with plausible-misconception distractors. Mild edge-awareness is fine; avoid adversarial trickery and ambiguous corner cases.`,
  challenge: `DIFFICULTY: CHALLENGE. Push into edge cases, boundary conditions, and subtle misconceptions that separate deep mastery from surface familiarity. It MUST remain FAIR: exactly one defensibly-correct answer, unambiguous, never dependent on trivia the learner cannot reason out from the material itself.`,
};

const MCQ_SCHEMA = {
  type: 'object',
  properties: {
    question: { type: 'string' },
    options: { type: 'array', items: { type: 'string' } },
    answerIndex: { type: 'integer' },
    explanation: { type: 'string' },
  },
  required: ['question', 'options', 'answerIndex', 'explanation'],
  propertyOrdering: ['question', 'options', 'answerIndex', 'explanation'],
};
const MCQ_ARRAY_SCHEMA = { type: 'array', items: MCQ_SCHEMA };

function avoidBlock(existing: string[]): string {
  const list = existing
    .map((q) => q.trim())
    .filter(Boolean)
    .slice(0, 60);
  if (!list.length) return '';
  return `ALREADY WRITTEN (do NOT duplicate or paraphrase any of these):\n${list
    .map((q) => `- ${q}`)
    .join('\n')}\n`;
}

export interface GenerateArgs {
  content: string;
  extraContext?: string;
  count?: number;
  difficulty?: string;
}

/**
 * Generate a quiz grounded ONLY in the supplied material. 'auto' difficulty maps
 * to BALANCED (there is no per-learner history here). For larger counts it works
 * in sequential waves, feeding earlier questions back as an avoid-list so a big
 * quiz stays distinct and never truncates one giant JSON blob.
 */
export async function generateQuizFromContent({
  content,
  extraContext = '',
  count = 8,
  difficulty = 'auto',
}: GenerateArgs): Promise<GeneratedQuestion[]> {
  const material = content.trim();
  if (!material) throw new Error('No source material to build a quiz from');

  const total = Math.min(30, Math.max(1, Math.floor(count) || 8));
  const level = ['core', 'balanced', 'challenge'].includes(difficulty) ? difficulty : 'balanced';
  const steer = extraContext.trim().slice(0, 1200);

  const build = (n: number, avoid: string[]): string =>
    `You are a Wise Master Educator and Professional Test Developer. A learner has given you their OWN study material and wants a quiz that tests genuine mastery of it.

SOURCE MATERIAL (this is the ONLY ground truth: every question and its correct answer MUST be answerable and verifiable from this text alone):
"""
${material}
"""
${
  steer
    ? `\nADDITIONAL INSTRUCTIONS FROM THE LEARNER (honour these when they do not conflict with staying grounded in the material):\n"""\n${steer}\n"""\n`
    : ''
}
${DIFFICULTY_DIRECTIVE[level]}

${avoidBlock(avoid)}YOUR MISSION:
1. First, silently identify the key concepts, definitions, claims, procedures and relationships in the material. Then write ${n} multiple-choice questions that TOGETHER give broad coverage of what matters most.
2. Decide per concept how it is mastered, and make the questions DISTINCT accordingly:
   - PROCEDURAL skill (a process practised over varied inputs): each question runs the same process on a DIFFERENT given; questions MAY share structure, that is correct practice.
   - CONCEPTUAL idea: each question probes a DIFFERENT facet, angle, or misconception.
3. Ground EVERY question strictly in the material above. Do NOT test outside knowledge, and never write a question whose correct answer is not supported by the text. No two questions may be interchangeable.
4. Each question must stand on its own: do NOT reference "the text", "the passage", "the author", or "the document"; ask directly about the concept.
5. Write a ONE-sentence "explanation" for each question that says why the correct answer is right (shown to the learner after they answer).

CRITICAL FORMATTING RULES (TO PREVENT TEST-HACKING):
- Provide EXACTLY FOUR options.
- OPTION UNIFORMITY: all four options must be of approximately the same character length.
- No "Length Bias": do not make the correct answer the longest or most detailed.
- PARALLEL STRUCTURE: if one option starts with a verb, all must; keep the phrasing symmetrical.
- SOPHISTICATED DISTRACTORS: wrong answers must be plausible and reflect common misconceptions about this material.

Write in plain, readable text. Express any math in plain form (for example V = I x R, x^2, sqrt(x), 1/2); do NOT use LaTeX, dollar-sign math, backticks, or markdown. Do NOT use em dashes; use commas, colons, or simple hyphens.

Set "answerIndex" to the 0-based position (integer 0-3) of the correct option within "options".

Return ONLY a JSON array of ${n} objects: [{"question": "text", "options": ["A","B","C","D"], "answerIndex": 0, "explanation": "why the answer is correct"}]`;

  const out: GeneratedQuestion[] = [];
  const WAVE = 8;
  while (out.length < total) {
    const n = Math.min(WAVE, total - out.length);
    const avoid = out.map((q) => q.question);
    let batch: unknown;
    try {
      batch = parseLooseJson(
        await callGemini(build(n, avoid), {
          json: true,
          schema: MCQ_ARRAY_SCHEMA,
          thinking: false,
        }),
      );
    } catch {
      throw new Error('Quiz generator returned non-JSON content');
    }
    const arr = Array.isArray(batch) ? batch : [batch];
    const clean = arr
      .map((q) => normalizeMcq(q as RawMcq))
      .filter((q): q is GeneratedQuestion => q !== null);
    if (!clean.length) break; // material exhausted or model stalling
    for (const q of clean) {
      if (out.length >= total) break;
      out.push(q);
    }
    if (clean.length < n) break; // couldn't fill the wave; material likely exhausted
  }

  if (!out.length) throw new Error('No usable questions could be built from this material');
  return out;
}

/**
 * Transcribe ONE uploaded PDF or image to plain text via Gemini's multimodal
 * reading. Text files are decoded directly by the caller and never reach here.
 */
export async function extractDocumentText({
  mimeType,
  dataBase64,
  name = '',
}: {
  mimeType: string;
  dataBase64: string;
  name?: string;
}): Promise<string> {
  if (!mimeType || !dataBase64) return '';
  const prompt = `You are a precise document transcriber. Read the attached file${
    name ? ` ("${name}")` : ''
  } and output its FULL textual content as clean plain text.

RULES:
- Transcribe ALL text faithfully, in reading order. Do NOT summarise, shorten, or add commentary.
- Preserve structure simply: headings on their own line, list items prefixed with "- ". Keep tables as readable rows.
- Write any math in plain readable text (for example V = I x R, x^2), not LaTeX.
- For a diagram, chart, or figure that carries meaning, add one line: "[Figure: <a brief factual description>]".
- If a page is blank or unreadable, skip it silently. Output ONLY the transcribed content, no preamble.`;

  const text = await callGeminiParts(
    [{ text: prompt }, { inlineData: { mimeType, data: dataBase64 } }],
    { thinking: false, maxOutputTokens: 16384 },
  );
  return text.trim();
}
