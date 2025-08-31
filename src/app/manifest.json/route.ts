import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: 'Mind Axis - Smart Study Companion',
    short_name: 'Mind Axis',
    description: 'A simple, focused study app designed to help students manage their daily learning and ace exams — without distractions or complexity.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['education', 'productivity', 'utilities'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32',
        type: 'image/x-icon'
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      },
      {
        src: '/favicon-simple.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      }
    ],
    screenshots: [
      {
        src: '/preview.png',
        sizes: '1280x720',
        type: 'image/png',
        label: 'Mind Axis Dashboard'
      }
    ],
    shortcuts: [
      {
        name: 'Tasks',
        short_name: 'Tasks',
        description: 'Manage your study tasks',
        url: '/tasks',
        icons: [{ src: '/favicon.svg', sizes: '96x96' }]
      },
      {
        name: 'Focus Timer',
        short_name: 'Focus',
        description: 'Start a focused study session',
        url: '/focus',
        icons: [{ src: '/favicon.svg', sizes: '96x96' }]
      },
      {
        name: 'Flashcards',
        short_name: 'Remember',
        description: 'Study with flashcards',
        url: '/remember',
        icons: [{ src: '/favicon.svg', sizes: '96x96' }]
      }
    ],
    prefer_related_applications: false,
    related_applications: []
  };

  return NextResponse.json(manifest, {
    status: 200,
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
