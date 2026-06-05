import { Playlist, Topic, Video } from "../db/IDatabaseClient";

// ---------------------------------------------------------
// Helper Types & Interface Definitions
// ---------------------------------------------------------

export interface PlaylistItemVideo extends Omit<Video, "id" | "createdAt" | "updatedAt" | "completed" | "completedAt"> {
  topicSequenceOrder?: number;
}

// ---------------------------------------------------------
// Mock Data (structured exactly to match the DB schema)
// ---------------------------------------------------------

export const MOCK_REACT_PLAYLIST: Playlist = {
  id: "mock-react-playlist-id",
  userId: "mock-user-id",
  youtubePlaylistId: "PLmockreact123",
  title: "React JS Course for Beginners",
  description: "Learn React JS from scratch. Master JSX, components, state, hooks, routing, and context API.",
  thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
  totalVideos: 25,
  totalDuration: 22780,
  difficultyLevel: "Beginner",
  createdAt: "2026-06-05T12:00:00.000Z",
  updatedAt: "2026-06-05T12:00:00.000Z",
};

export const MOCK_REACT_TOPICS: Topic[] = [
  {
    id: "mock-react-topic-1",
    playlistId: "mock-react-playlist-id",
    name: "Introduction & Setup",
    sequenceOrder: 1,
    description: "Get started with React, install dependencies, and learn project setup and folder structure.",
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z",
  },
  {
    id: "mock-react-topic-2",
    playlistId: "mock-react-playlist-id",
    name: "Core React Concepts",
    sequenceOrder: 2,
    description: "Learn props, rendering lists, conditional rendering, event handling, and styling in React.",
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z",
  },
  {
    id: "mock-react-topic-3",
    playlistId: "mock-react-playlist-id",
    name: "Working with State & Effects",
    sequenceOrder: 3,
    description: "Understand React Hooks, state management with useState, lifecycle events with useEffect, and data fetching.",
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z",
  },
  {
    id: "mock-react-topic-4",
    playlistId: "mock-react-playlist-id",
    name: "Routing & Navigation",
    sequenceOrder: 4,
    description: "Configure dynamic routing, nested routes, and navigation using React Router v6.",
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z",
  },
  {
    id: "mock-react-topic-5",
    playlistId: "mock-react-playlist-id",
    name: "State Management & Beyond",
    sequenceOrder: 5,
    description: "Master Context API, Redux Toolkit, performance optimization, and application deployment.",
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z",
  }
];

