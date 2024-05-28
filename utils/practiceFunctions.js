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

    const space = answer.indexOf(" ");
    let index = Number(answer.slice(0, space));
    let num = Number(answer.slice(space + 1));

    if (space === -1) {
      index = Number(answer);
      num = 1;
    }

    if (num < 1) num = 1;

    if (!isNaN(index) && index >= 0 && index <= this.methods.length) {
      if (index === 0) {
        return this.callback();
      }
      await this.practiceFunc(index - 1, num);
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
        continue;
      }
      console.log(`Incorrect. The correct answer is '${completed.correct}'`);
    }
    console.log();
    console.log(`You scored ${score} out of ${num}`);
    await this.showMenu();
  }

  async translation(word) {
    const answer = (
      await this.askQuestion(
        `What is the word for '${word.nativeWord}' in the language you are learning? `,
      )
    )
      .trim()
      .toLowerCase();
    const correct = word.learnedWord.trim().toLowerCase();
    const result = answer === correct;
    return { result, correct };
  }

  async reverseTranslation(word) {
    const answer = (
      await this.askQuestion(
        `What is the word for '${word.learnedWord}' in your language? `,
      )
    )
      .trim()
      .toLowerCase();

    const correct = word.nativeWord.trim().toLowerCase();
    const result = answer === correct;
    return { result, correct };
  }

  async definition(word) {
    const answer = (
      await this.askQuestion(
        `What is the word that matches this definition? \n ${word.learnedDefinition} - `,
      )
    )
      .trim()
      .toLowerCase();

    const correct = word.learnedWord.trim().toLowerCase();
    const result = answer === correct;
    return { result, correct };
  }

  async matchingGame(word) {
    const total = 5;
    if (this.config.length < total) {
      console.log("Insufficient number of words.");
      return { result: false, correct: " " };
    }

    const words = [word];
    while (words.length < total) {
      const randomWord =
        this.config[Math.floor(Math.random() * this.config.length)];
      if (!words.includes(randomWord)) {
        words.push(randomWord);
      }
    }

    const options = words.map((word) => word.learnedWord);
    const randomOptions = [...options].sort(() => Math.random() - 0.45);

    console.log("Match the words:");
    words.forEach((word, index) => {
      console.log(`${index + 1}. ${word.nativeWord}`);
    });

    console.log();

    const correctPairs = [];

    randomOptions.forEach((option, index) => {
      const char = String.fromCharCode(97 + index);
      console.log(`${char}. ${option}`);
      correctPairs.push(`${options.indexOf(option) + 1}${char}`);
    });

    correctPairs.sort((a, b) => a[0] - b[0]);

    const answer = await this.askQuestion(
      'Enter your answers in the format "1a 2b 3c ...": ',
    );
    const pairs = answer.trim().split(" ");
    let right = 0;

    for (let i = 0; i < pairs.length; i++) {
      if (pairs[i] === correctPairs[i]) right++;
    }
    const correct = correctPairs.join(" ");
    const result = right === total;
    console.log(`You got ${right} out of ${words.length} correct.`);
    return { result, correct };
  }

  async random(word) {
    const index = Math.floor(Math.random() * (this.methods.length - 1));
    return this.methods[index](word);
  }
}

module.exports = Practice;
