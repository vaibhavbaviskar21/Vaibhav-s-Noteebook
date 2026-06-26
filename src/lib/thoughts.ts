/**
 * Curated daily insights — real quotes from famous figures in security,
 * engineering, and technology. Rotates daily based on day-of-year seed.
 */

export interface DailyThought {
  quote: string;
  author: string;
  role: string;
  context: string;
}

export const TECH_THOUGHTS: DailyThought[] = [
  {
    quote: "Security is always excessive until it's not enough.",
    author: "Robbie Sinclair",
    role: "Head of Security, Country Energy",
    context: "The cost of a security breach — data loss, reputation damage, legal liability — almost always dwarfs the cost of the controls that could have prevented it. Over-engineering security is rarely the mistake companies regret."
  },
  {
    quote: "The only truly secure system is one that is powered off, cast in a block of concrete and sealed in a lead-lined room with armed guards.",
    author: "Gene Spafford",
    role: "Cybersecurity Pioneer, Purdue University",
    context: "Absolute security is a myth. Every system that does useful work has an attack surface. The goal is to make exploitation harder than it's worth for the adversary — not to eliminate risk entirely."
  },
  {
    quote: "Amateurs hack systems, professionals hack people.",
    author: "Bruce Schneier",
    role: "Cryptographer & Security Technologist",
    context: "Social engineering remains the most effective attack vector in existence. Phishing, pretexting, and vishing bypass the most hardened technical controls because humans are consistently the weakest link."
  },
  {
    quote: "If you think technology can solve your security problems, then you don't understand the problems and you don't understand the technology.",
    author: "Bruce Schneier",
    role: "Cryptographer & Security Technologist",
    context: "Firewalls, IDS, and encryption are tools, not solutions. Security is a process — threat modeling, policy, training, incident response, and culture matter more than any single product purchase."
  },
  {
    quote: "Privacy is not something that I'm merely entitled to, it's an absolute prerequisite.",
    author: "Marlon Brando",
    role: "Actor & Cultural Icon",
    context: "In the digital age, privacy is foundational to freedom. Systems that collect more data than they need create liability for users and operators alike. Data minimization is not optional — it's ethical engineering."
  },
  {
    quote: "The Internet is a reflection of our society and that mirror is going to be reflecting what we see. If we do not like what we see in that mirror the problem is not to fix the mirror, we have to fix the society.",
    author: "Vint Cerf",
    role: "Co-inventor of TCP/IP, 'Father of the Internet'",
    context: "Online harms — from disinformation to abuse — are human problems that technical systems amplify. Engineers bear responsibility for the social consequences of the systems they build."
  },
  {
    quote: "Cryptography is the ultimate form of non-violent direct action.",
    author: "Julian Assange",
    role: "Publisher, WikiLeaks",
    context: "Strong encryption gives individuals power that no government or corporation can override with policy alone. Building and deploying cryptography correctly is an act of protecting human rights at scale."
  },
  {
    quote: "There are two kinds of cryptography in this world: cryptography that will stop your kid sister from reading your files, and cryptography that will stop major governments from reading your files.",
    author: "Bruce Schneier",
    role: "Cryptographer & Security Technologist",
    context: "Most consumer security is theater. Real cryptographic protection requires correct implementation, proper key management, and a threat model that accounts for the adversary's actual capabilities."
  },
  {
    quote: "The art of war teaches us to rely not on the likelihood of the enemy not coming, but on our own readiness to receive him.",
    author: "Sun Tzu",
    role: "Military Strategist, The Art of War",
    context: "Assume breach. Security posture built around prevention alone collapses the moment a novel attack appears. Detection, response, and recovery are equally critical pillars of any mature security program."
  },
  {
    quote: "Never underestimate the determination of a kid who is time-rich and cash-poor.",
    author: "Cory Doctorow",
    role: "Author & Digital Rights Activist",
    context: "Some of the most significant security breaches in history were carried out not by nation-states but by teenagers with time and curiosity. Threat models must account for motivated, low-resource adversaries."
  },
  {
    quote: "Complexity is the enemy of security.",
    author: "Bruce Schneier",
    role: "Cryptographer & Security Technologist",
    context: "Every abstraction layer, every third-party dependency, every configuration option is a potential vulnerability surface. The most secure systems are deliberately minimal. Simple is auditable; complex is not."
  },
  {
    quote: "The Internet was designed for the flow of information, not for security.",
    author: "Whitfield Diffie",
    role: "Co-inventor of Public Key Cryptography",
    context: "TCP/IP, HTTP, DNS, and SMTP were all designed in an era of trusted networks. Security was retrofitted, not built in. This architectural debt is why application-level security must compensate for insecure foundations."
  },
  {
    quote: "In the world of cyber, you can be the biggest wolf or the smallest mouse — size doesn't matter, skill does.",
    author: "James Scott",
    role: "Senior Fellow, Institute for Critical Infrastructure Technology",
    context: "A single skilled individual with the right exploit can compromise infrastructure serving millions. The asymmetry of offense vs. defense is what makes cybersecurity uniquely challenging as a field."
  },
  {
    quote: "Encryption works. Properly implemented strong crypto systems are one of the few things that you can rely on.",
    author: "Edward Snowden",
    role: "Whistleblower & Privacy Advocate",
    context: "End-to-end encryption with forward secrecy is one of the strongest protections available to individuals. The problem is rarely the math — it's the implementation, key storage, and metadata that leak."
  },
  {
    quote: "The value of a man is not in his skin, that we should touch him.",
    author: "Ralph Waldo Emerson",
    role: "Philosopher & Essayist",
    context: "Biometric data — fingerprints, facial geometry, iris scans — cannot be changed after a breach. Engineers who collect biometric data carry a lifelong responsibility to the people they authenticate."
  },
  {
    quote: "Software bugs are not random events. They are deterministic artifacts of human cognition under pressure.",
    author: "Gary McGraw",
    role: "Software Security Pioneer",
    context: "Security vulnerabilities are not bad luck — they are predictable consequences of design shortcuts, unclear requirements, and insufficient threat modeling. Building security in from the start is always cheaper than patching."
  },
  {
    quote: "You can't defend. You can't prevent. The only thing you can do is detect and respond.",
    author: "Bruce Schneier",
    role: "Cryptographer & Security Technologist",
    context: "Perimeter security is dead. In a world of cloud, BYOD, and remote work, there is no clean inside/outside boundary. Zero-trust architecture — verify everything, assume nothing — is the only realistic model."
  },
  {
    quote: "Hackers are breaking the systems for profit. Before, it was about intellectual curiosity and the pursuit of knowledge and thrill.",
    author: "Kevin Mitnick",
    role: "World's Most Famous Hacker turned Security Consultant",
    context: "The threat landscape has evolved from curious teenagers to organized criminal enterprises and nation-state actors. Understanding adversary motivation is step one in building a proportionate defense."
  },
  {
    quote: "I can show you how to pick a lock, but I can't teach you what it feels like when someone's privacy is violated.",
    author: "Kevin Mitnick",
    role: "World's Most Famous Hacker turned Security Consultant",
    context: "Technical skill without ethics is dangerous. The hacker community's code of responsible disclosure exists because the harm of unauthorized access is real, regardless of the technical elegance of the exploit."
  },
  {
    quote: "Privacy is a social good, a component of a truly human life.",
    author: "Priscilla Regan",
    role: "Professor of Government & Politics, GMU",
    context: "When privacy erodes at scale — through surveillance capitalism or government monitoring — it changes how people behave, speak, and organize. Engineers building data-intensive systems carry social weight."
  },
  {
    quote: "The problem with the internet is that the internet makes no distinction between signal and noise.",
    author: "Eli Pariser",
    role: "Author of The Filter Bubble",
    context: "Misinformation, malware, and manipulation spread at the same speed as truth. Content authenticity, zero-trust information models, and provenance tracking are the next frontier of information security."
  },
  {
    quote: "Security is mostly a superstition. Life is either a daring adventure or nothing at all.",
    author: "Helen Keller",
    role: "Author & Political Activist",
    context: "In security engineering, paralysis from over-analysis is as dangerous as complacency. Shipping a secure-enough system beats never shipping a perfect one. Threat model, mitigate what matters, and iterate."
  },
  {
    quote: "We have to stop optimizing for programmers and start optimizing for users.",
    author: "Jeff Atwood",
    role: "Co-founder of Stack Overflow",
    context: "Security UX is often the weakest link. Overly complex passwords, confusing permission dialogs, and buried privacy controls guarantee users will take the path of least resistance — which is rarely the secure path."
  },
  {
    quote: "The question is not if your organization will be hacked. The question is when — and whether you'll know.",
    author: "Theresa Payton",
    role: "Former White House CIO",
    context: "Mean time to detect (MTTD) is often measured in months, not hours. Investing in detection and logging infrastructure — SIEM, anomaly detection, honeypots — is as important as hardening endpoints."
  },
  {
    quote: "The more I study, the more insatiable do I feel my genius for it to be.",
    author: "Ada Lovelace",
    role: "World's First Computer Programmer",
    context: "Ada's curiosity exemplifies the right posture in security: the field changes constantly, and continuous learning is not optional. Every CVE, every breach post-mortem, every RFC update is a lesson in the art of attack and defense."
  },
  {
    quote: "There is no patch for human stupidity.",
    author: "Kevin Mitnick",
    role: "World's Most Famous Hacker turned Security Consultant",
    context: "Security awareness training exists because policies alone don't change behavior. People click phishing links, reuse passwords, and plug in unknown USB drives. Culture and training are technical controls too."
  },
  {
    quote: "To protect against an adversary you don't understand is to not protect at all.",
    author: "Richard Clarke",
    role: "Former US National Coordinator for Security",
    context: "Threat intelligence — understanding who attacks you, with what tools, and toward what goal — is the foundation of proportionate defense. Generic defenses fail against targeted, sophisticated adversaries."
  },
  {
    quote: "Information security is ultimately about trust — trust in the people, processes, and technologies that protect our data.",
    author: "Whitfield Diffie",
    role: "Co-inventor of Public Key Cryptography",
    context: "Public-key infrastructure, certificate authorities, and zero-knowledge proofs are all mechanisms for establishing trust without prior relationships. Understanding trust models is central to designing secure systems."
  },
  {
    quote: "The most dangerous phrase in the language is, 'We've always done it this way.'",
    author: "Grace Hopper",
    role: "Computer Science Pioneer, COBOL Creator",
    context: "Legacy systems, inherited configurations, and outdated protocols persist in production because change is hard. Security debt accumulates silently. Grace Hopper's warning applies as much to infrastructure as it does to culture."
  },
  {
    quote: "Show me a secure system and I'll show you an unusable one.",
    author: "Gene Spafford",
    role: "Cybersecurity Pioneer, Purdue University",
    context: "Security and usability exist in permanent tension. Zero-trust is more secure but harder to use. Strong passwords are safer but less memorable. The engineer's job is to find the right equilibrium for their threat model."
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