export const MOCK_REACT_VIDEOS: (Video & { topicSequenceOrder?: number })[] = [
  {
    id: "mock-react-video-1",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-1",
    topicSequenceOrder: 1,
    youtubeVideoId: "react_vid_1",
    title: "React JS Tutorial - Introduction",
    duration: 600,
    sequenceOrder: 1,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-2",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-1",
    topicSequenceOrder: 1,
    youtubeVideoId: "react_vid_2",
    title: "Setting Up React Developer Environment",
    duration: 720,
    sequenceOrder: 2,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-3",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-1",
    topicSequenceOrder: 1,
    youtubeVideoId: "react_vid_3",
    title: "Understanding React Project Folder Structure",
    duration: 540,
    sequenceOrder: 3,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-4",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-1",
    topicSequenceOrder: 1,
    youtubeVideoId: "react_vid_4",
    title: "Introduction to JSX & Rendering Elements",
    duration: 900,
    sequenceOrder: 4,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-5",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-1",
    topicSequenceOrder: 1,
    youtubeVideoId: "react_vid_5",
    title: "Creating Your First Functional Component",
    duration: 800,
    sequenceOrder: 5,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-6",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-2",
    topicSequenceOrder: 2,
    youtubeVideoId: "react_vid_6",
    title: "Props in React - Passing Data to Components",
    duration: 750,
    sequenceOrder: 6,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-7",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-2",
    topicSequenceOrder: 2,
    youtubeVideoId: "react_vid_7",
    title: "Rendering Lists & Using Key Prop",
    duration: 650,
    sequenceOrder: 7,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-8",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-2",
    topicSequenceOrder: 2,
    youtubeVideoId: "react_vid_8",
    title: "Conditional Rendering in React",
    duration: 620,
    sequenceOrder: 8,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-9",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-2",
    topicSequenceOrder: 2,
    youtubeVideoId: "react_vid_9",
    title: "Event Handling in Functional Components",
    duration: 700,
    sequenceOrder: 9,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-10",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-2",
    topicSequenceOrder: 2,
    youtubeVideoId: "react_vid_10",
    title: "Styling React Components - CSS Modules & Tailwind CSS",
    duration: 850,
    sequenceOrder: 10,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-11",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-3",
    topicSequenceOrder: 3,
    youtubeVideoId: "react_vid_11",
    title: "Introduction to React Hooks & useState",
    duration: 950,
    sequenceOrder: 11,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-12",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-3",
    topicSequenceOrder: 3,
    youtubeVideoId: "react_vid_12",
    title: "Handling Forms & Controlled Components",
    duration: 1100,
    sequenceOrder: 12,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-13",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-3",
    topicSequenceOrder: 3,
    youtubeVideoId: "react_vid_13",
    title: "Understanding useEffect Hook & Component Lifecycle",
    duration: 1200,
    sequenceOrder: 13,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-14",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-3",
    topicSequenceOrder: 3,
    youtubeVideoId: "react_vid_14",
    title: "Fetching Data from API in React using useEffect",
    duration: 1000,
    sequenceOrder: 14,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-15",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-3",
    topicSequenceOrder: 3,
    youtubeVideoId: "react_vid_15",
    title: "Creating Custom Hooks for Reusable Logic",
    duration: 900,
    sequenceOrder: 15,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-16",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-4",
    topicSequenceOrder: 4,
    youtubeVideoId: "react_vid_16",
    title: "Getting Started with React Router v6",
    duration: 800,
    sequenceOrder: 16,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-17",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-4",
    topicSequenceOrder: 4,
    youtubeVideoId: "react_vid_17",
    title: "Configuring Routes & Using Link component",
    duration: 750,
    sequenceOrder: 17,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-18",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-4",
    topicSequenceOrder: 4,
    youtubeVideoId: "react_vid_18",
    title: "Dynamic Routing & useParams Hook",
    duration: 900,
    sequenceOrder: 18,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-19",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-4",
    topicSequenceOrder: 4,
    youtubeVideoId: "react_vid_19",
    title: "Nested Routes & Outlet Component",
    duration: 850,
    sequenceOrder: 19,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-20",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-4",
    topicSequenceOrder: 4,
    youtubeVideoId: "react_vid_20",
    title: "Protected Routes & Navigation Hooks",
    duration: 950,
    sequenceOrder: 20,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-21",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-5",
    topicSequenceOrder: 5,
    youtubeVideoId: "react_vid_21",
    title: "Prop Drilling vs Context API in React",
    duration: 1150,
    sequenceOrder: 21,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-22",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-5",
    topicSequenceOrder: 5,
    youtubeVideoId: "react_vid_22",
    title: "Managing Global State with useContext Hook",
    duration: 1050,
    sequenceOrder: 22,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-23",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-5",
    topicSequenceOrder: 5,
    youtubeVideoId: "react_vid_23",
    title: "Introduction to Redux Toolkit",
    duration: 1500,
    sequenceOrder: 23,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-24",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-5",
    topicSequenceOrder: 5,
    youtubeVideoId: "react_vid_24",
    title: "React Performance Optimization - useMemo & useCallback",
    duration: 1300,
    sequenceOrder: 24,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-react-video-25",
    playlistId: "mock-react-playlist-id",
    topicId: "mock-react-topic-5",
    topicSequenceOrder: 5,
    youtubeVideoId: "react_vid_25",
    title: "Deploying React App to Vercel/Netlify",
    duration: 700,
    sequenceOrder: 25,
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  }
];

export const MOCK_DSA_PLAYLIST: Playlist = {
  id: "mock-dsa-playlist-id",
  userId: "mock-user-id",
  youtubePlaylistId: "PLmockdsa123",
  title: "Data Structures & Algorithms",
  description: "Master essential computer science concepts. Cover arrays, lists, sorting, trees, graphs, and Dijkstra's algorithm.",
  thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
  totalVideos: 15,
  totalDuration: 23650,
  difficultyLevel: "Advanced",
  createdAt: "2026-06-05T12:00:00.000Z",
  updatedAt: "2026-06-05T12:00:00.000Z",
};

