// Mock database (in production, use a real database)
// Pre-computed bcrypt hash for password: "demo123"

// Users data (array is mutable)
const users = [
  {
    id: 1,
    email: "demo@careerontrack.ai",
    password: "$2a$10$fUA6ZQBdWMLuY4z6/okcauKF1ApUGX5RnZ5Eimg.CIuZ9j6pU3U1a", // password: "demo123"
    name: "Demo User",
    createdAt: new Date().toISOString(),
  },
];

// Goals data (array is mutable)
const goals = [
  {
    id: 1,
    userId: 1,
    title: "Become a Senior Developer",
    description: "Advance to senior developer role within 12 months",
    status: "in_progress",
    progress: 60,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 1,
    title: "Learn React Native",
    description: "Master React Native for mobile development",
    status: "completed",
    progress: 100,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    userId: 1,
    title: "Build Portfolio App",
    description: "Create a showcase app for my portfolio",
    status: "not_started",
    progress: 0,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Export arrays directly (they are mutable in JavaScript)
export { users, goals };
