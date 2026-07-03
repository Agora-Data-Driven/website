/** Quiz data for the Tools & Insights / Future-Proof Tests page. */

export type ScoreBandId = 'behind' | 'developing' | 'competitive' | 'future-ready';

export interface QuizOption {
  label: string;
  score: 0 | 1 | 2 | 3;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface ScoreBand {
  id: ScoreBandId;
  label: string;
  min: number;
  max: number;
  summary: string;
  recommendations: string[];
}

export interface QuizTopic {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  /** Heroicon-style SVG path (viewBox 0 0 24 24) */
  iconPath: string;
  availableQuestionCounts: readonly number[];
  questions: QuizQuestion[];
  scoreBands: ScoreBand[];
}

// ---------------------------------------------------------------------------
// DATA SCIENCE
// ---------------------------------------------------------------------------
const dataScience: QuizTopic = {
  id: 'data-science',
  title: 'Data Science Readiness Test',
  shortTitle: 'Data Science',
  description: 'Are you using your business data to drive smarter decisions?',
  iconPath:
    'M3 13.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 3 18.5v-5Zm6.5-5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 9.5 18.5v-10Zm6.5-4a1.5 1.5 0 0 1 1.5-1.5h1A1.5 1.5 0 0 1 22 4.5v14a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 16 18.5v-14Z',
  availableQuestionCounts: [5, 10, 20],
  scoreBands: [
    {
      id: 'behind',
      label: 'Behind',
      min: 0,
      max: 39,
      summary:
        "Your business is making decisions without a data foundation to back them up. You're leaving real insights and efficiency gains on the table.",
      recommendations: [
        'Start tracking at least 3 core KPIs this week — revenue, cost per acquisition, and conversion rate',
        'Set up Google Analytics 4 (or equivalent) and ensure basic event tracking is working',
        'Create a simple weekly reporting template so the team reviews numbers consistently',
        'Identify one decision you made last month by gut instinct that data could have informed',
        'Assign data ownership — someone must be responsible for keeping numbers accurate',
      ],
    },
    {
      id: 'developing',
      label: 'Developing',
      min: 40,
      max: 59,
      summary:
        'You have some data practices in place, but they are inconsistent. The opportunity to turn data into a real competitive advantage is right in front of you.',
      recommendations: [
        'Connect your analytics, ad platforms, and CRM so data flows into one place rather than living in silos',
        'Move away from last-click attribution — even a simple linear model gives a better picture',
        'Establish a weekly data review cadence with your team — 30 minutes, same time each week',
        'Start segmenting customers by behavior, not just demographics, to unlock more targeted decisions',
        'Document your current reporting process so it scales beyond one person',
      ],
    },
    {
      id: 'competitive',
      label: 'Competitive',
      min: 60,
      max: 79,
      summary:
        'Your data practice is solid. With a few strategic upgrades you could shift from reactive reporting to predictive decision-making.',
      recommendations: [
        'Invest in a BI tool (Looker Studio, Power BI, or Metabase) to unify reporting across sources',
        'Build rolling 90-day forecasts using your historical performance data',
        'Implement systematic A/B testing with a documented log of hypotheses, results, and learnings',
        'Add LTV modelling by cohort so acquisition decisions factor in long-term customer value',
      ],
    },
    {
      id: 'future-ready',
      label: 'Future-Ready',
      min: 80,
      max: 100,
      summary:
        "You're using data as a genuine competitive advantage. The focus now is scaling these capabilities and ensuring they drive outcomes across every team.",
      recommendations: [
        'Explore predictive modelling for churn, LTV, and demand forecasting',
        'Invest in data governance — schema documentation, access controls, and QA pipelines',
        'Automate anomaly detection so the team is alerted before problems become crises',
        'Build a data team structure (or agency model) that scales with business growth',
      ],
    },
  ],
  questions: [
    {
      id: 'ds-1',
      question: 'How often do you use actual business data to make marketing decisions?',
      options: [
        { label: 'Rarely — most decisions are gut instinct', score: 0 },
        { label: 'Sometimes — we check reports but not consistently', score: 1 },
        { label: 'Often — data influences most decisions', score: 2 },
        { label: 'Always — decisions are tied to tracked KPIs and experiments', score: 3 },
      ],
    },
    {
      id: 'ds-2',
      question: 'Do you have clearly defined KPIs for each marketing channel?',
      options: [
        { label: 'No KPIs defined', score: 0 },
        { label: 'A few KPIs exist but they are not consistently tracked', score: 1 },
        { label: 'KPIs exist for most channels and are reviewed regularly', score: 2 },
        { label: 'Every channel has clear KPIs with accountability and regular review', score: 3 },
      ],
    },
    {
      id: 'ds-3',
      question: 'Do you use live dashboards to monitor business performance?',
      options: [
        { label: 'No dashboards — we rely on ad hoc exports', score: 0 },
        { label: 'Basic spreadsheets or platform-level reports', score: 1 },
        { label: 'A shared dashboard we check occasionally', score: 2 },
        { label: 'Live dashboards reviewed weekly by the whole team', score: 3 },
      ],
    },
    {
      id: 'ds-4',
      question: 'How well do you understand which channels actually drive revenue?',
      options: [
        { label: "Not sure — we don't track attribution", score: 0 },
        { label: 'A general sense, but we cannot quantify it', score: 1 },
        { label: 'We track it for the main channels', score: 2 },
        { label: 'Full multi-touch attribution model across all touchpoints', score: 3 },
      ],
    },
    {
      id: 'ds-5',
      question: 'Do you segment your customer base?',
      options: [
        { label: 'No segmentation', score: 0 },
        { label: 'Basic segmentation by location or product', score: 1 },
        { label: 'Behavioral and demographic segments used in campaigns', score: 2 },
        { label: 'Dynamic segments driving personalized campaigns and offers', score: 3 },
      ],
    },
    {
      id: 'ds-6',
      question: 'How do you approach business forecasting?',
      options: [
        { label: "We don't forecast", score: 0 },
        { label: 'Rough estimates based on last year', score: 1 },
        { label: 'Monthly projections based on trend data', score: 2 },
        { label: 'Rolling forecasts with scenario planning and variance tracking', score: 3 },
      ],
    },
    {
      id: 'ds-7',
      question: 'Do you run A/B tests or controlled experiments?',
      options: [
        { label: 'Never', score: 0 },
        { label: 'Occasionally for ads, but not systematically', score: 1 },
        { label: 'Regular testing across campaigns and landing pages', score: 2 },
        { label: 'Systematic testing program with documented hypotheses and learnings', score: 3 },
      ],
    },
    {
      id: 'ds-8',
      question: 'Who is responsible for data accuracy in your business?',
      options: [
        { label: 'No one specifically', score: 0 },
        { label: 'One person checks things ad hoc when something looks wrong', score: 1 },
        { label: 'A dedicated analyst or manager owns reporting', score: 2 },
        { label: 'Clear data ownership with documented processes and QA', score: 3 },
      ],
    },
    {
      id: 'ds-9',
      question: 'Do you track customer lifetime value (LTV)?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Roughly, using total revenue averages', score: 1 },
        { label: 'By cohort or product type', score: 2 },
        { label: 'Per-customer LTV with predictive modelling', score: 3 },
      ],
    },
    {
      id: 'ds-10',
      question: 'How many data sources are you currently integrating?',
      options: [
        { label: 'None — or just one spreadsheet', score: 0 },
        { label: '1–2 sources (e.g., GA + one ad platform)', score: 1 },
        { label: '3–5 sources connected in some way', score: 2 },
        { label: '5+ sources in a centralized system or data warehouse', score: 3 },
      ],
    },
    {
      id: 'ds-11',
      question: 'How do you use data to optimize campaigns in-flight?',
      options: [
        { label: "We don't optimize based on data", score: 0 },
        { label: 'We adjust spend based on basic performance feels', score: 1 },
        { label: 'Weekly data-driven reviews with defined actions', score: 2 },
        { label: 'Real-time optimization with documented decision rules', score: 3 },
      ],
    },
    {
      id: 'ds-12',
      question: 'Do you have a regular reporting cadence with your team?',
      options: [
        { label: 'No regular reporting', score: 0 },
        { label: 'Monthly summaries', score: 1 },
        { label: 'Weekly team updates', score: 2 },
        { label: 'Weekly or daily scorecards with clear accountability', score: 3 },
      ],
    },
    {
      id: 'ds-13',
      question: 'Can you identify which customer segments are most profitable?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Roughly, by guessing based on revenue', score: 1 },
        { label: 'By acquisition channel or product type', score: 2 },
        { label: 'Full profitability analysis by segment, including LTV vs. CAC', score: 3 },
      ],
    },
    {
      id: 'ds-14',
      question: 'How confident are you in the accuracy of your current data?',
      options: [
        { label: 'Not confident — there are many gaps and discrepancies', score: 0 },
        { label: 'Somewhat confident in some metrics', score: 1 },
        { label: 'Mostly confident with known limitations', score: 2 },
        { label: 'Very confident — data is validated across multiple sources', score: 3 },
      ],
    },
    {
      id: 'ds-15',
      question: 'Do you use historical data to plan future marketing investments?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Sometimes for seasonal planning', score: 1 },
        { label: 'Regularly for budget allocation across channels', score: 2 },
        { label: 'Always — data is central to all planning and investment decisions', score: 3 },
      ],
    },
    {
      id: 'ds-16',
      question: 'Do you have a documented process for extracting insights from data?',
      options: [
        { label: 'No formal process', score: 0 },
        { label: 'Ad hoc reviews when something looks wrong', score: 1 },
        { label: 'Monthly reviews with a standard template', score: 2 },
        { label: 'Documented insight process with actionable output requirements', score: 3 },
      ],
    },
    {
      id: 'ds-17',
      question: 'How do you handle data quality issues when you discover them?',
      options: [
        { label: "We aren't aware of data quality issues", score: 0 },
        { label: 'We notice problems but do not fix them systematically', score: 1 },
        { label: 'We clean data occasionally when critical issues arise', score: 2 },
        {
          label: 'Data quality checks are built into our collection and reporting process',
          score: 3,
        },
      ],
    },
    {
      id: 'ds-18',
      question: 'Does data influence your hiring or team resource planning?',
      options: [
        { label: 'Not at all', score: 0 },
        { label: 'Occasionally for ad hoc resourcing decisions', score: 1 },
        { label: 'For key hires based on workload data', score: 2 },
        { label: 'All resourcing decisions are informed by performance data', score: 3 },
      ],
    },
    {
      id: 'ds-19',
      question: 'Do you track and analyze customer acquisition cost (CAC) by channel?',
      options: [
        { label: "We don't calculate CAC", score: 0 },
        { label: 'Rough total CAC but not broken down by channel', score: 1 },
        { label: 'CAC tracked for main channels, reviewed monthly', score: 2 },
        { label: 'CAC tracked and benchmarked per channel with target thresholds', score: 3 },
      ],
    },
    {
      id: 'ds-20',
      question: 'Do you benchmark your performance against industry standards?',
      options: [
        { label: "We don't benchmark", score: 0 },
        { label: 'Occasionally check industry reports', score: 1 },
        { label: 'Regular benchmarking for key metrics', score: 2 },
        { label: 'Systematic benchmarking informing targets and strategy', score: 3 },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// AI INTEGRATION
// ---------------------------------------------------------------------------
const aiIntegration: QuizTopic = {
  id: 'ai-integration',
  title: 'AI Integration Test',
  shortTitle: 'AI Integration',
  description: 'Find out whether AI is improving your workflows or just adding noise.',
  iconPath:
    'M12 2a1 1 0 0 1 .894.553l2.447 4.894 5.4.785a1 1 0 0 1 .554 1.706l-3.909 3.81.923 5.378a1 1 0 0 1-1.451 1.054L12 17.77l-4.858 2.555a1 1 0 0 1-1.45-1.054l.922-5.378L2.705 9.938a1 1 0 0 1 .554-1.706l5.4-.785 2.447-4.894A1 1 0 0 1 12 2Z',
  availableQuestionCounts: [5, 10, 20],
  scoreBands: [
    {
      id: 'behind',
      label: 'Behind',
      min: 0,
      max: 39,
      summary:
        'AI is transforming marketing and business operations, but you are not yet leveraging it. Getting started now is far less painful than catching up in 12 months.',
      recommendations: [
        'Start with one high-impact AI tool — try ChatGPT or Claude for content drafting and research',
        'Document 3 manual tasks your team does weekly that AI could assist with or automate',
        'Run a short team workshop on what AI tools exist and how they apply to your workflows',
        'Set a goal to test one AI tool this month, measure the time saved, and decide whether to adopt it',
        'Establish a basic AI usage policy to protect customer data before wider adoption',
      ],
    },
    {
      id: 'developing',
      label: 'Developing',
      min: 40,
      max: 59,
      summary:
        "You've started using AI tools, but adoption is patchy across the team. Turning this into a systematic capability is your next step.",
      recommendations: [
        'Build a prompt library for your most common content, reporting, and research tasks',
        'Connect at least one AI tool to your marketing stack via Zapier or a native integration',
        'Create a formal AI usage policy that covers data privacy and quality review requirements',
        'Set measurable targets for time saved through AI and review them monthly',
      ],
    },
    {
      id: 'competitive',
      label: 'Competitive',
      min: 60,
      max: 79,
      summary:
        'AI is making your team more productive. The gap to close is moving from individual tool use to embedded, cross-team workflows with measurable outcomes.',
      recommendations: [
        'Build a cross-team AI adoption playbook with documented SOPs and approved tool list',
        'Explore AI-assisted customer personalization and automated lead scoring',
        'Track and report ROI from AI tools quarterly — make the value visible to leadership',
        'Invest in prompt engineering training so the team extracts maximum value from AI tools',
      ],
    },
    {
      id: 'future-ready',
      label: 'Future-Ready',
      min: 80,
      max: 100,
      summary:
        'AI is genuinely differentiating your business. Your focus now is scaling these advantages and staying ahead of the next automation wave.',
      recommendations: [
        'Explore AI agents for autonomous reporting, scheduling, and campaign management tasks',
        'Build feedback loops to continuously improve your AI models and prompt performance',
        'Invest in first-party data infrastructure to power more sophisticated AI personalization',
        'Share your AI capabilities as a competitive differentiator in sales and marketing materials',
      ],
    },
  ],
  questions: [
    {
      id: 'ai-1',
      question: 'How often do AI tools assist in your day-to-day marketing workflows?',
      options: [
        { label: "Never — we don't use AI tools", score: 0 },
        { label: 'Occasionally for one-off tasks', score: 1 },
        { label: 'Regularly for several recurring tasks', score: 2 },
        { label: 'AI is embedded across most workflows and reviewed systematically', score: 3 },
      ],
    },
    {
      id: 'ai-2',
      question: 'Do you use AI to assist with content creation?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Rarely — for rough drafts only, with heavy rewriting', score: 1 },
        { label: 'Yes, AI drafts content that a human then edits and approves', score: 2 },
        { label: 'Systematically, with a documented prompting and review process', score: 3 },
      ],
    },
    {
      id: 'ai-3',
      question: 'How much of your reporting is currently manual?',
      options: [
        { label: 'Almost all — we pull and format data by hand', score: 0 },
        { label: 'Mostly manual with some platform exports', score: 1 },
        { label: 'Partially automated — some reports run themselves', score: 2 },
        { label: 'Mostly or fully automated with minimal manual intervention', score: 3 },
      ],
    },
    {
      id: 'ai-4',
      question: 'Is there a documented process for how your team uses AI tools?',
      options: [
        { label: 'No documentation at all', score: 0 },
        { label: 'Informal guidelines passed around verbally', score: 1 },
        { label: 'Basic SOPs written for key AI-assisted tasks', score: 2 },
        { label: 'Detailed playbooks with prompt libraries and quality standards', score: 3 },
      ],
    },
    {
      id: 'ai-5',
      question: 'How do you handle data privacy when using AI tools?',
      options: [
        { label: "We don't specifically consider AI data privacy", score: 0 },
        { label: "We're aware but have no formal policy", score: 1 },
        { label: 'Basic policy in place — no customer PII in AI prompts', score: 2 },
        { label: 'Formal, reviewed AI data handling policy across all tools', score: 3 },
      ],
    },
    {
      id: 'ai-6',
      question: 'Is AI adoption driven by leadership or limited to individual use?',
      options: [
        { label: 'No AI adoption at all', score: 0 },
        { label: 'A few individuals use AI tools on their own initiative', score: 1 },
        { label: 'Team-wide awareness, but adoption is inconsistent', score: 2 },
        { label: 'Leadership-driven, cross-team adoption with clear accountability', score: 3 },
      ],
    },
    {
      id: 'ai-7',
      question: 'How do you quality-control AI-generated outputs before they are used?',
      options: [
        { label: "We don't — outputs are used as-is", score: 0 },
        { label: 'A quick scan before publishing', score: 1 },
        { label: 'Human review against brand guidelines and accuracy standards', score: 2 },
        { label: 'Multi-step review: accuracy, brand voice, legal, then approved', score: 3 },
      ],
    },
    {
      id: 'ai-8',
      question: 'Do you track ROI or efficiency gains from AI tools?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Anecdotally — "it feels faster"', score: 1 },
        { label: 'Roughly tracked by hours saved per month', score: 2 },
        { label: 'Measured and reviewed against business targets quarterly', score: 3 },
      ],
    },
    {
      id: 'ai-9',
      question: 'How integrated is AI with your CRM or marketing stack?',
      options: [
        { label: 'Not integrated at all', score: 0 },
        { label: 'Loose connections via manual imports and exports', score: 1 },
        { label: 'Some integrations via Zapier or platform-native connections', score: 2 },
        { label: 'Native API integrations — AI reads from and writes to the stack', score: 3 },
      ],
    },
    {
      id: 'ai-10',
      question: 'Do you use AI for lead scoring or audience personalization?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Basic rule-based scoring only', score: 1 },
        { label: 'AI-assisted scoring applied to some segments', score: 2 },
        { label: 'Dynamic AI scoring and real-time personalization at scale', score: 3 },
      ],
    },
    {
      id: 'ai-11',
      question: 'How do you keep up with changes in AI tools relevant to your business?',
      options: [
        { label: "We don't track AI developments", score: 0 },
        { label: 'Occasionally read articles when something makes headlines', score: 1 },
        { label: 'Regular team discussions about new and updated tools', score: 2 },
        {
          label: 'Dedicated person or formal process for AI tool research and evaluation',
          score: 3,
        },
      ],
    },
    {
      id: 'ai-12',
      question: 'Do you use AI in your paid advertising workflows?',
      options: [
        { label: 'No AI involvement', score: 0 },
        { label: 'Platform AI only (e.g., smart bidding)', score: 1 },
        { label: 'AI-assisted creative testing or copy generation', score: 2 },
        { label: 'AI deeply embedded in campaign structure, creative, and optimization', score: 3 },
      ],
    },
    {
      id: 'ai-13',
      question: 'Is AI helping reduce manual workload for your team?',
      options: [
        { label: 'No impact on workload', score: 0 },
        { label: 'Minor reduction — saves 1–2 hours per week', score: 1 },
        { label: 'Moderate reduction — saves 5–10 hours per week across the team', score: 2 },
        { label: 'Significant reduction — team focuses on higher-value strategic work', score: 3 },
      ],
    },
    {
      id: 'ai-14',
      question: 'Do you use AI to assist with SEO research or content optimization?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Basic keyword research tools only', score: 1 },
        { label: 'AI-assisted content briefs and outlines', score: 2 },
        { label: 'Full AI-enhanced SEO workflow from research to publish', score: 3 },
      ],
    },
    {
      id: 'ai-15',
      question: 'How do you evaluate new AI tools before adopting them?',
      options: [
        { label: 'No formal evaluation — we try whatever is popular', score: 0 },
        { label: 'Brief trial if someone on the team mentions it', score: 1 },
        { label: 'Test it against a specific use case before committing', score: 2 },
        { label: 'Defined evaluation criteria and structured pilot period', score: 3 },
      ],
    },
    {
      id: 'ai-16',
      question: 'How many AI tools does your team actively use in daily work?',
      options: [
        { label: 'None', score: 0 },
        { label: '1–2 tools', score: 1 },
        { label: '3–5 tools with clear use cases', score: 2 },
        { label: '6+ tools, each strategically selected for a specific workflow', score: 3 },
      ],
    },
    {
      id: 'ai-17',
      question: 'Do you use AI for customer support or initial lead qualification?',
      options: [
        { label: "No — we haven't explored this", score: 0 },
        { label: "We've considered it but not implemented", score: 1 },
        { label: 'AI chatbot handling basic FAQs', score: 2 },
        { label: 'AI handles intake, qualification, and escalation to humans', score: 3 },
      ],
    },
    {
      id: 'ai-18',
      question: 'How does AI affect the volume and speed of your content output?',
      options: [
        { label: 'No measurable change', score: 0 },
        { label: 'Slightly faster — saves a few hours per piece', score: 1 },
        { label: 'About 2× faster without sacrificing quality', score: 2 },
        { label: '3× or more faster, with maintained or improved quality', score: 3 },
      ],
    },
    {
      id: 'ai-19',
      question: 'Do you use AI tools to analyze competitor or market data?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Occasionally using free tools when prompted', score: 1 },
        { label: 'Regularly with a mix of free and paid tools', score: 2 },
        { label: 'Integrated into a formal competitive intelligence workflow', score: 3 },
      ],
    },
    {
      id: 'ai-20',
      question: 'Is AI visibly improving the quality of your customer experience?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Marginally — small improvements in speed or content quality', score: 1 },
        { label: 'Noticeably — faster responses, more relevant content', score: 2 },
        {
          label: 'Significantly — AI is a core differentiator in our customer experience',
          score: 3,
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// ORGANIC CONTENT
// ---------------------------------------------------------------------------
const organicContent: QuizTopic = {
  id: 'organic-content',
  title: 'Organic Content Strategy Test',
  shortTitle: 'Organic Content',
  description: 'Check if your content strategy is built for traffic, trust, and conversions.',
  iconPath:
    'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z',
  availableQuestionCounts: [5, 10, 20],
  scoreBands: [
    {
      id: 'behind',
      label: 'Behind',
      min: 0,
      max: 39,
      summary:
        'Your content is not yet working hard for your business. Without a search and funnel strategy, content stays invisible.',
      recommendations: [
        'Start with a basic keyword research exercise — find 10 questions your customers are already searching',
        'Commit to publishing at least one well-researched piece of content per month',
        'Add a clear CTA to every piece of content you already have live',
        'Set up Google Search Console to understand what traffic you currently get organically',
        'Map two or three broad topic themes that align with what your business sells',
      ],
    },
    {
      id: 'developing',
      label: 'Developing',
      min: 40,
      max: 59,
      summary:
        'You are creating content, but it is not yet part of a coherent strategy that drives traffic and converts visitors into leads.',
      recommendations: [
        'Build a topic cluster around your core service — pillar page + 5–8 supporting articles',
        'Define search intent before every piece: informational, navigational, or transactional',
        'Create a simple distribution checklist so every piece gets shared beyond just publishing',
        'Add lead capture (content upgrade or email opt-in) to your highest-traffic pages',
      ],
    },
    {
      id: 'competitive',
      label: 'Competitive',
      min: 60,
      max: 79,
      summary:
        'Your content strategy is driving traffic and building authority. The opportunity is to turn more of that traffic into attributable business outcomes.',
      recommendations: [
        'Implement a quarterly content refresh process — update your top 5 posts for accuracy and ranking',
        'Develop at least two detailed case studies that show results in your core service area',
        'Map your entire content library to funnel stages and identify MOFU and BOFU gaps',
        'Build a systematic backlink acquisition strategy around your best-performing content',
      ],
    },
    {
      id: 'future-ready',
      label: 'Future-Ready',
      min: 80,
      max: 100,
      summary:
        'Your content is a compounding growth asset. The challenge now is protecting quality at scale and ensuring the full funnel is converting.',
      recommendations: [
        'Build persona-specific content streams with dedicated nurture paths for each segment',
        'Invest in original research or proprietary data as link-magnet and authority content',
        'Create a content ROI model that traces organic traffic all the way to revenue',
        'Explore multimedia content formats (video, podcast) to compound distribution reach',
      ],
    },
  ],
  questions: [
    {
      id: 'oc-1',
      question: 'Do you have a documented SEO and content strategy?',
      options: [
        { label: 'No strategy — we write what feels right at the time', score: 0 },
        { label: 'Informal ideas but nothing documented', score: 1 },
        { label: 'A basic content calendar with SEO in mind', score: 2 },
        { label: 'Full documented strategy with review cycles and ownership', score: 3 },
      ],
    },
    {
      id: 'oc-2',
      question: 'Do you research search intent before creating content?',
      options: [
        { label: 'No — we write what the team thinks is interesting', score: 0 },
        { label: 'Occasionally check what is ranking on the first page', score: 1 },
        { label: 'Research intent for most pieces before writing', score: 2 },
        {
          label:
            'Search intent is the starting point for every piece — it shapes structure, tone, and CTA',
          score: 3,
        },
      ],
    },
    {
      id: 'oc-3',
      question: 'How consistent is your content publishing cadence?',
      options: [
        { label: 'No regular publishing', score: 0 },
        { label: 'Sporadic — a few pieces per year when time allows', score: 1 },
        { label: 'Monthly or bi-weekly publishing on a loose schedule', score: 2 },
        { label: 'Weekly or more, on a documented editorial calendar', score: 3 },
      ],
    },
    {
      id: 'oc-4',
      question: 'Do you use topic clusters to organize your content?',
      options: [
        { label: "No — we haven't structured content this way", score: 0 },
        { label: 'We have categories but no deliberate cluster structure', score: 1 },
        { label: 'Some clusters built around key service themes', score: 2 },
        {
          label: 'Full topic cluster architecture covering each service or audience silo',
          score: 3,
        },
      ],
    },
    {
      id: 'oc-5',
      question: 'How do you distribute content after publishing?',
      options: [
        { label: 'We publish and hope — no distribution strategy', score: 0 },
        { label: 'Share once on one social channel', score: 1 },
        { label: 'Multi-channel distribution checklist for each piece', score: 2 },
        {
          label: 'Full repurposing strategy: clips, email, social, outreach, syndication',
          score: 3,
        },
      ],
    },
    {
      id: 'oc-6',
      question: 'Do you track which content drives leads or conversions?',
      options: [
        { label: 'No', score: 0 },
        { label: 'We see traffic numbers but not what converts', score: 1 },
        { label: 'Basic conversion tracking on our key landing pages', score: 2 },
        { label: 'Every piece of content is attributed to pipeline and revenue', score: 3 },
      ],
    },
    {
      id: 'oc-7',
      question: 'Do you create case studies or proof-based content?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Occasional testimonial quotes', score: 1 },
        { label: '1–2 case studies on the site', score: 2 },
        { label: 'A library of detailed, data-backed case studies regularly published', score: 3 },
      ],
    },
    {
      id: 'oc-8',
      question: 'How do you build authority and earn backlinks in your niche?',
      options: [
        { label: "We don't focus on authority building", score: 0 },
        { label: 'We blog occasionally and hope for organic links', score: 1 },
        { label: 'Guest posts and occasional link outreach', score: 2 },
        { label: 'Systematic authority strategy: thought leadership, PR, and outreach', score: 3 },
      ],
    },
    {
      id: 'oc-9',
      question: 'Do you use internal linking throughout your content?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Occasionally when it is obvious', score: 1 },
        { label: 'Moderate internal linking on most posts', score: 2 },
        { label: 'Deliberate internal linking strategy mapped to topic clusters', score: 3 },
      ],
    },
    {
      id: 'oc-10',
      question: 'Do you refresh and update old content?',
      options: [
        { label: 'Never — we only produce new content', score: 0 },
        { label: 'Rarely, only if there is a factual error', score: 1 },
        { label: 'Occasionally for top-performing posts', score: 2 },
        { label: 'Systematic refresh schedule reviewed quarterly', score: 3 },
      ],
    },
    {
      id: 'oc-11',
      question: 'How do you use keyword research?',
      options: [
        { label: "We don't do keyword research", score: 0 },
        { label: 'Basic Google searches to check what is out there', score: 1 },
        { label: 'Tool-assisted research using Ahrefs, Semrush, or similar', score: 2 },
        { label: 'Systematic keyword mapping integrated into the editorial calendar', score: 3 },
      ],
    },
    {
      id: 'oc-12',
      question: 'How does your content relate to your sales funnel?',
      options: [
        { label: 'No connection — content exists separately from the funnel', score: 0 },
        { label: 'A blog exists, but it is not mapped to funnel stages', score: 1 },
        { label: 'Top-of-funnel content created intentionally to attract buyers', score: 2 },
        { label: 'Content mapped to all funnel stages with stage-specific CTAs', score: 3 },
      ],
    },
    {
      id: 'oc-13',
      question: 'Do you create content specifically for defined target personas?',
      options: [
        { label: 'No — we write for a general audience', score: 0 },
        { label: 'We think about the audience informally when writing', score: 1 },
        { label: 'Most content is persona-informed', score: 2 },
        { label: 'Each persona has a dedicated content stream and documented plan', score: 3 },
      ],
    },
    {
      id: 'oc-14',
      question: 'Do you use content to answer FAQ and support questions?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Occasionally, but not planned deliberately', score: 1 },
        { label: 'Some dedicated FAQ or how-to content exists', score: 2 },
        { label: 'Full FAQ mapping with schema markup for rich results', score: 3 },
      ],
    },
    {
      id: 'oc-15',
      question: 'Do you have a process for writing detailed content briefs?',
      options: [
        { label: 'No — writers are given a topic and told to go', score: 0 },
        { label: 'We brief writers verbally', score: 1 },
        { label: 'Basic brief template covering topic and key points', score: 2 },
        {
          label: 'Detailed briefs with keyword mapping, search intent, structure, and CTAs',
          score: 3,
        },
      ],
    },
    {
      id: 'oc-16',
      question: "Do you track your content's backlink profile over time?",
      options: [
        { label: 'No', score: 0 },
        { label: 'Check occasionally when there is an obvious change', score: 1 },
        { label: 'Monthly backlink monitoring with a tool', score: 2 },
        { label: 'Proactive link acquisition as part of the content strategy', score: 3 },
      ],
    },
    {
      id: 'oc-17',
      question: 'How do you optimize existing content for better rankings?',
      options: [
        { label: "We don't optimize existing content", score: 0 },
        { label: 'Basic title and meta description changes if rankings drop', score: 1 },
        { label: 'Periodic on-page SEO updates for key pieces', score: 2 },
        { label: 'Full CRO and SEO refresh process applied to aging content', score: 3 },
      ],
    },
    {
      id: 'oc-18',
      question: 'Do you repurpose content across different formats and channels?',
      options: [
        { label: 'No — each piece stays in its original format', score: 0 },
        { label: 'Occasionally copy paste into a social post', score: 1 },
        { label: 'Some repurposing into emails or social clips', score: 2 },
        { label: 'Systematic repurposing plan for every major piece', score: 3 },
      ],
    },
    {
      id: 'oc-19',
      question: 'Do you track ROI on organic content investment?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Views and social shares only', score: 1 },
        { label: 'Organic traffic, time on page, and rough lead count', score: 2 },
        {
          label: 'Full funnel attribution: content → organic traffic → lead → client → revenue',
          score: 3,
        },
      ],
    },
    {
      id: 'oc-20',
      question: 'Is your content strategy reviewed and adjusted regularly?',
      options: [
        { label: "It isn't — content is produced ad hoc", score: 0 },
        { label: 'Annually at most', score: 1 },
        { label: 'Quarterly review of content performance', score: 2 },
        { label: 'Monthly strategy review tied to traffic and conversion data', score: 3 },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// MEDIA BUYING
// ---------------------------------------------------------------------------
const mediaBuying: QuizTopic = {
  id: 'media-buying',
  title: 'Media Buying Efficiency Test',
  shortTitle: 'Media Buying',
  description: 'See whether your ad strategy is structured to scale efficiently.',
  iconPath:
    'M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605',
  availableQuestionCounts: [5, 10, 20],
  scoreBands: [
    {
      id: 'behind',
      label: 'Behind',
      min: 0,
      max: 39,
      summary:
        'Your ad spend is likely inefficient. Without proper structure, tracking, and testing, you are scaling what does not work rather than what does.',
      recommendations: [
        'Audit your current pixel and conversion tracking setup — bad data is worse than no data',
        'Restructure campaigns into at least three funnel stages: awareness, consideration, conversion',
        'Start tracking CAC and ROAS weekly, not just when you remember to look',
        'Run one structured audience test this month with a clear hypothesis and defined winner criteria',
        'Ensure every ad has a corresponding dedicated landing page — not just your homepage',
      ],
    },
    {
      id: 'developing',
      label: 'Developing',
      min: 40,
      max: 59,
      summary:
        'You have the basics in place but your structure may be holding back performance. Better testing discipline will unlock the next level.',
      recommendations: [
        'Build a naming convention for campaigns, ad sets, and ads so performance analysis is faster',
        'Implement segmented retargeting — separate messaging for site visitors, cart abandoners, and past buyers',
        'Document your scaling rules so budget increases follow data, not instinct',
        'Set up automated performance alerts so issues are caught before significant spend is wasted',
      ],
    },
    {
      id: 'competitive',
      label: 'Competitive',
      min: 60,
      max: 79,
      summary:
        'Your media buying is producing results. The opportunity is tighter testing discipline and smarter use of first-party data to improve efficiency.',
      recommendations: [
        'Implement server-side tracking to protect data quality as third-party cookies decline',
        'Build a systematic creative testing calendar with controlled variables and documented learnings',
        'Develop a lookalike strategy using your highest-LTV customer segments',
        'Move toward a full media plan that aligns channel budgets to business objectives quarterly',
      ],
    },
    {
      id: 'future-ready',
      label: 'Future-Ready',
      min: 80,
      max: 100,
      summary:
        'Your media buying is operating at a high level. The priority is protecting performance as the ad ecosystem evolves and scaling proven structures.',
      recommendations: [
        'Invest in creative production infrastructure to support a high-velocity testing program',
        'Build a first-party data strategy that reduces reliance on platform-based targeting',
        'Develop cross-channel attribution models to balance efficiency across your full media mix',
        'Explore incrementality testing to measure true media impact, not just correlated performance',
      ],
    },
  ],
  questions: [
    {
      id: 'mb-1',
      question: 'How is your campaign structure organized?',
      options: [
        { label: 'No formal structure — campaigns are set up ad hoc', score: 0 },
        { label: 'Basic campaigns grouped loosely by product or offer', score: 1 },
        { label: 'Campaigns structured by funnel stage', score: 2 },
        { label: 'Full TOFU/MOFU/BOFU structure with a naming convention', score: 3 },
      ],
    },
    {
      id: 'mb-2',
      question: 'Do you test multiple audiences within campaigns?',
      options: [
        { label: 'No — we target one audience and leave it', score: 0 },
        { label: '1–2 audience variations tested occasionally', score: 1 },
        { label: 'Systematic audience testing with a test-and-pause rhythm', score: 2 },
        { label: 'Continuous audience testing with documented winner-loser log', score: 3 },
      ],
    },
    {
      id: 'mb-3',
      question: 'How do you approach creative testing?',
      options: [
        { label: 'We run one creative until it stops delivering', score: 0 },
        { label: 'Occasional creative swaps when performance drops', score: 1 },
        { label: 'Planned creative rotation and A/B testing per campaign', score: 2 },
        {
          label: 'Structured creative testing with controlled variables and learnings log',
          score: 3,
        },
      ],
    },
    {
      id: 'mb-4',
      question: 'Is tracking and attribution properly set up?',
      options: [
        { label: 'Basic pixel only — no event tracking', score: 0 },
        { label: 'Pixel plus some basic purchase or lead events', score: 1 },
        { label: 'Full event tracking with defined conversion windows', score: 2 },
        { label: 'Multi-touch attribution plus server-side tracking for accuracy', score: 3 },
      ],
    },
    {
      id: 'mb-5',
      question: 'Do you use retargeting campaigns?',
      options: [
        { label: 'No retargeting at all', score: 0 },
        { label: 'One broad retargeting audience (all site visitors)', score: 1 },
        { label: 'Segmented retargeting by page visited, time, or action taken', score: 2 },
        { label: 'Dynamic retargeting with personalized messaging per segment', score: 3 },
      ],
    },
    {
      id: 'mb-6',
      question: 'How aligned are your landing pages with your ad creative?',
      options: [
        { label: 'Ads route to the homepage — no specific landing pages', score: 0 },
        { label: 'Loosely aligned — similar product, different messaging', score: 1 },
        { label: 'Generally aligned with consistent offer and messaging', score: 2 },
        {
          label: 'Dedicated landing pages per campaign and audience with full message match',
          score: 3,
        },
      ],
    },
    {
      id: 'mb-7',
      question: 'Do you monitor CAC and ROAS regularly?',
      options: [
        { label: "We don't track these metrics", score: 0 },
        { label: 'Check them monthly at most', score: 1 },
        { label: 'Weekly monitoring with a defined review process', score: 2 },
        { label: 'Daily monitoring with automated alerts for threshold breaches', score: 3 },
      ],
    },
    {
      id: 'mb-8',
      question: 'Do you have defined rules for when and how to scale campaigns?',
      options: [
        { label: 'No rules — we scale when budget allows', score: 0 },
        { label: 'Scale based on gut feel when things are performing', score: 1 },
        { label: 'Scale when ROAS hits a target threshold', score: 2 },
        {
          label: 'Documented scaling rules tied to multiple KPIs with review checkpoints',
          score: 3,
        },
      ],
    },
    {
      id: 'mb-9',
      question: 'How do you manage ad creative fatigue?',
      options: [
        { label: 'We reuse ads indefinitely', score: 0 },
        { label: 'Replace when CTR drops noticeably', score: 1 },
        { label: 'Frequency-based rotation with defined fatigue thresholds', score: 2 },
        {
          label: 'Proactive creative refresh cycle with frequency caps and creative scoring',
          score: 3,
        },
      ],
    },
    {
      id: 'mb-10',
      question: 'Do you use lookalike or similar audiences?',
      options: [
        { label: 'No', score: 0 },
        { label: 'One basic lookalike from all customers', score: 1 },
        { label: 'Multiple lookalikes built from different customer value segments', score: 2 },
        { label: 'Tested and layered lookalike strategy using high-LTV seed audiences', score: 3 },
      ],
    },
    {
      id: 'mb-11',
      question: 'How do you allocate budget across channels?',
      options: [
        { label: 'Based on gut feel or default setup', score: 0 },
        { label: "Based on last year's allocations", score: 1 },
        { label: 'Data-informed allocation reviewed monthly', score: 2 },
        { label: 'Performance-threshold-based allocation with weekly rebalancing', score: 3 },
      ],
    },
    {
      id: 'mb-12',
      question: 'Do you use dayparting or ad scheduling based on data?',
      options: [
        { label: 'Ads run 24/7 with no scheduling', score: 0 },
        { label: 'Occasionally pause underperforming time slots', score: 1 },
        { label: 'Scheduled based on when conversions typically occur', score: 2 },
        {
          label:
            'Fully optimized schedule based on hour-of-day and day-of-week conversion analysis',
          score: 3,
        },
      ],
    },
    {
      id: 'mb-13',
      question: 'Do you maintain a media plan or buying calendar?',
      options: [
        { label: 'No plan — campaigns are created as needed', score: 0 },
        { label: 'General channel overview', score: 1 },
        { label: 'Detailed calendar with budgets and campaign objectives', score: 2 },
        {
          label: 'Full media plan linked to business targets and creative production schedule',
          score: 3,
        },
      ],
    },
    {
      id: 'mb-14',
      question: 'How do you approach testing new advertising channels?',
      options: [
        { label: 'Rarely test new channels', score: 0 },
        { label: 'Try a channel if someone suggests it', score: 1 },
        { label: 'Occasional structured test with a dedicated budget', score: 2 },
        {
          label:
            'Formal new-channel testing protocol with defined success criteria and review date',
          score: 3,
        },
      ],
    },
    {
      id: 'mb-15',
      question: 'Do you use first-party data to enhance targeting?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Upload customer lists occasionally', score: 1 },
        { label: 'Regular list uploads and exclusion audiences', score: 2 },
        {
          label: 'First-party data integrated across all targeting layers with regular syncing',
          score: 3,
        },
      ],
    },
    {
      id: 'mb-16',
      question: 'How do you minimize wasted ad spend?',
      options: [
        { label: "We don't actively manage wasted spend", score: 0 },
        { label: 'Pause underperforming ads when noticed', score: 1 },
        { label: 'Regular negative keyword and audience exclusion reviews', score: 2 },
        {
          label: 'Systematic waste audit with automated rules and monthly optimization sprint',
          score: 3,
        },
      ],
    },
    {
      id: 'mb-17',
      question: 'How do you handle seasonal budget adjustments?',
      options: [
        { label: 'No adjustments — flat budget all year', score: 0 },
        { label: 'Ad hoc budget increases during obviously busy periods', score: 1 },
        { label: 'Seasonal plan based on past performance', score: 2 },
        {
          label: 'Detailed seasonal budget model with historical benchmarks and scenario planning',
          score: 3,
        },
      ],
    },
    {
      id: 'mb-18',
      question: 'Do you have documented media buying SOPs?',
      options: [
        { label: 'No documentation', score: 0 },
        { label: 'Basic notes or a setup checklist', score: 1 },
        { label: 'Campaign setup and optimization checklist', score: 2 },
        {
          label: 'Full SOPs for setup, audience testing, creative rotation, scaling, and reporting',
          score: 3,
        },
      ],
    },
    {
      id: 'mb-19',
      question: 'How often do you analyze campaign performance data?',
      options: [
        { label: 'Rarely or never in a structured way', score: 0 },
        { label: 'Monthly', score: 1 },
        { label: 'Weekly with a defined review structure', score: 2 },
        { label: 'Daily, with automated alerts for anomalies', score: 3 },
      ],
    },
    {
      id: 'mb-20',
      question: 'How do you report media buying performance to stakeholders?',
      options: [
        { label: 'We do not report formally', score: 0 },
        { label: 'Basic metrics email with spend and ROAS', score: 1 },
        { label: 'Monthly dashboard report with key metrics', score: 2 },
        {
          label: 'Live dashboard with narrative context, benchmarks, and recommendations',
          score: 3,
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// WEBSITE CONVERSION
// ---------------------------------------------------------------------------
const websiteConversion: QuizTopic = {
  id: 'website-conversion',
  title: 'Website Conversion Test',
  shortTitle: 'Website Conversion',
  description: 'Test whether your site turns visitors into leads and customers.',
  iconPath:
    'M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5',
  availableQuestionCounts: [5, 10, 20],
  scoreBands: [
    {
      id: 'behind',
      label: 'Behind',
      min: 0,
      max: 39,
      summary:
        'Your website is likely losing visitors before they convert. Small, targeted improvements can have a big impact on conversion rates right away.',
      recommendations: [
        'Rewrite your homepage headline to make your offer and its benefit unmistakably clear in one sentence',
        'Add at least one strong CTA above the fold — tell visitors exactly what to do next',
        'Install Google Analytics 4 and check your current bounce rate by page',
        'Add two or three testimonials or case study references near your primary CTA',
        'Test your site on a real mobile device — identify the most friction-heavy moment',
      ],
    },
    {
      id: 'developing',
      label: 'Developing',
      min: 40,
      max: 59,
      summary:
        'You have the foundations but there are clear gaps in how your site converts. Systematic optimization will give you a meaningful lift.',
      recommendations: [
        'Install a heatmap tool (Hotjar or Microsoft Clarity) to see where visitors are dropping off',
        'Reduce form fields to the minimum required — every extra field reduces completion rates',
        'Create dedicated landing pages for your top acquisition campaigns',
        'Add social proof (reviews, client logos, case study results) near your conversion points',
      ],
    },
    {
      id: 'competitive',
      label: 'Competitive',
      min: 60,
      max: 79,
      summary:
        'Your site is converting well. A structured testing program will help you find the remaining gains.',
      recommendations: [
        'Launch a structured A/B testing program — start with headline and CTA copy on your highest-traffic pages',
        'Build a multi-touch lead capture strategy (exit intent, scroll-based, inline content upgrades)',
        'Map the post-conversion experience — what happens after a lead submits a form?',
        'Conduct a mobile UX audit focusing on tap target size, form experience, and load speed',
      ],
    },
    {
      id: 'future-ready',
      label: 'Future-Ready',
      min: 80,
      max: 100,
      summary:
        'Your site is a high-performing conversion asset. The focus now is personalization, advanced testing, and protecting performance as the site grows.',
      recommendations: [
        'Explore dynamic personalization based on traffic source, returning visitor status, and industry',
        'Build an incrementality testing program to measure true CRO impact versus external factors',
        'Invest in video-based proof content for your highest-value conversion pages',
        'Run regular accessibility audits — WCAG compliance improves UX for all users',
      ],
    },
  ],
  questions: [
    {
      id: 'wc-1',
      question: 'Is your primary offer clear within 5 seconds of landing on your site?',
      options: [
        { label: "No — it's not immediately obvious what you do or who it is for", score: 0 },
        { label: 'Somewhat — visitors who read carefully will understand', score: 1 },
        { label: 'Usually — most visitors get it quickly', score: 2 },
        {
          label: 'Yes — tested and confirmed through user research or session recordings',
          score: 3,
        },
      ],
    },
    {
      id: 'wc-2',
      question: 'How strong is your above-the-fold message?',
      options: [
        { label: 'Generic headline with no clear value proposition', score: 0 },
        { label: 'Decent headline but weak supporting copy', score: 1 },
        { label: 'Clear headline and supporting subtext aligned to your offer', score: 2 },
        {
          label: 'Benefit-led headline, supporting copy, and visual all tested and aligned',
          score: 3,
        },
      ],
    },
    {
      id: 'wc-3',
      question: 'How visible and compelling are your calls-to-action?',
      options: [
        { label: 'CTAs are minimal or hard to find', score: 0 },
        { label: 'CTAs exist but are not prominent enough', score: 1 },
        { label: 'Clear primary CTAs on key pages', score: 2 },
        { label: 'CTAs tested by copy, placement, and design — optimized per page', score: 3 },
      ],
    },
    {
      id: 'wc-4',
      question: 'How fast does your site load on mobile?',
      options: [
        { label: "We haven't measured it", score: 0 },
        { label: 'We know it is slow but have not addressed it', score: 1 },
        { label: 'Acceptable (3–4 seconds)', score: 2 },
        { label: 'Fast (under 2 seconds), monitored and maintained regularly', score: 3 },
      ],
    },
    {
      id: 'wc-5',
      question: 'Do you display trust signals on conversion pages?',
      options: [
        { label: 'No trust signals', score: 0 },
        { label: 'A logo or single testimonial somewhere on the site', score: 1 },
        { label: 'Testimonials and/or certifications placed on key pages', score: 2 },
        { label: 'Multiple trust signals strategically placed near every major CTA', score: 3 },
      ],
    },
    {
      id: 'wc-6',
      question: 'How are your forms optimized for conversion?',
      options: [
        { label: 'Long forms with many required fields', score: 0 },
        { label: 'Forms exist but have not been optimized', score: 1 },
        { label: 'Shortened forms with friction points reduced', score: 2 },
        {
          label: 'Tested forms with minimal required fields and clear benefit copy above them',
          score: 3,
        },
      ],
    },
    {
      id: 'wc-7',
      question: 'What analytics and tracking do you have in place?',
      options: [
        { label: 'Nothing', score: 0 },
        { label: 'Basic Google Analytics page views only', score: 1 },
        { label: 'GA plus heatmaps or session recording', score: 2 },
        { label: 'Full stack: GA, heatmaps, event tracking, and funnel visualization', score: 3 },
      ],
    },
    {
      id: 'wc-8',
      question: 'Do you run A/B tests on your website?',
      options: [
        { label: 'Never', score: 0 },
        { label: 'Tried it once without a clear process', score: 1 },
        { label: 'Occasional tests on key pages', score: 2 },
        { label: 'Ongoing structured test program with documented learnings log', score: 3 },
      ],
    },
    {
      id: 'wc-9',
      question: 'How do you capture leads at multiple stages of the funnel?',
      options: [
        { label: 'No lead capture', score: 0 },
        { label: 'Basic contact form only', score: 1 },
        { label: 'A few lead magnets or embedded forms', score: 2 },
        { label: 'Multi-point lead capture with segmented follow-up sequences', score: 3 },
      ],
    },
    {
      id: 'wc-10',
      question: 'Do you track micro-conversions (button clicks, scroll depth, video views)?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Track some button clicks', score: 1 },
        { label: 'Most micro-conversions tracked with events', score: 2 },
        { label: 'Full event tracking mapped to a documented conversion funnel', score: 3 },
      ],
    },
    {
      id: 'wc-11',
      question: 'How well does your homepage communicate your unique selling proposition?',
      options: [
        { label: 'It does not communicate a clear USP', score: 0 },
        { label: 'Somewhat — but it is generic enough to apply to many businesses', score: 1 },
        { label: 'Clearly stated USP', score: 2 },
        {
          label: 'Differentiated USP validated through customer research and competitive analysis',
          score: 3,
        },
      ],
    },
    {
      id: 'wc-12',
      question: 'How is your site navigation structured from a conversion standpoint?',
      options: [
        { label: 'Confusing or overloaded with options', score: 0 },
        { label: 'Functional but not optimized for conversion pathways', score: 1 },
        { label: 'Clear navigation with obvious paths to key conversion pages', score: 2 },
        { label: 'Navigation designed and tested around conversion goals', score: 3 },
      ],
    },
    {
      id: 'wc-13',
      question: 'Do you have social proof close to your conversion points?',
      options: [
        { label: 'No social proof', score: 0 },
        { label: 'One or two testimonials on the homepage', score: 1 },
        { label: 'Relevant social proof on most key pages', score: 2 },
        { label: 'Contextual social proof A/B tested near every major CTA', score: 3 },
      ],
    },
    {
      id: 'wc-14',
      question: 'How is the mobile UX of your site?',
      options: [
        { label: 'Not mobile-optimized', score: 0 },
        { label: 'Responsive but not designed for mobile-first', score: 1 },
        { label: 'Good mobile experience with clear usability', score: 2 },
        {
          label: 'Mobile-first design with tested flows and minimal friction on small screens',
          score: 3,
        },
      ],
    },
    {
      id: 'wc-15',
      question: 'Do you use exit-intent or behavior-triggered lead capture?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Basic popup on all pages (not targeted)', score: 1 },
        { label: 'Exit intent popup on key pages', score: 2 },
        { label: 'Behavior-triggered capture tested and optimized by page and audience', score: 3 },
      ],
    },
    {
      id: 'wc-16',
      question: 'Is your site accessibility-compliant?',
      options: [
        { label: 'Not checked', score: 0 },
        { label: 'Partial — some alt text and basic semantic structure', score: 1 },
        { label: 'Most accessibility basics covered', score: 2 },
        { label: 'WCAG AA compliant, regularly audited', score: 3 },
      ],
    },
    {
      id: 'wc-17',
      question: 'How do you handle the post-conversion experience?',
      options: [
        { label: 'No follow-up process', score: 0 },
        { label: 'Basic thank-you page only', score: 1 },
        { label: 'Thank-you email and a short follow-up sequence', score: 2 },
        {
          label: 'Automated onboarding sequence designed for activation and early retention',
          score: 3,
        },
      ],
    },
    {
      id: 'wc-18',
      question: 'Do you use video to support key conversion pages?',
      options: [
        { label: 'No video on the site', score: 0 },
        { label: 'Embedded YouTube video somewhere on the site', score: 1 },
        { label: 'Product or service explainer video on key pages', score: 2 },
        { label: 'Tested video placements with conversion impact measured per page', score: 3 },
      ],
    },
    {
      id: 'wc-19',
      question: 'How personalized is your website experience for different visitors?',
      options: [
        { label: 'One-size-fits-all for everyone', score: 0 },
        { label: 'Slightly different CTAs for different traffic sources', score: 1 },
        { label: 'Some personalization by source or returning visitor', score: 2 },
        { label: 'Dynamic personalization based on behavior, source, and segment', score: 3 },
      ],
    },
    {
      id: 'wc-20',
      question: 'How do you reduce bounce rate on high-traffic landing pages?',
      options: [
        { label: "We don't address it", score: 0 },
        { label: 'We check bounce rate occasionally but do not take action', score: 1 },
        { label: 'Improved page speed and content quality for high-bounce pages', score: 2 },
        { label: 'Dedicated bounce reduction strategy per landing page with testing', score: 3 },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// RETENTION & CRM
// ---------------------------------------------------------------------------
const retentionCrm: QuizTopic = {
  id: 'retention-crm',
  title: 'Retention & CRM Readiness Test',
  shortTitle: 'Retention & CRM',
  description: 'Evaluate how well you nurture, retain, and grow customer value.',
  iconPath:
    'M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z',
  availableQuestionCounts: [5, 10, 20],
  scoreBands: [
    {
      id: 'behind',
      label: 'Behind',
      min: 0,
      max: 39,
      summary:
        "You're spending to acquire customers but not investing in keeping them. Retention improvements typically generate far higher ROI than new acquisition.",
      recommendations: [
        'Set up a basic welcome email sequence for all new customers — even a 3-email series is a start',
        'Implement a CRM (HubSpot free, Notion, or a spreadsheet with discipline) so contacts are tracked',
        'Create a simple post-purchase follow-up email 7 days after first purchase',
        'Define your customer lifecycle stages — at minimum: lead, new customer, active, lapsed',
        'Identify your top 20 customers and ensure they are being looked after personally',
      ],
    },
    {
      id: 'developing',
      label: 'Developing',
      min: 40,
      max: 59,
      summary:
        'You have some retention activities in place, but they are not systematic enough to compound over time. Better segmentation and automation will change this.',
      recommendations: [
        'Build a segmented email nurture sequence — different content for cold leads vs. past buyers',
        'Set up a lapsed customer winback campaign triggered at 60 and 90 days of no activity',
        'Start tracking churn rate and NPS on a quarterly basis',
        'Use your CRM data to identify the 20% of customers driving 80% of revenue and protect them',
      ],
    },
    {
      id: 'competitive',
      label: 'Competitive',
      min: 60,
      max: 79,
      summary:
        'Your retention is working. The opportunity is deeper personalization and using CRM data to feed back into your acquisition strategy.',
      recommendations: [
        'Move to behavioral email triggers — events like page visits, downloads, and purchase milestones',
        'Build a systematic referral program with tracking and incentives',
        'Use retained customer data (demographics, behavior, LTV) to build acquisition lookalike audiences',
        'Create a loyalty or VIP tier for your highest-value customers',
      ],
    },
    {
      id: 'future-ready',
      label: 'Future-Ready',
      min: 80,
      max: 100,
      summary:
        'Your retention and CRM are operating at a high level. The next frontier is predictive retention and using customer data as a full-loop growth engine.',
      recommendations: [
        'Explore predictive churn modelling — intervene before customers disengage',
        'Build a full-loop data strategy where retention insights power acquisition targeting',
        'Invest in customer community and advocacy programs to turn LTV into organic referral',
        'Automate personalized milestone moments (anniversaries, usage milestones, upgrades)',
      ],
    },
  ],
  questions: [
    {
      id: 'rc-1',
      question: 'Do you have email automation set up for your customer journey?',
      options: [
        { label: 'No — we send emails manually only when we remember', score: 0 },
        { label: 'One or two basic automations (welcome email only)', score: 1 },
        { label: 'Several key sequences: welcome, purchase confirmation, follow-up', score: 2 },
        { label: 'Full lifecycle automation mapped to each customer journey stage', score: 3 },
      ],
    },
    {
      id: 'rc-2',
      question: "How do you nurture leads who don't convert immediately?",
      options: [
        { label: "We don't — unconverted leads are dropped", score: 0 },
        { label: 'Occasional manual follow-up email', score: 1 },
        { label: 'A basic nurture sequence (3–5 emails)', score: 2 },
        {
          label: 'Multi-touch nurture with segmented content based on behavior and intent',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-3',
      question: 'Do you follow up with customers after their first purchase?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Occasionally and manually', score: 1 },
        { label: 'Basic automated post-purchase email', score: 2 },
        {
          label: 'Structured post-purchase journey: onboarding, upsell, cross-sell, review request',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-4',
      question: 'How segmented is your customer and prospect list?',
      options: [
        { label: 'No segmentation — everyone gets the same emails', score: 0 },
        { label: 'Basic segmentation by product purchased or source', score: 1 },
        { label: 'Behavioral and demographic segments used for most campaigns', score: 2 },
        {
          label: 'Dynamic multi-variable segmentation driving all campaigns automatically',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-5',
      question: 'Are you actively using a CRM?',
      options: [
        { label: 'No CRM — everything lives in emails and spreadsheets', score: 0 },
        { label: 'CRM exists but is barely used or out of date', score: 1 },
        { label: 'CRM used actively for key contacts and pipeline', score: 2 },
        {
          label: 'CRM fully adopted, driving all sales and marketing activity with clean data',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-6',
      question: 'Do you have winback campaigns for lapsed customers?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Occasional promotional blast to dormant contacts', score: 1 },
        { label: 'A winback sequence triggered at a set period of inactivity', score: 2 },
        { label: 'Tiered winback system based on recency, frequency, and value', score: 3 },
      ],
    },
    {
      id: 'rc-7',
      question: 'Do you measure customer satisfaction or Net Promoter Score (NPS)?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Informally — we notice if complaints increase', score: 1 },
        { label: 'Periodic NPS survey or post-purchase feedback', score: 2 },
        {
          label:
            'Continuous NPS tracking integrated with lifecycle campaigns and improvement loops',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-8',
      question: 'Do you have referral systems in place to grow through existing customers?',
      options: [
        { label: 'No referral program', score: 0 },
        { label: 'Informal — we occasionally ask satisfied customers to refer', score: 1 },
        { label: 'Basic referral incentive or affiliate offer', score: 2 },
        {
          label: 'Documented referral program with tracking, automation, and incentive tiers',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-9',
      question: 'How do you collect customer feedback?',
      options: [
        { label: "We don't formally collect feedback", score: 0 },
        { label: 'Occasional manual surveys when we think of it', score: 1 },
        { label: 'Post-purchase survey or NPS sent to all customers', score: 2 },
        {
          label: 'Systematic feedback loop feeding back into product and marketing improvements',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-10',
      question: 'Do you track churn or cancellation rates?',
      options: [
        { label: 'No', score: 0 },
        { label: "We notice when important customers leave but don't track it", score: 1 },
        { label: 'Basic churn tracking reviewed quarterly', score: 2 },
        {
          label:
            'Real-time churn monitoring with early-warning triggers and intervention workflows',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-11',
      question: 'How do you use CRM data to inform campaigns?',
      options: [
        { label: "CRM data isn't used for campaigns", score: 0 },
        { label: 'Occasionally for segmented promotional blasts', score: 1 },
        { label: 'Regularly used for campaign targeting and personalization', score: 2 },
        {
          label: 'CRM drives all campaign targeting, personalization, and automation triggers',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-12',
      question: 'Do you use behavioral triggers in your email sequences?',
      options: [
        { label: 'No triggers — everything is time-based (day 1, day 3, day 7)', score: 0 },
        { label: 'One or two behavioral triggers (e.g., cart abandonment)', score: 1 },
        { label: 'Behavioral triggers for key sequences like post-purchase and winback', score: 2 },
        {
          label: 'Behavior-first automation across the entire lifecycle — actions, not clocks',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-13',
      question: 'How do you measure email performance end-to-end?',
      options: [
        { label: "We don't track email metrics", score: 0 },
        { label: 'Open rates only', score: 1 },
        { label: 'Open and click-through rates', score: 2 },
        { label: 'Full funnel: open → click → conversion → revenue attributed to email', score: 3 },
      ],
    },
    {
      id: 'rc-14',
      question: 'Do you personalize your email content beyond first name?',
      options: [
        { label: 'No — same content goes to everyone', score: 0 },
        { label: 'Name personalization only', score: 1 },
        { label: 'Content varies by segment or product interest', score: 2 },
        {
          label: 'Dynamic content personalized by lifecycle stage, behavior, and customer value',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-15',
      question: 'Do you have onboarding sequences for new customers?',
      options: [
        { label: 'No', score: 0 },
        { label: 'Basic welcome email only', score: 1 },
        { label: 'Welcome series of 2–4 emails', score: 2 },
        {
          label:
            'Full onboarding journey designed for activation, habit formation, and early retention',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-16',
      question: 'Do you have a strategy to encourage repeat purchases or upsells?',
      options: [
        { label: 'No strategy', score: 0 },
        { label: 'Occasional promotional email', score: 1 },
        { label: 'Upsell and cross-sell emails in some sequences', score: 2 },
        {
          label: 'Systematic repeat-purchase strategy with LTV goals and automated triggers',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-17',
      question: 'How do you handle email list health and deliverability?',
      options: [
        { label: "We don't monitor list health", score: 0 },
        { label: 'Comply with unsubscribes but do not proactively clean the list', score: 1 },
        { label: 'Periodic list cleaning every 6–12 months', score: 2 },
        {
          label:
            'Proactive deliverability management with regular list health audits and re-engagement campaigns',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-18',
      question: 'How do you increase average order value (AOV)?',
      options: [
        { label: 'No strategy to increase AOV', score: 0 },
        { label: 'Occasionally mention upsells in conversation', score: 1 },
        { label: 'Upsell and cross-sell offers in post-purchase emails', score: 2 },
        {
          label: 'Systematic AOV strategy embedded across the entire post-purchase experience',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-19',
      question: 'Do you map the full customer lifecycle with defined stages?',
      options: [
        { label: "We don't map lifecycle stages", score: 0 },
        { label: 'Broad categories only: prospect and customer', score: 1 },
        { label: 'Defined stages with some automation triggers per stage', score: 2 },
        {
          label: 'Full lifecycle map with stage-specific content, scoring, and handoff rules',
          score: 3,
        },
      ],
    },
    {
      id: 'rc-20',
      question: 'Is retention data used to improve your acquisition strategy?',
      options: [
        { label: 'No connection between retention and acquisition data', score: 0 },
        { label: "Rarely — different teams or tools that don't communicate", score: 1 },
        { label: 'Some sharing of retention insights with the acquisition team', score: 2 },
        {
          label:
            'Full loop: best-retained customers inform lookalike targeting and acquisition messaging',
          score: 3,
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Exported collection
// ---------------------------------------------------------------------------
export const quizTopics: QuizTopic[] = [
  dataScience,
  aiIntegration,
  organicContent,
  mediaBuying,
  websiteConversion,
  retentionCrm,
];

export const quizTopicMap: Record<string, QuizTopic> = Object.fromEntries(
  quizTopics.map((t) => [t.id, t]),
);