export const MOCK_DSA_TOPICS: Topic[] = [
  {
    id: "mock-dsa-topic-1",
    playlistId: "mock-dsa-playlist-id",
    name: "Arrays & Linked Lists",
    sequenceOrder: 1,
    description: "Learn about complexity analysis, array representations, and linked list structures.",
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z",
  },
  {
    id: "mock-dsa-topic-2",
    playlistId: "mock-dsa-playlist-id",
    name: "Sorting & Searching",
    sequenceOrder: 2,
    description: "Master classic sorting algorithms like bubble/merge/quick sort and binary searching techniques.",
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z",
  },
  {
    id: "mock-dsa-topic-3",
    playlistId: "mock-dsa-playlist-id",
    name: "Advanced Trees & Graphs",
    sequenceOrder: 3,
    description: "Deep dive into self-balancing AVL trees, graphs representations, and Dijkstra's shortest path algorithm.",
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z",
  }
];

export const MOCK_DSA_VIDEOS: (Video & { topicSequenceOrder?: number })[] = [
  {
    id: "mock-dsa-video-1",
    playlistId: "mock-dsa-playlist-id",
    topicId: "mock-dsa-topic-1",
    topicSequenceOrder: 1,
    youtubeVideoId: "dsa_vid_1",
    title: "Introduction to Big O Notation & Time Complexity",
    duration: 1200,
    sequenceOrder: 1,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-dsa-video-2",
    playlistId: "mock-dsa-playlist-id",
    topicId: "mock-dsa-topic-1",
    topicSequenceOrder: 1,
    youtubeVideoId: "dsa_vid_2",
    title: "Static vs Dynamic Arrays",
    duration: 900,
    sequenceOrder: 2,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-dsa-video-3",
    playlistId: "mock-dsa-playlist-id",
    topicId: "mock-dsa-topic-1",
    topicSequenceOrder: 1,
    youtubeVideoId: "dsa_vid_3",
    title: "Singly Linked List Implementation",
    duration: 1500,
    sequenceOrder: 3,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-dsa-video-4",
    playlistId: "mock-dsa-playlist-id",
    topicId: "mock-dsa-topic-1",
    topicSequenceOrder: 1,
    youtubeVideoId: "dsa_vid_4",
    title: "Doubly Linked Lists & Sentinel Nodes",
    duration: 1100,
    sequenceOrder: 4,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-dsa-video-5",
    playlistId: "mock-dsa-playlist-id",
    topicId: "mock-dsa-topic-1",
    topicSequenceOrder: 1,
    youtubeVideoId: "dsa_vid_5",
    title: "Linked List Interview Questions - Reverse a List",
    duration: 1300,
    sequenceOrder: 5,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-dsa-video-6",
    playlistId: "mock-dsa-playlist-id",
    topicId: "mock-dsa-topic-2",
    topicSequenceOrder: 2,
    youtubeVideoId: "dsa_vid_6",
    title: "Bubble Sort, Insertion Sort, Selection Sort",
    duration: 1400,
    sequenceOrder: 6,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-dsa-video-7",
    playlistId: "mock-dsa-playlist-id",
    topicId: "mock-dsa-topic-2",
    topicSequenceOrder: 2,
    youtubeVideoId: "dsa_vid_7",
    title: "Divide and Conquer - Merge Sort Explained",
    duration: 1600,
    sequenceOrder: 7,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-dsa-video-8",
    playlistId: "mock-dsa-playlist-id",
    topicId: "mock-dsa-topic-2",
    topicSequenceOrder: 2,
    youtubeVideoId: "dsa_vid_8",
    title: "Quick Sort Algorithm & Pivot Selection",
    duration: 1800,
    sequenceOrder: 8,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-dsa-video-9",
    playlistId: "mock-dsa-playlist-id",
    topicId: "mock-dsa-topic-2",
    topicSequenceOrder: 2,
    youtubeVideoId: "dsa_vid_9",
    title: "Linear Search vs Binary Search",
    duration: 1000,
    sequenceOrder: 9,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-dsa-video-10",
    playlistId: "mock-dsa-playlist-id",
    topicId: "mock-dsa-topic-2",
    topicSequenceOrder: 2,
    youtubeVideoId: "dsa_vid_10",
    title: "Binary Search on Sorted Arrays - Exercises",
    duration: 1250,
    sequenceOrder: 10,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-dsa-video-11",
    playlistId: "mock-dsa-playlist-id",
    topicId: "mock-dsa-topic-3",
    topicSequenceOrder: 3,
    youtubeVideoId: "dsa_vid_11",
    title: "Binary Trees & BST Traversals - DFS & BFS",
    duration: 1700,
    sequenceOrder: 11,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-dsa-video-12",
    playlistId: "mock-dsa-playlist-id",
    topicId: "mock-dsa-topic-3",
    topicSequenceOrder: 3,
    youtubeVideoId: "dsa_vid_12",
    title: "AVL Trees & Self-Balancing Mechanisms",
    duration: 2100,
    sequenceOrder: 12,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-dsa-video-13",
    playlistId: "mock-dsa-playlist-id",
    topicId: "mock-dsa-topic-3",
    topicSequenceOrder: 3,
    youtubeVideoId: "dsa_vid_13",
    title: "Introduction to Graphs - Adjacency Matrix & List",
    duration: 1500,
    sequenceOrder: 13,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-dsa-video-14",
    playlistId: "mock-dsa-playlist-id",
    topicId: "mock-dsa-topic-3",
    topicSequenceOrder: 3,
    youtubeVideoId: "dsa_vid_14",
    title: "Graph Traversals - BFS and DFS Implementation",
    duration: 1900,
    sequenceOrder: 14,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-dsa-video-15",
    playlistId: "mock-dsa-playlist-id",
    topicId: "mock-dsa-topic-3",
    topicSequenceOrder: 3,
    youtubeVideoId: "dsa_vid_15",
    title: "Shortest Path Algorithm - Dijkstra's Explained",
    duration: 2400,
    sequenceOrder: 15,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  }
];

