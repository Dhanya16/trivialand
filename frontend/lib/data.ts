import type {
  Category,
  Contest,
  Discussion,
  DiscussionReply,
  Level,
  Question,
  Quiz,
  Ranking,
  Subcategory,
} from "./types";

// --- Categories ---

export const categories: Category[] = [
  { slug: "science", name: "Science", description: "Physics, chemistry, biology, and more." },
  { slug: "history", name: "History", description: "World history and civilizations." },
  { slug: "geography", name: "Geography", description: "Countries, capitals, and landmarks." },
  { slug: "technology", name: "Technology", description: "Computers, programming, and innovation." },
  { slug: "literature", name: "Literature", description: "Books, authors, and literary works." },
  { slug: "arts", name: "Arts", description: "Music, painting, and performing arts." },
  { slug: "mathematics", name: "Mathematics", description: "Algebra, geometry, and logic puzzles." },
  { slug: "sports", name: "Sports", description: "Athletes, rules, and world records." },
  { slug: "movies", name: "Movies", description: "Films, directors, and cinema history." },
  { slug: "music", name: "Music", description: "Genres, artists, and music theory." },
  { slug: "food", name: "Food", description: "Cuisines, ingredients, and cooking." },
  { slug: "nature", name: "Nature", description: "Animals, plants, and ecosystems." },
  { slug: "space", name: "Space", description: "Astronomy, planets, and exploration." },
  { slug: "mythology", name: "Mythology", description: "Legends, gods, and folklore." },
  { slug: "politics", name: "Politics", description: "Governments, leaders, and world affairs." },
  { slug: "business", name: "Business", description: "Economics, finance, and entrepreneurship." },
  { slug: "health", name: "Health", description: "Medicine, wellness, and the human body." },
  { slug: "psychology", name: "Psychology", description: "Mind, behavior, and cognition." },
  { slug: "languages", name: "Languages", description: "Vocabulary, grammar, and linguistics." },
  { slug: "architecture", name: "Architecture", description: "Buildings, styles, and design." },
  { slug: "fashion", name: "Fashion", description: "Trends, designers, and style history." },
  { slug: "gaming", name: "Gaming", description: "Video games, esports, and game design." },
  { slug: "inventions", name: "Inventions", description: "Discoveries and breakthrough ideas." },
  { slug: "pop-culture", name: "Pop Culture", description: "Trends, celebrities, and media." },
];

export const subcategories: Subcategory[] = [
  { slug: "physics", name: "Physics", categorySlug: "science" },
  { slug: "chemistry", name: "Chemistry", categorySlug: "science" },
  { slug: "biology", name: "Biology", categorySlug: "science" },
  { slug: "ancient", name: "Ancient History", categorySlug: "history" },
  { slug: "modern", name: "Modern History", categorySlug: "history" },
  { slug: "world", name: "World Geography", categorySlug: "geography" },
  { slug: "programming", name: "Programming", categorySlug: "technology" },
];

export const levels: Level[] = [
  { id: "1", name: "Level 1", categorySlug: "science", subcategorySlug: "physics", status: "completed" },
  { id: "2", name: "Level 2", categorySlug: "science", subcategorySlug: "physics", status: "unlocked" },
  { id: "3", name: "Level 3", categorySlug: "science", subcategorySlug: "physics", status: "locked" },
  { id: "4", name: "Level 1", categorySlug: "science", subcategorySlug: "chemistry", status: "unlocked" },
  { id: "5", name: "Level 1", categorySlug: "history", subcategorySlug: "ancient", status: "unlocked" },
];

export const quizzes: Quiz[] = [
  {
    id: "mechanics-basics",
    title: "Mechanics Basics",
    levelId: "2",
    categorySlug: "science",
    subcategorySlug: "physics",
  },
];

export const questions: Record<string, Question[]> = {
  "mechanics-basics": [
    {
      id: "q1",
      text: "What is Newton's first law of motion?",
      options: [
        "F = ma",
        "An object at rest stays at rest unless acted upon",
        "Every action has an equal and opposite reaction",
        "Energy cannot be created or destroyed",
      ],
      correctIndex: 1,
      explanation: "Newton's first law is the law of inertia.",
    },
    {
      id: "q2",
      text: "What is the SI unit of force?",
      options: ["Joule", "Watt", "Newton", "Pascal"],
      correctIndex: 2,
      explanation: "Force is measured in Newtons (N).",
    },
    {
      id: "q3",
      text: "What does acceleration measure?",
      options: [
        "Speed only",
        "Change in velocity over time",
        "Total distance traveled",
        "Mass of an object",
      ],
      correctIndex: 1,
    },
  ],
};

// --- Contests ---

