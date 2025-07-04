import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

type Payload = {
  document: {
    title?: string | null;
    description?: string | null;
    url: string;
    datePosted?: string | null;
    snippet?: string | null;
    num_tokens: number;
  };
  tokens: { token: string; frequency: number }[];
};

export async function POST(request: NextRequest) {
  try {
    const { document, tokens } = await request.json() as Payload;

    // Create the Document
    const createdDocument = await prisma.document.create({
      data: {
        title: document.title ?? null,
        description: document.description ?? null,
        url: document.url, // this one is required
        datePosted: document.datePosted ?? null,
        snippet: document.snippet ?? null,
        num_tokens: document.num_tokens,
      },
    });

    const tokenDocumentData = [];

    for (const { token, frequency } of tokens) {
    let existingToken = await prisma.token.findUnique({
      where: { token },
    });

    if (!existingToken) {
      try {
        existingToken = await prisma.token.create({ data: { token } });
      } catch (e) {
        // Another request may have created it — try to fetch again
        existingToken = await prisma.token.findUnique({ where: { token } });
      }
    }

      if (!existingToken) {
        throw new Error(`Token "${token}" could not be created or found.`);
      }
      tokenDocumentData.push({
        tokenId: existingToken.id,
        documentId: createdDocument.id,
        frequency,
      });
    }

    // 4️⃣ Bulk create TokenDocument records
    await prisma.tokenDocument.createMany({
      data: tokenDocumentData,
      skipDuplicates: true, // In case the composite key already exists
    });

    return NextResponse.json({ message: 'Success', documentId: createdDocument.id }, { status: 201 });

  } catch (error) {
    console.error('[POST /api/documents] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}