export const MOCK_PYTHON_PLAYLIST: Playlist = {
  id: "mock-python-playlist-id",
  userId: "mock-user-id",
  youtubePlaylistId: "PLmockpython123",
  title: "Introduction to Python",
  description: "Learn Python from the ground up. Cover syntax, conditions, loops, collections, functions, and OOP.",
  thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
  totalVideos: 10,
  totalDuration: 8650,
  difficultyLevel: "Beginner",
  createdAt: "2026-06-05T12:00:00.000Z",
  updatedAt: "2026-06-05T12:00:00.000Z",
};

export const MOCK_PYTHON_TOPICS: Topic[] = [
  {
    id: "mock-python-topic-1",
    playlistId: "mock-python-playlist-id",
    name: "Syntax Basics",
    sequenceOrder: 1,
    description: "Get familiar with Python installation, variables, basic operators, loops, and list structures.",
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z",
  },
  {
    id: "mock-python-topic-2",
    playlistId: "mock-python-playlist-id",
    name: "Functions & OOP",
    sequenceOrder: 2,
    description: "Master functions scope, Lambda, and fundamental Object Oriented Programming concepts.",
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z",
  }
];

export const MOCK_PYTHON_VIDEOS: (Video & { topicSequenceOrder?: number })[] = [
  {
    id: "mock-python-video-1",
    playlistId: "mock-python-playlist-id",
    topicId: "mock-python-topic-1",
    topicSequenceOrder: 1,
    youtubeVideoId: "python_vid_1",
    title: "Python Installation & Setting up VS Code",
    duration: 500,
    sequenceOrder: 1,
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-python-video-2",
    playlistId: "mock-python-playlist-id",
    topicId: "mock-python-topic-1",
    topicSequenceOrder: 1,
    youtubeVideoId: "python_vid_2",
    title: "Variables, Data Types & Basic Operators",
    duration: 650,
    sequenceOrder: 2,
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-python-video-3",
    playlistId: "mock-python-playlist-id",
    topicId: "mock-python-topic-1",
    topicSequenceOrder: 1,
    youtubeVideoId: "python_vid_3",
    title: "Conditional Statements - if, elif, else",
    duration: 600,
    sequenceOrder: 3,
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-python-video-4",
    playlistId: "mock-python-playlist-id",
    topicId: "mock-python-topic-1",
    topicSequenceOrder: 1,
    youtubeVideoId: "python_vid_4",
    title: "Loops in Python - While & For Loops",
    duration: 750,
    sequenceOrder: 4,
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-python-video-5",
    playlistId: "mock-python-playlist-id",
    topicId: "mock-python-topic-1",
    topicSequenceOrder: 1,
    youtubeVideoId: "python_vid_5",
    title: "Working with Python Lists & Tuples",
    duration: 800,
    sequenceOrder: 5,
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-python-video-6",
    playlistId: "mock-python-playlist-id",
    topicId: "mock-python-topic-2",
    topicSequenceOrder: 2,
    youtubeVideoId: "python_vid_6",
    title: "Defining Functions & Return Values",
    duration: 900,
    sequenceOrder: 6,
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-python-video-7",
    playlistId: "mock-python-playlist-id",
    topicId: "mock-python-topic-2",
    topicSequenceOrder: 2,
    youtubeVideoId: "python_vid_7",
    title: "Variable Scope & Lambda Functions",
    duration: 850,
    sequenceOrder: 7,
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-python-video-8",
    playlistId: "mock-python-playlist-id",
    topicId: "mock-python-topic-2",
    topicSequenceOrder: 2,
    youtubeVideoId: "python_vid_8",
    title: "Introduction to Object-Oriented Programming (OOP)",
    duration: 1200,
    sequenceOrder: 8,
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-python-video-9",
    playlistId: "mock-python-playlist-id",
    topicId: "mock-python-topic-2",
    topicSequenceOrder: 2,
    youtubeVideoId: "python_vid_9",
    title: "Classes, Objects, Attributes, and Methods",
    duration: 1100,
    sequenceOrder: 9,
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  },
  {
    id: "mock-python-video-10",
    playlistId: "mock-python-playlist-id",
    topicId: "mock-python-topic-2",
    topicSequenceOrder: 2,
    youtubeVideoId: "python_vid_10",
    title: "Inheritance & Polymorphism in Python",
    duration: 1300,
    sequenceOrder: 10,
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
    completed: false,
    createdAt: "2026-06-05T12:00:00.000Z",
    updatedAt: "2026-06-05T12:00:00.000Z"
  }
];

