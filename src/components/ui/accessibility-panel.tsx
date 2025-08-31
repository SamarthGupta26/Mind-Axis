'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Type, Contrast } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  focusVisible: boolean;
}

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    focusVisible: true,
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applySettings(parsed);
    }

    // Check for system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
    
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setSettings(prev => ({ ...prev, highContrast: true }));
    }
  }, []);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (newSettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Focus visible
    if (newSettings.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  return (
    <>
      {/* Accessibility trigger button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="icon"
        className="fixed bottom-4 left-4 z-50 bg-background/80 backdrop-blur-sm border"
        aria-label="Open accessibility settings"
      >
        <Eye className="h-4 w-4" />
      </Button>

      {/* Accessibility panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 bg-background border rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Accessibility Settings</h2>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  aria-label="Close accessibility settings"
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <SettingToggle
                  icon={<Contrast className="h-4 w-4" />}
                  label="High Contrast"
                  description="Increase contrast for better visibility"
                  checked={settings.highContrast}
                  onChange={(checked) => updateSetting('highContrast', checked)}
                />

                <SettingToggle
                  icon={<Type className="h-4 w-4" />}
                  label="Large Text"
                  description="Increase text size for better readability"
                  checked={settings.largeText}
                  onChange={(checked) => updateSetting('largeText', checked)}
                />

                <SettingToggle
                  icon={<Eye className="h-4 w-4" />}
                  label="Reduced Motion"
                  description="Minimize animations and transitions"
                  checked={settings.reducedMotion}
                  onChange={(checked) => updateSetting('reducedMotion', checked)}
                />

                <SettingToggle
                  icon={<Eye className="h-4 w-4" />}
                  label="Enhanced Focus"
                  description="Show clear focus indicators"
                  checked={settings.focusVisible}
                  onChange={(checked) => updateSetting('focusVisible', checked)}
                />
              </div>

              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  These settings are saved locally and will persist across sessions.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface SettingToggleProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function SettingToggle({ icon, label, description, checked, onChange }: SettingToggleProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-1 text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium cursor-pointer" onClick={() => onChange(!checked)}>
            {label}
          </label>
          <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              checked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                checked ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
