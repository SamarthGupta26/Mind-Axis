import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://mind-axis.vercel.app/sitemap.xml

# Disallow specific pages if needed
Disallow: /api/
Disallow: /_next/
Disallow: /socket-test

# Crawl-delay for better server performance
Crawl-delay: 1`;

  return new NextResponse(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
