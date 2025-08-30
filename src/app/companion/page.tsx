"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { FloatingPanels } from "@/components/ui/floating-panels";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskStore } from "@/store/task-store";
import { Task } from "@/types/task";
import { 
  BookOpen, Brain, Clock, Target, CheckCircle2, TrendingUp, 
  Calendar, BarChart3, Award, Users, Timer, Lightbulb, 
  Play, Pause, RotateCcw, Star, AlertCircle, ArrowRight, Zap,
  Coffee, PlusCircle, Network, Mic,
  HelpCircle, CheckCircle, RotateCw
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

// Set page title
if (typeof document !== 'undefined') {
  document.title = 'Study Companion - Mind Axis';
}

// Study Method Quiz Component
function StudyMethodQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved quiz results
    const savedResults = localStorage.getItem('study-method-quiz');
    if (savedResults) {
      try {
        const results = JSON.parse(savedResults);
        setAnswers(results.answers || []);
        setShowResults(results.completed || false);
      } catch (e) {
        console.error('Failed to load quiz results:', e);
      }
    }
  }, []);

  const questions = [
    {
      id: 1,
      question: "When do you feel most productive?",
      options: [
        "Early morning (6-9 AM)",
        "Late morning (9 AM-12 PM)", 
        "Afternoon (12-5 PM)",
        "Evening/Night (5 PM onwards)"
      ]
    },
    {
      id: 2,
      question: "How do you best absorb new information?",
      options: [
        "Reading and taking detailed notes",
        "Listening to explanations or lectures",
        "Hands-on practice and experimentation",
        "Visual diagrams and mind maps"
      ]
    },
    {
      id: 3,
      question: "What's your preferred study environment?",
      options: [
        "Complete silence",
        "Light background music",
        "Coffee shop or library buzz",
        "With friends or study groups"
      ]
    },
    {
      id: 4,
      question: "How do you prefer to review material?",
      options: [
        "Re-reading notes multiple times",
        "Testing myself with flashcards",
        "Teaching concepts to others",
        "Creating summaries and outlines"
      ]
    },
    {
      id: 5,
      question: "When facing a difficult concept, you:",
      options: [
        "Break it down into smaller parts",
        "Look for real-world examples",
        "Practice similar problems repeatedly",
        "Discuss it with others"
      ]
    },
    {
      id: 6,
      question: "Your ideal study session length is:",
      options: [
        "25-30 minutes with short breaks",
        "45-60 minutes with longer breaks",
        "2-3 hours with minimal breaks",
        "Varies based on the subject"
      ]
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      setShowResults(true);
      // Save results
      localStorage.setItem('study-method-quiz', JSON.stringify({
        answers: newAnswers,
        completed: true,
        completedAt: new Date().toISOString()
      }));
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    localStorage.removeItem('study-method-quiz');
  };

  const getStudyMethodResults = () => {
    if (answers.length === 0) return null;

    // Analyze answers to determine study method
    const visualLearner = answers[1] === 3 || answers[3] === 3;
    const auditoryLearner = answers[1] === 1 || answers[3] === 2;
    const kinestheticLearner = answers[1] === 2 || answers[4] === 2;
    const socialLearner = answers[2] === 3 || answers[4] === 3;
    
    const timePreference = answers[0];
    const sessionPreference = answers[5];

    let primaryMethod = "Balanced Learner";
    let description = "You have a balanced learning style that adapts to different situations.";
    let recommendations = [
      "Use the Pomodoro technique for time management",
      "Combine different learning methods based on the subject",
      "Regular review sessions using spaced repetition"
    ];

    if (visualLearner) {
      primaryMethod = "Visual Learner";
      description = "You learn best through visual aids, diagrams, and organized information.";
      recommendations = [
        "Use mind mapping for complex topics (/understand)",
        "Create colorful flashcards with diagrams (/remember)",
        "Organize study materials with visual hierarchies"
      ];
    } else if (auditoryLearner) {
      primaryMethod = "Auditory Learner";
      description = "You absorb information best through listening and verbal explanation.";
      recommendations = [
        "Use the Feynman Technique - explain concepts aloud (/understand)",
        "Record yourself explaining topics and listen back",
        "Join study groups for discussion (/rooms)"
      ];
    } else if (kinestheticLearner) {
      primaryMethod = "Kinesthetic Learner";
      description = "You learn through hands-on experience and physical activity.";
      recommendations = [
        "Use active recall with physical flashcards (/remember)",
        "Take breaks for movement during study sessions (/focus)",
        "Practice problems rather than just reading theory"
      ];
    } else if (socialLearner) {
      primaryMethod = "Social Learner";
      description = "You thrive in collaborative learning environments.";
      recommendations = [
        "Join study rooms for group sessions (/rooms)",
        "Teach concepts to others to reinforce learning",
        "Form study groups for challenging subjects"
      ];
    }

    // Add time-based recommendations
    const timeRecommendations = [
      "Schedule challenging subjects during your morning peak hours",
      "Use late morning for deep thinking and complex problems", 
      "Afternoon is great for review and practice sessions",
      "Evening sessions work well for light review and group study"
    ];

    // Add session length recommendations
    const sessionRecommendations = [
      "Perfect for Pomodoro technique - use our Focus Timer (/focus)",
      "Medium-length focused sessions with strategic breaks",
      "Extended deep work sessions with minimal interruptions", 
      "Flexible sessions adapted to subject difficulty"
    ];

    return {
      primaryMethod,
      description,
      recommendations,
      timeRecommendation: timeRecommendations[timePreference] || timeRecommendations[0],
      sessionRecommendation: sessionRecommendations[sessionPreference] || sessionRecommendations[0],
      timePreference: ["Morning", "Late Morning", "Afternoon", "Evening"][timePreference] || "Flexible"
    };
  };

  const results = showResults ? getStudyMethodResults() : null;

  if (!mounted) {
    return (
      <div className="liquid-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-primary/10 rounded w-3/4"></div>
          <div className="h-20 bg-primary/5 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="liquid-card p-6"
    >
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <HelpCircle className="text-primary w-5 h-5" />
        Study Method Discovery Quiz
      </h3>

      {!showResults ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-primary/10 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Counter */}
          <div className="text-sm text-muted-foreground text-center">
            Question {currentQuestion + 1} of {questions.length}
          </div>

          {/* Current Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-center">
                {questions[currentQuestion].question}
              </h4>

              <div className="grid gap-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="p-4 text-left rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 interactive-glow"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-primary/30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary/50" />
                      </div>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {results && (
            <>
              {/* Results Header */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">Quiz Complete!</span>
                </div>
                <h4 className="text-2xl font-bold text-primary">{results.primaryMethod}</h4>
                <p className="text-muted-foreground">{results.description}</p>
              </div>

              {/* Time Preference */}
              <div className="liquid-card bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4">
                <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Your Peak Time: {results.timePreference}
                </h5>
                <p className="text-sm text-blue-700 dark:text-blue-300">{results.timeRecommendation}</p>
              </div>

              {/* Session Preference */}
              <div className="liquid-card bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 p-4">
                <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  Optimal Session Style
                </h5>
                <p className="text-sm text-purple-700 dark:text-purple-300">{results.sessionRecommendation}</p>
              </div>

              {/* Personalized Recommendations */}
              <div className="space-y-3">
                <h5 className="font-semibold flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Personalized Study Tips
                </h5>
                <div className="grid gap-2">
                  {results.recommendations.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 liquid-card bg-primary/5 border border-primary/20">
                      <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={resetQuiz} 
                  variant="outline" 
                  className="flex items-center gap-2 interactive-glow"
                >
                  <RotateCw className="w-4 h-4" />
                  Retake Quiz
                </Button>
                <Link href="/focus">
                  <Button className="flex items-center gap-2 interactive-glow">
                    <ArrowRight className="w-4 h-4" />
                    Start Studying
                  </Button>
                </Link>
              </div>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// Study Session Planner
function StudySessionPlanner() {
  const tasks = useTaskStore((state) => state.tasks);
  const [sessions, setSessions] = useState<Array<{
    id: string;
    subject: string;
    duration: number;
    type: 'study' | 'review' | 'practice' | 'break';
    completed: boolean;
    startTime?: Date;
  }>>([]);
  const [newSession, setNewSession] = useState<{subject: string; duration: number; type: 'study' | 'review' | 'practice' | 'break'}>({ subject: '', duration: 25, type: 'study' });
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Auto-suggest subjects from existing tasks
  const suggestedSubjects = React.useMemo(() => {
    const subjects = [...new Set(tasks.map(task => {
      // Extract subject from task title (before first colon or dash)
      const match = task.title.match(/^([^:\-]+)/);
      return match ? match[1].trim() : task.title.split(' ')[0];
    }))];
    return subjects.slice(0, 5); // Limit to 5 suggestions
  }, [tasks]);

  // Auto-suggest optimal session duration based on task complexity
  const getOptimalDuration = (subject: string) => {
    const relatedTasks = tasks.filter(task => 
      task.title.toLowerCase().includes(subject.toLowerCase())
    );
    
    if (relatedTasks.length === 0) return 25;
    
    const highPriorityTasks = relatedTasks.filter(task => task.priority === 'high');
    const avgComplexity = highPriorityTasks.length / relatedTasks.length;
    
    // More high-priority tasks suggest longer focus sessions
    if (avgComplexity > 0.6) return 45;
    if (avgComplexity > 0.3) return 35;
    return 25;
  };

  // Load sessions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('study-sessions');
    if (saved) {
      try {
        setSessions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved sessions:', e);
      }
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem('study-sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            setActiveSession(null);
            // Mark session as completed
            setSessions(prev => prev.map(s => 
              s.id === activeSession ? { ...s, completed: true } : s
            ));
            // Show notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Study Session Complete!', {
                body: 'Time for a break. Great work!',
                icon: '/favicon.ico'
              });
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, activeSession]);

  const addSession = () => {
    if (!newSession.subject.trim()) return;
    
    const session = {
      id: Date.now().toString(),
      ...newSession,
      completed: false,
      startTime: new Date()
    };
    
    setSessions([...sessions, session]);
    setNewSession({ subject: '', duration: 25, type: 'study' });
  };

  const startSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    setActiveSession(sessionId);
    setTimeLeft(session.duration * 60);
    setIsRunning(true);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'study': return <BookOpen className="w-4 h-4" />;
      case 'review': return <RotateCcw className="w-4 h-4" />;
      case 'practice': return <Target className="w-4 h-4" />;
      case 'break': return <Coffee className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getSessionTypeRecommendation = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour <= 10) return 'study';
    if (currentHour >= 14 && currentHour <= 17) return 'review';
    if (currentHour >= 19 && currentHour <= 21) return 'practice';
    return 'study';
  };

  // Auto-update session type based on time of day
  useEffect(() => {
    const recommendedType = getSessionTypeRecommendation();
    setNewSession(prev => ({ ...prev, type: recommendedType as 'study' | 'review' | 'practice' | 'break' }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="liquid-card p-6"
    >
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Timer className="text-primary w-5 h-5" />
        Smart Session Planner
      </h3>

      {/* Active Session Timer */}
      {activeSession && (
        <div className="mb-6 p-4 liquid-card bg-primary/5 border border-primary/20">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{formatTime(timeLeft)}</div>
            <div className="text-sm text-muted-foreground mb-3">
              {sessions.find(s => s.id === activeSession)?.subject}
            </div>
            <div className="flex justify-center gap-2">
              <Button onClick={toggleTimer} size="sm" className="interactive-glow">
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button 
                onClick={() => {
                  setActiveSession(null);
                  setIsRunning(false);
                  setTimeLeft(0);
                }} 
                variant="outline" 
                size="sm"
                className="interactive-glow"
              >
                Stop
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Session */}
      <div className="mb-6 p-3 sm:p-4 liquid-card bg-background/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div className="relative">
            <Input
              placeholder="Subject"
              value={newSession.subject}
              onChange={(e) => {
                const value = e.target.value;
                setNewSession({ 
                  ...newSession, 
                  subject: value,
                  duration: getOptimalDuration(value)
                });
              }}
              className="text-sm"
              list="subject-suggestions"
            />
            <datalist id="subject-suggestions">
              {suggestedSubjects.map((subject, index) => (
                <option key={index} value={subject} />
              ))}
            </datalist>
          </div>
          <Input
            type="number"
            placeholder="Minutes"
            min="1"
            max="120"
            value={newSession.duration}
            onChange={(e) => setNewSession({ ...newSession, duration: Number(e.target.value) })}
            className="text-sm"
          />
          <select
            value={newSession.type}
            onChange={(e) => setNewSession({ ...newSession, type: e.target.value as 'study' | 'review' | 'practice' | 'break' })}
            className="px-3 py-2 rounded-md border border-border bg-background text-sm transition-all duration-300 hover:border-primary/40 focus:border-primary/60"
          >
            <option value="study">Study</option>
            <option value="review">Review</option>
            <option value="practice">Practice</option>
            <option value="break">Break</option>
          </select>
          <Button onClick={addSession} className="flex items-center gap-1 text-sm interactive-glow">
            <PlusCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            Add
          </Button>
        </div>
        {suggestedSubjects.length > 0 && (
          <div className="text-xs text-muted-foreground">
            💡 Suggested subjects: {suggestedSubjects.slice(0, 3).join(', ')}
            {suggestedSubjects.length > 3 && '...'}
          </div>
        )}
      </div>

      {/* Session List */}
      <div className="space-y-2">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Timer className="w-12 h-12 mx-auto mb-3 text-primary/30" />
            <p>No study sessions planned yet.</p>
            <p className="text-sm">Add your first session above!</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 rounded-lg border flex items-center justify-between ${
                session.completed 
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                  : 'bg-background border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                {getSessionIcon(session.type)}
                <div>
                  <div className="font-medium">{session.subject}</div>
                  <div className="text-sm text-muted-foreground">
                    {session.duration} min • {session.type}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {session.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Button
                    onClick={() => startSession(session.id)}
                    size="sm"
                    disabled={activeSession !== null}
                  >
                    Start
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// Study Insights Dashboard
function StudyInsightsDashboard({ tasks }: { tasks: Task[] }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const getStudyInsights = () => {
    if (!mounted) return null;
    
    const totalTasks = tasks.length;
    if (totalTasks === 0) {
      return {
        completedTasks: 0,
        pendingTasks: 0,
        completionRate: 0,
        highPriorityTasks: 0,
        timeInsight: "Start by adding your first task to begin tracking your progress!",
        recommendation: "Create specific, actionable tasks to build momentum and track your learning journey.",
        weeklyInsight: "⚡ Ready to start? Your first task will begin your learning journey.",
        todayTasks: 0,
        recentlyCompleted: 0
      };
    }

    const completed = tasks.filter(task => task.completed);
    const pending = tasks.filter(task => !task.completed);
    const completionRate = (completed.length / totalTasks) * 100;
    const highPriority = pending.filter(task => task.priority === 'high');
    
    // Advanced time-based insights
    const currentHour = new Date().getHours();
    const today = new Date();
    const todayTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate.toDateString() === today.toDateString();
    });
    
    const recentlyCompleted = tasks.filter(task => {
      if (!task.completed) return false;
      const completedTime = new Date(task.updatedAt || task.createdAt);
      const hoursSince = (today.getTime() - completedTime.getTime()) / (1000 * 60 * 60);
      return hoursSince <= 24;
    });

    // Productivity patterns analysis
    const getProductivityPattern = () => {
      if (recentlyCompleted.length === 0) return "No recent completions to analyze";
      
      const completionTimes = recentlyCompleted.map(task => {
        const time = new Date(task.updatedAt || task.createdAt);
        return time.getHours();
      });
      
      const morningCompletions = completionTimes.filter(h => h >= 6 && h <= 12).length;
      const afternoonCompletions = completionTimes.filter(h => h >= 13 && h <= 18).length;
      const eveningCompletions = completionTimes.filter(h => h >= 19 && h <= 23).length;
      
      if (morningCompletions >= afternoonCompletions && morningCompletions >= eveningCompletions) {
        return "You're most productive in the morning! Consider scheduling challenging tasks before noon.";
      } else if (afternoonCompletions >= eveningCompletions) {
        return "Your afternoon focus is strong! Perfect time for complex problem-solving.";
      } else {
        return "You're a night owl! Evening hours seem to be your prime productivity time.";
      }
    };

    // Smart time insights based on current context
    const getSmartTimeInsight = () => {
      const basePatternInsight = getProductivityPattern();
      
      if (todayTasks.length === 0) {
        return `${basePatternInsight} Start today by creating tasks aligned with your productive hours.`;
      }
      
      if (currentHour >= 6 && currentHour <= 9) {
        if (highPriority.length > 0) {
          return `Morning focus time! You have ${highPriority.length} high-priority tasks - perfect time to tackle them.`;
        }
        return "Fresh morning energy - ideal for starting your most challenging work.";
      } else if (currentHour >= 10 && currentHour <= 14) {
        return `Peak cognitive hours! ${basePatternInsight}`;
      } else if (currentHour >= 15 && currentHour <= 18) {
        const todayCompleted = todayTasks.filter(t => t.completed).length;
        if (todayCompleted > 0) {
          return `Great afternoon momentum! You've completed ${todayCompleted} tasks today. Keep the energy going.`;
        }
        return "Afternoon energy dip? Try the Pomodoro technique to maintain focus.";
      } else if (currentHour >= 19 && currentHour <= 22) {
        return basePatternInsight + " Consider lighter review tasks for evening study.";
      } else {
        return "Late night study? Focus on review and avoid starting new challenging topics.";
      }
    };

    // Dynamic recommendations based on performance and context
    const getSmartRecommendation = () => {
      if (completionRate >= 80) {
        if (highPriority.length > 0) {
          return `Excellent progress! Focus on your ${highPriority.length} high-priority tasks to maintain momentum.`;
        }
        return 'Outstanding performance! Consider adding more challenging goals to keep growing.';
      } else if (completionRate >= 60) {
        if (pending.length > 5) {
          return 'Good progress! Break larger tasks into smaller chunks to boost completion rate.';
        }
        return 'Steady progress! Try timeboxing to increase your completion rate.';
      } else if (completionRate >= 40) {
        if (highPriority.length > 2) {
          return 'Focus on high-priority tasks first - complete 1-2 important items before adding new ones.';
        }
        return 'Building momentum! Use the 2-minute rule: if it takes less than 2 minutes, do it now.';
      } else if (completionRate >= 20) {
        return 'Start small! Pick the easiest task on your list and complete it for a quick win.';
      } else {
        if (totalTasks > 10) {
          return 'Task list might be overwhelming. Archive or delete tasks that are no longer relevant.';
        }
        return 'Fresh start! Focus on just one task at a time to build consistent habits.';
      }
    };

    // Weekly goal insights
    const getWeeklyInsight = () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const weeklyCompleted = tasks.filter(task => {
        if (!task.completed) return false;
        const completedDate = new Date(task.updatedAt || task.createdAt);
        return completedDate >= weekAgo;
      }).length;
      
      if (weeklyCompleted >= 7) {
        return "🔥 Hot streak! You're averaging 1+ task completion per day this week.";
      } else if (weeklyCompleted >= 3) {
        return "📈 Solid progress! You're building consistent study habits.";
      } else if (weeklyCompleted >= 1) {
        return "🌱 Starting strong! Focus on building daily completion habits.";
      } else {
        return "⚡ Ready to start? Your first completion this week will build momentum.";
      }
    };

    return {
      completedTasks: completed.length,
      pendingTasks: pending.length,
      completionRate,
      highPriorityTasks: highPriority.length,
      timeInsight: getSmartTimeInsight(),
      recommendation: getSmartRecommendation(),
      weeklyInsight: getWeeklyInsight(),
      todayTasks: todayTasks.length,
      recentlyCompleted: recentlyCompleted.length
    };
  };
  
  const insights = getStudyInsights();
  
  if (!mounted || !insights) {
    return (
      <div className="bg-background/80 backdrop-blur-xl rounded-xl p-6 border border-primary/20 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-primary/10 rounded w-3/4"></div>
          <div className="h-20 bg-primary/5 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="liquid-card p-6"
    >
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BarChart3 className="text-primary w-5 h-5" />
        Smart Study Analytics
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="liquid-card bg-primary/5 p-3 sm:p-4 text-center border border-primary/20">
          <div className="text-xl sm:text-2xl font-bold text-primary">{insights.completedTasks}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="liquid-card bg-primary/5 p-3 sm:p-4 text-center border border-primary/20">
          <div className="text-xl sm:text-2xl font-bold text-primary">{insights.pendingTasks}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="liquid-card bg-primary/5 p-3 sm:p-4 text-center border border-primary/20">
          <div className="text-xl sm:text-2xl font-bold text-primary">{Math.round(insights.completionRate)}%</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Success Rate</div>
        </div>
        <div className="liquid-card bg-primary/5 p-3 sm:p-4 text-center border border-primary/20">
          <div className="text-xl sm:text-2xl font-bold text-primary">{insights.todayTasks}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Today&apos;s Tasks</div>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Weekly streak insight */}
        <div className="flex items-start gap-3 p-4 liquid-card bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200 dark:border-green-800">
          <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <div className="font-medium text-green-800 dark:text-green-200">Weekly Progress</div>
            <div className="text-sm text-green-700 dark:text-green-300">{insights.weeklyInsight}</div>
          </div>
        </div>

        {/* Smart time insight */}
        <div className="flex items-start gap-3 p-4 liquid-card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800">
          <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <div className="font-medium text-blue-800 dark:text-blue-200">Smart Time Insight</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">{insights.timeInsight}</div>
          </div>
        </div>
        
        {/* Personalized recommendation */}
        <div className="flex items-start gap-3 p-4 liquid-card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800">
          <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <div className="font-medium text-purple-800 dark:text-purple-200">Personalized Tip</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">{insights.recommendation}</div>
          </div>
        </div>
        
        {/* Priority alert */}
        {insights.highPriorityTasks > 0 && (
          <div className="flex items-start gap-3 p-4 liquid-card bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <div className="font-medium text-red-800 dark:text-red-200">Priority Alert</div>
              <div className="text-sm text-red-700 dark:text-red-300">
                You have {insights.highPriorityTasks} high-priority task{insights.highPriorityTasks !== 1 ? 's' : ''} waiting. 
                Consider tackling {insights.highPriorityTasks === 1 ? 'it' : 'them'} during your most productive hours.
              </div>
            </div>
          </div>
        )}

        {/* Recent activity */}
        {insights.recentlyCompleted > 0 && (
          <div className="flex items-start gap-3 p-4 liquid-card bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-emerald-200 dark:border-emerald-800">
            <Award className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div>
              <div className="font-medium text-emerald-800 dark:text-emerald-200">Recent Achievement</div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300">
                Great momentum! You&apos;ve completed {insights.recentlyCompleted} task{insights.recentlyCompleted !== 1 ? 's' : ''} in the last 24 hours.
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Learning Techniques Guide
function LearningTechniquesGuide() {
  const tasks = useTaskStore((state) => state.tasks);
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  
  // Smart technique recommendations based on user context
  const getPersonalizedTechniques = () => {
    const currentHour = new Date().getHours();
    const taskCount = tasks.length;
    const highPriorityCount = tasks.filter(task => task.priority === 'high').length;
    const completedCount = tasks.filter(task => task.completed).length;
    const completionRate = taskCount > 0 ? (completedCount / taskCount) * 100 : 0;
    
    // Analyze task types for smart recommendations
    const taskTypes = tasks.reduce((acc, task) => {
      const title = task.title.toLowerCase();
      if (title.includes('math') || title.includes('calculation') || title.includes('formula')) acc.math++;
      if (title.includes('essay') || title.includes('write') || title.includes('report')) acc.writing++;
      if (title.includes('read') || title.includes('study') || title.includes('chapter')) acc.reading++;
      if (title.includes('code') || title.includes('program') || title.includes('algorithm')) acc.coding++;
      if (title.includes('test') || title.includes('exam') || title.includes('quiz')) acc.exam++;
      return acc;
    }, { math: 0, writing: 0, reading: 0, coding: 0, exam: 0 });

    const baseTechniques = [
      {
        id: 'pomodoro',
        name: 'Pomodoro Technique',
        description: 'Work in 25-minute focused intervals with 5-minute breaks',
        icon: Timer,
        priority: 0, // Default priority
        steps: [
          'Choose a task to work on',
          'Set timer for 25 minutes',
          'Work with full focus until timer rings',
          'Take a 5-minute break',
          'Repeat 3-4 times, then take longer break'
        ],
        benefits: ['Improved focus', 'Better time management', 'Reduced mental fatigue'],
        link: '/focus',
        personalizedTip: taskCount > 5 
          ? `Perfect for your ${taskCount} tasks! Break them into manageable chunks.`
          : 'Great for maintaining consistent progress on your current tasks.',
        when: 'Best used when you have multiple tasks or need better time management'
      },
      {
        id: 'activerecall',
        name: 'Active Recall',
        description: 'Test yourself frequently instead of passive reading',
        icon: Brain,
        priority: 0,
        steps: [
          'Read or study material once',
          'Close books and try to recall key points',
          'Write down what you remember',
          'Check against original material',
          'Focus on areas you missed'
        ],
        benefits: ['Stronger memory retention', 'Better understanding', 'Identifies knowledge gaps'],
        link: '/remember',
        personalizedTip: taskTypes.exam > 0 
          ? 'Essential for your exam preparation! Start testing yourself now.'
          : 'Perfect for building long-term retention of your study material.',
        when: 'Ideal for memorization and exam preparation'
      },
      {
        id: 'spaced',
        name: 'Spaced Repetition',
        description: 'Review material at increasing intervals over time',
        icon: Calendar,
        priority: 0,
        steps: [
          'Study new material',
          'Review after 1 day',
          'Review after 3 days',
          'Review after 1 week',
          'Review after 2 weeks, then monthly'
        ],
        benefits: ['Long-term retention', 'Efficient use of time', 'Combats forgetting curve'],
        link: '/remember',
        personalizedTip: taskTypes.reading > 0 
          ? 'Perfect for your reading tasks! Set up review schedules for key chapters.'
          : 'Excellent for maintaining knowledge over time. Set reminders for review sessions.',
        when: 'Best for long-term learning and retention'
      },
      {
        id: 'feynman',
        name: 'Feynman Technique',
        description: 'Explain concepts in simple terms to test understanding',
        icon: Users,
        priority: 0,
        steps: [
          'Choose a concept to learn',
          'Explain it in simple terms',
          'Identify gaps in explanation',
          'Go back to source material',
          'Simplify and create analogies'
        ],
        benefits: ['Deep understanding', 'Clear thinking', 'Better communication'],
        link: '/understand',
        personalizedTip: taskTypes.math > 0 || taskTypes.coding > 0 
          ? 'Ideal for your technical subjects! Try explaining concepts out loud.'
          : 'Great for ensuring you truly understand complex topics.',
        when: 'Perfect for complex topics that require deep understanding'
      },
      {
        id: 'mindmapping',
        name: 'Mind Mapping',
        description: 'Visually organize information and connections',
        icon: Network,
        priority: 0,
        steps: [
          'Start with central topic in middle',
          'Add main branches for key concepts',
          'Use colors and symbols',
          'Connect related ideas',
          'Review and refine structure'
        ],
        benefits: ['Visual learning', 'Better organization', 'Creative connections'],
        link: '/understand',
        personalizedTip: taskTypes.writing > 0 
          ? 'Perfect for planning your writing assignments! Start with main arguments.'
          : 'Excellent for seeing connections between different concepts.',
        when: 'Great for creative thinking and organizing complex information'
      },
      {
        id: 'sq3r',
        name: 'SQ3R Method',
        description: 'Survey, Question, Read, Recite, Review',
        icon: BookOpen,
        priority: 0,
        steps: [
          'Survey: Skim headings and summaries',
          'Question: Create questions about content',
          'Read: Read actively for answers',
          'Recite: Summarize in your own words',
          'Review: Go over material again'
        ],
        benefits: ['Better reading comprehension', 'Active engagement', 'Structured approach'],
        link: '/understand',
        personalizedTip: taskTypes.reading > 0 
          ? 'Specifically designed for your reading tasks! Turn titles into questions.'
          : 'Excellent for textbook study and comprehension.',
        when: 'Ideal for reading heavy subjects and textbook study'
      }
    ];

    // Calculate priority based on context
    baseTechniques.forEach(technique => {
      let priority = 0;
      
      // Time-based recommendations
      if (currentHour >= 6 && currentHour <= 9) {
        if (technique.id === 'activerecall') priority += 3; // Morning recall is powerful
        if (technique.id === 'feynman') priority += 2;
      } else if (currentHour >= 10 && currentHour <= 14) {
        if (technique.id === 'feynman') priority += 3; // Peak cognitive hours
        if (technique.id === 'mindmapping') priority += 2;
      } else if (currentHour >= 15 && currentHour <= 18) {
        if (technique.id === 'spaced') priority += 3; // Good for review
        if (technique.id === 'sq3r') priority += 2;
      } else if (currentHour >= 19 && currentHour <= 22) {
        if (technique.id === 'pomodoro') priority += 3; // Focus needed in evening
        if (technique.id === 'mindmapping') priority += 2; // Creative evening time
      }

      // Task-based recommendations
      if (taskTypes.exam > 0 && technique.id === 'activerecall') priority += 4;
      if (taskTypes.reading > 0 && (technique.id === 'sq3r' || technique.id === 'spaced')) priority += 3;
      if (taskTypes.writing > 0 && technique.id === 'mindmapping') priority += 3;
      if (taskTypes.math > 0 && technique.id === 'feynman') priority += 3;
      if (taskTypes.coding > 0 && technique.id === 'feynman') priority += 3;

      // General context
      if (taskCount > 5 && technique.id === 'pomodoro') priority += 2;
      if (highPriorityCount > 2 && technique.id === 'pomodoro') priority += 2;
      if (completionRate < 50 && technique.id === 'pomodoro') priority += 1;

      technique.priority = priority;
    });

    // Sort by priority (highest first)
    return baseTechniques.sort((a, b) => b.priority - a.priority);
  };

  const techniques = getPersonalizedTechniques();
  const topRecommendation = techniques[0];

  const getTimeBasedMessage = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour <= 9) {
      return "🌅 Morning is perfect for active learning and memory consolidation";
    } else if (currentHour >= 10 && currentHour <= 14) {
      return "☀️ Peak cognitive hours - ideal for complex problem solving";
    } else if (currentHour >= 15 && currentHour <= 18) {
      return "🌤️ Afternoon is great for review and spaced repetition";
    } else if (currentHour >= 19 && currentHour <= 22) {
      return "🌙 Evening creativity boost - perfect for visual learning";
    } else {
      return "🌃 Late hours need focused techniques like Pomodoro";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="liquid-card p-6"
    >
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BookOpen className="text-primary w-5 h-5" />
        Smart Learning Techniques
      </h3>

      {/* Time-based insight */}
      <div className="mb-4 p-3 liquid-card bg-primary/5 border border-primary/20">
        <div className="text-sm font-medium text-primary mb-1">
          {getTimeBasedMessage()}
        </div>
        <div className="text-xs text-muted-foreground">
          Recommended: <span className="font-medium">{topRecommendation.name}</span> - {topRecommendation.personalizedTip}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
        {techniques.map((technique, index) => {
          const IconComponent = technique.icon;
          const isRecommended = index === 0;
          return (
            <div
              key={technique.id}
              className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                selectedTechnique === technique.id
                  ? 'border-primary bg-primary/10 interactive-glow'
                  : isRecommended
                  ? 'border-primary/60 bg-primary/5 hover:border-primary/80 hover:bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-background/80'
              }`}
              onClick={() => setSelectedTechnique(
                selectedTechnique === technique.id ? null : technique.id
              )}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm sm:text-base">{technique.name}</h4>
                    {isRecommended && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">{technique.description}</p>
                  <p className="text-xs text-primary/80">{technique.when}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <AnimatePresence>
        {selectedTechnique && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t pt-4"
          >
            {(() => {
              const technique = techniques.find(t => t.id === selectedTechnique);
              if (!technique) return null;
              
              return (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">{technique.name}</h4>
                  
                  <div>
                    <h5 className="font-medium mb-2">How to do it:</h5>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      {technique.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Benefits:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {technique.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link href={technique.link}>
                    <Button className="flex items-center gap-2">
                      Try it now
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Quick Study Tools
function QuickStudyTools() {
  const tasks = useTaskStore((state) => state.tasks);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Smart tool recommendations based on current context
  const getPersonalizedTools = () => {
    const currentHour = new Date().getHours();
    const incompleteTasks = tasks.filter(task => !task.completed);
    const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed);
    const tasksToday = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      const today = new Date();
      return taskDate.toDateString() === today.toDateString();
    });

    // Analyze what the user needs most right now
    const urgentNeed = highPriorityTasks.length > 2 ? 'focus' : 
                     incompleteTasks.length > 5 ? 'planning' :
                     tasksToday.length === 0 ? 'planning' : 'study';

    const baseTools = [
      {
        title: 'Smart Focus Timer',
        description: 'AI-powered Pomodoro with break reminders and session tracking',
        icon: Timer,
        color: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
        link: '/focus',
        action: 'Start Smart Session',
        priority: 0,
        smartFeatures: ['Auto break reminders', 'Session analytics', 'Distraction blocking'],
        personalizedTip: highPriorityTasks.length > 0 
          ? `Perfect for your ${highPriorityTasks.length} high-priority tasks!`
          : 'Great for maintaining consistent study momentum.'
      },
      {
        title: 'AI Flashcard Generator',
        description: 'Auto-generate flashcards from your study material and task notes',
        icon: Brain,
        color: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800',
        link: '/remember',
        action: 'Generate Cards',
        priority: 0,
        smartFeatures: ['Auto-generate from notes', 'Spaced repetition scheduling', 'Difficulty tracking'],
        personalizedTip: tasks.some(task => task.title.toLowerCase().includes('exam') || task.title.toLowerCase().includes('test'))
          ? 'Essential for your upcoming exams!'
          : 'Build long-term retention with smart flashcards.'
      },
      {
        title: 'Study Room Matcher',
        description: 'Find study partners with similar goals and schedules',
        icon: Users,
        color: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
        link: '/rooms',
        action: 'Find Partners',
        priority: 0,
        smartFeatures: ['Goal-based matching', 'Schedule sync', 'Progress sharing'],
        personalizedTip: currentHour >= 19 && currentHour <= 22
          ? 'Evening study groups are very active right now!'
          : 'Collaborate with others to stay motivated.'
      },
      {
        title: 'Intelligent Task Planner',
        description: 'Auto-prioritize tasks based on deadlines and difficulty',
        icon: Target,
        color: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800',
        link: '/tasks',
        action: 'Smart Planning',
        priority: 0,
        smartFeatures: ['Auto-prioritization', 'Time estimation', 'Deadline tracking'],
        personalizedTip: incompleteTasks.length > 3 
          ? `Organize your ${incompleteTasks.length} pending tasks efficiently!`
          : 'Stay ahead with intelligent task management.'
      },
      {
        title: 'Study Analytics',
        description: 'Track your progress, identify patterns, and enhance learning',
        icon: BarChart3,
        color: 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800',
        link: '/companion',
        action: 'View Insights',
        priority: 0,
        smartFeatures: ['Progress tracking', 'Pattern recognition', 'Performance enhancement'],
        personalizedTip: tasks.length > 0 
          ? 'Discover insights from your study patterns!'
          : 'Start tracking to get personalized insights.'
      },
      {
        title: 'Quick Note Capture',
        description: 'Voice-to-text notes with automatic organization and tagging',
        icon: Mic,
        color: 'bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-800',
        link: '/understand',
        action: 'Start Recording',
        priority: 0,
        smartFeatures: ['Voice recognition', 'Auto-tagging', 'Smart organization'],
        personalizedTip: currentHour >= 8 && currentHour <= 18
          ? 'Perfect for capturing lecture notes and ideas!'
          : 'Quickly capture your late-night study insights.'
      }
    ];

    // Calculate smart priorities
    baseTools.forEach(tool => {
      let priority = 0;

      // Urgent need based priorities
      if (urgentNeed === 'focus' && tool.title.includes('Focus')) priority += 4;
      if (urgentNeed === 'planning' && tool.title.includes('Task')) priority += 4;
      if (urgentNeed === 'study' && tool.title.includes('Flashcard')) priority += 3;

      // Time-based priorities
      if (currentHour >= 9 && currentHour <= 12) {
        if (tool.title.includes('Focus') || tool.title.includes('Analytics')) priority += 2;
      } else if (currentHour >= 14 && currentHour <= 17) {
        if (tool.title.includes('Flashcard') || tool.title.includes('Note')) priority += 2;
      } else if (currentHour >= 19 && currentHour <= 22) {
        if (tool.title.includes('Room') || tool.title.includes('Task')) priority += 2;
      }

      // Context-based priorities
      if (highPriorityTasks.length > 0 && tool.title.includes('Focus')) priority += 2;
      if (incompleteTasks.length > 5 && tool.title.includes('Task')) priority += 3;
      if (tasks.length > 10 && tool.title.includes('Analytics')) priority += 2;

      tool.priority = priority;
    });

    return baseTools.sort((a, b) => b.priority - a.priority).slice(0, 4); // Show top 4
  };

  const tools = mounted ? getPersonalizedTools() : [];

  const getContextualMessage = () => {
    const currentHour = new Date().getHours();
    const incompleteTasks = tasks.filter(task => !task.completed);
    
    if (currentHour >= 6 && currentHour <= 9) {
      return incompleteTasks.length > 0 
        ? `🌅 Good morning! Ready to tackle ${incompleteTasks.length} tasks?`
        : "🌅 Fresh start! Time to plan your day.";
    } else if (currentHour >= 10 && currentHour <= 14) {
      return "☀️ Peak focus hours - your brain is ready for deep work!";
    } else if (currentHour >= 15 && currentHour <= 18) {
      return "🌤️ Afternoon energy - perfect for review and practice!";
    } else if (currentHour >= 19 && currentHour <= 22) {
      return "🌙 Evening study time - consider group sessions or light review.";
    } else {
      return "🌃 Burning the midnight oil? Use focused techniques to maximize efficiency.";
    }
  };
  
  if (!mounted) {
    return (
      <div className="liquid-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-primary/10 rounded w-3/4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-20 bg-primary/5 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="liquid-card p-6"
    >
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Zap className="text-primary w-5 h-5" />
        Smart Study Tools
      </h3>

      {/* Contextual message */}
      <div className="mb-4 p-3 liquid-card bg-primary/5 border border-primary/20">
        <div className="text-sm font-medium text-primary">
          {getContextualMessage()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {tools.map((tool, i) => {
          const IconComponent = tool.icon;
          const isTopRecommendation = i === 0;
          return (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={tool.link}>
                <div className={`p-3 sm:p-4 rounded-lg border transition-all duration-300 cursor-pointer ${tool.color} ${
                  isTopRecommendation 
                    ? 'ring-2 ring-primary/30 hover:ring-primary/50 hover:scale-105' 
                    : 'hover:scale-105'
                } interactive-glow`}>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm sm:text-base">{tool.title}</h4>
                        {isTopRecommendation && (
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                            Top Pick
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm opacity-80 mb-2">{tool.description}</p>
                      
                      {/* Smart features preview */}
                      <div className="mb-2">
                        <div className="flex flex-wrap gap-1 mb-1">
                          {tool.smartFeatures.slice(0, 2).map((feature, idx) => (
                            <span key={idx} className="text-xs bg-white/20 px-1.5 py-0.5 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs opacity-70">{tool.personalizedTip}</p>
                      </div>
                      
                      <div className="text-xs font-medium flex items-center gap-1">
                        {tool.action}
                        <ArrowRight className="w-2 h-2 sm:w-3 sm:h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function StudyCompanionPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const tasks = useTaskStore((state) => state.tasks);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const getBoxShadow = () => {
    if (!mounted) return "0 8px 32px 0 rgba(33,150,243,0.18), 0 0 0 1px rgba(59, 130, 246, 0.08)";
    
    return resolvedTheme === 'dark' 
      ? "0 8px 32px 0 rgba(0,0,0,0.5), 0 0 0 1px rgba(59, 130, 246, 0.1)" 
      : "0 8px 32px 0 rgba(33,150,243,0.18), 0 0 0 1px rgba(59, 130, 246, 0.08)";
  };
  
  return (
    <PageTransition>
      <div className="relative min-h-screen flex flex-col items-center justify-start pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 bg-transparent">
        <FloatingPanels />
        <GridPattern />
        
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="w-full max-w-5xl mx-auto text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Your Personal Study Assistant</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 text-center text-black dark:text-white drop-shadow-lg flex items-center justify-center gap-2">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary" />
            <span>Study Companion</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            Your comprehensive study toolkit with proven techniques, smart insights, and practical tools to enhance your learning journey.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
          className="w-full max-w-7xl mx-auto bg-white/60 dark:bg-neutral-900/60 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 backdrop-blur-2xl border border-primary/30"
          style={{ boxShadow: getBoxShadow() }}
        >
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid grid-cols-3 lg:grid-cols-5 mb-6 sm:mb-8 h-auto p-1">
              <TabsTrigger value="dashboard" className="text-xs sm:text-sm py-2 sm:py-3">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="text-xs sm:text-sm py-2 sm:py-3">
                <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Study Quiz</span>
                <span className="sm:hidden">Quiz</span>
              </TabsTrigger>
              <TabsTrigger value="planner" className="text-xs sm:text-sm py-2 sm:py-3">
                <Timer className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Session Planner</span>
                <span className="sm:hidden">Planner</span>
              </TabsTrigger>
              <TabsTrigger value="techniques" className="text-xs sm:text-sm py-2 sm:py-3">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Techniques</span>
                <span className="sm:hidden">Learn</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs sm:text-sm py-2 sm:py-3">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Quick Tools</span>
                <span className="sm:hidden">Tools</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6 sm:space-y-8">
              <StudyInsightsDashboard tasks={tasks} />
            </TabsContent>

            <TabsContent value="quiz" className="space-y-6 sm:space-y-8">
              <StudyMethodQuiz />
            </TabsContent>
            
            <TabsContent value="planner" className="space-y-6 sm:space-y-8">
              <StudySessionPlanner />
            </TabsContent>
            
            <TabsContent value="techniques" className="space-y-6 sm:space-y-8">
              <LearningTechniquesGuide />
            </TabsContent>
            
            <TabsContent value="tools" className="space-y-6 sm:space-y-8">
              <QuickStudyTools />
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 sm:mt-8 text-center px-4"
        >
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            Study Companion uses proven learning science and your study patterns to help you learn more effectively.
            <br className="hidden sm:block" />All data is stored locally in your browser for complete privacy.
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
