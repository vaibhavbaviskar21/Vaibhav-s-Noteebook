/**
 * Curated motivational quotes from famous leaders, engineers, entrepreneurs,
 * and thinkers. Rotates daily based on day-of-year seed.
 */

export interface DailyThought {
  quote: string;
  author: string;
  role: string;
  context: string;
}

export const TECH_THOUGHTS: DailyThought[] = [
  {
    quote: "The people who are crazy enough to think they can change the world are the ones who do.",
    author: "Steve Jobs",
    role: "Co-founder, Apple",
    context: "Every great product, every breakthrough idea, every open-source project started with someone bold enough to believe it was possible. You don't need permission to build something that matters."
  },
  {
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    role: "Chinese Philosopher",
    context: "Consistency beats intensity. One commit a day, one concept mastered per week, one project shipped per month — the compound effect of showing up every day is what separates those who make it from those who almost did."
  },
  {
    quote: "Whether you think you can, or you think you can't — you're right.",
    author: "Henry Ford",
    role: "Founder, Ford Motor Company",
    context: "Mindset is the real bottleneck. The engineer who believes they can debug a complex system will. The student who believes placement is achievable will prepare accordingly. Your belief defines your ceiling."
  },
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    role: "Author & Humorist",
    context: "Analysis paralysis is real. The project you've been planning for three months needs one thing: a first commit. A bad first draft is infinitely better than a perfect idea that never ships."
  },
  {
    quote: "I have not failed. I've just found 10,000 ways that won't work.",
    author: "Thomas Edison",
    role: "Inventor, Entrepreneur",
    context: "Every bug you fix teaches you something. Every rejected PR, every failed interview, every broken deployment is data — not defeat. Persistence with reflection is how expertise is built."
  },
  {
    quote: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
    role: "Theoretical Physicist, Nobel Laureate",
    context: "The hardest problems in your codebase, your career, and your life are the ones worth solving. Difficulty is a filter — most people stop there. The ones who push through find the real rewards."
  },
  {
    quote: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    role: "Co-founder, Apple",
    context: "Build what you believe in. Write about what excites you. Work on problems that keep you up at night. A career built on your own curiosity and conviction will always outrun one built on imitation."
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    role: "Prime Minister of the United Kingdom",
    context: "One good placement doesn't end the journey. One bad interview doesn't end the career. What matters is whether you get up, adjust, and try again — with more knowledge than you had before."
  },
  {
    quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    role: "Ancient Wisdom",
    context: "You can't go back and start learning data structures, building projects, or writing online six months ago. But you can start today. The gap between where you are and where you want to be closes one day at a time."
  },
  {
    quote: "Strive not to be a success, but rather to be of value.",
    author: "Albert Einstein",
    role: "Theoretical Physicist, Nobel Laureate",
    context: "The engineers and builders who endure are not those who chased metrics — they are those who genuinely solved problems for real people. Value creation is the only sustainable foundation for a technical career."
  },
  {
    quote: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
    role: "Ice Hockey Legend",
    context: "Apply for the role that intimidates you. Open-source the project you think isn't good enough. Publish the blog post you've been drafting for weeks. The cost of not trying is always higher than the cost of failing."
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    role: "Co-founder, Apple",
    context: "Passion is not a luxury in engineering — it's a competitive advantage. The developer who genuinely loves what they're building will outlearn, outship, and outlast the one who is just going through the motions."
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    role: "26th President of the United States",
    context: "Confidence is not arrogance — it is the reasonable belief that you can figure things out. That belief is the prerequisite for every hard problem you will ever solve."
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    role: "Author & Humorist",
    context: "Deep work doesn't feel like progress in the moment. Grinding through a difficult algorithm, rewriting a messy module, or studying for an exam rarely feels rewarding until it's done. Keep going anyway."
  },
  {
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    role: "Anti-apartheid Leader, Former President of South Africa",
    context: "Every system you've built that works today looked impossibly complex before you started. Every skill you have now once felt out of reach. 'Impossible' is just a snapshot of where you are — not where you'll be."
  },
  {
    quote: "Hard work beats talent when talent doesn't work hard.",
    author: "Tim Notke",
    role: "Basketball Coach",
    context: "Placement, open-source recognition, and career breakthroughs rarely go to the most naturally gifted — they go to the people who put in consistent, deliberate practice over years. Outwork the talented. Outsmart the hardworking."
  },
  {
    quote: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
    role: "Author & Scholar",
    context: "Whether you're starting your first side project, switching domains, or going from frontend to security — there is no expiry date on ambition. The only thing standing between you and a new skill is the decision to learn it."
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    role: "Former First Lady of the United States",
    context: "Every major technology company was once someone's dream dismissed as impractical. Every influential open-source project was once someone's side project. Dream with conviction, then engineer your way toward it."
  },
  {
    quote: "Excellence is not a destination; it is a continuous journey that never ends.",
    author: "Brian Tracy",
    role: "Author & Motivational Speaker",
    context: "There is no point at which you become 'good enough' and stop growing. The best engineers, writers, and builders in the world are still learning, still shipping, still iterating. Excellence is a habit, not a trophy."
  },
  {
    quote: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
    role: "26th President of the United States",
    context: "You don't need a perfect setup, an elite college, or a senior mentor to start building. A laptop, an internet connection, and a curious mind are enough to ship something real. Start with what you have."
  },
  {
    quote: "The biggest risk is not taking any risk.",
    author: "Mark Zuckerberg",
    role: "Co-founder & CEO, Meta",
    context: "In a world where technology moves fast, playing it safe is the riskiest strategy of all. The safe choice — the familiar framework, the familiar role, the familiar city — often leads to the least interesting outcomes."
  },
  {
    quote: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown",
    role: "Timeless Wisdom",
    context: "Motivation from outside is temporary. The discipline to open your IDE at midnight, to study when you're tired, to keep building when no one is watching — that comes from inside. Cultivate it like a skill."
  },
  {
    quote: "What you do today can improve all of your tomorrows.",
    author: "Ralph Marston",
    role: "Author & Publisher",
    context: "Every pull request you write, every problem you solve, every note you publish compounds. The effort you put in today — even when it feels insignificant — is quietly building the foundation of who you'll be tomorrow."
  },
  {
    quote: "Act as if what you do makes a difference. It does.",
    author: "William James",
    role: "Philosopher & Psychologist, Harvard",
    context: "A well-written blog post teaches someone. A clean open-source contribution saves hours for a stranger. Building in public creates the accountability to keep going. What you ship matters — more than you know."
  },
  {
    quote: "We may encounter many defeats but we must not be defeated.",
    author: "Maya Angelou",
    role: "Poet & Civil Rights Activist",
    context: "A rejected pull request, a failed technical round, a project that never shipped — these are experiences, not sentences. The defeat is not in the outcome. The defeat is in choosing to stop."
  },
  {
    quote: "Keep your eyes on the stars, and your feet on the ground.",
    author: "Theodore Roosevelt",
    role: "26th President of the United States",
    context: "Dream about building something impactful — but then sit down and write the code. Ambition without execution is just daydreaming. The combination of high goals and grounded daily effort is where careers are made."
  },
  {
    quote: "With the new day comes new strength and new thoughts.",
    author: "Eleanor Roosevelt",
    role: "Former First Lady of the United States",
    context: "The bug that defeated you yesterday is solvable today. The concept that confused you last week is clearer now. Every day you show up, you are a slightly better engineer than you were the day before."
  },
  {
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    role: "Author & Motivational Speaker",
    context: "No one's first project is impressive. No one's first blog post goes viral. Greatness is built iteratively — through every imperfect thing you put out into the world and then made slightly better."
  },
  {
    quote: "The harder the conflict, the greater the triumph.",
    author: "Thomas Paine",
    role: "Political Activist & Philosopher",
    context: "The interview that almost broke you, the system design problem that took three weeks to understand, the deployment that failed before it worked — the harder the battle, the more the victory means."
  },
  {
    quote: "Energy and persistence conquer all things.",
    author: "Benjamin Franklin",
    role: "Founding Father, Inventor, Statesman",
    context: "Talent is common. Intelligence is common. What is rare is the relentless daily energy to keep building, keep writing, keep learning — even when the results are invisible. That persistence is your greatest asset."
  },
  {
    quote: "Either write something worth reading or do something worth writing.",
    author: "Benjamin Franklin",
    role: "Founding Father, Inventor, Statesman",
    context: "Build in public. Write what you learn. Ship what you build. The act of documenting your journey — here, in this space — makes your work worth more than the work itself."
  },
];

export function getDailyTechThought(): DailyThought {
  const date = new Date();
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = dayOfYear % TECH_THOUGHTS.length;
  return TECH_THOUGHTS[index];
}
