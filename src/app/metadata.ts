import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://mind-axis.vercel.app'),
  title: {
    default: 'Mind Axis - Smart Study Companion',
    template: '%s | Mind Axis'
  },
  description: "A simple, focused study app designed to help students manage their daily learning and ace exams — without distractions or complexity. Features intelligent task management, Pomodoro timer, flashcards, and collaborative study rooms.",
  keywords: [
    'study app',
    'student planner',
    'pomodoro timer',
    'flashcards',
    'task management',
    'study companion',
    'learning',
    'education',
    'productivity',
    'exam preparation',
    'focus timer',
    'study groups',
    'note taking',
    'academic success'
  ],
  authors: [{ name: 'Mind Axis Team' }],
  creator: 'Mind Axis',
  publisher: 'Mind Axis',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mind-axis.vercel.app',
    siteName: 'Mind Axis',
    title: 'Mind Axis - Smart Study Companion',
    description: 'A simple, focused study app designed to help students manage their daily learning and ace exams — without distractions or complexity.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mind Axis - Smart Study Companion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mind Axis - Smart Study Companion',
    description: 'A simple, focused study app designed to help students manage their daily learning and ace exams — without distractions or complexity.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      { url: '/favicon-simple.svg', rel: 'mask-icon', color: '#3b82f6' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://mind-axis.vercel.app',
  },
  category: 'education',
  classification: 'Education & Productivity',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  verification: {
    // Add verification IDs when you have them
    // google: 'your-google-verification-id',
    // other: {
    //   'msvalidate.01': 'your-bing-verification-id',
    // },
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Mind Axis',
    'application-name': 'Mind Axis',
    'msapplication-TileColor': '#3b82f6',
    'theme-color': '#3b82f6',
  },
};
