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
      this.random.bind(this),
    ];
  }

  async start() {
    if (this.config.length === 0) {
      console.log("No words to practice.");
      this.callback();
    } else {
      await this.showMenu();
    }
  }

  askQuestion(query) {
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

    const answer = (
      await this.askQuestion(
        "Choose an option, you can also specify a number \nafter a space character to repeat the exercise (1 10): ",
      )
    ).trim();

    const [index, num] = answer.split(" ").map(Number);
    const practiceIndex = isNaN(index) ? 0 : index;
    const repeatNum = isNaN(num) ? 1 : num;

    if (practiceIndex >= 0 && practiceIndex <= this.methods.length) {
      if (practiceIndex === 0) {
        return this.callback();
      }
      await this.practiceFunc(practiceIndex - 1, repeatNum);
    } else {
      console.log("Invalid option!");
      await this.showMenu();
    }
  }

  async practiceFunc(index, num) {
    let score = 0;
    for (let i = 0; i < num; i++) {
      const word = this.config[Math.floor(Math.random() * this.config.length)];
      const completed = await this.methods[index](word);
      if (completed.result) {
        score++;
        console.log("Correct!");
      } else {
        console.log(`Incorrect. The correct answer is '${completed.correct}'`);
      }
    }
    console.log(); // empty line for better visual
    console.log(`You scored ${score} out of ${num}`);
    await this.showMenu();
  }

  async translation(word) {
    return this.checkAnswer(
      `What is the word for '${word.nativeWord}' in the language you are learning? `,
      word.learnedWord,
    );
  }

  async reverseTranslation(word) {
    return this.checkAnswer(
      `What is the word for '${word.learnedWord}' in your language? `,
      word.nativeWord,
    );
  }

  async definition(word) {
    return this.checkAnswer(
      `What is the word that matches this definition? \n ${word.learnedDefinition} - `,
      word.learnedWord,
    );
  }

  async matchingGame(word) {
    const total = 5;
    if (this.config.length < total) {
      console.log("Insufficient number of words.");
      return { result: false, correct: "" };
    }

    const words = this.getRandomWords(total, word);
    const options = words.map((w) => w.learnedWord);
    const randomOptions = this.shuffleArray([...options]);

    console.log("Match the words:");
    words.forEach((w, i) => {
      console.log(`${i + 1}. ${w.nativeWord}`);
    });

    console.log();
    randomOptions.forEach((option, i) => {
      console.log(`${String.fromCharCode(97 + i)}. ${option}`);
    });

    const correctPairs = options.map(
      (option, i) =>
        `${i + 1}${String.fromCharCode(97 + randomOptions.indexOf(option))}`,
    );

    const answer = (
      await this.askQuestion(
        'Enter your answers in the format "1a 2b 3c ...": ',
      )
    ).trim();

    const pairs = answer.split(" ");
    const right = pairs.filter((pair, i) => pair === correctPairs[i]).length;

    console.log(`You got ${right} out of ${words.length} correct.`);
    return { result: right === total, correct: correctPairs.join(" ") };
  }

  async random(word) {
    const randomIndex = Math.floor(Math.random() * (this.methods.length - 1)); // -1, because we do not want to call this method again
    return this.methods[randomIndex](word);
  }

  async checkAnswer(question, correctAnswer) {
    const answer = (await this.askQuestion(question)).trim().toLowerCase();
    const correct = correctAnswer;
    const result = answer === correct;
    return { result, correct };
  }

  getRandomWords(count, firstWord) {
    const words = new Set([firstWord]);
    while (words.size < count) {
      const randomWord =
        this.config[Math.floor(Math.random() * this.config.length)];
      words.add(randomWord);
    }
    return Array.from(words);
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

module.exports = Practice;
