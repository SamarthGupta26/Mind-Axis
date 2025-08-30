"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlashcardsStore } from "@/store/flashcards-store";
import { Button } from "@/components/ui/button";

export function Flashcards() {
  const [cramActive, setCramActive] = useState(false);
  const { decks, cards, addDeck, deleteDeck, addCard, deleteCard, reviewCard } = useFlashcardsStore();
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [deckMenuOpen, setDeckMenuOpen] = useState(false);
  const [showAddDeck, setShowAddDeck] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [showAddCard, setShowAddCard] = useState(false);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Filter cards for selected deck and due for review
  const dueCards = cards.filter(
    (c) => c.deckId === selectedDeck && new Date(c.nextReview) <= new Date()
  );

  // Deck selection UI
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 items-center mb-4">
        {decks.map((deck) => (
          <Button
            key={deck.id}
            variant={selectedDeck === deck.id && deckMenuOpen ? "default" : "outline"}
            onClick={() => {
              if (selectedDeck === deck.id && deckMenuOpen) {
                setDeckMenuOpen(false);
                setSelectedDeck(null);
              } else {
                setSelectedDeck(deck.id);
                setDeckMenuOpen(true);
              }
            }}
            className="rounded-full px-4 interactive-glow"
          >
            {deck.name}
          </Button>
        ))}
        <Button variant="ghost" size="sm" onClick={() => setShowAddDeck(true)}>
          + New Deck
        </Button>
      </div>
      <AnimatePresence>
        {showAddDeck && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="liquid-card p-4 rounded-xl shadow-lg mb-4"
          >
            <input
              type="text"
              value={newDeckName}
              onChange={e => setNewDeckName(e.target.value)}
              placeholder="Deck name"
              className="input bg-background/50 px-3 py-2 rounded-md w-64 mb-2"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => { addDeck(newDeckName); setNewDeckName(""); setShowAddDeck(false); }}>
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddDeck(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  {selectedDeck && deckMenuOpen && decks.some(d => d.id === selectedDeck) && (
        <div className="space-y-4">
          <div className="flex gap-2 mb-2">
            <Button size="sm" onClick={() => setShowAddCard(true)}>
              + Add Card
            </Button>
            <Button size="sm" variant="outline" onClick={() => { deleteDeck(selectedDeck); setSelectedDeck(null); }}>
              Delete Deck
            </Button>
          </div>
          <AnimatePresence>
            {showAddCard && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="liquid-card p-4 rounded-xl shadow-lg mb-4"
              >
                <input
                  type="text"
                  value={newFront}
                  onChange={e => setNewFront(e.target.value)}
                  placeholder="Front (Question)"
                  className="input bg-background/50 px-3 py-2 rounded-md w-64 mb-2"
                />
                <input
                  type="text"
                  value={newBack}
                  onChange={e => setNewBack(e.target.value)}
                  placeholder="Back (Answer)"
                  className="input bg-background/50 px-3 py-2 rounded-md w-64 mb-2"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => { addCard(selectedDeck, newFront, newBack); setNewFront(""); setNewBack(""); setShowAddCard(false); }}>
                    Add
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddCard(false)}>
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Review UI */}
          {dueCards.length > 0 ? (
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-80 h-56">
                <motion.div
                  className="liquid-card w-full h-full rounded-2xl shadow-2xl flex items-center justify-center cursor-pointer select-none relative border-2 border-primary/30"
                  onClick={() => setShowAnswer(a => !a)}
                  initial={false}
                  animate={{ background: showAnswer ? "rgba(34,197,94,0.08)" : "rgba(59,130,246,0.08)" }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    {!showAnswer ? (
                      <motion.div
                        key="question"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center justify-center w-full h-full text-xl font-semibold px-6 text-center"
                      >
                        <span className="mb-2 text-primary/80">Question</span>
                        {dueCards[reviewIndex]?.front}
                        <span className="mt-4 text-xs text-muted-foreground">Click to reveal answer</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="answer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center justify-center w-full h-full text-lg px-6 text-center"
                      >
                        <span className="mb-2 text-green-600">Answer</span>
                        {dueCards[reviewIndex]?.back}
                        <span className="mt-4 text-xs text-muted-foreground">Click to go back</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              <div className="flex gap-2 mt-4 justify-center">
                <Button size="sm" variant="outline" onClick={() => { reviewCard(dueCards[reviewIndex].id, 1); setShowAnswer(false); setReviewIndex(i => (i + 1) % dueCards.length); }}>
                  Hard
                </Button>
                <Button size="sm" variant="outline" onClick={() => { reviewCard(dueCards[reviewIndex].id, 2); setShowAnswer(false); setReviewIndex(i => (i + 1) % dueCards.length); }}>
                  Medium
                </Button>
                <Button size="sm" variant="default" onClick={() => { reviewCard(dueCards[reviewIndex].id, 3); setShowAnswer(false); setReviewIndex(i => (i + 1) % dueCards.length); }}>
                  Easy
                </Button>
              </div>
              <div className="flex justify-center mt-2">
                <Button size="sm" variant="ghost" onClick={() => deleteCard(dueCards[reviewIndex].id)}>
                  Delete Card
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8 liquid-card rounded-xl shadow-lg">
              No cards due for review. Add cards or check back later!
            </div>
          )}
        </div>
      )}

      {/* Cramming Section */}
      <div className="mt-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className="text-3xl font-bold text-center mb-6 text-black dark:text-white"
        >
          Cramming
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 16 }}
          className="liquid-card p-6 rounded-xl shadow-lg mx-auto max-w-xl mb-6 text-center"
          style={{ background: 'rgba(59,130,246,0.07)' }}
        >
          <div className="text-lg font-semibold mb-2">How to use Cramming:</div>
          <div className="text-base text-muted-foreground mb-2">Add questions and answers, then rate your recall:</div>
          <div className="flex justify-center gap-2 mb-2 flex-wrap">
            <span className="font-semibold px-3 py-1 rounded-md" style={{ background: '#ef4444', color: '#fff' }}>Red</span>
            <span className="font-semibold px-3 py-1 rounded-md" style={{ background: '#facc15', color: '#fff' }}>Yellow</span>
            <span className="font-semibold px-3 py-1 rounded-md" style={{ background: '#22c55e', color: '#fff' }}>Green</span>
          </div>
          <div className="text-base text-muted-foreground">Red = don’t know, Yellow = almost, Green = know it!<br />When all rows are green, you’re ready <span className="inline-block align-middle">✅</span></div>
        </motion.div>
        {!cramActive ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 16 }}
            className="flex justify-center"
          >
            <Button size="lg" variant="default" onClick={() => setCramActive(true)} className="rounded-xl px-8 py-3 text-base font-semibold">Start Cramming</Button>
          </motion.div>
        ) : (
          <CrammingSheet onAllGreen={() => { setCramActive(false); }} />
        )}
      </div>
    </div>
  );
}

