import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remember | MindAxis",
  description: "Review, memorize, and master concepts with simple, effective flashcards.",
  keywords: "flashcards, memorize, revision, study, planner, students, learning",
  openGraph: {
    title: "Remember | MindAxis",
    description: "Review, memorize, and master concepts with simple, effective flashcards.",
    url: "https://mindaxis.app/remember",
    siteName: "MindAxis",
    images: [
      {
        url: "/book.svg",
        width: 1200,
        height: 630,
        alt: "Remember Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};
