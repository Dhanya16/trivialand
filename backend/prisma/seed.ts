import { ContestStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Placeholder hash — replace with real bcrypt when auth is built
const SEED_PASSWORD_HASH = '$2b$10$seedplaceholderhashnotforproductionuse';

const categories = [
  { slug: 'science', name: 'Science', description: 'Physics, chemistry, biology, and more.', sortOrder: 0 },
  { slug: 'history', name: 'History', description: 'World history and civilizations.', sortOrder: 1 },
  { slug: 'geography', name: 'Geography', description: 'Countries, capitals, and landmarks.', sortOrder: 2 },
  { slug: 'technology', name: 'Technology', description: 'Computers, programming, and innovation.', sortOrder: 3 },
  { slug: 'literature', name: 'Literature', description: 'Books, authors, and literary works.', sortOrder: 4 },
  { slug: 'arts', name: 'Arts', description: 'Music, painting, and performing arts.', sortOrder: 5 },
  { slug: 'mathematics', name: 'Mathematics', description: 'Algebra, geometry, and logic puzzles.', sortOrder: 6 },
  { slug: 'sports', name: 'Sports', description: 'Athletes, rules, and world records.', sortOrder: 7 },
  { slug: 'movies', name: 'Movies', description: 'Films, directors, and cinema history.', sortOrder: 8 },
  { slug: 'music', name: 'Music', description: 'Genres, artists, and music theory.', sortOrder: 9 },
  { slug: 'food', name: 'Food', description: 'Cuisines, ingredients, and cooking.', sortOrder: 10 },
  { slug: 'nature', name: 'Nature', description: 'Animals, plants, and ecosystems.', sortOrder: 11 },
  { slug: 'space', name: 'Space', description: 'Astronomy, planets, and exploration.', sortOrder: 12 },
  { slug: 'mythology', name: 'Mythology', description: 'Legends, gods, and folklore.', sortOrder: 13 },
  { slug: 'politics', name: 'Politics', description: 'Governments, leaders, and world affairs.', sortOrder: 14 },
  { slug: 'business', name: 'Business', description: 'Economics, finance, and entrepreneurship.', sortOrder: 15 },
  { slug: 'health', name: 'Health', description: 'Medicine, wellness, and the human body.', sortOrder: 16 },
  { slug: 'psychology', name: 'Psychology', description: 'Mind, behavior, and cognition.', sortOrder: 17 },
  { slug: 'languages', name: 'Languages', description: 'Vocabulary, grammar, and linguistics.', sortOrder: 18 },
  { slug: 'architecture', name: 'Architecture', description: 'Buildings, styles, and design.', sortOrder: 19 },
  { slug: 'fashion', name: 'Fashion', description: 'Trends, designers, and style history.', sortOrder: 20 },
  { slug: 'gaming', name: 'Gaming', description: 'Video games, esports, and game design.', sortOrder: 21 },
  { slug: 'inventions', name: 'Inventions', description: 'Discoveries and breakthrough ideas.', sortOrder: 22 },
  { slug: 'pop-culture', name: 'Pop Culture', description: 'Trends, celebrities, and media.', sortOrder: 23 },
];

const subcategories = [
  { slug: 'physics', name: 'Physics', categorySlug: 'science' },
  { slug: 'chemistry', name: 'Chemistry', categorySlug: 'science' },
  { slug: 'biology', name: 'Biology', categorySlug: 'science' },
  { slug: 'ancient', name: 'Ancient History', categorySlug: 'history' },
  { slug: 'modern', name: 'Modern History', categorySlug: 'history' },
  { slug: 'world', name: 'World Geography', categorySlug: 'geography' },
  { slug: 'programming', name: 'Programming', categorySlug: 'technology' },
];

const demoUsers = [
  { username: 'quizmaster', email: 'quizmaster@trivialand.test' },
  { username: 'brainiac', email: 'brainiac@trivialand.test' },
  { username: 'triviaking', email: 'triviaking@trivialand.test' },
  { username: 'learner42', email: 'learner42@trivialand.test' },
  { username: 'you', email: 'you@trivialand.test' },
  { username: 'novafox', email: 'novafox@trivialand.test' },
  { username: 'cipher', email: 'cipher@trivialand.test' },
  { username: 'atlas', email: 'atlas@trivialand.test' },
];

const contestRatings = [
  { username: 'quizmaster', rating: 1842 },
  { username: 'brainiac', rating: 1765 },
  { username: 'triviaking', rating: 1690 },
  { username: 'learner42', rating: 1520 },
  { username: 'you', rating: 1200 },
  { username: 'novafox', rating: 1185 },
  { username: 'cipher', rating: 1150 },
  { username: 'atlas', rating: 1098 },
];

const contests = [
  { id: 'c1', title: 'Weekly Science Challenge', description: 'Test your science knowledge in 60 minutes.', startTime: '2026-08-20T18:00:00.000Z', durationMinutes: 60, status: ContestStatus.upcoming },
  { id: 'c4', title: 'Geography Sprint', description: 'Capitals, flags, and landmarks in 45 minutes.', startTime: '2026-08-22T14:00:00.000Z', durationMinutes: 45, status: ContestStatus.upcoming },
  { id: 'c5', title: 'Literature League', description: 'Classic and modern authors face off.', startTime: '2026-08-25T19:00:00.000Z', durationMinutes: 75, status: ContestStatus.upcoming },
  { id: 'c6', title: 'Tech Trivia Open', description: 'Programming, gadgets, and internet culture.', startTime: '2026-08-28T17:00:00.000Z', durationMinutes: 60, status: ContestStatus.upcoming },
  { id: 'c7', title: 'Math Marathon', description: 'Algebra, geometry, and logic under pressure.', startTime: '2026-09-01T16:00:00.000Z', durationMinutes: 90, status: ContestStatus.upcoming },
  { id: 'c2', title: 'Friday Night Trivia', description: 'Mixed topics, fast-paced contest.', startTime: '2026-08-16T20:00:00.000Z', durationMinutes: 90, status: ContestStatus.live },
  { id: 'c8', title: 'Pop Culture Blitz', description: 'Movies, music, and memes — live now.', startTime: '2026-08-16T18:00:00.000Z', durationMinutes: 60, status: ContestStatus.live },
  { id: 'c9', title: 'Sports Showdown', description: 'Real-time quiz on global sports trivia.', startTime: '2026-08-16T21:00:00.000Z', durationMinutes: 45, status: ContestStatus.live },
  { id: 'c3', title: 'History Masters', description: 'A contest focused on world history.', startTime: '2026-08-10T15:00:00.000Z', durationMinutes: 120, status: ContestStatus.past },
  { id: 'c10', title: 'Summer Trivia Open', description: 'Mixed topics championship round.', startTime: '2026-08-05T15:00:00.000Z', durationMinutes: 90, status: ContestStatus.past },
  { id: 'c11', title: 'Space Explorers Cup', description: 'Astronomy and space exploration quiz.', startTime: '2026-07-28T18:00:00.000Z', durationMinutes: 60, status: ContestStatus.past },
  { id: 'c12', title: 'Art & Design Duel', description: 'Paintings, architecture, and design history.', startTime: '2026-07-20T14:00:00.000Z', durationMinutes: 75, status: ContestStatus.past },
  { id: 'c13', title: 'Food & Culture Fest', description: 'World cuisines and culinary traditions.', startTime: '2026-07-12T19:00:00.000Z', durationMinutes: 50, status: ContestStatus.past },
  { id: 'c14', title: 'Gaming Legends', description: 'Video game history and esports trivia.', startTime: '2026-07-05T20:00:00.000Z', durationMinutes: 80, status: ContestStatus.past },
];

const achievements = [
  { slug: 'first-quiz', name: 'First quiz completed', description: 'Complete your first quiz.', criteria: 'quiz_attempts >= 1' },
  { slug: 'first-level', name: 'First level cleared', description: 'Clear your first level.', criteria: 'levels_cleared >= 1' },
  { slug: 'first-contest', name: 'First contest participated', description: 'Join your first contest.', criteria: 'contest_participations >= 1' },
  { slug: 'levels-5', name: '5 levels cleared', description: 'Clear five levels.', criteria: 'levels_cleared >= 5' },
  { slug: 'levels-10', name: '10 levels cleared', description: 'Clear ten levels.', criteria: 'levels_cleared >= 10' },
  { slug: 'rating-1200', name: 'Rating 1200', description: 'Reach a contest rating of 1200.', criteria: 'contest_rating >= 1200' },
  { slug: 'rating-1500', name: 'Rating 1500', description: 'Reach a contest rating of 1500.', criteria: 'contest_rating >= 1500' },
];

type QuizQuestionSeed = {
  text: string;
  explanation?: string;
  options: { text: string; isCorrect: boolean }[];
};

const quizContentBySubcategory: Record<string, { title: string; questions: QuizQuestionSeed[] }> = {
  physics: {
    title: 'Mechanics Basics',
    questions: [
      {
        text: "What is Newton's first law of motion?",
        explanation: "Newton's first law is the law of inertia.",
        options: [
          { text: 'F = ma', isCorrect: false },
          { text: 'An object at rest stays at rest unless acted upon', isCorrect: true },
          { text: 'Every action has an equal and opposite reaction', isCorrect: false },
          { text: 'Energy cannot be created or destroyed', isCorrect: false },
        ],
      },
      {
        text: 'What is the SI unit of force?',
        explanation: 'Force is measured in Newtons (N).',
        options: [
          { text: 'Joule', isCorrect: false },
          { text: 'Watt', isCorrect: false },
          { text: 'Newton', isCorrect: true },
          { text: 'Pascal', isCorrect: false },
        ],
      },
      {
        text: 'What does acceleration measure?',
        options: [
          { text: 'Speed only', isCorrect: false },
          { text: 'Change in velocity over time', isCorrect: true },
          { text: 'Total distance traveled', isCorrect: false },
          { text: 'Mass of an object', isCorrect: false },
        ],
      },
    ],
  },
  chemistry: {
    title: 'Elements & Compounds',
    questions: [
      {
        text: 'What is the chemical symbol for water?',
        explanation: 'Water is H₂O.',
        options: [
          { text: 'HO', isCorrect: false },
          { text: 'H2O', isCorrect: true },
          { text: 'O2H', isCorrect: false },
          { text: 'H3O', isCorrect: false },
        ],
      },
      {
        text: 'Which gas do plants absorb during photosynthesis?',
        options: [
          { text: 'Oxygen', isCorrect: false },
          { text: 'Nitrogen', isCorrect: false },
          { text: 'Carbon dioxide', isCorrect: true },
          { text: 'Hydrogen', isCorrect: false },
        ],
      },
    ],
  },
  biology: {
    title: 'Cells & Life',
    questions: [
      {
        text: 'What is the powerhouse of the cell?',
        options: [
          { text: 'Nucleus', isCorrect: false },
          { text: 'Mitochondria', isCorrect: true },
          { text: 'Ribosome', isCorrect: false },
          { text: 'Golgi body', isCorrect: false },
        ],
      },
      {
        text: 'DNA stands for?',
        options: [
          { text: 'Deoxyribonucleic acid', isCorrect: true },
          { text: 'Dynamic nuclear acid', isCorrect: false },
          { text: 'Dual nitrogen array', isCorrect: false },
          { text: 'Dense nucleotide agent', isCorrect: false },
        ],
      },
    ],
  },
  ancient: {
    title: 'Ancient Civilizations',
    questions: [
      {
        text: 'Which river was central to ancient Egyptian civilization?',
        options: [
          { text: 'Tigris', isCorrect: false },
          { text: 'Nile', isCorrect: true },
          { text: 'Indus', isCorrect: false },
          { text: 'Danube', isCorrect: false },
        ],
      },
      {
        text: 'The Colosseum is located in which city?',
        options: [
          { text: 'Athens', isCorrect: false },
          { text: 'Rome', isCorrect: true },
          { text: 'Cairo', isCorrect: false },
          { text: 'Istanbul', isCorrect: false },
        ],
      },
    ],
  },
  modern: {
    title: 'Modern Era',
    questions: [
      {
        text: 'In which year did World War II end?',
        options: [
          { text: '1943', isCorrect: false },
          { text: '1945', isCorrect: true },
          { text: '1950', isCorrect: false },
          { text: '1939', isCorrect: false },
        ],
      },
      {
        text: 'Who was the first person to walk on the Moon?',
        options: [
          { text: 'Yuri Gagarin', isCorrect: false },
          { text: 'Neil Armstrong', isCorrect: true },
          { text: 'Buzz Aldrin', isCorrect: false },
          { text: 'John Glenn', isCorrect: false },
        ],
      },
    ],
  },
  world: {
    title: 'World Capitals',
    questions: [
      {
        text: 'What is the capital of Japan?',
        options: [
          { text: 'Seoul', isCorrect: false },
          { text: 'Beijing', isCorrect: false },
          { text: 'Tokyo', isCorrect: true },
          { text: 'Bangkok', isCorrect: false },
        ],
      },
      {
        text: 'Which country has the largest area?',
        options: [
          { text: 'Canada', isCorrect: false },
          { text: 'China', isCorrect: false },
          { text: 'Russia', isCorrect: true },
          { text: 'USA', isCorrect: false },
        ],
      },
    ],
  },
  programming: {
    title: 'Programming Fundamentals',
    questions: [
      {
        text: 'What does HTML stand for?',
        options: [
          { text: 'HyperText Markup Language', isCorrect: true },
          { text: 'High Tech Modern Language', isCorrect: false },
          { text: 'Home Tool Markup Language', isCorrect: false },
          { text: 'Hyperlink Text Model Language', isCorrect: false },
        ],
      },
      {
        text: 'Which keyword declares a constant in JavaScript?',
        options: [
          { text: 'var', isCorrect: false },
          { text: 'let', isCorrect: false },
          { text: 'const', isCorrect: true },
          { text: 'static', isCorrect: false },
        ],
      },
    ],
  },
};

async function seedUsers() {
  const userIds: Record<string, string> = {};

  for (const user of demoUsers) {
    const record = await prisma.user.upsert({
      where: { username: user.username },
      update: { email: user.email },
      create: {
        username: user.username,
        email: user.email,
        passwordHash: SEED_PASSWORD_HASH,
      },
    });
    userIds[user.username] = record.id;
  }

  for (const entry of contestRatings) {
    await prisma.contestRating.upsert({
      where: { userId: userIds[entry.username] },
      update: { rating: entry.rating },
      create: {
        userId: userIds[entry.username],
        rating: entry.rating,
      },
    });
  }

  console.log(`✅ Seeded ${demoUsers.length} users and contest ratings`);
  return userIds;
}

async function seedCategories() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
      },
      create: category,
    });
  }

  console.log(`✅ Seeded ${categories.length} categories`);
}

