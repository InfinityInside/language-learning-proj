class Word {
    constructor(nativeWord, learnedWord, nativeDefinition, learnedDefinition) {
        this.nativeWord = nativeWord;
        this.learnedWord = learnedWord;
        this.nativeDefinition = nativeDefinition;
        this.learnedDefinition = learnedDefinition;
    }
    toString() {
        return `${this.nativeWord} - ${this.learnedWord} - ${this.nativeDefinition} - ${this.learnedDefinition}`;
    }
}
module.exports = Word
