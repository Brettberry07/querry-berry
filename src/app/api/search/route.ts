import { Prisma, PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';
import { removeStopwords } from 'stopword';
import lemmatizer from 'wink-lemmatizer';

const prisma = new PrismaClient();

type Query = {
    search: string
}

async function getTokens(query: Query) {
    let search = query['search'].toLowerCase().split(/\W+/);
    search = removeStopwords(search);
    let tokens = search.map(word =>
        lemmatizer.verb(word) ||
        lemmatizer.noun(word) ||
        lemmatizer.adjective(word) ||
        word
    );
    tokens = tokens.filter(t => t.length > 1);

    const freq: { [key: string]: number } = {};
    tokens.forEach(t => freq[t] = (freq[t] || 0) + 1);
    tokens = [...new Set(tokens)];
    return tokens
}

function getTF_IDF(TF: number, DF: number, N: number){
    return (TF * (Math.log(N / DF)));
}

function bm25Score({
  tf,        // frequency of token in doc
  df,        // num of docs containing that tokens
  N,         // total number of documents
  docLen,    // total tokens in that doc
  avgDocLen, // avgNumTokens in every doc
  k = 1.5,   // k constant
  b = 0.75   // b constant
}: {
  tf: number,
  df: number,
  N: number,
  docLen: number,
  avgDocLen: number,
  k?: number,
  b?: number
}): number {
  const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5)); // IDF with smoothing
  const numerator = tf * (k + 1);
  const denominator = tf + k * (1 - b + b * (docLen / avgDocLen));
  return idf * (numerator / denominator);
}

export async function POST(request: NextRequest) {
    const query = await request.json() as Query;
    let search_tokens = await getTokens(query);


    // {id of token, the token, every doc that this token appears in}
    const db_tokens = await prisma.token.findMany({
        where: {
            token: { in: search_tokens }
        },
        include: {
            docs: {
                include: {
                    document: true
                }
            }
        }
    });

    let docScoring: { [key: string]: number } = {};
    const totalDocs = await prisma.document.count();
    const totalTokenSum = await prisma.document.aggregate({
        _sum: {
            num_tokens: true
        }
    });
    const avgDocLen = totalTokenSum._sum.num_tokens! / totalDocs;

    for (const [key, item] of db_tokens.entries()) {
        let docs = item.docs;
        let tokens_length = docs.length;


        // for (const doc of docs) {
        //     const tfIdf = getTF_IDF(doc.frequency, tokens_length, total_length);
        //     docScoring[doc.documentId] = (docScoring[doc.documentId] ?? 0) + tfIdf;
        // }
        for (const doc of docs) {
            const bm25 = bm25Score({
                tf: doc.frequency,
                df: tokens_length,
                N: totalDocs,
                docLen: doc.document.num_tokens,
                avgDocLen: avgDocLen
            });
            docScoring[doc.documentId] = (docScoring[doc.documentId] ?? 0) + bm25;
        }
    }

    // I now have all the docs scored according to tfIdf!
    // Now we need to sort everything and get the top results

    // Sort by score
    const sorted = Object.entries(docScoring)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

    // Fetch documents
    const results = await prisma.document.findMany({
    where: {
        id: {
        in: sorted.map(([id]) => parseInt(id))
        }
    }
    });

    const response = results.map(doc => ({
        id: doc.id,
        title: doc.title,
        url: doc.url,
        snippet: doc.snippet,
        score: docScoring[doc.id]
    }));

    return NextResponse.json(response);


}
