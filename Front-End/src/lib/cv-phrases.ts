export const GOLDEN_PHRASES: Record<string, string[]> = {
  "led": [" a team of developers to deliver...", " the design and implementation of...", " cross-functional teams in agile..."],
  "developed": [" a scalable microservices architecture using...", " and maintained high-performance web applications...", " a robust automated testing framework..."],
  "improved": [" system performance by 40% through...", " code quality by implementing...", " user engagement by 25% by..."],
  "built": [" an end-to-end data pipeline with...", " a custom CMS that reduced...", " responsive and accessible UI components..."],
  "responsible for": [" managing a budget of...", " mentoring junior developers and...", " overseeing the entire software development life cycle..."],
  "collaborated with": [" product managers to define...", " designers to create intuitive...", " stakeholders to gather requirements..."],
  "achieved": [" a 99.9% uptime for critical...", " significant cost savings by...", " the 'Employee of the Year' award for..."],
  "expert in": [" full-stack development with...", " cloud infrastructure and...", " modern JavaScript frameworks like..."],
};

export function getLocalCompletion(text: string): string | null {
  const words = text.toLowerCase().trim().split(/\s+/);
  if (words.length === 0) return null;

  const lastWord = words[words.length - 1];
  const lastTwoWords = words.slice(-2).join(" ");

  // Check last two words then last one word
  const match = GOLDEN_PHRASES[lastTwoWords] || GOLDEN_PHRASES[lastWord];
  
  if (match) {
    // Return a random completion from the list for variety
    return match[Math.floor(Math.random() * match.length)];
  }

  return null;
}
