class Practice {
    constructor(rl, config, callback) {
        this.rl = rl;
        this.config = config;
        this.callback = callback;
    }

    start() {
        if (this.config.length === 0) {
            console.log('No words to practice.');
            this.callback();
        } else {
            this.showMenu();
        }
    }

    showMenu() {
        console.log(`
        Practice Menu:
        1. Translate
        2. Reverse translate
        3. Match a definition
        4. Matching game
        0. Exit
        `);
        this.rl.question('Choose an option: ', answer => {
            switch (answer.trim()) {
                case '1':
                    this.translation();
                    break;
                case '2':
                    this.reverseTranslation();
                    break;
                case '3':
                    this.definition();
                    break;
                case '4':
                    this.matchingGame();
                    break;
                case '0':
                    this.callback();
                    break;
                default:
                    console.log("Invalid option.");
                    this.showMenu();
                    break;
            }
        });
    }

    translation() {
        const word = this.config[Math.floor(Math.random() * this.config.length)];
        this.rl.question(`What is the word for '${word.nativeWord}' in the language you are learning? `, (answer) => {
            if (answer.trim().toLowerCase() === word.learnedWord.trim().toLowerCase()) {
                console.log('Correct!');
            } else {
                console.log(`Incorrect. The correct answer is '${word.learnedWord}'.`);
            }
            this.showMenu();
        });
    }

    reverseTranslation() {
        const word = this.config[Math.floor(Math.random() * this.config.length)];
        this.rl.question(`What is the word for '${word.learnedWord}' in your language? `, (answer) => {
            if (answer.trim().toLowerCase() === word.nativeWord.trim().toLowerCase()) {
                console.log('Correct!');
            } else {
                console.log(`Incorrect. The correct answer is '${word.nativeWord}'.`);
            }
            this.showMenu();
        });
    }

    definition() {
        const word = this.config[Math.floor(Math.random() * this.config.length)];
        this.rl.question(`What is the word that matches this definition? \n ${word.learnedDefinition} `, (answer) => {
            if (answer.trim().toLowerCase() === word.learnedWord.trim().toLowerCase()) {
                console.log('Correct!');
            } else {
                console.log(`Incorrect. The correct answer is '${word.learnedWord}'.`);
            }
            this.showMenu();
        });
    }

    matchingGame() {
        if (this.config.length < 5) {
            console.log("Insufficient number of words.")
            this.showMenu();
            return;
        }
        const words = [];
        while (words.length < 5) {
            const word = this.config[Math.floor(Math.random() * this.config.length)];
            if (!words.includes(word)) {
                words.push(word);
            }
        }

        const options = words.map(word => word.learnedWord);
        options.sort(() => Math.random() - 0.5);

        console.log('Match the words:');
        words.forEach((word, index) => {
            console.log(`${index + 1}. ${word.nativeWord}`);
        });

        options.forEach((option, index) => {
            console.log(`${String.fromCharCode(97 + index)}. ${option}`);
        });

        this.rl.question('Enter your answers in the format "1a 2b 3c ...": ', (answer) => {
            const pairs = answer.trim().split(' ');
            let correct = 0;

            pairs.forEach(pair => {
                const [num, opt] = pair.split('');
                const wordIndex = parseInt(num) - 1;
                const optionIndex = opt.charCodeAt(0) - 97;
                if (words[wordIndex].learnedWord === options[optionIndex]) {
                    correct++;
                }
            });

            console.log(`You got ${correct} out of ${words.length} correct.`);
            this.showMenu();
        });
    }
}

module.exports = Practice;
