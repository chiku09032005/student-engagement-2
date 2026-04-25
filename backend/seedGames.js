const mongoose = require('mongoose');
const Game = require('./models/Game');

const brainGames = [
  {
    name: 'Memory Cards',
    description: 'Match pairs of cards to test your memory. Flip two cards at a time and find all matching pairs.',
    type: 'memory',
    questions: [],
    totalPoints: 100,
    difficulty: 'medium',
  },
  {
    name: 'Number Sequence',
    description: 'Find the next number in the sequence. Test your pattern recognition skills.',
    type: 'math',
    questions: [
      {
        question: '2, 4, 8, 16, ?',
        options: ['24', '32', '18', '20'],
        correctAnswer: 1,
        points: 10,
      },
      {
        question: '1, 4, 9, 16, 25, ?',
        options: ['30', '36', '49', '32'],
        correctAnswer: 1,
        points: 10,
      },
      {
        question: '1, 1, 2, 3, 5, 8, ?',
        options: ['11', '13', '15', '10'],
        correctAnswer: 1,
        points: 10,
      },
    ],
    totalPoints: 30,
    difficulty: 'easy',
  },
  {
    name: 'Word Puzzle',
    description: 'Unscramble the letters to form a word. Improve your vocabulary and spelling.',
    type: 'word-game',
    questions: [
      {
        question: 'Unscramble: T C E S I N E C',
        options: ['Science', 'Scientist', 'Scientific', 'Science'],
        correctAnswer: 0,
        points: 15,
      },
      {
        question: 'Unscramble: M T A E H M I C A S',
        options: ['Mathematics', 'Mathematical', 'Mathematician', 'Mathematics'],
        correctAnswer: 0,
        points: 15,
      },
      {
        question: 'Unscramble: O L G Y O B I L O',
        options: ['Biology', 'Biological', 'Biologist', 'Biology'],
        correctAnswer: 0,
        points: 15,
      },
    ],
    totalPoints: 45,
    difficulty: 'medium',
  },
  {
    name: 'Logic Grid',
    description: 'Solve logic puzzles by deducing relationships between different items.',
    type: 'puzzle',
    questions: [
      {
        question: 'Three friends - Alice, Bob, and Charlie - have different favorite colors: red, blue, and green. Alice does not like red. Bob does not like blue. What color does Charlie like?',
        options: ['Red', 'Blue', 'Green', 'Cannot determine'],
        correctAnswer: 2,
        points: 20,
      },
    ],
    totalPoints: 20,
    difficulty: 'hard',
  },
  {
    name: 'Speed Math',
    description: 'Solve math problems as quickly as possible. Test your mental arithmetic.',
    type: 'math',
    questions: [
      {
        question: '15 + 27 = ?',
        options: ['42', '41', '43', '40'],
        correctAnswer: 0,
        points: 5,
      },
      {
        question: '8 × 9 = ?',
        options: ['72', '71', '73', '70'],
        correctAnswer: 0,
        points: 5,
      },
      {
        question: '144 ÷ 12 = ?',
        options: ['12', '11', '13', '10'],
        correctAnswer: 0,
        points: 5,
      },
    ],
    totalPoints: 15,
    difficulty: 'easy',
  },
];

const seedGames = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-engagement');

    // Clear existing games
    await Game.deleteMany({ type: { $in: ['memory', 'math', 'word-game'] } });

    // Insert new games
    await Game.insertMany(brainGames);

    console.log('Brain games seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding games:', error);
    process.exit(1);
  }
};

seedGames();