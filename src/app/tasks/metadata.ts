import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks | MindAxis",
  description: "Your personal task manager. Stay organized, focused, and achieve your goals one task at a time.",
  keywords: "tasks, todo, productivity, study, planner, students, focus, goals",
  openGraph: {
    title: "Tasks | MindAxis",
    description: "Your personal task manager. Stay organized, focused, and achieve your goals one task at a time.",
    url: "https://mindaxis.app/tasks",
    siteName: "MindAxis",
    images: [
      {
        url: "/window.svg",
        width: 1200,
        height: 630,
        alt: "Tasks Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};
