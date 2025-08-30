'use client';

import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { ArrowRight, BookOpen, Brain, CheckCircle, Focus, Target, Users, X, Play, ChevronRight, Lightbulb, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/store/task-store';
import { QuickNotesSidebar } from '@/components/ui/quick-notes-sidebar';
import * as React from 'react';

// Set page title
if (typeof document !== 'undefined') {
  document.title = 'Mind Axis - Smart Study Companion';
}

// Type definitions for performance optimization
interface GuideStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  color: string;
  accentColor: string;
  bgGlow: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Home() {
  // Automated streak logic: count consecutive days with completed tasks
  const tasks = useTaskStore((s) => s.tasks);
  const [streak, setStreak] = React.useState(0);
  const [name, setName] = React.useState('');
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [greeting, setGreeting] = React.useState('');

  const calculateStreak = React.useCallback(() => {
    const completed = tasks.filter(t => t.completed && t.createdAt);
    const days = new Set(
      completed.map(t => {
        const d = new Date(t.createdAt);
        return d.toISOString().slice(0, 10);
      })
    );
    
    let streakCount = 0;
    const day = new Date();
    for (;;) {
      const key = day.toISOString().slice(0, 10);
      if (days.has(key)) {
        streakCount++;
        day.setDate(day.getDate() - 1);
      } else {
        break;
      }
    }
    return streakCount;
  }, [tasks]);

  React.useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      setStreak(calculateStreak());
      
      const storedName = localStorage.getItem('user-name');
      if (storedName) {
        setName(storedName);
        setShowOnboarding(false);
        
        const greetings = [
          `Welcome, ${storedName}! Ready to conquer your studies?`,
          `Hey ${storedName}, let's make today productive!`,
          `Hi ${storedName}, your learning journey starts now!`,
          `Hello ${storedName}, let's ace those exams!`,
          `Greetings, ${storedName}! Time to focus and grow.`
        ];
        setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
      } else {
        setShowOnboarding(true);
      }
    }
  }, [calculateStreak]);

  const handleNameSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('user-name', name.trim());
      setShowOnboarding(false);
      
      const greetings = [
        `Welcome, ${name}! Ready to conquer your studies?`,
        `Hey ${name}, let's make today productive!`,
        `Hi ${name}, your learning journey starts now!`,
        `Hello ${name}, let's ace those exams!`,
        `Greetings, ${name}! Time to focus and grow.`,
        `${name}, your success story begins today!`,
        `${name}, let's make every study session count!`,
        `Ready to learn, ${name}? Let's get started!`,
        `Focus time, ${name}! Your goals are within reach.`,
        `Let's do this, ${name}! Success is just a task away.`,
      ];
      setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    }
  }, [name]);

  return (
    <MotionConfig reducedMotion="user">
      <QuickNotesSidebar />
      <div className="container px-4 py-16 sm:py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Streak indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8 flex flex-col items-center justify-center"
          >
            <span className="inline-block px-4 sm:px-6 py-2 rounded-full liquid-card font-bold text-base sm:text-lg shadow-lg text-primary interactive-glow will-change-transform">
              🔥 Streak: {streak} day{streak === 1 ? '' : 's'}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground mt-2 px-4 text-center">Complete tasks daily to keep your streak alive!</span>
          </motion.div>
          
          <motion.div
            initial="initial"
            animate="animate"
            className="text-center space-y-8"
          >
            {mounted && showOnboarding ? (
              <motion.form
                initial={{ opacity: 0, scale: 0.92, y: 60, filter: 'blur(12px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ type: 'spring', stiffness: 70, damping: 18 }}
                onSubmit={handleNameSubmit}
                className="relative w-full max-w-sm sm:max-w-md mx-auto px-6 py-8 sm:py-10 md:py-14 flex flex-col items-center gap-5 sm:gap-7 rounded-2xl sm:rounded-3xl liquid-card will-change-transform"
                style={{ transform: 'translateZ(0)' }}
              >
                {/* Liquid glass animated background */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 0.7, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="absolute inset-0 z-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-100/40 via-white/30 to-primary/20 dark:from-blue-900/40 dark:via-neutral-900/30 dark:to-primary/20 blur-2xl will-change-transform"
                  style={{ pointerEvents: 'none', transform: 'translateZ(0)' }}
                />
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  className="relative z-10 text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white mb-2 tracking-tight"
                >
                  Welcome!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.1 }}
                  className="relative z-10 text-sm sm:text-base md:text-lg text-muted-foreground mb-2 text-center px-2"
                >
                  Please enter your name to personalize your experience
                </motion.p>
                <motion.input
                  initial={{ opacity: 0, scale: 0.96, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 16, delay: 0.15 }}
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="relative z-10 w-full rounded-xl px-4 py-3 border border-primary/30 focus:ring-2 focus:ring-primary/40 font-medium text-black dark:text-white bg-white/80 dark:bg-neutral-900/80 shadow backdrop-blur-md transition-all duration-200 text-sm sm:text-base"
                  style={{ minWidth: '180px', maxWidth: '100%' }}
                  required
                  autoFocus
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative z-10 w-full sm:w-auto rounded-full px-6 py-3 morph-button text-white font-semibold shadow-lg text-sm sm:text-base will-change-transform"
                  style={{ transform: 'translateZ(0)' }}
                >
                  Continue
                </motion.button>
              </motion.form>
            ) : (
              <>
                <motion.h1
                  variants={fadeInUp}
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight px-4"
                >
                  {greeting}
                </motion.h1>
                <motion.p
                  variants={fadeInUp}
                  className="text-base sm:text-lg md:text-xl text-muted-foreground px-4 max-w-3xl mx-auto"
                >
                  A simple, focused study app designed to help students manage their daily learning and ace exams  — without distractions or complexity.
                </motion.p>
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 max-w-md sm:max-w-none mx-auto"
                >
                  <Button size="lg" asChild className="w-full sm:w-auto">
                    <Link href="/tasks">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                    <Link href="/companion">
                      Study Companion
                      <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary/20 text-primary">Updated!</span>
                    </Link>
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>

        {/* Interactive Guide Section */}
        {mounted && !showOnboarding && <InteractiveGuide />}
      </div>
    </MotionConfig>
  );
}

// Interactive Guide Component - Memoized for performance
const InteractiveGuide = React.memo(function InteractiveGuide() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [showGuide, setShowGuide] = React.useState(false);
  const [showStepModal, setShowStepModal] = React.useState<number | null>(null);

  const guideSteps = React.useMemo(() => [
    {
      id: 1,
      title: "Organize Your Tasks",
      description: "Start by adding your study tasks, assignments, and deadlines. Categorize them by subject for better organization.",
      icon: CheckCircle,
      link: "/tasks",
      color: "from-blue-500/20 to-cyan-500/20",
      accentColor: "text-blue-600 dark:text-blue-400",
      bgGlow: "bg-blue-500/10",
    },
    {
      id: 2,
      title: "Stay Focused",
      description: "Use our Pomodoro timer and focus modes to maintain concentration during study sessions.",
      icon: Focus,
      link: "/focus",
      color: "from-green-500/20 to-emerald-500/20",
      accentColor: "text-green-600 dark:text-green-400",
      bgGlow: "bg-green-500/10",
    },
    {
      id: 3,
      title: "Learn & Remember",
      description: "Create flashcards and use cramming techniques to reinforce your learning and improve retention.",
      icon: Brain,
      link: "/remember",
      color: "from-purple-500/20 to-violet-500/20",
      accentColor: "text-purple-600 dark:text-purple-400",
      bgGlow: "bg-purple-500/10",
    },
    {
      id: 4,
      title: "Take Notes & Understand",
      description: "Capture important concepts and insights to build a comprehensive knowledge base.",
      icon: BookOpen,
      link: "/understand",
      color: "from-orange-500/20 to-yellow-500/20",
      accentColor: "text-orange-600 dark:text-orange-400",
      bgGlow: "bg-orange-500/10",
    },
    {
      id: 5,
      title: "Get AI Assistance",
      description: "Use our intelligent Study Companion for personalized recommendations and study strategies.",
      icon: Users,
      link: "/companion",
      color: "from-pink-500/20 to-rose-500/20",
      accentColor: "text-pink-600 dark:text-pink-400",
      bgGlow: "bg-pink-500/10",
    },
  ], []);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showGuide) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % guideSteps.length);
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showGuide, guideSteps.length]);

  const toggleGuide = React.useCallback(() => {
    setShowGuide(prev => !prev);
  }, []);

  const setStepHandler = React.useCallback((index: number) => {
    setActiveStep(index);
  }, []);

  const closeModal = React.useCallback(() => {
    setShowStepModal(null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.3 }}
      className="mt-16 sm:mt-24 max-w-6xl mx-auto"
    >
      {/* Guide Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.5 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
          Your Study Journey Awaits
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto px-4">
          Discover how Mind Axis can transform your learning experience with these powerful features
        </p>
        
        {!showGuide ? (
          <motion.button
            onClick={toggleGuide}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="morph-button px-8 py-3 text-white font-semibold rounded-full shadow-lg will-change-transform"
            style={{ transform: 'translateZ(0)' }}
          >
            <Target className="mr-2 h-5 w-5 inline" />
            Start Interactive Guide
          </motion.button>
        ) : (
          <motion.button
            onClick={toggleGuide}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Hide Guide
          </motion.button>
        )}
      </motion.div>

      {/* Guide Steps Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4"
      >
        {guideSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = showGuide && activeStep === index;
          
          return (
            <GuideStepCard
              key={step.id}
              step={step}
              index={index}
              isActive={isActive}
              Icon={Icon}
              onModalOpen={setShowStepModal}
            />
          );
        })}
      </motion.div>

      {/* Guide Navigation */}
      {showGuide && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center items-center mt-8 space-x-3"
        >
          {guideSteps.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setStepHandler(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-3 h-3 rounded-full transition-all duration-300 will-change-transform ${
                activeStep === index 
                  ? 'bg-primary shadow-lg' 
                  : 'bg-primary/30 hover:bg-primary/50'
              }`}
              style={{ transform: 'translateZ(0)' }}
            />
          ))}
        </motion.div>
      )}

      {/* Step-by-step Modal */}
      <AnimatePresence mode="wait">
        {showStepModal !== null && (
          <StepModal
            stepId={showStepModal}
            guideSteps={guideSteps}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// Memoized Guide Step Card for performance
const GuideStepCard = React.memo(function GuideStepCard({ 
  step, 
  index, 
  isActive, 
  Icon, 
  onModalOpen 
}: {
  step: GuideStep;
  index: number;
  isActive: boolean;
  Icon: React.ComponentType<{ className?: string }>;
  onModalOpen: (id: number) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: isActive ? 1.05 : 1,
        transition: { type: 'spring', stiffness: 120, damping: 16, delay: index * 0.1 }
      }}
      whileHover={{ 
        scale: 1.03,
        transition: { type: 'spring', stiffness: 400, damping: 25 }
      }}
      className={`relative group rounded-2xl p-6 liquid-card transition-all duration-500 will-change-transform ${
        isActive ? 'ring-2 ring-primary/50 shadow-2xl' : 'hover:shadow-xl'
      }`}
      style={{
        background: isActive 
          ? `linear-gradient(135deg, ${step.color.split(' ')[1]}, ${step.color.split(' ')[3]})`
          : undefined,
        transform: 'translateZ(0)'
      }}
    >
      {/* Interactive Glow Effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isActive ? 0.3 : 0,
          scale: isActive ? 1.2 : 0.8,
        }}
        transition={{ duration: 0.6 }}
        className={`absolute inset-0 rounded-2xl ${step.bgGlow} blur-xl -z-10 will-change-transform`}
        style={{ transform: 'translateZ(0)' }}
      />

      <div className="flex flex-col items-center mb-4 group/step">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, boxShadow: isActive ? '0 0 0 4px rgba(59,130,246,0.15)' : 'none' }}
          whileHover={{ scale: 1.15, boxShadow: '0 0 0 6px rgba(59,130,246,0.18)' }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: index * 0.1 + 0.2 }}
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold mb-2 transition-all duration-300 will-change-transform ${
            isActive 
              ? 'bg-primary text-white shadow-lg' 
              : 'bg-primary/20 text-primary'
          }`}
          style={{ transform: 'translateZ(0)' }}
        >
          {step.id}
        </motion.div>
        <div className="h-2" />
        <motion.div
          animate={{ 
            rotate: isActive ? [0, 10, -10, 0] : 0,
            scale: isActive ? 1.1 : 1,
            filter: isActive ? 'drop-shadow(0 0 8px rgba(59,130,246,0.18))' : 'none'
          }}
          whileHover={{ scale: 1.15, filter: 'drop-shadow(0 0 12px rgba(59,130,246,0.25))' }}
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl will-change-transform ${
            isActive ? step.bgGlow : 'bg-primary/10'
          } transition-all duration-300`}
          style={{ transform: 'translateZ(0)' }}
        >
          <Icon className={`h-6 w-6 ${step.accentColor}`} />
        </motion.div>
      </div>

      <div className="space-y-3">
        <motion.h3
          animate={{ color: isActive ? undefined : undefined }}
          className={`text-lg font-semibold ${
            isActive ? step.accentColor : 'text-foreground'
          }`}
        >
          {step.title}
        </motion.h3>
        
        <motion.p
          animate={{ opacity: isActive ? 1 : 0.8 }}
          className="text-sm text-muted-foreground leading-relaxed"
        >
          {step.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.4 }}
          className="flex flex-col gap-2"
        >
          <Button
            asChild
            variant={isActive ? "default" : "outline"}
            size="sm"
            className={`transition-all duration-200 ${
              isActive 
                ? 'shadow-lg scale-105' 
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Link href={step.link} className="inline-flex items-center">
              Explore
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-primary"
            onClick={() => onModalOpen(step.id)}
          >
            <Lightbulb className="mr-1 h-3 w-3" />
            Show Steps
          </Button>
        </motion.div>
      </div>

      {/* Progress Indicator */}
      {isActive && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 4, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-1 bg-primary rounded-b-2xl"
        />
      )}
    </motion.div>
  );
});