export const MOCK_REACT_COURSE = {
  playlist: MOCK_REACT_PLAYLIST,
  videos: MOCK_REACT_VIDEOS,
  topics: MOCK_REACT_TOPICS,
};

export const MOCK_DSA_COURSE = {
  playlist: MOCK_DSA_PLAYLIST,
  videos: MOCK_DSA_VIDEOS,
  topics: MOCK_DSA_TOPICS,
};

export const MOCK_PYTHON_COURSE = {
  playlist: MOCK_PYTHON_PLAYLIST,
  videos: MOCK_PYTHON_VIDEOS,
  topics: MOCK_PYTHON_TOPICS,
};

// ---------------------------------------------------------
// Helper Functions & Business Logic Heuristics
// ---------------------------------------------------------

/**
 * Extracts a playlist ID from a YouTube playlist URL or validates a raw playlist ID.
 */
export function extractPlaylistId(urlOrId: string): string | null {
  const idRegex = /^[a-zA-Z0-9_-]{18,34}$/;
  if (idRegex.test(urlOrId)) {
    return urlOrId;
  }

  try {
    let urlString = urlOrId;
    if (!/^https?:\/\//i.test(urlOrId)) {
      urlString = "https://" + urlOrId;
    }
    const url = new URL(urlString);
    const listParam = url.searchParams.get("list");
    if (listParam && idRegex.test(listParam)) {
      return listParam;
    }
  } catch {
    // Ignore URL constructor parsing errors
  }

  const match = urlOrId.match(/[&?]list=([a-zA-Z0-9_-]{18,34})/);
  if (match) {
    return match[1];
  }

  return null;
}

/**
 * Parse an ISO 8601 duration (e.g. PT1H10M30S) into seconds.
 */