export const contests: Contest[] = [
  {
    id: "c1",
    title: "Weekly Science Challenge",
    description: "Test your science knowledge in 60 minutes.",
    startTime: "2026-08-20T18:00:00",
    durationMinutes: 60,
    status: "upcoming",
  },
  {
    id: "c4",
    title: "Geography Sprint",
    description: "Capitals, flags, and landmarks in 45 minutes.",
    startTime: "2026-08-22T14:00:00",
    durationMinutes: 45,
    status: "upcoming",
  },
  {
    id: "c5",
    title: "Literature League",
    description: "Classic and modern authors face off.",
    startTime: "2026-08-25T19:00:00",
    durationMinutes: 75,
    status: "upcoming",
  },
  {
    id: "c6",
    title: "Tech Trivia Open",
    description: "Programming, gadgets, and internet culture.",
    startTime: "2026-08-28T17:00:00",
    durationMinutes: 60,
    status: "upcoming",
  },
  {
    id: "c7",
    title: "Math Marathon",
    description: "Algebra, geometry, and logic under pressure.",
    startTime: "2026-09-01T16:00:00",
    durationMinutes: 90,
    status: "upcoming",
  },
  {
    id: "c2",
    title: "Friday Night Trivia",
    description: "Mixed topics, fast-paced contest.",
    startTime: "2026-08-16T20:00:00",
    durationMinutes: 90,
    status: "live",
  },
  {
    id: "c8",
    title: "Pop Culture Blitz",
    description: "Movies, music, and memes — live now.",
    startTime: "2026-08-16T18:00:00",
    durationMinutes: 60,
    status: "live",
  },
  {
    id: "c9",
    title: "Sports Showdown",
    description: "Real-time quiz on global sports trivia.",
    startTime: "2026-08-16T21:00:00",
    durationMinutes: 45,
    status: "live",
  },
  {
    id: "c3",
    title: "History Masters",
    description: "A contest focused on world history.",
    startTime: "2026-08-10T15:00:00",
    durationMinutes: 120,
    status: "past",
  },
  {
    id: "c10",
    title: "Summer Trivia Open",
    description: "Mixed topics championship round.",
    startTime: "2026-08-05T15:00:00",
    durationMinutes: 90,
    status: "past",
  },
  {
    id: "c11",
    title: "Space Explorers Cup",
    description: "Astronomy and space exploration quiz.",
    startTime: "2026-07-28T18:00:00",
    durationMinutes: 60,
    status: "past",
  },
  {
    id: "c12",
    title: "Art & Design Duel",
    description: "Paintings, architecture, and design history.",
    startTime: "2026-07-20T14:00:00",
    durationMinutes: 75,
    status: "past",
  },
  {
    id: "c13",
    title: "Food & Culture Fest",
    description: "World cuisines and culinary traditions.",
    startTime: "2026-07-12T19:00:00",
    durationMinutes: 50,
    status: "past",
  },
  {
    id: "c14",
    title: "Gaming Legends",
    description: "Video game history and esports trivia.",
    startTime: "2026-07-05T20:00:00",
    durationMinutes: 80,
    status: "past",
  },
];

export const rankings: Ranking[] = [
  { rank: 1, username: "quizmaster", rating: 1842 },
  { rank: 2, username: "brainiac", rating: 1765 },
  { rank: 3, username: "triviaking", rating: 1690 },
  { rank: 4, username: "learner42", rating: 1520 },
  { rank: 5, username: "you", rating: 1200 },
  { rank: 6, username: "novafox", rating: 1185 },
  { rank: 7, username: "cipher", rating: 1150 },
  { rank: 8, username: "atlas", rating: 1098 },
];

// --- Discussions ---

export const discussions: Discussion[] = [
  {
    id: "d1",
    title: "Help with Newton's laws question",
    author: "learner42",
    replyCount: 3,
    createdAt: "2026-08-15",
    topic: "Physics",
  },
  {
    id: "d2",
    title: "Best strategy for timed contests?",
    author: "brainiac",
    replyCount: 7,
    createdAt: "2026-08-14",
    topic: "Contests",
  },
  {
    id: "d3",
    title: "AI-generated quiz quality tips",
    author: "quizmaster",
    replyCount: 2,
    createdAt: "2026-08-12",
    topic: "AI Quiz",
  },
];

export const discussionReplies: Record<string, DiscussionReply[]> = {
  d1: [
    {
      id: "r1",
      author: "brainiac",
      content: "Remember: first law is about inertia, second is F=ma, third is action-reaction.",
      createdAt: "2026-08-15",
    },
    {
      id: "r2",
      author: "triviaking",
      content: "Draw a free-body diagram — it helps a lot for mechanics problems.",
      createdAt: "2026-08-15",
    },
  ],
};

// --- Profile (sample data) ---

export const profile = {
  username: "you",
  levelsCleared: 1,
  contestRating: 1200,
  quizHistory: [
    { title: "Mechanics Basics", score: "2/3", date: "2026-08-14" },
    { title: "Ancient Rome Quiz", score: "4/5", date: "2026-08-10" },
  ],
  contestHistory: [
    { title: "Summer Trivia Open", score: 450, ratingChange: "+25", date: "2026-08-05" },
  ],
  achievements: [
    "First quiz completed",
    "First level cleared",
    "First contest participated",
  ],
};

// --- Helper functions ---

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getSubcategories(categorySlug: string) {
  return subcategories.filter((s) => s.categorySlug === categorySlug);
}

export function getSubcategory(categorySlug: string, subcategorySlug: string) {
  return subcategories.find(
    (s) => s.categorySlug === categorySlug && s.slug === subcategorySlug,
  );
}

export function getLevels(categorySlug: string, subcategorySlug: string) {
  return levels.filter(
    (l) => l.categorySlug === categorySlug && l.subcategorySlug === subcategorySlug,
  );
}

export function getLevel(categorySlug: string, subcategorySlug: string, levelId: string) {
  return levels.find(
    (l) =>
      l.id === levelId &&
      l.categorySlug === categorySlug &&
      l.subcategorySlug === subcategorySlug,
  );
}

export function getQuizzesForLevel(levelId: string) {
  return quizzes.filter((q) => q.levelId === levelId);
}

export function getQuiz(quizId: string) {
  return quizzes.find((q) => q.id === quizId);
}

export function getQuestions(quizId: string) {
  return questions[quizId] ?? [];
}

export function getContestsByStatus(status: Contest["status"]) {
  return contests.filter((c) => c.status === status);
}

export function getDiscussion(id: string) {
  return discussions.find((d) => d.id === id);
}

export function getDiscussionReplies(id: string) {
  return discussionReplies[id] ?? [];
}
