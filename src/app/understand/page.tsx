"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Geist } from "next/font/google";
import { FloatingPanels } from "@/components/ui/floating-panels";
import { GridPattern } from "@/components/ui/grid-pattern";
import { PageTransition } from "@/components/ui/page-transition";
import { Book, Info } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { useRecorder } from "@/hooks/use-recorder";
import { useTaskStore } from "@/store/task-store";

// Set page title
if (typeof document !== 'undefined') {
  document.title = 'Understand - Mind Axis';
}

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export default function UnderstandPage() {
  const addTask = useTaskStore((state) => state.addTask);
  interface Note {
    id: string;
    title: string;
    content: string;
    created: number;
  }

  function getNotes(): Note[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("understand-notes") || "[]");
    } catch {
      return [];
    }
  }

  function saveNotes(notes: Note[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem("understand-notes", JSON.stringify(notes));
    }
  }

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  function handleAddOrEditNote(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    if (editingId) {
      setNotes((notes: Note[]) => notes.map((n: Note) => n.id === editingId ? { ...n, title, content } : n));
      setEditingId(null);
    } else {
      setNotes((notes: Note[]) => [
        ...notes,
        { id: crypto.randomUUID(), title, content, created: Date.now() }
      ]);
    }
    setTitle("");
    setContent("");
    setShowForm(false);
  }

  function handleEdit(note: Note) {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    setNotes((notes: Note[]) => notes.filter((n: Note) => n.id !== id));
  }

  function handleNew() {
    setTitle("");
    setContent("");
    setEditingId(null);
    setShowForm(true);
  }

  // Search only on headings
  const filteredNotes = search.trim()
    ? notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()))
    : notes;
  // Show only 3 most recent notes if not searching
  const recentNotes = filteredNotes.slice(-3).reverse();

  // Template for notes
  const templateTitle = "Topic / Subject (e.g. Metal Reactivity Series)";
  const templateContent = `Cornell Notes Template:\nCue Column:\n- Key terms, questions, prompts\n\nNotes Column:\n- Main notes, explanations, diagrams\n\nSummary:\n- Summarize the main ideas in your own words`;

  // Feynman spaced repetition logic
  const FEYNMAN_INTERVALS = [2, 7, 30]; // days
  type FeynmanTopic = {
    subject: string;
    chapter: string;
    started: number;
    completed: number;
    next: Date | null;
  };
  function getNextInterval(date: number, completed: number): Date | null {
    if (completed >= FEYNMAN_INTERVALS.length) return null;
    return new Date(date + FEYNMAN_INTERVALS[completed] * 24 * 60 * 60 * 1000);
  }
  function getFeynmanTopics(): FeynmanTopic[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("feynman-topics");
      if (!raw) return [];
      const arr = JSON.parse(raw);
      // Convert next to Date object
      return arr.map((t: FeynmanTopic) => ({ ...t, next: t.next ? new Date(t.next) : null }));
    } catch {
      return [];
    }
  }
  function saveFeynmanTopics(topics: FeynmanTopic[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem("feynman-topics", JSON.stringify(topics));
    }
  }
  const [feynmanTopics, setFeynmanTopics] = useState<FeynmanTopic[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) {
      setFeynmanTopics(getFeynmanTopics());
    }
  }, [mounted]);
  useEffect(() => {
    if (mounted) {
      saveFeynmanTopics(feynmanTopics);
    }
  }, [feynmanTopics, mounted]);
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [readyToRecord, setReadyToRecord] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const recorder = useRecorder();
  const [showGuide, setShowGuide] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStartRecording() {
    setError(null);
    setRating(null);
    if (!subject.trim() || !chapter.trim()) {
      setError("Please enter both subject and chapter before recording.");
      return;
    }
    if (!readyToRecord) {
      setReadyToRecord(true);
      setError("Click again to start recording. This prevents accidental recording.");
      return;
    }
    if (!recorder.hasPermission || !recorder.mediaRecorder) {
      await recorder.requestPermission();
      // Wait for mediaRecorder to be set, then start recording automatically
      const waitForRecorder = () => {
        if (recorder.hasPermission && recorder.mediaRecorder) {
          recorder.startRecording();
          setIsRecording(true);
        } else if (recorder.error) {
          setError(recorder.error);
        } else {
          setTimeout(waitForRecorder, 50);
        }
      };
      waitForRecorder();
    } else {
      recorder.startRecording();
      setIsRecording(true);
    }
    setReadyToRecord(false);
  }
  function handleStopRecording() {
    recorder.stopRecording();
    setIsRecording(false);
    setRating(null);
    // Ensure mic tracks are stopped
    if (recorder.mediaRecorder && recorder.mediaRecorder.stream) {
      recorder.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }
  function handleSaveExplanation() {
    if (!subject.trim() || !chapter.trim() || rating == null) return;
    if (rating < 8) {
      recorder.resetRecording();
      setRating(null);
      setError("Try again and rate yourself honestly!");
      // Ensure mic tracks are stopped
      if (recorder.mediaRecorder && recorder.mediaRecorder.stream) {
        recorder.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
      return;
    }
    // Save topic with next interval
    const now = Date.now();
    const nextInterval = getNextInterval(now, 1);
    setFeynmanTopics(topics => [
      ...topics,
      {
        subject,
        chapter,
        started: now,
        completed: 1,
        next: nextInterval,
      },
    ]);
    // Save as global task for interval-based display
    addTask({
      title: `Feynman: ${subject} - ${chapter}`,
      description: `Spaced repetition interval: ${nextInterval ? nextInterval.toLocaleDateString() : "Done"}`,
      completed: false,
      priority: "high",
      category: subject,
    });
    recorder.resetRecording();
    setRating(null);
    setSubject("");
    setChapter("");
    setError("");
    // Ensure mic tracks are stopped
    if (recorder.mediaRecorder && recorder.mediaRecorder.stream) {
      recorder.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }
  function handleRate(val: number) {
    setRating(val);
  }
  function handleGuide() {
    setShowGuide(v => !v);
  }
  function handleIntervalDone(idx: number) {
    setFeynmanTopics(topics =>
      topics
        .map((t, i) =>
          i === idx
            ? {
                ...t,
                completed: t.completed + 1,
                next: getNextInterval(t.started, t.completed + 1),
              }
            : t
        )
        .filter(t => t.next !== null)
    );
  }

  return (
    <PageTransition>
      <div className={`relative min-h-screen flex flex-col items-center justify-start pt-24 pb-16 px-4 bg-transparent ${geist.variable}`}>
        <FloatingPanels />
        <GridPattern />
        <div className="w-full max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="text-center space-y-4 mb-8"
          >
            <div className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full liquid-card text-primary text-xs sm:text-sm font-medium mb-3">
              <Book className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Knowledge Building</span>
            </div>
            
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 text-center text-black dark:text-white drop-shadow-lg"
              style={{fontFamily: 'var(--font-geist), Inter, sans-serif'}}
            >
              Understanding
            </motion.h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto" style={{fontFamily: 'var(--font-geist), Inter, sans-serif'}}>Capture and organize your thoughts with ease using structured note-taking and spaced repetition.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ type: "spring", stiffness: 80, damping: 16 }}
            className="liquid-card rounded-3xl p-6 sm:p-8 mb-8"
            style={{ fontFamily: 'var(--font-geist), Inter, sans-serif' }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
                className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4"
              >
                <h2 className="text-3xl font-serif font-bold text-black dark:text-white tracking-tight" style={{fontFamily: 'var(--font-geist), Inter, serif'}}>Notes</h2>
                <Button variant="outline" onClick={handleNew} className="ml-2 font-semibold">{editingId ? "Edit" : "Add"} Note</Button>
              </motion.div>
            </div>
            <div className="mb-6">
              <Input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search notes by title or content..."
                className="rounded-xl px-4 py-2 border border-primary/30 focus:ring-primary/40 font-medium"
                style={{fontFamily: 'var(--font-geist), Inter, sans-serif'}}
              />
            </div>
            <AnimatePresence>
              {showForm && (
                <motion.form
                  initial={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(8px)' }}
                  transition={{ type: "spring", stiffness: 80, damping: 16 }}
                  className="mb-6 flex flex-col gap-2 bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 border border-neutral-200 dark:border-neutral-800"
                  style={{ fontFamily: 'var(--font-geist), Inter, sans-serif' }}
                  onSubmit={handleAddOrEditNote}
                >
                  <div className="mb-4 p-4 rounded-lg bg-white dark:bg-neutral-900 border border-primary/30 text-black dark:text-white text-sm whitespace-pre-line">
                    <strong>Cornell Notes Template:</strong>
                    {`\nCue Column:\n- Key terms, questions, prompts\n\nNotes Column:\n- Main notes, explanations, diagrams\n\nSummary:\n- Summarize the main ideas in your own words`}
                  </div>
                  <Label htmlFor="title" className="font-semibold text-black dark:text-white">Cornell Heading</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={templateTitle}
                    className="mb-2 rounded-lg font-medium text-black dark:text-white bg-white dark:bg-neutral-900 border border-primary/30"
                    style={{fontFamily: 'var(--font-geist), Inter, sans-serif'}}
                  />
                  <Label htmlFor="content" className="font-semibold text-black dark:text-white">Cornell Body</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder={templateContent}
                    rows={10}
                    className="mb-2 rounded-lg font-medium text-black dark:text-white bg-white dark:bg-neutral-900 border border-primary/30"
                    style={{fontFamily: 'var(--font-geist), Inter, sans-serif'}}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-primary text-white shadow font-semibold">{editingId ? "Save" : "Add"}</Button>
                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="font-semibold">Cancel</Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
            <div className="space-y-4">
              {recentNotes.length === 0 && <p className="text-muted-foreground text-center">No notes yet. Add your first note!</p>}
              {recentNotes.map(note => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  layout
                  className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-[0_2px_12px_0_rgba(33,150,243,0.08)] flex flex-col gap-2 border border-primary/30 animate-fade-in"
                  style={{fontFamily: 'var(--font-geist), Inter, sans-serif'}}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-black dark:text-white mb-1">{note.title}</h3>
                      <p className="text-xs text-neutral-500 mb-2">{new Date(note.created).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(note)} className="font-semibold">Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(note.id)} className="font-semibold">Delete</Button>
                    </div>
                  </div>
                  <p className="text-base text-black dark:text-white whitespace-pre-line mt-2">{note.content}</p>
                </motion.div>
              ))}
              {search.trim() && filteredNotes.length > 3 && (
                <p className="text-xs text-muted-foreground text-center mt-2">Showing {filteredNotes.length} results for &ldquo;{search}&rdquo;</p>
              )}
            </div>
          </motion.div>
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="mt-12 mb-16 max-w-2xl mx-auto w-full liquid-glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-primary/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className="text-3xl font-bold text-black dark:text-white flex items-center gap-2"
                style={{fontFamily: 'var(--font-geist), Inter, serif'}}
              >
                <Info className="w-8 h-8 text-primary" />
                Feynman Technique
              </motion.h2>
              <Tooltip content="What is this?">
                <Button variant="ghost" size="icon" onClick={handleGuide}>
                  <Info className="w-5 h-5 text-primary" />
                </Button>
              </Tooltip>
            </div>
            {showGuide && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-neutral-900/80 border border-primary/30 text-black dark:text-white text-sm"
              >
                <strong>How it works:</strong> Select a subject and chapter, record your explanation using your mic (safe, permission required only during recording). Rate yourself honestly. If rating is below 8, try again. If rating is 8 or above, the explanation counts and is scheduled for spaced repetition (2, 7, 30 days). Audio is deleted after rating. You can only explain topics on their interval days. After 30 days, the topic is done.
              </motion.div>
            )}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="flex flex-col gap-4 mb-8"
              onSubmit={e => { e.preventDefault(); handleSaveExplanation(); }}
            >
              <div className="flex gap-2">
                <Input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Subject (required)"
                  className="rounded-lg font-medium transition-all duration-200 hover:border-primary focus:border-primary"
                  required
                />
                <Input
                  value={chapter}
                  onChange={e => setChapter(e.target.value)}
                  placeholder="Chapter (required)"
                  className="rounded-lg font-medium transition-all duration-200 hover:border-primary focus:border-primary"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 items-center">
                {!isRecording && recorder.recordingStatus !== 'recording' && !recorder.audioUrl && !recorder.error && (
                  <Button type="button" onClick={handleStartRecording} className="bg-primary text-white rounded-full px-6 py-2 shadow-lg transition-all duration-200 hover:bg-primary/80">
                    Double click to start recording (Mic permission required)
                  </Button>
                )}
                {isRecording && recorder.recordingStatus === 'recording' && (
                  <Button type="button" onClick={handleStopRecording} className="bg-red-500 text-white rounded-full px-6 py-2 shadow-lg transition-all duration-200 hover:bg-red-600">
                    Stop Recording
                  </Button>
                )}
                {recorder.audioUrl && !isRecording && (
                  <audio src={recorder.audioUrl} controls autoPlay className="w-full mb-2 transition-all duration-200 hover:shadow-xl" />
                )}
                {recorder.audioUrl && !isRecording && (
                  <div className="flex gap-2 items-center">
                    <span className="text-sm">Rate your explanation (1-10):</span>
                    {[...Array(10)].map((_, i) => (
                      <Button key={i} type="button" size="sm" variant={rating === i+1 ? "default" : "outline"} onClick={() => handleRate(i+1)} className="transition-all duration-200 hover:bg-primary/20">{i+1}</Button>
                    ))}
                  </div>
                )}
                {error && <span className="text-red-500 text-sm mt-2">{error}</span>}
                {recorder.audioUrl && rating != null && !isRecording && (
                  <Button type="submit" className="bg-black text-white rounded-full px-6 py-2 shadow-lg mt-2 transition-all duration-200 hover:bg-black/80">Save Explanation</Button>
                )}
              </div>
            </motion.form>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="mt-8"
            >
              <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Your Feynman Topics</h3>
              <div className="space-y-4">
                {mounted && feynmanTopics.length === 0 && <p className="text-muted-foreground">No topics yet. Add your first explanation!</p>}
                {/* All topics */}
                {mounted && feynmanTopics.map((topic, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white/80 dark:bg-neutral-900/80 rounded-xl p-4 shadow border border-primary/30 flex flex-col gap-2 transition-all duration-200 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-black dark:text-white">{topic.subject} - {topic.chapter}</span>
                        <span className="ml-2 text-xs text-muted-foreground">Next: {topic.next ? new Date(topic.next).toLocaleDateString() : "Done"}</span>
                      </div>
                      {topic.next && (
                        <Button type="button" size="sm" variant="default" onClick={() => handleIntervalDone(idx)} disabled={Date.now() < topic.next.getTime()} className="transition-all duration-200 hover:bg-primary/20">
                          {Date.now() >= topic.next.getTime() ? "Explain Now" : "Locked"}
                        </Button>
                      )}
                      {!topic.next && (
                        <span className="text-green-600 font-bold">Done</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Interval-due topics section */}
              <h3 className="text-xl font-bold mt-10 mb-4 text-black dark:text-white">Topics Due Today</h3>
              <div className="space-y-4">
                {mounted && feynmanTopics.filter(topic => topic.next && new Date(topic.next).toDateString() === new Date().toDateString()).length === 0 && (
                  <p className="text-muted-foreground">No topics due today.</p>
                )}
                {mounted && feynmanTopics.filter(topic => topic.next && new Date(topic.next).toDateString() === new Date().toDateString()).map((topic, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-blue-50 dark:bg-neutral-900 rounded-xl p-4 shadow border border-primary/30 flex flex-col gap-2 transition-all duration-200 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-black dark:text-white">{topic.subject} - {topic.chapter}</span>
                        <span className="ml-2 text-xs text-muted-foreground">Due Today</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </PageTransition>
  );
}