async function seedSubcategories() {
  for (const sub of subcategories) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: sub.categorySlug },
    });

    await prisma.subcategory.upsert({
      where: {
        categoryId_slug: {
          categoryId: category.id,
          slug: sub.slug,
        },
      },
      update: { name: sub.name },
      create: {
        slug: sub.slug,
        name: sub.name,
        categoryId: category.id,
      },
    });
  }

  console.log(`✅ Seeded ${subcategories.length} subcategories`);
}

async function seedLevels() {
  let count = 0;

  for (const sub of subcategories) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: sub.categorySlug },
    });
    const subcategory = await prisma.subcategory.findUniqueOrThrow({
      where: {
        categoryId_slug: {
          categoryId: category.id,
          slug: sub.slug,
        },
      },
    });

    for (let order = 1; order <= 3; order++) {
      await prisma.level.upsert({
        where: {
          subcategoryId_order: {
            subcategoryId: subcategory.id,
            order,
          },
        },
        update: { name: `Level ${order}` },
        create: {
          name: `Level ${order}`,
          order,
          subcategoryId: subcategory.id,
        },
      });
      count++;
    }
  }

  console.log(`✅ Seeded ${count} levels`);
}

async function seedQuizzesAndQuestions() {
  const questionIds: string[] = [];

  for (const sub of subcategories) {
    const content = quizContentBySubcategory[sub.slug];
    if (!content) continue;

    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: sub.categorySlug },
    });
    const subcategory = await prisma.subcategory.findUniqueOrThrow({
      where: {
        categoryId_slug: {
          categoryId: category.id,
          slug: sub.slug,
        },
      },
    });
    const level = await prisma.level.findUniqueOrThrow({
      where: {
        subcategoryId_order: {
          subcategoryId: subcategory.id,
          order: 1,
        },
      },
    });

    const existingQuiz = await prisma.quiz.findFirst({
      where: { levelId: level.id, title: content.title },
    });

    const quiz =
      existingQuiz ??
      (await prisma.quiz.create({
        data: {
          title: content.title,
          levelId: level.id,
        },
      }));

    for (let i = 0; i < content.questions.length; i++) {
      const q = content.questions[i];
      const order = i + 1;

      const existingQuestion = await prisma.question.findUnique({
        where: {
          quizId_order: {
            quizId: quiz.id,
            order,
          },
        },
      });

      if (existingQuestion) {
        questionIds.push(existingQuestion.id);
        continue;
      }

      const question = await prisma.question.create({
        data: {
          text: q.text,
          explanation: q.explanation,
          order,
          quizId: quiz.id,
          options: {
            create: q.options.map((opt) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        },
      });
      questionIds.push(question.id);
    }
  }

  console.log(`✅ Seeded quizzes and questions for ${subcategories.length} subcategories`);
  return questionIds;
}

