import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  deckId: string;
  nextReview: string; // ISO date
  interval: number; // days until next review
  ease: number; // 1=hard, 2=medium, 3=easy
};

export type Deck = {
  id: string;
  name: string;
};

interface FlashcardsStore {
  decks: Deck[];
  cards: Flashcard[];
  addDeck: (name: string) => void;
  deleteDeck: (id: string) => void;
  addCard: (deckId: string, front: string, back: string) => void;
  updateCard: (id: string, updates: Partial<Flashcard>) => void;
  deleteCard: (id: string) => void;
  reviewCard: (id: string, rating: 1 | 2 | 3) => void;
}

function getNextInterval(current: number, rating: 1 | 2 | 3) {
  // Simple SM-2 inspired: hard=1d, medium=2x, easy=2.5x
  if (rating === 1) return 1;
  if (rating === 2) return Math.max(2, current * 2);
  return Math.max(3, Math.floor(current * 2.5));
}

export const useFlashcardsStore = create<FlashcardsStore>()(
  persist(
    (set, get) => ({
      decks: [],
      cards: [],
      addDeck: (name) => set((state) => ({
        decks: [...state.decks, { id: uuidv4(), name }],
      })),
      deleteDeck: (id) => set((state) => ({
        decks: state.decks.filter((d) => d.id !== id),
        cards: state.cards.filter((c) => c.deckId !== id),
      })),
      addCard: (deckId, front, back) => set((state) => ({
        cards: [
          ...state.cards,
          {
            id: uuidv4(),
            front,
            back,
            deckId,
            nextReview: new Date().toISOString(),
            interval: 1,
            ease: 2,
          },
        ],
      })),
      updateCard: (id, updates) => set((state) => ({
        cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      })),
      deleteCard: (id) => set((state) => ({
        cards: state.cards.filter((c) => c.id !== id),
      })),
      reviewCard: (id, rating) => set((state) => {
        const now = new Date();
        return {
          cards: state.cards.map((c) => {
            if (c.id !== id) return c;
            const newInterval = getNextInterval(c.interval, rating);
            const nextReview = new Date(now.getTime() + newInterval * 86400000).toISOString();
            return {
              ...c,
              interval: newInterval,
              ease: rating,
              nextReview,
            };
          }),
        };
      }),
    }),
    { name: 'flashcards-storage' }
  )
);