// Memoized Step Modal for performance
const StepModal = React.memo(function StepModal({ 
  stepId, 
  guideSteps, 
  onClose 
}: {
  stepId: number;
  guideSteps: GuideStep[];
  onClose: () => void;
}) {
  const currentStep = React.useMemo(() => 
    guideSteps.find(s => s.id === stepId), 
    [guideSteps, stepId]
  );

  if (!currentStep) return null;

  const Icon = currentStep.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        className="max-w-md w-full mx-4 p-8 rounded-3xl shadow-2xl relative bg-gradient-to-br from-white/95 to-white/90 dark:from-neutral-900/95 dark:to-neutral-900/90 backdrop-blur-xl border border-white/30 dark:border-neutral-700/30 ring-1 ring-black/5 dark:ring-white/5 will-change-transform"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: 'translateZ(0)' }}
      >
        <button
          className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-all duration-200 p-2 rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 hover:scale-105"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border border-primary/20 dark:border-primary/30 shadow-lg backdrop-blur-sm ring-1 ring-primary/10 dark:ring-primary/20"
          >
            <Icon className={`h-10 w-10 ${currentStep.accentColor} drop-shadow-sm`} />
          </motion.div>
          <h3 className="text-2xl font-bold mb-3 text-center text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {currentStep.title}
          </h3>
          <p className="text-base text-muted-foreground text-center leading-relaxed max-w-sm">
            {currentStep.description}
          </p>
        </div>
        <StepInstructions stepId={currentStep.id} />
      </motion.div>
    </motion.div>
  );
});

