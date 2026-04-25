const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache

// Knowledge base with predefined answers
const knowledgeBase = {
  academic: {
    'mathematics': [
      'Mathematics is the study of numbers, quantities, shapes, and patterns.',
      'Key areas: Algebra, Geometry, Calculus, Statistics, Trigonometry',
      'Study tips: Practice regularly, solve previous year papers, visualize concepts',
      'Resources: Khan Academy, Wolfram Alpha, Mathway for problem solving'
    ],
    'science': [
      'Science includes Physics, Chemistry, and Biology',
      'Physics: Study of matter, energy, and forces. Key topics: Mechanics, Thermodynamics, Electricity',
      'Chemistry: Study of atoms, molecules, and reactions. Focus on periodic table and chemical equations',
      'Biology: Study of living organisms and life processes. Learn cell structure, genetics, evolution'
    ],
    'english': [
      'English includes grammar, literature, and communication',
      'Focus on: Reading comprehension, writing skills, vocabulary building',
      'Practice: Read daily, write essays, maintain a journal, learn new words',
      'Tips: Watch English movies with subtitles, join debate clubs, practice speaking'
    ],
    'computer_science': [
      'Computer Science covers programming, algorithms, and system design',
      'Languages: Python (beginner-friendly), JavaScript (web), Java (enterprise)',
      'Topics: Data structures, algorithms, databases, web development',
      'Resources: freeCodeCamp, Codecademy, LeetCode for practice'
    ]
  },
  social: {
    'friendship': [
      'Good friendships are built on trust, honesty, and mutual respect',
      'Tips: Listen actively, be supportive, respect boundaries, share interests',
      'Making friends: Join clubs, participate in activities, be genuine',
      'Maintaining friendships: Regular communication, celebrate achievements together'
    ],
    'bullying': [
      'Bullying is never acceptable. Always report it to adults or authorities',
      'Support for victims: Talk to trusted adults, seek counseling, document incidents',
      'Prevention: Build inclusive environment, promote kindness, stand up against bullying',
      'Resources: School counselors, helplines, anti-bullying organizations'
    ],
    'communication': [
      'Effective communication: Be clear, listen actively, use appropriate body language',
      'Digital etiquette: Think before posting, respect privacy, avoid cyberbullying',
      'Conflict resolution: Stay calm, express feelings, find common ground'
    ]
  },
  personal: {
    'stress': [
      'Stress is normal but manage it through: exercise, meditation, good sleep, healthy eating',
      'Take breaks: Spend time with friends, pursue hobbies, practice mindfulness',
      'Seek help: Talk to counselors, family, or trusted adults when needed',
      'Techniques: Deep breathing, journaling, time management, setting boundaries'
    ],
    'motivation': [
      'Set clear goals and break them into smaller milestones',
      'Celebrate small wins to maintain momentum',
      'Find your "why" - understand your purpose and passion',
      'Build habits: Start small, be consistent, track progress'
    ],
    'time_management': [
      'Use planners or apps to organize your schedule',
      'Prioritize tasks: Important vs urgent, use Eisenhower matrix',
      'Techniques: Pomodoro (25 min work + 5 min break), time blocking',
      'Avoid procrastination: Break tasks into smaller steps, set deadlines'
    ],
    'mental_health': [
      'Mental health is important for academic success and wellbeing',
      'Signs to watch: Persistent sadness, anxiety, sleep issues, concentration problems',
      'Self-care: Exercise, healthy eating, adequate sleep, social connections',
      'When to seek help: Talk to counselors, doctors, or trusted adults'
    ]
  },
  career: {
    'future_planning': [
      'Explore interests and strengths to choose the right career path',
      'Research careers: Job requirements, salary, growth opportunities',
      'Build skills: Take relevant courses, gain experience through internships',
      'Network: Connect with professionals, attend career fairs'
    ],
    'study_techniques': [
      'Active recall: Test yourself instead of re-reading',
      'Spaced repetition: Review material at increasing intervals',
      'Feynman technique: Explain concepts in simple terms',
      'Mind mapping: Visualize connections between ideas'
    ]
  }
};

