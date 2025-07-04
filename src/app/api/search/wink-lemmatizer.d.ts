declare module 'wink-lemmatizer' {
    const lemmatizer: {
        verb: (word: string) => string | null;
        noun: (word: string) => string | null;
        adjective: (word: string) => string | null;
        adverb: (word: string) => string | null;
    };
    export default lemmatizer;
}