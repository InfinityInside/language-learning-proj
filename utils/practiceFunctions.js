class Practice {
    constructor(rl, config, callback) {
        this.rl = rl;
        this.config = config;
        this.callback = callback;
        this.methods = [
            this.translation.bind(this),
            this.reverseTranslation.bind(this),
            this.definition.bind(this),
            this.matchingGame.bind(this),
            //this.random.bind(this)
        ];
    }

    async start() {
        if (this.config.length === 0) {
            console.log('No words to practice.');
            this.callback();
        } else {
            await this.showMenu();
        }
    }

    async askQuestion(query) {
        return new Promise((resolve) => {
            this.rl.question(query, resolve);
        });
    }

    async showMenu() {
        console.log(`
        Practice Menu:
        1. Translate
        2. Reverse translate
        3. Match a definition
        4. Matching game
        5. Random
        0. Exit
        `);
        const answer = (await this.askQuestion('Choose an option, you can also specify a number \nafter a space character to repeat the exercise (1 10): ')).trim();
        const space = answer.indexOf(" ");
        const index = (space === -1) ? +answer : +answer.slice(0, space);
        let num = (space === -1) ? 1 : +answer.slice(space + 1);
        if (num < 1)
            num = 1;
        if (!isNaN(index) && index >= 0 && index <= this.methods.length) {
            if (index === 0) {
                return this.callback();
            }

            await this.practiceFunc(index-1, num)

        } else {
            console.log("Invalid option!");
            await this.showMenu();
        }
    }

    async practiceFunc(index, num) {
        let score = 0;
        for (let i = 0; i < num; i++) {
            const completed = await this.methods[index]();
            if (completed.result) {
                score++;
                console.log("Correct!")
                continue;
            }
            console.log();
            console.log(`Incorrect. The correct answer is '${completed.correct}'`);
        }
        console.log(`You scored ${score} out of ${num}`);
        await this.showMenu();
    }

    async translation() {
        const word = this.config[Math.floor(Math.random() * this.config.length)];
        const answer = (await this.askQuestion(`What is the word for '${word.nativeWord}' in the language you are learning? `))
            .trim()
            .toLowerCase();
        const correct = word.learnedWord.trim().toLowerCase();
        const result = answer === correct;
        return {result, correct}
    }

    async reverseTranslation() {
        const word = this.config[Math.floor(Math.random() * this.config.length)];
        const answer = (await this.askQuestion(`What is the word for '${word.learnedWord}' in your language? `))
            .trim()
            .toLowerCase();
        const correct = word.nativeWord.trim().toLowerCase();
        const result = answer === correct;
        return {result, correct}
    }

    async definition() {
        const word = this.config[Math.floor(Math.random() * this.config.length)];
        const answer = (await this.askQuestion(`What is the word that matches this definition? \n ${word.learnedDefinition} - `))
            .trim()
            .toLowerCase();
        const correct = word.learnedWord.trim().toLowerCase();
        const result = answer === correct;
        return {result, correct};

    }

    async matchingGame() {
        const total = 5;
        let temp = [];
        if (this.config.length < total) {
            console.log("Insufficient number of words.")
            return;
        }
        const words = [];
        while (words.length < total) {
            const word = this.config[Math.floor(Math.random() * this.config.length)];
            if (!words.includes(word)) {
                words.push(word);
            }
        }

        const options = words.map(word => word.learnedWord);
        const randomOptions = [...options].sort(() => Math.random() - 0.45);

        console.log('Match the words:');
        words.forEach((word, index) => {
            console.log(`${index + 1}. ${word.nativeWord}`);
        });

        console.log()

        randomOptions.forEach((option, index) => {
            const char = String.fromCharCode(97 + index)
            console.log(`${char}. ${option}`);
            temp.push(`${options.indexOf(option)+1}${char}`);
        });

        temp.sort((a,b) => a[0] - b[0]);

        const answer = await this.askQuestion('Enter your answers in the format "1a 2b 3c ...": ');
        const pairs = answer.trim().split(' ');
        const correctPairs = temp;
        let right = 0;

        for (let i = 0; i < pairs.length; i++) {
            if (pairs[i] === correctPairs[i])
                right++;

        }
        const correct = temp.join(" ");
        const result = right === total;
        console.log(`You got ${right} out of ${words.length} correct.`);
        return { result, correct }

    }

    // async random(num) {
    //     const methods = [
    //         this.translation,
    //         this.reverseTranslation,
    //         this.definition,
    //         this.matchingGame];
    //     const index = Math.floor(Math.random() * methods.length)
    //     await methods[index].call(this);
    //
    // }
}

module.exports = Practice;