// Simple intent classifier
const classifyIntent = (question) => {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('math') || lowerQuestion.includes('algebra') || lowerQuestion.includes('number') || lowerQuestion.includes('calculus')) {
    return 'mathematics';
  } else if (lowerQuestion.includes('physics') || lowerQuestion.includes('chemistry') || lowerQuestion.includes('biology') || lowerQuestion.includes('science')) {
    return 'science';
  } else if (lowerQuestion.includes('english') || lowerQuestion.includes('grammar') || lowerQuestion.includes('literature') || lowerQuestion.includes('writing')) {
    return 'english';
  } else if (lowerQuestion.includes('computer') || lowerQuestion.includes('programming') || lowerQuestion.includes('coding') || lowerQuestion.includes('javascript') || lowerQuestion.includes('python')) {
    return 'computer_science';
  } else if (lowerQuestion.includes('friend') || lowerQuestion.includes('friendship')) {
    return 'friendship';
  } else if (lowerQuestion.includes('bully') || lowerQuestion.includes('bullied') || lowerQuestion.includes('bullying')) {
    return 'bullying';
  } else if (lowerQuestion.includes('communicat') || lowerQuestion.includes('talk') || lowerQuestion.includes('social skills')) {
    return 'communication';
  } else if (lowerQuestion.includes('stress') || lowerQuestion.includes('anxious') || lowerQuestion.includes('worried')) {
    return 'stress';
  } else if (lowerQuestion.includes('motivation') || lowerQuestion.includes('lazy') || lowerQuestion.includes('inspire')) {
    return 'motivation';
  } else if (lowerQuestion.includes('time') || lowerQuestion.includes('schedule') || lowerQuestion.includes('organize')) {
    return 'time_management';
  } else if (lowerQuestion.includes('mental') || lowerQuestion.includes('depress') || lowerQuestion.includes('anxiety') || lowerQuestion.includes('wellbeing')) {
    return 'mental_health';
  } else if (lowerQuestion.includes('career') || lowerQuestion.includes('future') || lowerQuestion.includes('job') || lowerQuestion.includes('profession')) {
    return 'future_planning';
  } else if (lowerQuestion.includes('study') || lowerQuestion.includes('learn') || lowerQuestion.includes('technique') || lowerQuestion.includes('method')) {
    return 'study_techniques';
  }

  return 'general';
};

// Generate AI response
const generateResponse = (question, category, subject = null) => {
  try {
    // Check cache first
    const cacheKey = `${category}_${subject}`;
    const cachedResponse = cache.get(cacheKey);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    let response = '';

    if (category === 'academic' && knowledgeBase.academic[subject]) {
      response = knowledgeBase.academic[subject].join('\n\n');
    } else if (category === 'social' && knowledgeBase.social[subject]) {
      response = knowledgeBase.social[subject].join('\n\n');
    } else if (category === 'personal' && knowledgeBase.personal[subject]) {
      response = knowledgeBase.personal[subject].join('\n\n');
    } else {
      // Default response
      response = generateGenericResponse(question, category);
    }

    // Cache the response
    cache.set(cacheKey, response);

    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    return 'I appreciate your question. Please rephrase it or contact our support team for better assistance.';
  }
};

// Generate generic response if not found in knowledge base
const generateGenericResponse = (question, category) => {
  const responses = {
    academic: `I understand you have a question about academics. Here are some general tips:\n1. Break down complex topics into smaller parts\n2. Use multiple learning resources (books, videos, online courses)\n3. Practice regularly with exercises and problems\n4. Form study groups to discuss and learn together\n5. Don't hesitate to ask teachers for clarification\n\nFor specific help, please ask more detailed questions about the subject.`,
    social: `Your social concern is important. Remember:\n1. Communication is key in all relationships\n2. Respect others' boundaries and feelings\n3. Seek help from trusted adults when needed\n4. Build a positive and inclusive community\n5. Practice empathy and kindness\n\nWould you like to share more details about your situation?`,
    personal: `Taking care of your wellbeing is crucial. Consider:\n1. Maintain healthy daily routines (sleep, exercise, nutrition)\n2. Practice self-care activities you enjoy\n3. Talk to people you trust about your feelings\n4. Seek professional help if challenges persist\n5. Be patient and kind to yourself\n\nHow can I help you further with this?`,
    career: `Planning for your future is an exciting journey! Consider:\n1. Explore your interests and strengths\n2. Research different career paths and requirements\n3. Build relevant skills through courses and experience\n4. Network with professionals in your areas of interest\n5. Set both short-term and long-term goals\n\nWhat aspects of career planning would you like to discuss?`
  };

  return responses[category] || 'Thank you for your question. I\'m here to help with academic, social, personal, and career-related topics. Can you provide more details about what you\'d like to know?';
};

// Process question with optional API integration
const processQuestion = async (question, category, subject = null) => {
  try {
    // Classify intent if not provided
    const intent = subject || classifyIntent(question);

    // Generate response from knowledge base
    const response = generateResponse(question, category, intent);

    return response;
  } catch (error) {
    console.error('Error processing question:', error);
    return 'I encountered an error processing your question. Please try again later.';
  }
};