function parseISO8601Duration(durationStr: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = durationStr.match(regex);
  if (!matches) return 0;
  const hours = parseInt(matches[1] || "0", 10);
  const minutes = parseInt(matches[2] || "0", 10);
  const seconds = parseInt(matches[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

// Stripping functions for mock objects removed

/**
 * Estimates difficulty based on keywords in titles.
 */
export function estimateDifficulty(
  videos: { duration: number; title: string }[]
): 'Beginner' | 'Intermediate' | 'Advanced' {
  if (!videos || videos.length === 0) return 'Intermediate';

  let beginnerScore = 0;
  let advancedScore = 0;

  const beginnerKeywords = [
    /\bintro/i,
    /\bbegin/i,
    /\bsetup\b/i,
    /\binstall/i,
    /\bgetting started\b/i,
    /\bbasics?\b/i,
    /\bfoundations?\b/i,
    /\bcrash course\b/i,
    /\bfor absolute beginners\b/i,
    /\bhello world\b/i
  ];

  const advancedKeywords = [
    /\badvanced\b/i,
    /\bperformance\b/i,
    /\boptimi/i, // matches optimization, optimizing
    /\brecursion\b/i,
    /\bgraph\b/i,
    /\btree\b/i,
    /\bdijkstra\b/i,
    /\bdp\b/i,
    /\bdynamic programming\b/i,
    /\barchitect/i,
    /\bscaling\b/i,
    /\bsecure\b/i,
    /\bsecurity\b/i,
    /\bconcurrency\b/i,
    /\bmultithread/i,
    /\bunder the hood\b/i,
    /\bdeep dive\b/i,
    /\bmastery\b/i
  ];

  for (const v of videos) {
    const title = v.title;
    for (const kw of beginnerKeywords) {
      if (kw.test(title)) beginnerScore++;
    }
    for (const kw of advancedKeywords) {
      if (kw.test(title)) advancedScore++;
    }
  }

  if (advancedScore > beginnerScore && advancedScore >= 2) {
    return 'Advanced';
  } else if (beginnerScore > advancedScore && beginnerScore >= 2) {
    return 'Beginner';
  } else {
    if (advancedScore > 0 && beginnerScore === 0) {
      return 'Advanced';
    }
    if (beginnerScore > 0 && advancedScore === 0) {
      return 'Beginner';
    }
    return 'Intermediate';
  }
}

/**
 * Scans video titles for hierarchical patterns (e.g. Module, Section, Part)
 * and returns grouping information if >50% of the titles share a prefix pattern.
 */
function detectPrefixPattern(
  videos: Omit<Video, "id" | "createdAt" | "updatedAt" | "completed" | "completedAt">[]
): {
  groups: string[];
  groupNames: string[];
} | null {
  const patterns = [
    /^\s*(Module|Section|Part|Chapter|Unit|Mod|Sec|Pt|Ch)\b\.?\s*(\d+|[a-zA-Z])/i,
    /^\s*\[(Module|Section|Part|Chapter|Unit|Mod|Sec|Pt|Ch)\b\.?\s*(\d+|[a-zA-Z])\]/i,
    /^\s*(\d+)\s*[-:|]/,
  ];

  for (const regex of patterns) {
    let matchCount = 0;
    const extractedLabels: (string | null)[] = [];

    for (const v of videos) {
      const match = v.title.match(regex);
      if (match) {
        matchCount++;
        if (match[2]) {
          const prefix = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
          extractedLabels.push(`${prefix} ${match[2].toUpperCase()}`);
        } else {
          extractedLabels.push(`Section ${match[1]}`);
        }
      } else {
        extractedLabels.push(null);
      }
    }

    if (matchCount > videos.length * 0.5) {
      const groups: string[] = [];
      let lastValidLabel = "";

      for (const label of extractedLabels) {
        if (label) {
          lastValidLabel = label;
          break;
        }
      }
      if (!lastValidLabel) {
        lastValidLabel = "Section 1";
      }

      for (const label of extractedLabels) {
        if (label) {
          lastValidLabel = label;
        }
        groups.push(lastValidLabel);
      }

      const groupNames: string[] = [];
      for (const g of groups) {
        if (!groupNames.includes(g)) {
          groupNames.push(g);
        }
      }

      return { groups, groupNames };
    }
  }

  return null;
}

/**
 * Automates topic grouping using heuristics. Groups via title prefixes if a strong
 * pattern is detected, otherwise chunks into 4 videos or ~60 mins per block.
 */
export function groupVideosIntoTopics(
  videos: Omit<Video, "id" | "createdAt" | "updatedAt" | "completed" | "completedAt">[]
): {
  topics: Omit<Topic, "id" | "createdAt" | "updatedAt">[];
  videoTopicAssignments: Record<number, number>;
} {
  const prefixResult = detectPrefixPattern(videos);

  if (prefixResult) {
    const { groups, groupNames } = prefixResult;
    const topics = groupNames.map((gName, idx) => {
      const firstVideoInGroup = videos.find((_, i) => groups[i] === gName);
      let topicName = gName;
      
      if (firstVideoInGroup) {
        const titleWithoutPrefix = firstVideoInGroup.title
          .replace(/^\s*(?:Module|Section|Part|Chapter|Unit|Mod|Sec|Pt|Ch)\b\.?\s*(\d+|[a-zA-Z])\s*[-:|.]?\s*/i, "")
          .replace(/^\s*\[?(?:Module|Section|Part|Chapter|Unit|Mod|Sec|Pt|Ch)\b\.?\s*(\d+|[a-zA-Z])\]?\s*[-:|.]?\s*/i, "")
          .replace(/^\s*(\d+)\s*[-:|.]\s*/, "")
          .trim();
        if (titleWithoutPrefix.length > 3) {
          topicName = `${gName}: ${titleWithoutPrefix}`;
        }
      }

      return {
        playlistId: "",
        name: topicName,
        sequenceOrder: idx + 1,
        description: `Videos matching ${gName}`,
      };
    });

    const videoTopicAssignments: Record<number, number> = {};
    for (let i = 0; i < videos.length; i++) {
      const gIdx = groupNames.indexOf(groups[i]);
      videoTopicAssignments[i] = gIdx >= 0 ? gIdx : 0;
    }

    return { topics, videoTopicAssignments };
  }

  // Fallback chunking: 4 videos or ~60 minutes total duration per topic block.
  const topics: Omit<Topic, "id" | "createdAt" | "updatedAt">[] = [];
  const videoTopicAssignments: Record<number, number> = {};
  let currentTopicVideos: typeof videos = [];
  let currentDuration = 0;
  let topicIndex = 1;

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    if (
      currentTopicVideos.length > 0 &&
      (currentTopicVideos.length >= 4 || currentDuration + video.duration > 3600)
    ) {
      const topicName = `Topic Block ${topicIndex}`;
      topics.push({
        playlistId: "",
        name: topicName,
        sequenceOrder: topicIndex,
        description: `Includes videos ${currentTopicVideos[0].sequenceOrder} to ${currentTopicVideos[currentTopicVideos.length - 1].sequenceOrder}`,
      });

      const assignedTopicIdx = topicIndex - 1;
      for (const v of currentTopicVideos) {
        const globalIdx = videos.indexOf(v);
        videoTopicAssignments[globalIdx] = assignedTopicIdx;
      }

      currentTopicVideos = [];
      currentDuration = 0;
      topicIndex++;
    }

    currentTopicVideos.push(video);
    currentDuration += video.duration;
  }

  if (currentTopicVideos.length > 0) {
    const topicName = `Topic Block ${topicIndex}`;
    topics.push({
      playlistId: "",
      name: topicName,
      sequenceOrder: topicIndex,
      description: `Includes videos ${currentTopicVideos[0].sequenceOrder} to ${currentTopicVideos[currentTopicVideos.length - 1].sequenceOrder}`,
    });

    const assignedTopicIdx = topicIndex - 1;
    for (const v of currentTopicVideos) {
      const globalIdx = videos.indexOf(v);
      videoTopicAssignments[globalIdx] = assignedTopicIdx;
    }
  }

  return { topics, videoTopicAssignments };
}

// Helper to batch fetch details from YouTube API in blocks of 50
async function fetchVideoDetails(
  videoIds: string[],
  apiKey: string
): Promise<Record<string, { duration: number }>> {
  const result: Record<string, { duration: number }> = {};
  
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${batch.join(",")}&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      let detail = "";
      try {
        const errJson = await res.json();
        detail = errJson.error?.message || "";
      } catch {}
      throw new Error(`Failed to fetch video details: ${detail || res.statusText || "HTTP " + res.status}`);
    }
    const data = await res.json();
    for (const item of data.items || []) {
      const durationStr = item.contentDetails?.duration || "PT0S";
      result[item.id] = {
        duration: parseISO8601Duration(durationStr),
      };
    }
  }

  return result;
}

