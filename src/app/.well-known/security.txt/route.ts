import { NextResponse } from 'next/server';

export async function GET() {
  const securityTxt = `Contact: mailto:security@example.com
Expires: 2025-12-31T23:59:59.000Z
`;
  return new NextResponse(securityTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
