const readline = require('readline');
const {
    readConfig,
    appendToConfig,
    rewriteConfig,
    readDefaultConfig,
    writeDefaultConfig,
    getLanguages
} = require('./fileManager');
const Practice = require("./practiceFunctions");

class LearningCLI {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'learning-cli> '
        });
        this.currentLanguage = readDefaultConfig();
        this.config = readConfig(this.currentLanguage);

        this.methods = [
            this.addWord.bind(this),
            this.viewWords.bind(this),
            this.changeLanguage.bind(this),
            this.removeWord.bind(this),
            this.startPractice.bind(this),
        ];

        this.showMenu = this.showMenu.bind(this);
    }

    async askQuestion(query) {
        return new Promise((resolve) => {
            this.rl.question(query, resolve);
        });
    }

    async startPractice() {
        const practice = new Practice(this.rl, this.config, this.showMenu);
        await practice.start();
    }

    async showMenu() {
        console.log(`
    Current language: ${this.currentLanguage}
    1. Add a new word
    2. View words
    3. Change language
    4. Remove a word
    5. Practice
    0. Exit
    `);
        const answer = +(await this.askQuestion(`Choose an option: `)).trim();

        if (answer === 0) {
            console.log("Exiting the Language Learning CLI.");
            process.exit(0);
            return;
        }

        try {
            await this.methods[answer - 1]();
        } catch (err) {
            console.log("Invalid option.");
            console.log(`## ${err.message}`);
        }
        await this.showMenu();
    };

    async addWord() {
        const nativeWord = await this.askQuestion('Enter the word in your language: ');
        const learnedWord = await this.askQuestion('Enter the word in the language you learn: ');
        const nativeDefinition = await this.askQuestion('Enter the definition in your language: ');
        const learnedDefinition = await this.askQuestion('Enter the definition in the language you learn: ');
        const word = { nativeWord, learnedWord, nativeDefinition, learnedDefinition };
        this.config.push(word);
        appendToConfig(this.currentLanguage, word);
        console.log('Word added successfully!');
    };

    async viewWords() {
        if (this.config.length === 0) {
            console.log('No words added yet.');
        } else {
            this.config.forEach((word, index) => {
                console.log(`${index + 1}. ${word.nativeWord} - ${word.learnedWord} - ${word.nativeDefinition} - ${word.learnedDefinition}`);
            });
        }
    };

    async changeLanguage() {
        const languages = getLanguages();
        languages.forEach((value, index) => {
            console.log(`${index + 1}. ${value}`);
        });
        const input = (await this.askQuestion('Enter the index of the language or type a name of a language to create one (english, spanish, etc.): ')).trim();
        const num = +input;
        if (num) {
            if (num >= 1 && num <= languages.length) {
                this.currentLanguage = languages[num - 1];
            } else {
                console.log("Invalid index.");
                return;
            }
        } else {
            this.currentLanguage = input;
        }
        this.config = readConfig(this.currentLanguage);
        writeDefaultConfig(this.currentLanguage);
        console.log(`Language changed to ${this.currentLanguage}`);
    };

    async removeWord() {
        await this.viewWords();
        const index = +(await this.askQuestion('Enter the index of the word to remove or type 0 to abort: ')).trim();
        if (index === 0) {
            console.log("Aborted removing");
            return;
        }
        try {
            this.config.splice(index - 1, 1);
            rewriteConfig(this.currentLanguage, this.config);
            console.log('Word removed successfully!');
        } catch (err) {
            console.log("Invalid index.");
            console.log(`## ${err.message}`);
        }
    };
}

module.exports = LearningCLI;