// Helper to get all items in a playlist
async function fetchPlaylistItems(
  playlistId: string,
  apiKey: string
): Promise<{ videoId: string; title: string; thumbnailUrl: string; position: number }[]> {
  const items: { videoId: string; title: string; thumbnailUrl: string; position: number }[] = [];
  let nextPageToken = "";

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      let detail = "";
      try {
        const errJson = await res.json();
        detail = errJson.error?.message || "";
      } catch {}
      throw new Error(`Failed to fetch playlist items: ${detail || res.statusText || "HTTP " + res.status}`);
    }
    const data = await res.json();
    for (const item of data.items || []) {
      const videoId = item.contentDetails?.videoId;
      const title = item.snippet?.title || "";
      const thumbnailUrl = item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || "";
      const position = item.snippet?.position ?? items.length;
      if (videoId) {
        items.push({ videoId, title, thumbnailUrl, position });
      }
    }
    nextPageToken = data.nextPageToken || "";
  } while (nextPageToken);

  return items;
}

// Helper to get playlist metadata
async function fetchPlaylistMetadata(
  playlistId: string,
  apiKey: string
): Promise<{ title: string; description: string; thumbnailUrl: string }> {
  const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    let detail = "";
    try {
      const errJson = await res.json();
      detail = errJson.error?.message || "";
    } catch {}
    throw new Error(`Failed to fetch playlist metadata: ${detail || res.statusText || "HTTP " + res.status}`);
  }
  const data = await res.json();
  if (!data.items || data.items.length === 0) {
    throw new Error("Playlist not found");
  }
  const item = data.items[0];
  return {
    title: item.snippet.title,
    description: item.snippet.description || "",
    thumbnailUrl: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || "",
  };
}