// --- Cramming Section ---
function getInitialCramData() {
  return [
    { id: 1, question: "What is the capital of France?", answer: "Paris", rating: "red", revealed: false },
    { id: 2, question: "What is 2 + 2?", answer: "4", rating: "red", revealed: false },
    { id: 3, question: "Who wrote Hamlet?", answer: "William Shakespeare", rating: "red", revealed: false },
  ];
}

interface CrammingSheetProps {
  onAllGreen: () => void;
}

function CrammingSheet({ onAllGreen }: CrammingSheetProps) {
  const [rows, setRows] = useState(getInitialCramData());

  function reveal(id: number) {
    setRows(rows => rows.map(r => r.id === id ? { ...r, revealed: true } : r));
  }
  function setRating(id: number, rating: string) {
    setRows(rows => rows.map(r => r.id === id ? { ...r, rating, revealed: false } : r));
  }
  function addRow() {
    setRows(rows => [...rows, { id: Date.now(), question: "", answer: "", rating: "red", revealed: false }]);
  }
  function updateRow(id: number, field: string, value: string) {
    setRows(rows => rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  }
  useEffect(() => {
    if (rows.length > 0 && rows.every(r => r.rating === "green")) {
      onAllGreen();
    }
  }, [rows, onAllGreen]);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 16 }}
      className="mt-4"
    >
      <div className="overflow-x-auto">
        <div className="w-full max-w-3xl mx-auto">
          {rows.map(row => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 80, damping: 16 }}
              className="flex flex-col md:flex-row items-center gap-2 md:gap-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl mb-6 px-6 py-5 relative liquid-morph"
              style={{
                boxShadow:
                  '0 2px 32px 0 rgba(33,150,243,0.13), 0 0 0 0px ' +
                  (row.rating === 'green' ? '#22c55e' : row.rating === 'yellow' ? '#facc15' : row.rating === 'red' ? '#ef4444' : 'rgba(33,150,243,0.13)'),
                overflow: 'visible',
                position: 'relative',
              }}
            >
              {/* Blue emitting glow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 0.18, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="absolute inset-0 z-0 rounded-2xl pointer-events-none"
                style={{
                  background:
                    'radial-gradient(120% 60% at 50% 0%, rgba(33,150,243,0.13) 0%, transparent 100%)',
                  filter: 'blur(12px)',
                }}
              />
              <div className="flex-1 w-full z-10">
                <textarea
                  value={row.question}
                  onChange={e => updateRow(row.id, "question", e.target.value)}
                  className="bg-background/50 px-4 py-3 rounded-md w-full text-base font-medium focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all min-w-0 resize-y"
                  placeholder="Question"
                  rows={1}
                  style={{ minWidth: 0, minHeight: '44px', maxHeight: '180px', overflow: 'auto' }}
                />
              </div>
              <div className="flex-1 w-full z-10">
                {!row.revealed ? (
                  <Button size="lg" variant="outline" onClick={() => reveal(row.id)} className="rounded-xl px-6 py-3 font-semibold text-base transition-all duration-200 hover:scale-105 hover:shadow-lg">Reveal</Button>
                ) : (
                  <textarea
                    value={row.answer}
                    onChange={e => updateRow(row.id, "answer", e.target.value)}
                    className="bg-background/50 px-4 py-3 rounded-md w-full text-base font-medium focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all min-w-0 resize-y"
                    placeholder="Answer"
                    rows={1}
                    style={{ minWidth: 0, minHeight: '44px', maxHeight: '180px', overflow: 'auto' }}
                  />
                )}
              </div>
              <div className="flex gap-2 justify-center z-10">
                <Button
                  size="lg"
                  className="rounded-xl px-6 py-3 font-semibold text-base transition-all duration-200 shadow-md hover:scale-105 hover:shadow-lg"
                  style={{ background: row.rating === "red" ? "#ef4444" : "#fff", color: row.rating === "red" ? "#fff" : "#ef4444" }}
                  onClick={() => setRating(row.id, "red")}
                >
                  Red
                </Button>
                <Button
                  size="lg"
                  className="rounded-xl px-6 py-3 font-semibold text-base transition-all duration-200 shadow-md hover:scale-105 hover:shadow-lg"
                  style={{ background: row.rating === "yellow" ? "#facc15" : "#fff", color: row.rating === "yellow" ? "#fff" : "#facc15" }}
                  onClick={() => setRating(row.id, "yellow")}
                >
                  Yellow
                </Button>
                <Button
                  size="lg"
                  className="rounded-xl px-6 py-3 font-semibold text-base transition-all duration-200 shadow-md hover:scale-105 hover:shadow-lg"
                  style={{ background: row.rating === "green" ? "#22c55e" : "#fff", color: row.rating === "green" ? "#fff" : "#22c55e" }}
                  onClick={() => setRating(row.id, "green")}
                >
                  Green
                </Button>
              </div>
            </motion.div>
          ))}
          <div className="flex justify-center mt-2 mb-8">
            <Button size="lg" variant="default" onClick={addRow} className="rounded-xl px-8 py-3 font-semibold text-base">+ Add Row</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
