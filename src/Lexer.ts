// @ts-ignore
import stringTokenizer from "string-punctuation-tokenizer";
import Token from "./Token";

export interface NumberObject {
    [key: string]: number;
}

/**
 * A collection of lexical functions
 */
export default class Lexer {

    /**
     * Converts an array of words into an array of measured tokens
     * @param {string[]} words - an array of words
     * @param sentenceCharLength - the length of the sentence in characters
     * @return an array of {@link Token}s
     */
    public static tokenizeWords(words: string[], sentenceCharLength: number = -1): Token[] {
        if (sentenceCharLength === -1) {
            sentenceCharLength = words.join(" ").length;
        }

        const tokens: {text: string, position: number, characterPosition: number, sentenceTokenLen: number, sentenceCharLen: number, occurrence: number}[] = [];
        let charPos = 0;
        const occurrenceIndex: NumberObject = {};
        for (const word of words) {
            if (!occurrenceIndex[word]) {
                occurrenceIndex[word] = 0;
            }
            occurrenceIndex[word] += 1;
            tokens.push({
                text: word,
                position: tokens.length,
                characterPosition: charPos,
                sentenceTokenLen: words.length,
                sentenceCharLen: sentenceCharLength,
                occurrence: occurrenceIndex[word]
            });
            charPos += word.length;
        }

        // Finish adding occurrence information
        const occurrenceTokens: Token[] = [];
        for (const t of tokens) {
            occurrenceTokens.push(new Token({
                text: t.text,
                position: t.position,
                characterPosition: t.characterPosition,
                sentenceTokenLen: t.sentenceTokenLen,
                sentenceCharLen: t.sentenceCharLen,
                occurrence: t.occurrence,
                occurrences: occurrenceIndex[t.text]
            }));
        }
        return occurrenceTokens;
    }

    /**
     * Generates an array of measured tokens for the sentence.
     * @param {string} sentence - the sentence to tokenize
     * @param [punctuation=false] - optionally indicate if punctuation should be preserved.
     * @return {Token[]} An array of {@link Token}s
     */
    public static tokenize(sentence: string, {punctuation = false}: { punctuation?: boolean } = {}): Token[] {
        let words;

        if (punctuation) {
            words = stringTokenizer.tokenizeWithPunctuation(sentence);
        } else {
            words = stringTokenizer.tokenize(sentence);
        }
        return Lexer.tokenizeWords(words, sentence.length);
    }
}