/**
 * Main parser entry point. Resolves via real YouTube API requests.
 */
export async function parseYoutubePlaylist(
  urlOrId: string,
  apiKey?: string
): Promise<{
  playlist: Omit<Playlist, "id" | "createdAt" | "updatedAt">;
  videos: Omit<Video, "id" | "createdAt" | "updatedAt" | "completed" | "completedAt">[];
  topics: Omit<Topic, "id" | "createdAt" | "updatedAt">[];
}> {
  const activeApiKey = apiKey || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  if (!activeApiKey) {
    throw new Error("YouTube API Key is required to analyze playlists. Please provide it in the input form.");
  }

  const extractedId = extractPlaylistId(urlOrId);

  // Real YouTube Data API Fetching
  if (!extractedId) {
    throw new Error("Invalid YouTube playlist URL or ID");
  }

  const metadata = await fetchPlaylistMetadata(extractedId, activeApiKey);
  const playlistItems = await fetchPlaylistItems(extractedId, activeApiKey);
  const videoIds = playlistItems.map((item) => item.videoId);
  const videoDetails = await fetchVideoDetails(videoIds, activeApiKey);

  // Build raw video list
  const rawVideos = playlistItems.map((item) => ({
    playlistId: "",
    youtubeVideoId: item.videoId,
    title: item.title,
    duration: videoDetails[item.videoId]?.duration || 0,
    sequenceOrder: item.position + 1,
    thumbnailUrl: item.thumbnailUrl,
  }));

  // Perform intelligence heuristics
  const difficultyLevel = estimateDifficulty(rawVideos);
  const { topics, videoTopicAssignments } = groupVideosIntoTopics(rawVideos);

  // Map videos to their assigned topic parameters (including topicId/topicSequenceOrder for DB client mapping)
  const finalVideos = rawVideos.map((v, idx) => {
    const topicIdx = videoTopicAssignments[idx];
    const matchedTopic = topics[topicIdx];
    return {
      ...v,
      topicId: String(topicIdx), // 0-based string index for local DB client fallback
      topicSequenceOrder: matchedTopic ? matchedTopic.sequenceOrder : 1, // 1-based order for Supabase match
    };
  });

  const finalPlaylist: Omit<Playlist, "id" | "createdAt" | "updatedAt"> = {
    userId: "", // Set by caller
    youtubePlaylistId: extractedId,
    title: metadata.title,
    description: metadata.description,
    thumbnailUrl: metadata.thumbnailUrl,
    totalVideos: finalVideos.length,
    totalDuration: finalVideos.reduce((acc, v) => acc + v.duration, 0),
    difficultyLevel,
  };

  return {
    playlist: finalPlaylist,
    videos: finalVideos as unknown as Omit<Video, "id" | "createdAt" | "updatedAt" | "completed" | "completedAt">[],
    topics,
  };
}
