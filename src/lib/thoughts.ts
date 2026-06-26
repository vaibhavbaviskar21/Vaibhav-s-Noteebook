/**
 * A curated list of high-quality, inspiring thoughts and insights related to technology,
 * software engineering, architecture, and developer philosophy.
 * Automatically changes daily.
 */

export interface DailyThought {
  quote: string;
  author: string;
  role: string;
  context: string;
}

export const TECH_THOUGHTS: DailyThought[] = [
  {
    quote: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman",
    role: "Writer & Physician",
    context: "In a world of bloated software and complex frameworks, true engineering elegance is achieved when nothing more can be safely stripped away."
  },
  {
    quote: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson",
    role: "Co-author of SICP",
    context: "Code spends 90% of its lifetime being read, refactored, and maintained by humans. Cleanliness and clarity are the ultimate service to your team."
  },
  {
    quote: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    role: "Computer Scientist",
    context: "Coding without design is like constructing a house without blueprints. A clear understanding of the data structure and control flow saves hours of debugging."
  },
  {
    quote: "Complexity is the enemy of reliability.",
    author: "Tony Hoare",
    role: "Inventor of Quicksort",
    context: "The more elaborate the machinery, the more failure points exist. Elegant systems remain predictable, testable, and robust through clean interfaces."
  },
  {
    quote: "An elegant system is not one where nothing more can be added, but one where nothing more can be removed.",
    author: "Antoine de Saint-Exupéry",
    role: "Writer & Aviator",
    context: "Applying minimalism to product design and codebase architecture results in lightweight, highly maintainable systems."
  },
  {
    quote: "The best error message is the one that never shows up.",
    author: "Thomas Thompson",
    role: "Systems Architect",
    context: "Defensive programming, strong types, and graceful validation handle edge cases before they escalate to visible user-facing failures."
  },
  {
    quote: "Control-flow is easy, but data-flow is where the truth lies.",
    author: "Rich Hickey",
    role: "Creator of Clojure",
    context: "When designing features, map out how data moves through state transitions first. Most bugs are state inconsistencies, not logical fallacies."
  },
  {
    quote: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
    role: "Creator of Extreme Programming",
    context: "Don't fall into the trap of premature optimization. Focus on a functional prototype, refactor it for correctness and design, then optimize bottlenecks."
  },
  {
    quote: "The question of whether Machines Can Think is about as relevant as the question of whether Submarines Can Swim.",
    author: "Edsger W. Dijkstra",
    role: "Turing Award Laureate",
    context: "Focus on the practical, deterministic outcomes of computation, building software that reliably amplifies human potential."
  },
  {
    quote: "The most disastrous thing that you can do is learn your first programming language so well that you think it's the only one.",
    author: "Alan Perlis",
    role: "Computer Scientist",
    context: "Broaden your paradigms. Exploring functional, declarative, and low-level systems shapes you into a more resourceful problem solver."
  },
  {
    quote: "There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies, and the other way is to make it so complicated that there are no obvious deficiencies.",
    author: "C.A.R. Hoare",
    role: "Turing Award Winner",
    context: "Always prefer the former. Simplicity is difficult to design but beautiful to build and operate."
  },
  {
    quote: "The computer was born to solve problems that did not exist before.",
    author: "Bill Gates",
    role: "Co-founder of Microsoft",
    context: "Every line of code you write is a form of digital leverage, translating logic into automated leverage to solve human problems."
  }
];

export function getDailyTechThought(): DailyThought {
  const date = new Date();
  // Generate a stable seed based on the day of the year (1 - 366)
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = dayOfYear % TECH_THOUGHTS.length;
  return TECH_THOUGHTS[index];
}
