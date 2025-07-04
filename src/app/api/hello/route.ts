// /app/api/hello/route.ts in Next 13+ with app directory
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello from backend!' });
}