import { NextResponse } from 'next/server';

export async function GET() {
  const securityTxt = `Contact: mailto:security@uwezo.app
Expires: 2025-12-31T23:59:59.000Z
Policy: https://uwezo.app/security-policy  # Replace with your actual policy URL
Encryption: https://uwezo.app/security-gpg-key.txt # Replace with your actual GPG key URL
`;
  return new NextResponse(securityTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
