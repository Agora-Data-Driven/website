/** Quiz data for the Skill Tests (guest-mode front end of the Skill Mastery engine).
 *  Right/wrong technical proficiency questions, one correct option per question.
 *  Generated from an authored + fact-checked question bank; edit the source, not by hand at scale. */

export type ProficiencyBandId = 'novice' | 'developing' | 'proficient' | 'expert';

export interface QuizQuestion {
  id: string;
  question: string;
  /** Exactly four options. */
  options: string[];
  /** 0-based index of the correct option. */
  correctIndex: number;
  /** One-sentence rationale shown after answering. */
  explanation: string;
  difficulty?: 'fundamental' | 'intermediate' | 'advanced';
}

export interface ProficiencyBand {
  id: ProficiencyBandId;
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
  bands: ProficiencyBand[];
}

export const quizTopics: QuizTopic[] = [
  {
    id: 'data-science',
    title: 'Data Science & Analytics Test',
    shortTitle: 'Data Science',
    description:
      'Python, SQL, statistics, and machine-learning fundamentals: a live preview of the Skill Mastery engine.',
    iconPath:
      'M3 13.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 3 18.5v-5Zm6.5-5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 9.5 18.5v-10Zm6.5-4a1.5 1.5 0 0 1 1.5-1.5h1A1.5 1.5 0 0 1 22 4.5v14a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 16 18.5v-14Z',
    availableQuestionCounts: [5, 10, 20],
    questions: [
      {
        id: 'ds-1',
        question: 'What is the median of the data set [3, 1, 4, 1, 5]?',
        options: ['1', '2.8', '4', '3'],
        correctIndex: 3,
        explanation:
          'Sorted the values are 1, 1, 3, 4, 5, and the middle value of five numbers is 3.',
        difficulty: 'fundamental',
      },
      {
        id: 'ds-2',
        question: 'In Python 3, what type does the expression 3 / 2 evaluate to?',
        options: ['float', 'int', 'complex', 'str'],
        correctIndex: 0,
        explanation:
          'The / operator performs true division in Python 3 and always returns a float (1.5).',
        difficulty: 'fundamental',
      },
      {
        id: 'ds-3',
        question: 'In SQL, which clause filters individual rows before any grouping happens?',
        options: ['HAVING', 'GROUP BY', 'WHERE', 'ORDER BY'],
        correctIndex: 2,
        explanation:
          'WHERE filters rows before aggregation, whereas HAVING filters groups after aggregation.',
        difficulty: 'fundamental',
      },
      {
        id: 'ds-4',
        question: 'What is the output of [x * 2 for x in range(3)] in Python?',
        options: ['[2, 4, 6]', '[0, 2, 4]', '[0, 1, 2]', '[2, 4, 6, 8]'],
        correctIndex: 1,
        explanation: 'range(3) yields 0, 1, 2, and doubling each gives [0, 2, 4].',
        difficulty: 'fundamental',
      },
      {
        id: 'ds-5',
        question: 'Which of the following is an example of unsupervised learning?',
        options: [
          'Linear regression',
          'Logistic regression',
          'K-means clustering',
          'Random forest classification',
        ],
        correctIndex: 2,
        explanation:
          'K-means groups data without labeled targets, which defines unsupervised learning.',
        difficulty: 'fundamental',
      },
      {
        id: 'ds-6',
        question: 'A correlation coefficient of -0.9 between two variables indicates:',
        options: [
          'A strong negative linear relationship',
          'A weak negative linear relationship',
          'A strong positive linear relationship',
          'Almost no linear relationship',
        ],
        correctIndex: 0,
        explanation:
          'A value near -1 signals a strong linear relationship where one variable falls as the other rises.',
        difficulty: 'fundamental',
      },
      {
        id: 'ds-7',
        question: 'In SQL, a LEFT JOIN between table A (left) and table B returns:',
        options: [
          'Only rows matching in both tables',
          'All rows from both tables combined',
          'All B rows plus matched A rows',
          'All A rows plus matched B rows',
        ],
        correctIndex: 3,
        explanation:
          'A LEFT JOIN keeps every row from the left table and fills unmatched right-side columns with NULL.',
        difficulty: 'intermediate',
      },
      {
        id: 'ds-8',
        question: "What does the pandas method df['col'].value_counts() return?",
        options: [
          'Counts of each unique value in the column',
          'The number of columns in the DataFrame',
          'The sum of all values in the column',
          'Unique values sorted in ascending order',
        ],
        correctIndex: 0,
        explanation:
          'value_counts() tallies how many times each distinct value appears in the Series.',
        difficulty: 'intermediate',
      },
      {
        id: 'ds-9',
        question:
          'A model reaches 99% accuracy on training data but only 65% on test data. This is most likely:',
        options: ['Underfitting', 'Overfitting', 'Well generalized', 'High bias'],
        correctIndex: 1,
        explanation:
          'A large gap where training performance far exceeds test performance is the signature of overfitting.',
        difficulty: 'intermediate',
      },
      {
        id: 'ds-10',
        question: 'What is the main purpose of holding out a separate test set?',
        options: [
          'To increase the amount of training data',
          'To tune hyperparameters on each epoch',
          'To reduce the number of input features',
          'To estimate performance on unseen data',
        ],
        correctIndex: 3,
        explanation:
          'A held-out test set gives an unbiased estimate of how the model generalizes to new data.',
        difficulty: 'intermediate',
      },
      {
        id: 'ds-11',
        question: 'Using TP, FP, FN, and TN, recall is defined as:',
        options: ['TP / (TP + FP)', '(TP + TN) / total', 'TP / (TP + FN)', 'TN / (TN + FP)'],
        correctIndex: 2,
        explanation:
          'Recall measures the fraction of actual positives caught, which is TP divided by all real positives (TP + FN).',
        difficulty: 'intermediate',
      },
      {
        id: 'ds-12',
        question:
          'Which SQL construct computes a running total while keeping every individual row?',
        options: [
          'GROUP BY with SUM aggregate',
          'SUM() OVER (ORDER BY ...)',
          'HAVING clause with SUM',
          'SELECT DISTINCT with SUM',
        ],
        correctIndex: 1,
        explanation:
          'A window function like SUM() OVER (ORDER BY ...) accumulates values without collapsing rows into groups.',
        difficulty: 'intermediate',
      },
      {
        id: 'ds-13',
        question:
          'What is the average-case time complexity of binary search on a sorted array of n elements?',
        options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
        correctIndex: 2,
        explanation:
          'Binary search halves the search space each step, giving logarithmic O(log n) time.',
        difficulty: 'intermediate',
      },
      {
        id: 'ds-14',
        question:
          'Two fair coins are flipped. What is the probability of getting exactly one head?',
        options: ['1/4', '1/3', '3/4', '1/2'],
        correctIndex: 3,
        explanation:
          'Two of the four equally likely outcomes (HT, TH) have exactly one head, giving 2/4 = 1/2.',
        difficulty: 'intermediate',
      },
      {
        id: 'ds-15',
        question:
          "As you increase a model's complexity, the bias-variance tradeoff typically means it:",
        options: [
          'Increases bias, decreases variance',
          'Decreases bias, increases variance',
          'Decreases both bias and variance',
          'Increases both bias and variance',
        ],
        correctIndex: 1,
        explanation:
          'More flexible models fit training data more closely, lowering bias but raising variance.',
        difficulty: 'advanced',
      },
      {
        id: 'ds-16',
        question:
          'If the learning rate in gradient descent is set too high, the algorithm will most likely:',
        options: [
          'Overshoot the minimum and diverge or oscillate',
          'Converge very slowly toward the minimum',
          'Reach the global minimum in fewer steps',
          'Stop updating the weights entirely',
        ],
        correctIndex: 0,
        explanation:
          'An oversized step overshoots the minimum, so the loss oscillates or grows instead of converging.',
        difficulty: 'advanced',
      },
      {
        id: 'ds-17',
        question: 'A hypothesis test returns a p-value of 0.03. This means:',
        options: [
          'The null hypothesis has a 3% chance of being true',
          'The alternative hypothesis is true with 97% probability',
          'Given a true null, data this extreme has 3% probability',
          'The measured effect size is equal to 3 percent',
        ],
        correctIndex: 2,
        explanation:
          'A p-value is the probability of observing data at least this extreme assuming the null hypothesis is true.',
        difficulty: 'advanced',
      },
      {
        id: 'ds-18',
        question:
          'A disease affects 1% of a population. A test is 99% sensitive and 95% specific. Given a positive result, the probability of actually having the disease is closest to:',
        options: ['About 17%', 'About 50%', 'About 95%', 'About 99%'],
        correctIndex: 0,
        explanation: "By Bayes' rule, 0.0099 / (0.0099 + 0.0495) ≈ 0.167, so roughly 17%.",
        difficulty: 'advanced',
      },
      {
        id: 'ds-19',
        question:
          'Compared with L2 (Ridge) regularization, L1 (Lasso) regularization is notable because it:',
        options: [
          'Shrinks coefficients toward zero without reaching it',
          'Adds the squared magnitude of coefficients as penalty',
          'Requires input features to be normally distributed',
          'Drives some coefficients exactly to zero',
        ],
        correctIndex: 3,
        explanation:
          'The L1 penalty yields sparse models by forcing some coefficients to become exactly zero, whereas L2 only shrinks them toward zero.',
        difficulty: 'advanced',
      },
      {
        id: 'ds-20',
        question: 'What is the population variance of the data set [2, 4, 6]?',
        options: ['4.00', '2.67', '8.00', '1.63'],
        correctIndex: 1,
        explanation:
          'The mean is 4, squared deviations sum to 8, and dividing by n = 3 gives 8/3 ≈ 2.67.',
        difficulty: 'advanced',
      },
    ],
    bands: [
      {
        id: 'novice',
        label: 'Novice',
        min: 0,
        max: 39,
        summary:
          'You are just starting out and still have gaps in core Python, SQL, and basic statistics fundamentals.',
        recommendations: [
          'Drill Python data types, list comprehensions, and basic pandas operations until they feel automatic',
          'Learn the SQL SELECT / WHERE / GROUP BY workflow and practice simple aggregations on a sample dataset',
          'Compute mean, median, and variance by hand on small data sets to build statistical intuition',
          'Start daily spaced-repetition drills in the Skill Mastery engine and use its AI hints when you get stuck',
        ],
      },
      {
        id: 'developing',
        label: 'Developing',
        min: 40,
        max: 59,
        summary:
          'You have the basics down but still stumble on multi-table SQL, machine-learning workflow, and evaluation metrics.',
        recommendations: [
          'Practice INNER, LEFT, and window-function SQL queries against a realistic multi-table schema',
          'Build a train/test split in scikit-learn and diagnose overfitting vs underfitting on a real dataset',
          'Compute precision, recall, and F1 from a confusion matrix so the formulas stick',
          'Keep grinding the intermediate Skill Mastery decks and lean on AI hints to close specific gaps',
        ],
      },
      {
        id: 'proficient',
        label: 'Proficient',
        min: 60,
        max: 79,
        summary:
          'You work confidently across the data-science stack and are ready to sharpen advanced modeling and probability skills.',
        recommendations: [
          'Study the bias-variance tradeoff and compare L1 (Lasso) vs L2 (Ridge) regularization on the same model',
          'Solve Bayes and conditional-probability problems, including base-rate scenarios like medical testing',
          'Evaluate models with cross-validation and metrics such as RMSE, ROC-AUC, and log loss rather than accuracy alone',
          'Use Skill Mastery progress tracking to find your weakest tracks and target them with focused review sessions',
        ],
      },
      {
        id: 'expert',
        label: 'Expert',
        min: 80,
        max: 100,
        summary:
          'You have strong command of the full analyst toolkit and can reason precisely about statistics, ML, and algorithms.',
        recommendations: [
          'Implement gradient descent, k-means, and binary search from scratch to cement the underlying mechanics',
          'Deepen linear algebra for ML, including eigenvectors, SVD, and their role in dimensionality reduction',
          'Tackle the advanced Skill Mastery tracks on neural networks, TensorFlow, and unsupervised/reinforcement learning',
          'Sustain your edge with Skill Mastery spaced repetition on advanced decks and mentor teammates on weak areas',
        ],
      },
    ],
  },
  {
    id: 'ai-integration',
    title: 'AI Integration Test',
    shortTitle: 'AI Integration',
    description:
      'LLM capabilities and limits, prompt engineering, RAG, automation, and safe AI data handling.',
    iconPath:
      'M12 2a1 1 0 0 1 .894.553l2.447 4.894 5.4.785a1 1 0 0 1 .554 1.706l-3.909 3.81.923 5.378a1 1 0 0 1-1.451 1.054L12 17.77l-4.858 2.555a1 1 0 0 1-1.45-1.054l.922-5.378L2.705 9.938a1 1 0 0 1 .554-1.706l5.4-.785 2.447-4.894A1 1 0 0 1 12 2Z',
    availableQuestionCounts: [5, 10, 20],
    questions: [
      {
        id: 'ai-1',
        question: 'What does it mean when an LLM "hallucinates"?',
        options: [
          'It states false or fabricated information as if true',
          'It refuses to answer a question it finds unsafe',
          'It stops generating partway through a response',
          "It repeats the user's wording back word for word",
        ],
        correctIndex: 0,
        explanation:
          'A hallucination is fluent output that is factually false or invented rather than grounded in real information.',
        difficulty: 'fundamental',
      },
      {
        id: 'ai-2',
        question: 'A model\'s "knowledge cutoff" means that it...',
        options: [
          'Charges only for tokens created after that date',
          'Deletes stored conversations older than that date',
          'Must be retrained by the user every day afterward',
          'Has no training data about events after that date',
        ],
        correctIndex: 3,
        explanation:
          'The knowledge cutoff is the point after which the model saw no training data, so it cannot know later events.',
        difficulty: 'fundamental',
      },
      {
        id: 'ai-3',
        question: 'The "context window" of an LLM is...',
        options: [
          'The time before a chat session times out',
          'Tokens it can handle at once, in and out',
          'The users it can serve at the same time',
          'The set of languages it was trained to read',
        ],
        correctIndex: 1,
        explanation:
          'The context window is the maximum number of tokens, spanning prompt and completion, the model can attend to at one time.',
        difficulty: 'fundamental',
      },
      {
        id: 'ai-4',
        question: 'In a chat API, the "system" message is normally used to...',
        options: [
          "Hold the user's latest typed question",
          'Log errors returned by the API endpoint',
          "Store the model's earlier replies in the thread",
          "Set the assistant's role, tone, and rules",
        ],
        correctIndex: 3,
        explanation:
          "The system message defines the assistant's overall behavior, persona, and constraints before the conversation begins.",
        difficulty: 'fundamental',
      },
      {
        id: 'ai-5',
        question: 'Setting an LLM\'s "temperature" close to 0 makes its output...',
        options: [
          'Longer and more detailed on average',
          'More random and varied in wording',
          'More deterministic and predictable',
          'Slower to generate but more accurate',
        ],
        correctIndex: 2,
        explanation:
          'Low temperature reduces sampling randomness, so the model favors the most probable tokens and produces consistent output.',
        difficulty: 'fundamental',
      },
      {
        id: 'ai-6',
        question: '"Few-shot prompting" refers to...',
        options: [
          'Including a few worked examples in the prompt',
          'Sending the prompt repeatedly and averaging the replies',
          'Restricting the model to a few words per answer',
          'Splitting one prompt into several smaller calls',
        ],
        correctIndex: 0,
        explanation:
          'Few-shot prompting supplies example input-output pairs in the prompt so the model infers the desired pattern.',
        difficulty: 'fundamental',
      },
      {
        id: 'ai-7',
        question: 'Retrieval-augmented generation (RAG) works mainly by...',
        options: [
          "Fine-tuning the model's weights for each new query",
          "Raising temperature to broaden the model's answer",
          'Running the query across several models at once',
          'Fetching relevant documents into the prompt at runtime',
        ],
        correctIndex: 3,
        explanation:
          'RAG retrieves relevant external text and inserts it into the prompt so the model answers from that supplied context.',
        difficulty: 'intermediate',
      },
      {
        id: 'ai-8',
        question: 'In embedding-based semantic search, two texts count as similar when...',
        options: [
          'They happen to share the exact same keywords',
          'They have an identical number of tokens',
          'Their vectors lie close together in the space',
          'They were both written on the same date',
        ],
        correctIndex: 2,
        explanation:
          'Embeddings map meaning to vectors, so semantic similarity is measured by how close two vectors are, such as by cosine distance.',
        difficulty: 'intermediate',
      },
      {
        id: 'ai-9',
        question:
          'A common estimate is that 100 tokens is roughly 75 words of English. About how many tokens is a 1,500-word document?',
        options: [
          'About 1,125 tokens',
          'About 2,000 tokens',
          'About 3,000 tokens',
          'About 750 tokens',
        ],
        correctIndex: 1,
        explanation:
          'At 75 words per 100 tokens, 1,500 words is 1,500 divided by 0.75, which is about 2,000 tokens.',
        difficulty: 'intermediate',
      },
      {
        id: 'ai-10',
        question:
          'An API costs $3 per million input tokens and $15 per million output tokens. A request uses 10,000 input and 2,000 output tokens. The approximate cost is...',
        options: ['$0.06', '$0.03', '$0.18', '$0.60'],
        correctIndex: 0,
        explanation:
          'Input is 10,000/1,000,000 x $3 = $0.03 and output is 2,000/1,000,000 x $15 = $0.03, totaling $0.06.',
        difficulty: 'intermediate',
      },
      {
        id: 'ai-11',
        question: 'In a tool like Zapier or Make, a "webhook" is best described as...',
        options: [
          'A scheduled job that runs once every hour',
          'A database that stores your automation logs',
          'A backup copy of your workflow settings',
          'An HTTP request sent automatically on an event',
        ],
        correctIndex: 3,
        explanation:
          'A webhook is an automated HTTP callback that one system sends to another the moment a triggering event occurs.',
        difficulty: 'intermediate',
      },
      {
        id: 'ai-12',
        question: 'The safest way to use a third-party AI API key inside an automation is to...',
        options: [
          'Paste it into each shared automation workflow step',
          'Email it to teammates who run the flow',
          'Keep it in an environment variable or secrets store',
          'Hard-code it directly in the public client script',
        ],
        correctIndex: 2,
        explanation:
          'Storing the key in an environment variable or secrets manager keeps it out of shared code and version history.',
        difficulty: 'intermediate',
      },
      {
        id: 'ai-13',
        question:
          'Before sending customer records to a public LLM API, the recommended step is to...',
        options: [
          'Send everything so the model has full context',
          'Redact or anonymize personal data first',
          'Raise the temperature to obscure the data',
          'Encrypt the prompt with your own private key',
        ],
        correctIndex: 1,
        explanation:
          'Removing or masking PII before it leaves your systems limits exposure if the provider logs or retains the data.',
        difficulty: 'intermediate',
      },
      {
        id: 'ai-14',
        question:
          'To reliably total a numeric column across a 10,000-row spreadsheet, you should...',
        options: [
          'Ask the LLM to add the values mentally',
          'Paste all rows in chat and request the sum',
          'Have the LLM write code to compute the total',
          'Ask the model twice and average its answers',
        ],
        correctIndex: 2,
        explanation:
          'LLMs are unreliable at long manual arithmetic, so delegating to generated code or a spreadsheet formula gives exact results.',
        difficulty: 'intermediate',
      },
      {
        id: 'ai-15',
        question: 'In a RAG pipeline, making retrieved chunks too large tends to...',
        options: [
          'Make the embeddings impossible to compute',
          'Force the vector store to reject the chunk',
          'Dilute relevant detail so the model overlooks it',
          "Shift the model's knowledge cutoff earlier",
        ],
        correctIndex: 2,
        explanation:
          'Overly large chunks pack in unrelated text, lowering retrieval precision and burying the specific passage the model needs.',
        difficulty: 'advanced',
      },
      {
        id: 'ai-16',
        question:
          'You need an LLM to return the same classification label every time for identical input. The best configuration is...',
        options: [
          'Temperature near 1.0 with a long output limit',
          'Temperature near 0 with a fixed, stable prompt',
          'A high top-p value with a random seed',
          'Few-shot examples with temperature at 2.0',
        ],
        correctIndex: 1,
        explanation:
          "A temperature near zero minimizes sampling randomness, making the model's output essentially deterministic for the same input.",
        difficulty: 'advanced',
      },
      {
        id: 'ai-17',
        question:
          "A model has an 8,000-token context window. Your system prompt is 1,500 tokens and you reserve 2,000 tokens for the reply. About how many tokens are left for documents and the user's question?",
        options: [
          'About 6,500 tokens',
          'About 4,500 tokens',
          'About 2,500 tokens',
          'About 8,000 tokens',
        ],
        correctIndex: 1,
        explanation:
          'The window must hold everything, so 8,000 minus 1,500 minus 2,000 leaves 4,500 tokens for retrieved text and the question.',
        difficulty: 'advanced',
      },
      {
        id: 'ai-18',
        question: 'Fine-tuning is a better choice than RAG when your main goal is to...',
        options: [
          'Add a large set of frequently changing documents',
          'Give the model access to live inventory data',
          'Cite specific source passages in each answer',
          'Teach a consistent style or output format',
        ],
        correctIndex: 3,
        explanation:
          'Fine-tuning bakes in stable behavior like tone and formatting, whereas RAG better handles changing, citable factual content.',
        difficulty: 'advanced',
      },
      {
        id: 'ai-19',
        question:
          "Your bulk automation keeps hitting the API's rate limit. The most appropriate fix is to...",
        options: [
          'Retry immediately in a tight loop until it passes',
          "Set the model's temperature to zero",
          "Increase the model's context window size",
          'Add exponential backoff and throttle requests',
        ],
        correctIndex: 3,
        explanation:
          "Backing off exponentially and throttling the request rate keeps the workload within the provider's limits instead of hammering it.",
        difficulty: 'advanced',
      },
      {
        id: 'ai-20',
        question: 'In a RAG chatbot, "prompt injection" is the risk that...',
        options: [
          'Retrieved text hides instructions to hijack it',
          'The user types faster than the model replies',
          'Two API calls collide and overwrite each other',
          'The embedder and LLM use different tokenizers',
        ],
        correctIndex: 0,
        explanation:
          "Prompt injection occurs when untrusted retrieved or user text contains instructions that override the system's intended behavior.",
        difficulty: 'advanced',
      },
    ],
    bands: [
      {
        id: 'novice',
        label: 'Novice (0-39%)',
        min: 0,
        max: 39,
        summary:
          'You know AI tools exist but are still forming the core mental models of what LLMs can and cannot do reliably.',
        recommendations: [
          'Learn the three hard limits first: hallucination, knowledge cutoff, and the fixed context window, with a concrete example of each.',
          'Write prompts with an explicit system role, then test how temperature 0 versus 0.8 changes the same request.',
          'Run daily spaced-repetition drills in the Skill Mastery engine and lean on its AI hints to lock in the fundamentals.',
          "Never paste real customer PII into a public chatbot until you understand the provider's data-retention policy.",
        ],
      },
      {
        id: 'developing',
        label: 'Developing (40-64%)',
        min: 40,
        max: 59,
        summary:
          'You handle everyday prompting and simple automations, but retrieval, cost math, and privacy trade-offs still trip you up.',
        recommendations: [
          'Build one small RAG demo: chunk a document, embed it, and retrieve the top matches before answering.',
          'Practice token and cost estimation by hand (100 tokens is about 75 words) so you can budget an API workflow.',
          'Connect two apps with a webhook in Zapier or Make and store the API key in a secrets manager, not the workflow.',
          'Keep drilling the intermediate items in the Skill Mastery engine and track your accuracy per topic over time.',
        ],
      },
      {
        id: 'proficient',
        label: 'Proficient (65-84%)',
        min: 60,
        max: 79,
        summary:
          'You can design reliable AI workflows, choose the right tool, and reason about tokens, cost, and privacy with confidence.',
        recommendations: [
          'Compare fine-tuning versus RAG on a real task and document which fits changing facts versus fixed style.',
          'Add exponential backoff, retries, and idempotency keys to your automations so they survive rate limits.',
          'Tune RAG retrieval by varying chunk size and top-k, and measure answer precision against a test set.',
          'Audit every workflow for prompt-injection exposure from retrieved or user-supplied text.',
        ],
      },
      {
        id: 'expert',
        label: 'Expert (85-100%)',
        min: 80,
        max: 100,
        summary:
          'You architect production AI systems end to end and can defend your choices on accuracy, cost, latency, and data governance.',
        recommendations: [
          'Instrument evaluations with golden datasets and track hallucination and regression rates across model versions.',
          'Optimize cost and latency with prompt caching, request batching, and routing between small and large models.',
          'Harden pipelines against prompt injection and PII leakage with input/output filtering and least-privilege keys.',
          'Codify your prompt, retrieval, and privacy patterns into reusable, versioned templates and mentor the team on them.',
        ],
      },
    ],
  },
  {
    id: 'organic-content',
    title: 'Organic Content & SEO Test',
    shortTitle: 'Organic Content',
    description:
      'On-page and technical SEO, search intent, keyword research, and measuring organic performance.',
    iconPath:
      'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z',
    availableQuestionCounts: [5, 10, 20],
    questions: [
      {
        id: 'oc-1',
        question:
          'Roughly how many characters of a title tag does Google typically show on desktop before truncating it?',
        options: [
          'About 30 characters',
          'About 60 characters',
          'About 90 characters',
          'About 160 characters',
        ],
        correctIndex: 1,
        explanation:
          'Google typically displays around 50-60 characters of a title tag on desktop before cutting it off.',
        difficulty: 'fundamental',
      },
      {
        id: 'oc-2',
        question: 'Which statement about the meta description tag is correct?',
        options: [
          'It is a confirmed direct Google ranking factor.',
          'It sets the clickable headline shown in results.',
          'It influences click-through from the results page.',
          "It specifies the page's preferred canonical URL.",
        ],
        correctIndex: 2,
        explanation:
          'A meta description is not a direct ranking factor but acts as SERP ad copy that affects click-through rate.',
        difficulty: 'fundamental',
      },
      {
        id: 'oc-3',
        question: 'How many primary H1 headings should a standard web page have?',
        options: [
          'Exactly one main H1 heading',
          'At least five H1 headings',
          'One H1 for every paragraph',
          'No H1 heading at all',
        ],
        correctIndex: 0,
        explanation: "Best practice is a single H1 that clearly states the page's main topic.",
        difficulty: 'fundamental',
      },
      {
        id: 'oc-4',
        question: "The query 'buy running shoes online' most clearly reflects which search intent?",
        options: [
          'Informational intent',
          'Navigational intent',
          'Transactional intent',
          'Commercial investigation intent',
        ],
        correctIndex: 2,
        explanation:
          "'Buy ... online' signals a ready-to-purchase action, which is transactional intent.",
        difficulty: 'fundamental',
      },
      {
        id: 'oc-5',
        question: "What is the primary function of a website's robots.txt file?",
        options: [
          "To instantly remove pages from Google's index",
          'To encrypt data between the server and browser',
          'To redirect outdated URLs to newer locations',
          "To control crawler access to the site's URLs",
        ],
        correctIndex: 3,
        explanation:
          'robots.txt tells crawlers which paths they may or may not request, so it manages crawling rather than indexing or security.',
        difficulty: 'fundamental',
      },
      {
        id: 'oc-6',
        question: "In keyword research, what does 'search volume' measure?",
        options: [
          'The number of sites competing for the term',
          'The average number of monthly searches for it',
          'The advertising cost per click for the term',
          'The share of searchers who click a result',
        ],
        correctIndex: 1,
        explanation:
          'Search volume is the estimated average number of monthly searches for a keyword.',
        difficulty: 'fundamental',
      },
      {
        id: 'oc-7',
        question: 'When a page is permanently moved to a new URL, which response is correct?',
        options: [
          'A 301 permanent redirect',
          'A 302 temporary redirect',
          'A 307 temporary redirect',
          'A 404 not-found response',
        ],
        correctIndex: 0,
        explanation: 'A 301 signals a permanent move and passes ranking signals to the new URL.',
        difficulty: 'intermediate',
      },
      {
        id: 'oc-8',
        question: 'What does a rel="canonical" tag tell search engines?',
        options: [
          'That the page should never be crawled again',
          "The date the page's content was last updated",
          'The language and country the page targets',
          'The preferred URL among a set of duplicates',
        ],
        correctIndex: 3,
        explanation:
          'The canonical tag names the master version search engines should index among duplicate or similar pages.',
        difficulty: 'intermediate',
      },
      {
        id: 'oc-9',
        question: "What is the most reliable way to keep a specific page out of Google's index?",
        options: [
          "Disallow the page's path in the robots.txt file",
          'Add a noindex robots meta tag to it',
          "Point the page's canonical to your homepage",
          'Reduce the internal links that point to it',
        ],
        correctIndex: 1,
        explanation:
          'A noindex directive tells Google to drop the page, whereas a robots.txt disallow can leave the URL indexed via external links.',
        difficulty: 'intermediate',
      },
      {
        id: 'oc-10',
        question: 'Largest Contentful Paint (LCP) primarily measures which of the following?',
        options: [
          'Total unexpected layout shift on the page',
          'Delay before the page responds to input',
          'Load time of the largest visible element',
          'Time to receive the first byte of data',
        ],
        correctIndex: 2,
        explanation: 'LCP records how long the largest visible content element takes to render.',
        difficulty: 'intermediate',
      },
      {
        id: 'oc-11',
        question:
          "Per Google's thresholds, a 'good' Largest Contentful Paint score is at or under:",
        options: ['1.0 seconds', '2.5 seconds', '4.0 seconds', '6.0 seconds'],
        correctIndex: 1,
        explanation: "Google classifies an LCP of 2.5 seconds or less as 'good'.",
        difficulty: 'intermediate',
      },
      {
        id: 'oc-12',
        question:
          'A page had 20,000 impressions and 800 clicks in Search Console; what is its click-through rate?',
        options: ['0.4%', '4%', '25%', '40%'],
        correctIndex: 1,
        explanation: 'CTR = clicks / impressions = 800 / 20,000 = 4%.',
        difficulty: 'intermediate',
      },
      {
        id: 'oc-13',
        question:
          'Which tool reports the actual Google search queries that led users to your site?',
        options: [
          'Google Search Console',
          'Google Analytics 4',
          'Google Tag Manager',
          'Google Merchant Center',
        ],
        correctIndex: 0,
        explanation:
          "Search Console's Performance report shows the organic queries, which GA4 largely hides.",
        difficulty: 'intermediate',
      },
      {
        id: 'oc-14',
        question: 'What is a key SEO benefit of descriptive internal anchor text?',
        options: [
          "It speeds up the server's response time",
          'It removes duplicate content across the site',
          'It replaces the need for an XML sitemap',
          "It signals the linked page's topic to Google",
        ],
        correctIndex: 3,
        explanation:
          "Descriptive anchor text gives search engines context about the target page's subject.",
        difficulty: 'intermediate',
      },
      {
        id: 'oc-15',
        question: 'Which structured data format does Google recommend for most implementations?',
        options: ['Microdata', 'RDFa', 'JSON-LD', 'XML Schema'],
        correctIndex: 2,
        explanation:
          'Google recommends JSON-LD because it is the easiest structured data format to add and maintain.',
        difficulty: 'advanced',
      },
      {
        id: 'oc-16',
        question: 'What does the hreflang attribute specify?',
        options: [
          'The language and region a page targets',
          'The crawl frequency requested for search bots',
          'The reading difficulty level of the content',
          'The canonical version among duplicate pages',
        ],
        correctIndex: 0,
        explanation:
          'hreflang tells search engines which language and region a page version is intended for.',
        difficulty: 'advanced',
      },
      {
        id: 'oc-17',
        question: 'Why are long redirect chains (A→B→C→D) discouraged for SEO?',
        options: [
          'They automatically trigger a manual penalty',
          'They convert 301 redirects into 404 errors',
          'They block the target pages in robots.txt',
          'They dilute link signals and slow crawling',
        ],
        correctIndex: 3,
        explanation:
          'Each extra hop can leak ranking signals and wastes crawl resources, so chains should be collapsed to one redirect.',
        difficulty: 'advanced',
      },
      {
        id: 'oc-18',
        question: 'Correctly implemented Product structured data primarily does what in search?',
        options: [
          'Guarantees a top first-page ranking position',
          'Makes the page eligible for rich results',
          "Raises the term's average monthly search volume",
          "Hides rival sites' rich results from view",
        ],
        correctIndex: 1,
        explanation:
          'Valid structured data makes a page eligible for rich result features but does not guarantee them or lift rankings directly.',
        difficulty: 'advanced',
      },
      {
        id: 'oc-19',
        question: "In Google Search Console, when is an 'impression' counted?",
        options: [
          "When your link appears in a user's results",
          'When a user clicks through to your site',
          'When Googlebot crawls one of your pages',
          'When a user stays 10 seconds on a page',
        ],
        correctIndex: 0,
        explanation:
          'An impression is logged whenever a link to your site is shown in the search results.',
        difficulty: 'advanced',
      },
      {
        id: 'oc-20',
        question: 'Which URLs belong in an XML sitemap submitted to Google?',
        options: [
          'Every URL, including noindex and redirected ones',
          'Only pages currently blocked by robots.txt',
          'Canonical, indexable pages you want ranked',
          'Only the homepage and the contact page',
        ],
        correctIndex: 2,
        explanation:
          'A sitemap should list canonical, indexable URLs you want crawled and ranked, not blocked, redirected, or noindexed ones.',
        difficulty: 'advanced',
      },
    ],
    bands: [
      {
        id: 'novice',
        label: 'Novice',
        min: 0,
        max: 39,
        summary:
          "You know SEO exists, but the core on-page and crawling concepts aren't yet reliable, so a focused month of fundamentals will move you quickly.",
        recommendations: [
          'Write unique title tags (about 55 characters) and exactly one H1 per page.',
          'Study the four search intents and map each target keyword to the right one.',
          'Set up Google Search Console and review the Performance report weekly for clicks, impressions, and CTR.',
          'Drill title, meta, and H1 rules with spaced-repetition flashcards until they are automatic.',
        ],
      },
      {
        id: 'developing',
        label: 'Developing',
        min: 40,
        max: 59,
        summary:
          'You have the basics down and are ready to make technical SEO decisions about redirects, indexing, and page speed with more confidence.',
        recommendations: [
          'Use 301 for permanent moves and reserve 302/307 for genuinely temporary ones.',
          'Practice the noindex vs robots.txt distinction: noindex to deindex, robots.txt to control crawling.',
          'Measure Core Web Vitals in PageSpeed Insights against LCP ≤2.5s, CLS ≤0.1, and INP ≤200ms.',
          'Audit internal links and add descriptive anchor text to your highest-value pages.',
        ],
      },
      {
        id: 'proficient',
        label: 'Proficient',
        min: 60,
        max: 79,
        summary:
          'You can independently run on-page, technical, and measurement work correctly and would be a dependable SEO hire or team lead.',
        recommendations: [
          'Add JSON-LD structured data (Product, FAQ, Article) and validate it with the Rich Results Test.',
          'Run keyword research in Ahrefs or Semrush, balancing search volume against keyword difficulty.',
          'Diagnose indexing issues with the URL Inspection tool and the Search Console Pages report.',
          'Build topic clusters with a pillar page and supporting internally linked articles.',
        ],
      },
      {
        id: 'expert',
        label: 'Expert',
        min: 80,
        max: 100,
        summary:
          'You command the full stack from structured data and internationalization to log analysis and testing, and can set strategy others follow.',
        recommendations: [
          'Analyze server log files to find crawl-budget waste and orphan pages at scale.',
          'Correlate Search Console query data with GA4 conversions to prioritize high-intent pages.',
          'Implement hreflang for international targeting and QA it with Screaming Frog or Sitebulb.',
          'Run controlled title and template tests, measuring CTR and position lift before full rollout.',
        ],
      },
    ],
  },
  {
    id: 'media-buying',
    title: 'Paid Media & Media Buying Test',
    shortTitle: 'Media Buying',
    description:
      'Ad metrics and math, Meta & Google Ads mechanics, audiences, tracking, and attribution.',
    iconPath:
      'M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605',
    availableQuestionCounts: [5, 10, 20],
    questions: [
      {
        id: 'mb-1',
        question: 'What does CPM measure in a paid media campaign?',
        options: [
          'Cost per single click on an ad',
          'Cost per one thousand ad clicks',
          'Cost per one thousand ad impressions',
          'Cost per one completed purchase conversion',
        ],
        correctIndex: 2,
        explanation:
          'CPM stands for cost per mille, the amount paid for one thousand ad impressions.',
        difficulty: 'fundamental',
      },
      {
        id: 'mb-2',
        question: 'How is click-through rate (CTR) calculated?',
        options: [
          'Impressions divided by total clicks',
          'Clicks divided by impressions',
          'Clicks divided by total ad spend',
          'Conversions divided by total clicks',
        ],
        correctIndex: 1,
        explanation:
          'CTR is the share of impressions that resulted in clicks, so it is clicks divided by impressions.',
        difficulty: 'fundamental',
      },
      {
        id: 'mb-3',
        question: 'An ad spends $200 and receives 400 clicks. What is the cost per click (CPC)?',
        options: ['$2.00', '$5.00', '$0.20', '$0.50'],
        correctIndex: 3,
        explanation: 'CPC equals spend divided by clicks: $200 / 400 = $0.50.',
        difficulty: 'fundamental',
      },
      {
        id: 'mb-4',
        question: 'What does return on ad spend (ROAS) measure?',
        options: [
          'Profit remaining after subtracting ad costs',
          'Revenue generated per dollar of ad spend',
          'Total revenue minus the total ad spend',
          'Ad spend divided by the total order count',
        ],
        correctIndex: 1,
        explanation: 'ROAS expresses how much revenue is earned for every dollar spent on ads.',
        difficulty: 'fundamental',
      },
      {
        id: 'mb-5',
        question: 'In Meta Ads, what is the correct account structure from top to bottom?',
        options: [
          'Ad set, campaign, ad',
          'Ad group, campaign, ad',
          'Campaign, ad set, ad',
          'Campaign, ad, ad set',
        ],
        correctIndex: 2,
        explanation: 'Meta organizes accounts as campaign at the top, then ad set, then ad.',
        difficulty: 'fundamental',
      },
      {
        id: 'mb-6',
        question: 'Retargeting (remarketing) audiences are built from which group of people?',
        options: [
          'People who match your ideal customer profile',
          'People similar to your existing customer base',
          'People in a broad interest-based segment',
          'People who previously engaged with your brand',
        ],
        correctIndex: 3,
        explanation:
          'Retargeting serves ads to users who already visited or interacted with your brand.',
        difficulty: 'fundamental',
      },
      {
        id: 'mb-7',
        question: 'A campaign spends $2,000 and generates $8,000 in revenue. What is the ROAS?',
        options: ['0.25x', '6x', '4x', '40%'],
        correctIndex: 2,
        explanation: 'ROAS equals revenue divided by spend: $8,000 / $2,000 = 4x.',
        difficulty: 'intermediate',
      },
      {
        id: 'mb-8',
        question:
          'A campaign spends $1,500 and produces 30 conversions. What is the cost per acquisition (CPA)?',
        options: ['$45', '$50', '$20', '$500'],
        correctIndex: 1,
        explanation: 'CPA equals spend divided by conversions: $1,500 / 30 = $50.',
        difficulty: 'intermediate',
      },
      {
        id: 'mb-9',
        question:
          'An ad drives 500 clicks that result in 25 purchases. What is the conversion rate?',
        options: ['5%', '20%', '2.5%', '0.5%'],
        correctIndex: 0,
        explanation: 'Conversion rate equals conversions divided by clicks: 25 / 500 = 5%.',
        difficulty: 'intermediate',
      },
      {
        id: 'mb-10',
        question:
          'In Google Ads, which keyword match type reaches the widest range of searches, including synonyms and related queries?',
        options: ['Exact match', 'Phrase match', 'Negative match', 'Broad match'],
        correctIndex: 3,
        explanation:
          'Broad match casts the widest net, matching synonyms and related searches beyond the exact terms.',
        difficulty: 'intermediate',
      },
      {
        id: 'mb-11',
        question: 'How is a Meta lookalike audience created?',
        options: [
          'Targeting users who recently visited your website',
          'Excluding existing customers from ad delivery',
          'Finding users who resemble a source audience',
          'Grouping users by a shared interest category',
        ],
        correctIndex: 2,
        explanation:
          'A lookalike audience finds new users who resemble a chosen seed or source audience.',
        difficulty: 'intermediate',
      },
      {
        id: 'mb-12',
        question: "What is the main purpose of Meta's Conversions API (CAPI)?",
        options: [
          'Replace the need for any website tracking',
          'Send conversion events to Meta server-side',
          'Build lookalike audiences automatically from ad data',
          'Lower the CPM in the ad auction directly',
        ],
        correctIndex: 1,
        explanation:
          'CAPI sends conversion events to Meta from your server rather than relying only on the browser pixel.',
        difficulty: 'intermediate',
      },
      {
        id: 'mb-13',
        question:
          "Which UTM parameter identifies the referring platform, such as 'facebook' or 'google'?",
        options: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'],
        correctIndex: 0,
        explanation:
          'utm_source names the platform or site sending the traffic, like facebook or google.',
        difficulty: 'intermediate',
      },
      {
        id: 'mb-14',
        question:
          'A store makes $10,000 in revenue from 200 orders. What is the average order value (AOV)?',
        options: ['$20', '$2,000', '$500', '$50'],
        correctIndex: 3,
        explanation: 'AOV equals revenue divided by number of orders: $10,000 / 200 = $50.',
        difficulty: 'intermediate',
      },
      {
        id: 'mb-15',
        question: 'Google Ads Quality Score is primarily determined by which set of factors?',
        options: [
          'Total budget, bid amount, and campaign duration',
          'Impressions, total conversions, and cost per acquisition',
          'Expected CTR, ad relevance, and landing page experience',
          'Keyword count, ad rank, and daily spend',
        ],
        correctIndex: 2,
        explanation:
          'Quality Score is built from expected click-through rate, ad relevance, and landing page experience.',
        difficulty: 'advanced',
      },
      {
        id: 'mb-16',
        question:
          "In Meta Ads, a '7-day click, 1-day view' attribution setting credits a conversion when the user:",
        options: [
          'Clicked within 7 days or viewed within 1 day',
          'Clicked within 1 day or viewed within 7 days',
          'Clicked and viewed the ad within 7 days',
          'Viewed the ad at least 7 times in one day',
        ],
        correctIndex: 0,
        explanation:
          'The setting credits a click up to 7 days before or a view up to 1 day before the conversion.',
        difficulty: 'advanced',
      },
      {
        id: 'mb-17',
        question:
          'Under a last-click attribution model, conversion credit goes to which touchpoint?',
        options: [
          'The first touchpoint in the customer journey',
          'The final touchpoint before the conversion',
          'All touchpoints split equally across the path',
          'The touchpoint with the highest ad spend',
        ],
        correctIndex: 1,
        explanation:
          'Last-click assigns all conversion credit to the final touchpoint before the conversion.',
        difficulty: 'advanced',
      },
      {
        id: 'mb-18',
        question:
          'In the Google Ads auction, Ad Rank is calculated primarily using which combination?',
        options: [
          'Daily budget divided by the number of keywords',
          'Total historical spend on the whole account',
          'Number of competitors bidding on the keyword',
          'Bid amount multiplied by Quality Score factors',
        ],
        correctIndex: 3,
        explanation:
          'Ad Rank combines your bid with Quality Score and related factors to determine position.',
        difficulty: 'advanced',
      },
      {
        id: 'mb-19',
        question: "Google's Target ROAS smart bidding strategy adjusts bids in order to:",
        options: [
          'Maximize conversion value at a set return goal',
          'Get the most clicks within a daily budget',
          'Keep the CPC below a fixed maximum bid',
          'Show ads to the largest possible audience',
        ],
        correctIndex: 0,
        explanation:
          'Target ROAS bids to maximize conversion value while hitting the return goal you specify.',
        difficulty: 'advanced',
      },
      {
        id: 'mb-20',
        question:
          'A product sells for $100 with a 40% profit margin before ad costs. What is the breakeven ROAS?',
        options: ['4.0x', '1.4x', '2.5x', '0.4x'],
        correctIndex: 2,
        explanation: 'Breakeven ROAS equals 1 divided by the margin: 1 / 0.40 = 2.5x.',
        difficulty: 'advanced',
      },
    ],
    bands: [
      {
        id: 'novice',
        label: 'Novice',
        min: 0,
        max: 39,
        summary:
          'You are just starting out and still shaky on core paid-media metrics and platform structure, which is completely normal at this stage.',
        recommendations: [
          'Memorize the core formulas cold: CPM, CPC, CTR, CPA, ROAS, AOV, and conversion rate, and practice computing each from raw spend and results numbers.',
          'Build one Meta campaign end to end so the campaign, ad set, and ad hierarchy becomes second nature.',
          'Install the Meta pixel plus at least one standard conversion event and confirm it fires with the Meta Pixel Helper.',
          'Drill these fundamentals repeatedly in the Skill Mastery engine, using spaced-repetition reviews and AI hints to lock them into memory.',
        ],
      },
      {
        id: 'developing',
        label: 'Developing',
        min: 40,
        max: 59,
        summary:
          'You know the basic metrics and can navigate the ad platforms, but audience setup, match types, and clean tracking still trip you up.',
        recommendations: [
          'Practice the four Google Ads keyword match types and write example searches each would and would not trigger.',
          'Set up a retargeting audience, a lookalike from a source list, and an exclusion audience in Meta to see how they differ.',
          'Tag every campaign link with consistent utm_source, utm_medium, and utm_campaign values and verify them in analytics.',
          'Run timed calculation drills on ROAS, CPA, and conversion rate until the arithmetic is automatic.',
        ],
      },
      {
        id: 'proficient',
        label: 'Proficient',
        min: 60,
        max: 79,
        summary:
          'You run campaigns competently and understand tracking and optimization, and you are ready to sharpen attribution and bidding judgment.',
        recommendations: [
          'Implement Meta Conversions API alongside the pixel and deduplicate events to protect signal quality.',
          'Compare last-click, first-click, and data-driven attribution on the same account and note how credit shifts.',
          'Improve Quality Score by tightening ad relevance and landing page experience, then watch the effect on Ad Rank and CPC.',
          'Use Target ROAS bidding with a breakeven-ROAS calculation to set a floor that protects margin.',
        ],
      },
      {
        id: 'expert',
        label: 'Expert',
        min: 80,
        max: 100,
        summary:
          'You have strong command of metrics, platform mechanics, tracking, and attribution, and can lead strategy and quality-check a team.',
        recommendations: [
          'Design incrementality tests (geo holdouts or conversion lift studies) to measure true ad-driven revenue beyond platform-reported ROAS.',
          'Build a multi-touch or data-driven attribution view and reconcile it against last-click to guide budget allocation.',
          'Create a QA checklist for your VAs covering pixel/CAPI health, UTM hygiene, audience exclusions, and naming conventions.',
          'Manage budget pacing and marginal ROAS across channels so spend scales without eroding efficiency.',
        ],
      },
    ],
  },
  {
    id: 'website-conversion',
    title: 'Website Conversion (CRO) Test',
    shortTitle: 'Website Conversion',
    description:
      'Conversion math, A/B testing statistics, UX, form optimization, and analytics tracking.',
    iconPath:
      'M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5',
    availableQuestionCounts: [5, 10, 20],
    questions: [
      {
        id: 'wc-1',
        question:
          'A landing page received 4,000 visitors last month and generated 120 sign-ups. What is its conversion rate?',
        options: ['0.3%', '3.3%', '3%', '30%'],
        correctIndex: 2,
        explanation: 'Conversion rate is conversions divided by visitors: 120 / 4,000 = 3%.',
        difficulty: 'fundamental',
      },
      {
        id: 'wc-2',
        question: 'In its simplest form, what does an A/B test measure?',
        options: [
          'Which of two versions performs better by splitting live traffic',
          'How many total visitors a single page receives monthly',
          'Whether a page loads faster on mobile than desktop',
          'How far down the page most visitors scroll before leaving',
        ],
        correctIndex: 0,
        explanation:
          'An A/B test splits live traffic between two variants to see which drives more conversions.',
        difficulty: 'fundamental',
      },
      {
        id: 'wc-3',
        question: 'Why do CRO practitioners usually change only one element per A/B test?',
        options: [
          'So the page loads faster while the test is running',
          'So more visitors see the new version of the page',
          'So the test finishes with a much smaller sample size',
          'So any difference in results traces back to that element',
        ],
        correctIndex: 3,
        explanation:
          'Isolating a single variable lets you attribute any measured difference to that specific change.',
        difficulty: 'fundamental',
      },
      {
        id: 'wc-4',
        question: 'Which change is most likely to improve the clarity of a call-to-action button?',
        options: [
          'Using the generic label "Submit" on every button',
          'Using action-oriented text like "Start my free trial"',
          'Matching the button color exactly to the background',
          'Placing the button only in the page footer',
        ],
        correctIndex: 1,
        explanation:
          'Specific, action-oriented button copy tells users exactly what happens next, improving click-through.',
        difficulty: 'fundamental',
      },
      {
        id: 'wc-5',
        question:
          'Which of the following is a trust signal that typically increases checkout conversion?',
        options: [
          'Adding more required fields to the checkout form',
          'Hiding the total price until the final step',
          'Displaying security seals and payment badges',
          'Removing customer reviews from the product pages',
        ],
        correctIndex: 2,
        explanation:
          'Recognized security and payment badges reassure users their information is safe, reducing checkout abandonment.',
        difficulty: 'fundamental',
      },
      {
        id: 'wc-6',
        question:
          'Which form change most directly reduces friction and tends to increase completion rates?',
        options: [
          "Removing optional fields that aren't strictly needed",
          'Requiring users to confirm their email address twice',
          'Adding a CAPTCHA challenge to every form field',
          'Splitting the full name into five separate inputs',
        ],
        correctIndex: 0,
        explanation:
          'Fewer fields lower the effort required, which typically raises form completion rates.',
        difficulty: 'fundamental',
      },
      {
        id: 'wc-7',
        question: 'In A/B testing, a result at 95% statistical significance most closely means:',
        options: [
          'The new variant will convert 95% of all future visitors',
          '95% of visitors preferred the winning variant shown',
          'The test reached 95% of its required sample size',
          'About a 5% chance the difference is random noise',
        ],
        correctIndex: 3,
        explanation:
          '95% significance means roughly a 5% probability the observed difference arose from random variation.',
        difficulty: 'intermediate',
      },
      {
        id: 'wc-8',
        question: 'Why is it a mistake to stop an A/B test the moment it first shows significance?',
        options: [
          'Traffic to both variants slows down once significance is reached',
          'Stopping a test early corrupts the analytics tracking setup',
          'Repeatedly peeking then stopping early inflates false positives',
          'The losing variant keeps drawing conversions after the test ends',
        ],
        correctIndex: 2,
        explanation:
          'Repeatedly checking and stopping at the first significant reading inflates the false-positive rate, since early results are volatile.',
        difficulty: 'intermediate',
      },
      {
        id: 'wc-9',
        question:
          'You want analytics to record when users click a "Download brochure" link. What should you configure?',
        options: [
          'A new browser cookie set for each visitor',
          'An event that fires on the link click',
          'A separate landing page for the brochure',
          'A heatmap covering the entire page',
        ],
        correctIndex: 1,
        explanation:
          'A click-triggered event captures the specific interaction so it can be counted and turned into a goal.',
        difficulty: 'intermediate',
      },
      {
        id: 'wc-10',
        question: 'Largest Contentful Paint (LCP) measures which aspect of a page?',
        options: [
          'How long the main content takes to become visible',
          'How much the layout shifts during page loading',
          'How quickly the page responds to the first click',
          'How many resources the page requests in total',
        ],
        correctIndex: 0,
        explanation:
          'LCP measures the time until the largest visible content element renders, a key loading-speed metric.',
        difficulty: 'intermediate',
      },
      {
        id: 'wc-11',
        question:
          'Variant A converts 50 of 1,000 visitors; Variant B converts 90 of 1,500 visitors. Which statement is correct?',
        options: [
          'Both variants convert at the same 6% rate',
          'Variant A has the higher rate at 5% vs 4.5%',
          'Variant A converts at 6% and Variant B at 5%',
          'Variant B has the higher rate at 6% vs 5%',
        ],
        correctIndex: 3,
        explanation: 'A converts at 50/1,000 = 5% and B at 90/1,500 = 6%, so B is higher.',
        difficulty: 'intermediate',
      },
      {
        id: 'wc-12',
        question:
          "A page's conversion rate rose from 4% to 5%. What is the relative improvement (lift)?",
        options: ['1%', '20%', '25%', '100%'],
        correctIndex: 2,
        explanation:
          'Relative lift is the change divided by the original rate: (5% − 4%) / 4% = 25%.',
        difficulty: 'intermediate',
      },
      {
        id: 'wc-13',
        question:
          'Why should conversion results often be analyzed by segment (e.g., mobile vs desktop) rather than only in aggregate?',
        options: [
          'Segmented samples hit statistical significance faster than the full sample',
          'A variant can win overall yet lose in one segment',
          'Reporting an aggregate rate breaks the math behind significance testing',
          'Each device segment naturally converts at the same underlying rate',
        ],
        correctIndex: 1,
        explanation:
          'Aggregate results can mask a variant that helps one segment while hurting another, so segmenting surfaces hidden losers.',
        difficulty: 'intermediate',
      },
      {
        id: 'wc-14',
        question: 'What distinguishes a multivariate test from a standard A/B test?',
        options: [
          'It tests combinations of multiple element variations at once',
          'It sends all of the traffic to a single new variation',
          'It runs for a fixed 24-hour window by design',
          'It measures page load speed instead of conversions',
        ],
        correctIndex: 0,
        explanation:
          'A multivariate test varies several elements simultaneously to evaluate combinations and their interactions.',
        difficulty: 'advanced',
      },
      {
        id: 'wc-15',
        question:
          'If you want a test to reliably detect a smaller minimum detectable effect (MDE), what happens to the required sample size?',
        options: [
          'It decreases substantially',
          'It increases substantially',
          'It stays exactly the same',
          'It becomes irrelevant to the test',
        ],
        correctIndex: 1,
        explanation:
          'Detecting smaller effects requires more statistical power, which means a larger sample size.',
        difficulty: 'advanced',
      },
      {
        id: 'wc-16',
        question: 'In A/B testing, statistical power refers to:',
        options: [
          'The probability that the null hypothesis is actually true',
          'The total number of visitors entered into the test',
          'The chance of detecting a true effect when present',
          'The percentage lift the winning variant produced',
        ],
        correctIndex: 2,
        explanation:
          'Power is the probability a test correctly detects a real effect, that is, 1 minus the false-negative rate.',
        difficulty: 'advanced',
      },
      {
        id: 'wc-17',
        question:
          "A variant shows a huge lift in its first two days, then settles near the control's rate. This pattern is best explained by:",
        options: [
          'A novelty effect that fades as returning users adapt',
          'The control variant being secretly disabled partway through',
          'The conversion goal being tracked incorrectly from the start',
          'The sample size already being far too large',
        ],
        correctIndex: 0,
        explanation:
          'Early spikes that fade are characteristic of a novelty effect, where returning users react to a change that stops mattering.',
        difficulty: 'advanced',
      },
      {
        id: 'wc-18',
        question:
          'Per Core Web Vitals thresholds, a page is rated "good" for Cumulative Layout Shift (CLS) when its score is at or below:',
        options: ['1.0', '2.5', '0.5', '0.1'],
        correctIndex: 3,
        explanation: 'A CLS score of 0.1 or less is the "good" threshold in Core Web Vitals.',
        difficulty: 'advanced',
      },
      {
        id: 'wc-19',
        question:
          'A variant gets 2,000 visitors, converts at 4%, with an average order value of $50. What is its revenue per visitor?',
        options: ['$4.00', '$2.00', '$50.00', '$0.40'],
        correctIndex: 1,
        explanation:
          'Revenue per visitor equals conversion rate times average order value: 0.04 × $50 = $2.00.',
        difficulty: 'advanced',
      },
      {
        id: 'wc-20',
        question:
          'You test 20 variants against one control at 95% significance. Even if none truly differ, why expect about one "significant" winner?',
        options: [
          'Running many comparisons raises the false-positive rate',
          '95% significance guarantees exactly one true winner',
          'Larger numbers of variants reduce random variation',
          'Significance thresholds do not apply to multivariate tests',
        ],
        correctIndex: 0,
        explanation:
          'With a 5% false-positive rate per comparison, running 20 tests makes roughly one spurious "significant" result likely.',
        difficulty: 'advanced',
      },
    ],
    bands: [
      {
        id: 'novice',
        label: 'Novice',
        min: 0,
        max: 39,
        summary:
          'You grasp that conversion means turning visitors into actions, but testing methodology, analytics tracking, and the underlying math are still shaky.',
        recommendations: [
          'Memorize the core formula (conversion rate = conversions ÷ visitors) and practice it on a real GA4 report',
          'Learn the anatomy of a high-converting landing page: one clear headline, a single primary CTA, and visible trust badges',
          'Set up one goal/event in GA4 and watch it record an actual conversion end-to-end',
          "Drill CRO fundamentals in the Skill Mastery engine's spaced-repetition deck, using AI hints when you get stuck",
        ],
      },
      {
        id: 'developing',
        label: 'Developing',
        min: 40,
        max: 59,
        summary:
          'You can run a basic A/B test and apply landing-page best practices, but test validity and statistics are where results still slip through your fingers.',
        recommendations: [
          "Use a sample-size calculator (e.g., Evan Miller's) before every test and commit to a fixed end date to stop peeking",
          'Practice interpreting statistical significance and confidence intervals until "95%" stops feeling like a magic number',
          'Instrument micro-conversions (add-to-cart, form-start) as tracked events, not just final purchases',
          'Study Core Web Vitals thresholds (LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms) and how they move conversion, and keep reinforcing weak spots with spaced-repetition drills in the Skill Mastery engine',
        ],
      },
      {
        id: 'proficient',
        label: 'Proficient',
        min: 60,
        max: 79,
        summary:
          'You design valid experiments, read the statistics correctly, and optimize forms and page speed with intent, ready to run a real testing program.',
        recommendations: [
          'Segment every test result by device and traffic source to catch a winner that hides a losing segment',
          'Prioritize a hypothesis-driven test backlog with a framework like PIE or ICE',
          'Guard against peeking, novelty effects, and multiple-comparison false positives in your test QA',
          'Judge experiments by revenue per visitor and average order value, not conversion rate alone',
        ],
      },
      {
        id: 'expert',
        label: 'Expert',
        min: 80,
        max: 100,
        summary:
          'You command experiment design, statistics, and analytics deeply enough to build and defend an organization-wide CRO program and coach others.',
        recommendations: [
          'Adopt a sequential-testing or Bayesian workflow to shorten time-to-decision without inflating false positives',
          'Use holdout groups and meta-analysis to confirm lifts persist well beyond the novelty window',
          'Codify significance rules and test-QA checklists so VAs and teammates run experiments consistently',
          'Tie CRO experiments to downstream LTV and retention, not just first-order conversion',
        ],
      },
    ],
  },
  {
    id: 'retention-crm',
    title: 'Retention, CRM & Email Test',
    shortTitle: 'Retention & CRM',
    description:
      'Email metrics and deliverability, segmentation, lifecycle automation, LTV and churn.',
    iconPath:
      'M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z',
    availableQuestionCounts: [5, 10, 20],
    questions: [
      {
        id: 'rc-1',
        question: 'How is email open rate calculated?',
        options: [
          'Unique opens divided by emails delivered',
          'Unique opens divided by emails sent',
          'Unique opens divided by total clicks',
          'Unique opens divided by total subscribers',
        ],
        correctIndex: 0,
        explanation:
          'Open rate measures unique opens against successfully delivered emails, not raw sends or list size.',
        difficulty: 'fundamental',
      },
      {
        id: 'rc-2',
        question: 'How is email click-through rate (CTR) calculated?',
        options: [
          'Unique clicks divided by unique opens',
          'Unique clicks divided by conversions counted',
          'Unique clicks divided by emails delivered',
          'Unique clicks divided by emails bounced',
        ],
        correctIndex: 2,
        explanation:
          'CTR divides unique clicks by delivered emails, showing what share of the delivered audience clicked.',
        difficulty: 'fundamental',
      },
      {
        id: 'rc-3',
        question: 'How is click-to-open rate (CTOR) calculated?',
        options: [
          'Unique opens divided by unique clicks',
          'Unique clicks divided by unique opens',
          'Unique clicks divided by emails delivered',
          'Unique clicks divided by emails sent',
        ],
        correctIndex: 1,
        explanation:
          'CTOR divides unique clicks by unique opens, isolating how compelling the content was to those who opened.',
        difficulty: 'fundamental',
      },
      {
        id: 'rc-4',
        question: 'Which best describes a hard bounce?',
        options: [
          'A temporary failure from a full mailbox',
          'A delivered message routed to spam folder',
          'A delivered message opened but never clicked',
          'A permanent failure from an invalid address',
        ],
        correctIndex: 3,
        explanation:
          'A hard bounce is a permanent delivery failure, typically from an invalid or nonexistent address.',
        difficulty: 'fundamental',
      },
      {
        id: 'rc-5',
        question:
          'A business starts the month with 1,000 customers and loses 50 during the month. What is the monthly churn rate?',
        options: ['0.5%', '50%', '5%', '95%'],
        correctIndex: 2,
        explanation: 'Churn rate is customers lost divided by starting customers: 50 / 1,000 = 5%.',
        difficulty: 'fundamental',
      },
      {
        id: 'rc-6',
        question: 'What does email list hygiene primarily involve?',
        options: [
          'Removing invalid and inactive email addresses',
          'Adding more subscribers through paid ads',
          'Sending more frequently to boost opens',
          'Writing shorter subject lines for mobile',
        ],
        correctIndex: 0,
        explanation:
          'List hygiene is the ongoing removal of invalid, bounced, and unengaged addresses to protect deliverability.',
        difficulty: 'fundamental',
      },
      {
        id: 'rc-7',
        question: 'What is the purpose of an SPF record?',
        options: [
          'Adds a digital signature to each message header',
          'Specifies which servers may send for a domain',
          'Tells receivers how to handle authentication failures',
          'Encrypts the message body during transit end-to-end',
        ],
        correctIndex: 1,
        explanation:
          'SPF publishes the mail servers authorized to send on behalf of a domain, so receivers can verify the source.',
        difficulty: 'intermediate',
      },
      {
        id: 'rc-8',
        question: 'What does DKIM provide for outgoing email?',
        options: [
          'Adds a digital signature verifying integrity',
          'Lists IP addresses authorized to send mail',
          'Publishes a policy for handling failed checks',
          'Routes bounced messages back to the sender',
        ],
        correctIndex: 0,
        explanation:
          'DKIM attaches a cryptographic signature so receivers can confirm the message was not altered and came from the domain.',
        difficulty: 'intermediate',
      },
      {
        id: 'rc-9',
        question: 'What is the role of a DMARC record?',
        options: [
          'Encrypts message content between mail servers',
          'Authorizes specific IP ranges to send mail',
          'Signs the message body with a private key',
          'Publishes a policy for handling SPF/DKIM failures',
        ],
        correctIndex: 3,
        explanation:
          'DMARC tells receiving servers what to do when SPF or DKIM authentication fails and enables reporting.',
        difficulty: 'intermediate',
      },
      {
        id: 'rc-10',
        question: 'In RFM segmentation, what do the letters stand for?',
        options: [
          'Reach, Frequency, Margin',
          'Retention, Frequency, Monetary',
          'Recency, Frequency, Monetary',
          'Recency, Fulfillment, Margin',
        ],
        correctIndex: 2,
        explanation:
          'RFM scores customers on Recency, Frequency, and Monetary value of their purchases.',
        difficulty: 'intermediate',
      },
      {
        id: 'rc-11',
        question:
          'Which of these is a triggered (behavior-based) email rather than a time-based send?',
        options: [
          'A cart-abandonment email sent after inaction',
          'A newsletter scheduled every Tuesday morning',
          'A monthly digest sent on the first',
          'A quarterly promotion sent each season',
        ],
        correctIndex: 0,
        explanation:
          'A cart-abandonment email fires in response to a user action, making it a triggered rather than scheduled send.',
        difficulty: 'intermediate',
      },
      {
        id: 'rc-12',
        question: 'What does cohort analysis do?',
        options: [
          'Ranks users into lifetime spend tiers',
          'Splits one audience into random test groups',
          'Scores leads by demographic fit criteria',
          'Groups users by their shared join period',
        ],
        correctIndex: 3,
        explanation:
          'Cohort analysis groups users by a shared start period and tracks how their behavior evolves over time.',
        difficulty: 'intermediate',
      },
      {
        id: 'rc-13',
        question:
          'Average order value is $50, customers purchase 4 times per year, and average lifespan is 3 years. What is the customer lifetime value (LTV)?',
        options: ['$200', '$600', '$150', '$1,200'],
        correctIndex: 1,
        explanation: 'LTV = AOV × purchase frequency × lifespan = $50 × 4 × 3 = $600.',
        difficulty: 'intermediate',
      },
      {
        id: 'rc-14',
        question:
          "If a customer's LTV is $600 and the cost to acquire them (CAC) is $150, what is the LTV:CAC ratio?",
        options: ['1:4', '3:1', '4:1', '2:1'],
        correctIndex: 2,
        explanation: 'LTV:CAC is 600 divided by 150, which equals a 4:1 ratio.',
        difficulty: 'intermediate',
      },
      {
        id: 'rc-15',
        question:
          'A cohort starts with 500 customers, ends with 550, and acquired 100 new customers during the period. What is the retention rate?',
        options: ['110%', '90%', '82%', '50%'],
        correctIndex: 1,
        explanation: 'Retention rate = (end − new) / start = (550 − 100) / 500 = 90%.',
        difficulty: 'advanced',
      },
      {
        id: 'rc-16',
        question:
          'An email shows a high open rate but a low click-to-open rate. What does this most likely indicate?',
        options: [
          'The subject line was weak and unappealing',
          'Emails largely failed to reach inboxes',
          'Content or offer failed to engage openers',
          'The sending domain lacks SPF records',
        ],
        correctIndex: 2,
        explanation:
          'Strong opens with weak CTOR means people opened but the content or offer did not motivate clicks.',
        difficulty: 'advanced',
      },
      {
        id: 'rc-17',
        question:
          'Which DMARC policy instructs receivers to block messages that fail authentication?',
        options: ['p=quarantine', 'p=none', 'p=fail', 'p=reject'],
        correctIndex: 3,
        explanation:
          'p=reject tells receivers to block failing mail outright, while quarantine only diverts it and none just monitors.',
        difficulty: 'advanced',
      },
      {
        id: 'rc-18',
        question: 'If monthly customer churn is 4%, what is the average customer lifespan?',
        options: ['4 months', '40 months', '25 months', '96 months'],
        correctIndex: 2,
        explanation: 'Average lifespan equals 1 divided by the churn rate: 1 / 0.04 = 25 months.',
        difficulty: 'advanced',
      },
      {
        id: 'rc-19',
        question: "What does a 'sunset policy' refer to in email marketing?",
        options: [
          "Scheduling sends near the recipient's local evening",
          'Suppressing chronically unengaged subscribers from sends',
          'Gradually lowering send frequency near holidays',
          'Retiring old templates in favor of new ones',
        ],
        correctIndex: 1,
        explanation:
          'A sunset policy removes or suppresses persistently unengaged subscribers to protect engagement and sender reputation.',
        difficulty: 'advanced',
      },
      {
        id: 'rc-20',
        question: 'What is the primary purpose of a deduplication process in a CRM?',
        options: [
          'Merging duplicate records into one profile',
          'Encrypting stored customer records at rest',
          'Archiving inactive contacts to cold storage',
          'Enriching records with third-party data',
        ],
        correctIndex: 0,
        explanation:
          'Deduplication consolidates multiple records for the same person into a single accurate profile.',
        difficulty: 'advanced',
      },
    ],
    bands: [
      {
        id: 'novice',
        label: 'Novice',
        min: 0,
        max: 39,
        summary:
          "You're just starting out, and core metrics and deliverability terms like open rate, SPF, and churn aren't yet second nature.",
        recommendations: [
          'Memorize the core formulas: open rate, CTR, click-to-open, bounce rate, and churn rate.',
          'Learn what SPF, DKIM, and DMARC each do to authenticate outgoing email.',
          'Drill these fundamentals in the Skill Mastery engine using spaced-repetition and AI hints.',
          'Build a simple welcome automation in Mailchimp or Klaviyo to see triggered sends in action.',
        ],
      },
      {
        id: 'developing',
        label: 'Developing',
        min: 40,
        max: 59,
        summary:
          'You know the basic metrics and terms but still stumble on calculations and lifecycle concepts under real conditions.',
        recommendations: [
          'Practice computing LTV, LTV:CAC ratio, retention rate, and average customer lifespan by hand.',
          'Build an RFM segmentation on a sample list to separate high-value from lapsing customers.',
          'Map a full cart-abandonment flow to distinguish triggered from time-based automations.',
          'Use progress tracking to find weak spots and revisit them with spaced repetition.',
        ],
      },
      {
        id: 'proficient',
        label: 'Proficient',
        min: 60,
        max: 79,
        summary:
          'You handle metrics, segmentation, and authentication confidently and can diagnose most deliverability and retention issues.',
        recommendations: [
          'Run cohort analyses to compare retention curves across acquisition months.',
          'Implement a sunset policy and suppression rules to protect sender reputation.',
          'Move DMARC from p=none toward p=quarantine or p=reject after reviewing aggregate reports.',
          'Build dashboards tracking deliverability, complaint rate, and revenue per email.',
        ],
      },
      {
        id: 'expert',
        label: 'Expert',
        min: 80,
        max: 100,
        summary:
          'You operate strategically, optimizing lifecycle programs, deliverability, and LTV with rigorous, holdout-based measurement.',
        recommendations: [
          'Measure incremental LTV lift from lifecycle campaigns using holdout control groups.',
          'Diagnose inbox placement with seed lists, feedback loops, and engagement segmentation.',
          'Vet VAs and mentor teammates with targeted assessments on CRM hygiene and metrics.',
          "Track evolving standards like BIMI and Apple Mail Privacy Protection's impact on open-rate reliability.",
        ],
      },
    ],
  },
];

export const quizTopicMap: Record<string, QuizTopic> = Object.fromEntries(
  quizTopics.map((t) => [t.id, t]),
);
