/**
 * FAQ — real Q&A from the live site (homepage versions, which have the genuine
 * distinct answers). The live "typical project timeline" item only had a
 * duplicated placeholder answer, so it's omitted rather than reproduced as
 * cruft. (See docs/PLAN.md NEEDS INPUT: supply a real timeline answer to add it back.)
 */
export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: 'How much will my project cost?',
    answer:
      "Our pricing depends on the scope, complexity, and timeline of your project. After a quick discovery call or brief, we'll provide a custom quote based on your specific needs. We offer flexible pricing models for short-term and long-term collaborations.",
  },
  {
    question: 'How are we different from other agencies?',
    answer:
      "We don't just deliver reports, we deliver actionable insights. We combine technical expertise in data, social media, and eCommerce analytics with a deep understanding of marketing performance. We also pride ourselves on clear communication, fast turnaround, and solutions tailored to your business goals.",
  },
  {
    question: 'Can I see examples of your past work?',
    answer:
      "Absolutely! We have a portfolio of dashboards, reports, and case studies available upon request. Just reach out, and we'll be happy to share examples that match your industry or project type.",
  },
  {
    question: 'How do I start a project with your agency?',
    answer:
      "Getting started is easy. Just send us a message with a brief description of your project or needs. We'll schedule a discovery call to align on goals, timelines, and deliverables, then we get to work.",
  },
];