// StepInstructions component for each feature - Memoized for performance
const StepInstructions = React.memo(function StepInstructions({ stepId }: { stepId: number }) {
  const [currentStep, setCurrentStep] = React.useState(0);

  const stepData = React.useMemo(() => ({
    1: [
      { 
        icon: <CheckCircle className="h-6 w-6 text-blue-500" />, 
        title: 'Add Your First Task', 
        text: 'Click "Get Started" and create a task with a clear, actionable title like "Review Chapter 5 Biology".' 
      },
      { 
        icon: <Star className="h-6 w-6 text-yellow-500" />, 
        title: 'Categorize Smartly', 
        text: 'Assign each task to a subject category. This helps you focus on one area at a time.' 
      },
      { 
        icon: <Zap className="h-6 w-6 text-green-500" />, 
        title: 'Build Your Streak', 
        text: 'Complete tasks daily and watch your streak grow. Consistency is key to academic success!' 
      },
    ],
    2: [
      { 
        icon: <Focus className="h-6 w-6 text-green-500" />, 
        title: 'Choose Your Mode', 
        text: 'Select Pomodoro (25 min focus), Deep Work (longer sessions), or custom timers based on your task.' 
      },
      { 
        icon: <Play className="h-6 w-6 text-primary" />, 
        title: 'Stay in the Zone', 
        text: 'Eliminate distractions, put your phone away, and dive deep into focused study time.' 
      },
      { 
        icon: <Lightbulb className="h-6 w-6 text-yellow-500" />, 
        title: 'Reflect & Improve', 
        text: 'After each session, note what worked well and what challenged you for continuous improvement.' 
      },
    ],
    3: [
      { 
        icon: <Brain className="h-6 w-6 text-purple-500" />, 
        title: 'Create Smart Flashcards', 
        text: 'Write concise questions and clear answers. Focus on key concepts, formulas, and definitions.' 
      },
      { 
        icon: <Star className="h-6 w-6 text-yellow-500" />, 
        title: 'Master the Cramming Tool', 
        text: 'Use the traffic light system: Red = don\'t know, Yellow = almost there, Green = mastered!' 
      },
      { 
        icon: <Zap className="h-6 w-6 text-green-500" />, 
        title: 'Space Your Reviews', 
        text: 'Review flashcards regularly, not just before exams. Spaced repetition boosts long-term retention.' 
      },
    ],
    4: [
      { 
        icon: <BookOpen className="h-6 w-6 text-orange-500" />, 
        title: 'Capture Key Insights', 
        text: 'Write notes in your own words. Summarize concepts, jot down examples, and ask questions.' 
      },
      { 
        icon: <Lightbulb className="h-6 w-6 text-yellow-500" />, 
        title: 'Connect the Dots', 
        text: 'Link notes to your tasks and flashcards. Cross-reference topics to build deeper understanding.' 
      },
      { 
        icon: <Star className="h-6 w-6 text-primary" />, 
        title: 'Review & Refine', 
        text: 'Regularly revisit your notes. Update them with new insights and remove outdated information.' 
      },
    ],
    5: [
      { 
        icon: <Users className="h-6 w-6 text-pink-500" />, 
        title: 'Meet Your AI Companion', 
        text: 'Visit the Study Companion page for personalized insights and intelligent study recommendations.' 
      },
      { 
        icon: <Lightbulb className="h-6 w-6 text-yellow-500" />, 
        title: 'Discover Your Style', 
        text: 'Take the Study Method Quiz to identify your learning preferences and get tailored strategies.' 
      },
      { 
        icon: <Star className="h-6 w-6 text-primary" />, 
        title: 'Apply AI Insights', 
        text: 'Use personalized recommendations to improve your study sessions and enhance efficiency.' 
      },
    ],
  }), []);

  const steps = stepData[stepId as keyof typeof stepData] || [];

  const nextStep = React.useCallback(() => {
    setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
  }, [steps.length]);

  const prevStep = React.useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const handleComplete = React.useCallback(() => {
    setCurrentStep(0);
  }, []);

  if (steps.length === 0) return null;

  return (
    <div className="space-y-8">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 18 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm">
            {steps[currentStep].icon}
          </div>
        </motion.div>
        <h4 className="text-xl font-semibold mb-3 text-foreground">{steps[currentStep].title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed px-2">{steps[currentStep].text}</p>
      </motion.div>

      {/* Step counter */}
      <div className="flex justify-center">
        <div className="flex space-x-3 p-3 rounded-full bg-primary/5 border border-primary/10">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`w-3 h-3 rounded-full transition-all duration-300 will-change-transform ${
                index === currentStep 
                  ? 'bg-primary shadow-lg scale-125' 
                  : index < currentStep
                    ? 'bg-primary/60'
                    : 'bg-primary/20'
              }`}
              style={{ transform: 'translateZ(0)' }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentStep === 0}
          onClick={prevStep}
          className="flex items-center bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm"
        >
          <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
          Previous
        </Button>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        <Button
          variant={currentStep === steps.length - 1 ? "default" : "outline"}
          size="sm"
          onClick={currentStep === steps.length - 1 ? handleComplete : nextStep}
          className={`flex items-center will-change-transform ${currentStep === steps.length - 1 
            ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white' 
            : 'bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-neutral-800/70'
          }`}
          style={{ transform: 'translateZ(0)' }}
        >
          {currentStep === steps.length - 1 ? (
            <>
              <Star className="h-4 w-4 mr-1" />
              Got it!
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
});