// Get FAQ
const getFAQ = () => {
  return {
    academic: [
      {
        question: 'How to improve my grades?',
        answer: 'Focus on understanding concepts rather than memorization, practice regularly, seek help when stuck, and maintain consistent study habits.'
      },
      {
        question: 'What is the best study technique?',
        answer: 'The Pomodoro technique (25 min focus + 5 min break) and spaced repetition work well. Also try active recall and teaching concepts to others.'
      },
      {
        question: 'How to overcome exam anxiety?',
        answer: 'Prepare well in advance, practice relaxation techniques, get adequate sleep, eat well, and maintain a positive mindset.'
      },
      {
        question: 'How to learn programming?',
        answer: 'Start with beginner-friendly languages like Python, practice daily on platforms like LeetCode, build projects, and join coding communities.'
      }
    ],
    social: [
      {
        question: 'How to make friends?',
        answer: 'Join clubs or activities you enjoy, be genuine and approachable, show interest in others, and maintain regular communication.'
      },
      {
        question: 'How to handle peer pressure?',
        answer: 'Know your values and boundaries, have confidence in your decisions, seek support from trusted friends and family, and learn to say no politely.'
      },
      {
        question: 'What to do if someone is bullying me?',
        answer: 'Tell a trusted adult immediately, document incidents, avoid being alone with the bully, and seek support from counselors or school authorities.'
      }
    ],
    personal: [
      {
        question: 'How to manage stress?',
        answer: 'Exercise regularly, practice meditation or deep breathing, maintain good sleep habits, eat healthy, and talk to friends or family about your feelings.'
      },
      {
        question: 'How to stay motivated?',
        answer: 'Set clear achievable goals, break them into small steps, celebrate progress, find your purpose, and surround yourself with positive influences.'
      },
      {
        question: 'How to manage time effectively?',
        answer: 'Use a planner or digital calendar, prioritize tasks using techniques like Eisenhower matrix, avoid multitasking, and take regular breaks.'
      },
      {
        question: 'How to improve mental health?',
        answer: 'Maintain healthy routines, practice mindfulness, stay connected with loved ones, engage in hobbies, and seek professional help when needed.'
      }
    ],
    career: [
      {
        question: 'How to choose a career?',
        answer: 'Assess your interests, strengths, and values. Research different careers, talk to professionals, try internships, and consider long-term goals.'
      },
      {
        question: 'What skills are important for future careers?',
        answer: 'Critical thinking, communication, digital literacy, adaptability, problem-solving, and continuous learning are increasingly valuable.'
      }
    ]
  };
};

// Quick tips for different categories
const getQuickTips = (category) => {
  const tips = {
    academic: [
      '📚 Spend 25 minutes studying followed by a 5-minute break (Pomodoro technique)',
      '🧠 Teach concepts to others to reinforce your understanding',
      '📝 Make summary notes after each study session',
      '🎯 Set specific, achievable goals for each study session'
    ],
    social: [
      '💬 Listen more than you speak in conversations',
      '🙂 Smile and maintain eye contact to appear approachable',
      '🤝 Find common interests to build connections',
      '📱 Use social media positively to maintain friendships'
    ],
    personal: [
      '🛏️ Aim for 7-9 hours of sleep every night',
      '🏃‍♀️ Exercise for at least 30 minutes daily',
      '🥗 Eat a balanced diet with plenty of fruits and vegetables',
      '📖 Read for pleasure to reduce stress'
    ],
    career: [
      '🎓 Take online courses to build new skills',
      '🤝 Network with professionals in your field of interest',
      '📈 Set both short-term and long-term career goals',
      '📊 Track your achievements and update your resume regularly'
    ]
  };

  return tips[category] || ['Keep learning and growing every day! 🌟'];
};

// Motivational quotes
const getMotivationalQuote = () => {
  const quotes = [
    '"The only way to do great work is to love what you do." - Steve Jobs',
    '"Believe you can and you\'re halfway there." - Theodore Roosevelt',
    '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
    '"You miss 100% of the shots you don\'t take." - Wayne Gretzky',
    '"The best way to predict the future is to create it." - Peter Drucker',
    '"Success is not final, failure is not fatal: It is the courage to continue that counts." - Winston Churchill',
    '"Your time is limited, so don\'t waste it living someone else\'s life." - Steve Jobs',
    '"The only impossible journey is the one you never begin." - Tony Robbins'
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
};

// Get study streak encouragement
const getStudyStreakMessage = (streak) => {
  if (streak === 0) {
    return '🌟 Ready to start your study streak? Every journey begins with a single step!';
  } else if (streak < 7) {
    return `🔥 ${streak} day${streak > 1 ? 's' : ''} in a row! Keep the momentum going!`;
  } else if (streak < 30) {
    return `🚀 ${streak} day streak! You're building amazing habits!`;
  } else {
    return `👑 ${streak} day streak! You're unstoppable! Keep it up!`;
  }
};

module.exports = {
  processQuestion,
  generateResponse,
  classifyIntent,
  getFAQ,
  getQuickTips,
  getMotivationalQuote,
  getStudyStreakMessage,
};
