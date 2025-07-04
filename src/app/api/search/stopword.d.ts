declare module 'stopword' {
    const sw: {
        removeStopWords(words: string[], stopwords?: string[]): string[];
        [key: string]: any;
    };
    export = sw;
}