async function seedContests(questionIds: string[]) {
  for (const contest of contests) {
    await prisma.contest.upsert({
      where: { id: contest.id },
      update: {
        title: contest.title,
        description: contest.description,
        startTime: new Date(contest.startTime),
        durationMinutes: contest.durationMinutes,
        status: contest.status,
      },
      create: {
        id: contest.id,
        title: contest.title,
        description: contest.description,
        startTime: new Date(contest.startTime),
        durationMinutes: contest.durationMinutes,
        status: contest.status,
      },
    });
  }

  // Link first 3 questions to the live Friday Night Trivia contest
  const liveContestId = 'c2';
  for (let i = 0; i < Math.min(3, questionIds.length); i++) {
    await prisma.contestQuestion.upsert({
      where: {
        contestId_questionId: {
          contestId: liveContestId,
          questionId: questionIds[i],
        },
      },
      update: { order: i + 1, points: 1 },
      create: {
        contestId: liveContestId,
        questionId: questionIds[i],
        order: i + 1,
        points: 1,
      },
    });
  }

  console.log(`✅ Seeded ${contests.length} contests`);
}

async function seedDiscussions(userIds: Record<string, string>) {
  const discussions = [
    {
      id: 'd1',
      title: "Help with Newton's laws question",
      topic: 'Physics',
      authorUsername: 'learner42',
      createdAt: new Date('2026-08-15T10:00:00.000Z'),
    },
    {
      id: 'd2',
      title: 'Best strategy for timed contests?',
      topic: 'Contests',
      authorUsername: 'brainiac',
      createdAt: new Date('2026-08-14T10:00:00.000Z'),
    },
    {
      id: 'd3',
      title: 'AI-generated quiz quality tips',
      topic: 'AI Quiz',
      authorUsername: 'quizmaster',
      createdAt: new Date('2026-08-12T10:00:00.000Z'),
    },
  ];

  const replies = [
    {
      id: 'r1',
      discussionId: 'd1',
      authorUsername: 'brainiac',
      content:
        'Remember: first law is about inertia, second is F=ma, third is action-reaction.',
      createdAt: new Date('2026-08-15T11:00:00.000Z'),
    },
    {
      id: 'r2',
      discussionId: 'd1',
      authorUsername: 'triviaking',
      content: 'Draw a free-body diagram — it helps a lot for mechanics problems.',
      createdAt: new Date('2026-08-15T12:00:00.000Z'),
    },
    {
      id: 'r3',
      discussionId: 'd2',
      authorUsername: 'quizmaster',
      content: 'Skim all questions first, then tackle the easy ones.',
      createdAt: new Date('2026-08-14T11:00:00.000Z'),
    },
    {
      id: 'r4',
      discussionId: 'd3',
      authorUsername: 'learner42',
      content: 'Upload clean text when possible — OCR notes can be noisy.',
      createdAt: new Date('2026-08-12T11:00:00.000Z'),
    },
  ];

  for (const discussion of discussions) {
    await prisma.discussion.upsert({
      where: { id: discussion.id },
      update: {
        title: discussion.title,
        topic: discussion.topic,
        createdAt: discussion.createdAt,
      },
      create: {
        id: discussion.id,
        title: discussion.title,
        topic: discussion.topic,
        authorId: userIds[discussion.authorUsername],
        createdAt: discussion.createdAt,
      },
    });
  }

  for (const reply of replies) {
    await prisma.discussionReply.upsert({
      where: { id: reply.id },
      update: {
        content: reply.content,
        createdAt: reply.createdAt,
      },
      create: {
        id: reply.id,
        discussionId: reply.discussionId,
        authorId: userIds[reply.authorUsername],
        content: reply.content,
        createdAt: reply.createdAt,
      },
    });
  }

  console.log(`✅ Seeded ${discussions.length} discussions and ${replies.length} replies`);
}

async function seedAchievements() {
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { slug: achievement.slug },
      update: {
        name: achievement.name,
        description: achievement.description,
        criteria: achievement.criteria,
      },
      create: achievement,
    });
  }

  console.log(`✅ Seeded ${achievements.length} achievements`);
}

async function main() {
  console.log('🌱 Seed started...');

  const userIds = await seedUsers();
  await seedCategories();
  await seedSubcategories();
  await seedLevels();
  const questionIds = await seedQuizzesAndQuestions();
  await seedContests(questionIds);
  await seedDiscussions(userIds);
  await seedAchievements();

  console.log('✅ Seed finished');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
