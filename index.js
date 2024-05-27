const LearningCLI = require("./utils/learningCLI");

const start = async () => {
    const cli = new LearningCLI();

    await cli.showMenu();
};

start().catch(err => {
    console.error("An error occurred:", err);
});
