"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, PenTool, StickyNote, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: number;
}

export function QuickNotesSidebar() {
  const { resolvedTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [initialLoad, setInitialLoad] = React.useState(true);

  // Load notes from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("quick-notes");
    if (saved) {
      try {
        const parsedNotes = JSON.parse(saved);
        // Migrate old notes if needed
        const migratedNotes = parsedNotes.map((note: Note) => ({
          ...note,
          createdAt: note.createdAt || Date.now(),
        }));
        setNotes(migratedNotes);
      } catch (e) {
        console.error("Error parsing quick notes:", e);
        setNotes([]);
      }
    }
    setInitialLoad(false);
  }, []);

  // Save notes to localStorage
  React.useEffect(() => {
    if (!initialLoad) {
      localStorage.setItem("quick-notes", JSON.stringify(notes));
    }
  }, [notes, initialLoad]);

  function addNote() {
    const newNote: Note = {
      id: Math.random().toString(36).slice(2, 10),
      title: "Untitled Note",
      body: "",
      createdAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveId(newNote.id);
  }

  function updateNote(id: string, data: Partial<Note>) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...data } : n))
    );
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeId === id) setActiveId(null);
  }

  const filteredNotes = search
    ? notes.filter((n) => 
        n.title.toLowerCase().includes(search.toLowerCase()) || 
        n.body.toLowerCase().includes(search.toLowerCase())
      )
    : notes;

  const activeNote = notes.find((n) => n.id === activeId) || null;

  const sidebarVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring" as const, 
        stiffness: 100, 
        damping: 20,
        mass: 1,
        when: "beforeChildren" as const,
        staggerChildren: 0.1
      }
    },
    exit: { 
      x: "100%", 
      opacity: 0,
      transition: { 
        type: "spring" as const, 
        stiffness: 100, 
        damping: 20,
        mass: 0.8
      }
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-[101] bg-primary/90 text-white rounded-full shadow-lg p-3 flex items-center justify-center hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-300"
        style={{ 
          boxShadow: open 
            ? "0 0 0 4px rgba(var(--primary-rgb), 0.3), 0 4px 16px rgba(var(--primary-rgb), 0.5)" 
            : "0 4px 16px rgba(var(--primary-rgb), 0.3)"
        }}
        onClick={() => setOpen((v) => !v)}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
          }
        }}
        whileHover={{ 
          scale: 1.12,
          transition: { 
            type: "spring", 
            stiffness: 400, 
            damping: 10 
          }
        }}
        whileTap={{ scale: 0.94 }}
        aria-label={open ? "Close Quick Notes" : "Open Quick Notes"}
      >
        {open ? (
          <X className="w-5 h-5" />
        ) : (
          <PenTool className="w-5 h-5" />
        )}
      </motion.button>
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {open && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-[99]"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            
            <motion.aside
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full max-h-screen w-full sm:w-96 max-w-full z-[100] bg-background/95 dark:bg-neutral-900/95 shadow-2xl border-l border-primary/20 backdrop-blur-2xl flex flex-col overflow-hidden"
              style={{ 
                boxShadow: resolvedTheme === 'dark' 
                  ? "0 8px 32px 0 rgba(0,0,0,0.5), -4px 0 24px 0 rgba(var(--primary-rgb), 0.15)" 
                  : "0 8px 32px 0 rgba(33,150,243,0.18), -4px 0 24px 0 rgba(var(--primary-rgb), 0.1)"
              }}
            >
            {/* Header */}
            <motion.div 
              className="flex items-center gap-2 px-6 py-4 border-b border-primary/10 pt-6 sm:pt-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <StickyNote className="w-5 h-5 text-primary" />
              <span className="font-semibold text-lg">Quick Notes</span>
              <div className="relative flex-1 mx-2">
                <Search className="w-4 h-4 text-muted-foreground absolute left-2 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full bg-background/50 dark:bg-neutral-800/50 outline-none text-base px-8 py-1.5 rounded-md border border-primary/10 focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                className="ml-2 text-primary hover:text-primary/80 transition-colors p-1.5 rounded-md hover:bg-primary/10"
                onClick={addNote}
                title="Add Note"
              >
                <Plus className="w-5 h-5" />
              </button>
            </motion.div>
            {/* Notes List */}
            <div className="flex-1 flex overflow-hidden">
              <motion.div 
                className="w-40 min-w-[120px] max-w-[180px] border-r border-primary/10 overflow-y-auto py-2 bg-background/50 dark:bg-neutral-800/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {filteredNotes.length === 0 ? (
                  <div className="text-xs text-muted-foreground px-4 py-8 text-center">
                    {search ? "No matching notes" : "No notes yet"}
                  </div>
                ) : (
                  <ul className="space-y-1 px-2">
                    {filteredNotes.map((note) => (
                      <motion.li 
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        layout
                      >
                        <button
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-primary/10",
                            activeId === note.id 
                              ? "bg-primary/20 text-primary shadow-[0_0_8px_0_rgba(var(--primary-rgb),0.2)]" 
                              : "hover:shadow-[0_0_8px_0_rgba(var(--primary-rgb),0.1)]"
                          )}
                          onClick={() => setActiveId(note.id)}
                        >
                          <div className="truncate text-sm font-semibold">{note.title || "Untitled Note"}</div>
                          <div className="truncate text-xs text-muted-foreground mt-0.5">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </div>
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.div>
              {/* Note Editor */}
              <motion.div 
                className="flex-1 flex flex-col h-full overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {activeNote ? (
                  <div className="flex flex-col h-full p-4 gap-2 overflow-auto">
                    <input
                      className="w-full bg-transparent text-lg font-bold px-3 py-2 rounded-md border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all mb-2"
                      value={activeNote.title}
                      onChange={e => updateNote(activeNote.id, { title: e.target.value })}
                      placeholder="Note title"
                    />
                    <textarea
                      className="flex-1 w-full min-h-[200px] bg-transparent px-3 py-2 rounded-md border border-primary/10 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      value={activeNote.body}
                      onChange={e => updateNote(activeNote.id, { body: e.target.value })}
                      placeholder="Write your quick note here..."
                      style={{ minHeight: 200 }}
                    />
                    <div className="flex justify-between items-center mt-2 px-1">
                      <button
                        className="text-xs text-red-500 hover:text-red-600 transition-colors hover:underline py-1 px-2 rounded-md hover:bg-red-500/10"
                        onClick={() => deleteNote(activeNote.id)}
                      >
                        Delete Note
                      </button>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">Auto-saved</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-sm p-6 text-center">
                    <BookOpen className="w-12 h-12 text-primary/30 mb-3" />
                    <p className="mb-1">Select a note to view or edit</p>
                    <p className="text-xs">or</p>
                    <button
                      onClick={addNote}
                      className="mt-3 text-primary hover:text-primary/80 border border-primary/20 hover:border-primary/40 rounded-md px-3 py-1.5 text-sm transition-all duration-200 hover:shadow hover:bg-primary/5"
                    >
                      Create a new note
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* Footer with close button */}
            <motion.div 
              className="p-3 border-t border-primary/10 flex justify-end"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-1.5 rounded-md text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.aside>
        </>
        )}
      </AnimatePresence>
    </>
  );
}
