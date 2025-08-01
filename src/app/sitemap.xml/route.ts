import { NextResponse } from 'next/server';

const URL = 'https://uwezo.app';

export async function GET() {
  const pages = [
    '/',
    '/login',
    '/signup',
    '/dashboard',
    '/dashboard/profile',
    '/dashboard/quiz',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      return `
    <url>
      <loc>${`${URL}${page}`}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
  `;
    })
    .join('')}
</urlset>
`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
