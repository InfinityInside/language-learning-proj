const fs = require("fs");

const readConfig = (language) => {
  const filePath = `config/${language}.txt`;
  if (!fs.existsSync(filePath)) {
    console.log(
      `Configuration file for ${language} not found. Creating a new one.`,
    );
    fs.writeFileSync(filePath, "");
    return [];
  }
  const data = fs.readFileSync(filePath, "utf8");
  return data
    .trim()
    .split("\n")
    .filter((line) => line) // excluding empty lines
    .map((line) => {
      const [nativeWord, learnedWord, learnedDefinition] = line.split(";-;");
      return { nativeWord, learnedWord, learnedDefinition };
    });
};

const appendToConfig = (language, word) => {
  const filePath = `config/${language}.txt`;
  const line = `${word.nativeWord};-;${word.learnedWord};-;${word.learnedDefinition}\n`;
  fs.appendFileSync(filePath, line);
};

const rewriteConfig = (language, config) => {
  const filePath = `config/${language}.txt`;
  const data = config
    .map(
      (word) =>
        `${word.nativeWord};-;${word.learnedWord};-;${word.learnedDefinition}`,
    )
    .join("\n");
  fs.writeFileSync(filePath, data);
};

const readDefaultConfig = () => {
  const filePath = "config/defaultConfig.txt";
  if (!fs.existsSync(filePath)) {
    console.error(
      "Default configuration file not found. Creating a new one with default language.",
    );
    fs.writeFileSync(filePath, "english");
    return "english";
  }
  return fs.readFileSync(filePath, "utf8").trim();
};

const writeDefaultConfig = (defaultLanguage) => {
  const filePath = "config/defaultConfig.txt";
  fs.writeFileSync(filePath, defaultLanguage);
};

const getLanguages = () =>
  fs
    .readdirSync("config")
    .filter((file) => file !== "defaultConfig.txt" && file.endsWith(".txt"))
    .map((file) => file.slice(0, file.lastIndexOf("."))); // extracting file's name without .txt

module.exports = {
  readConfig,
  appendToConfig,
  rewriteConfig,
  readDefaultConfig,
  writeDefaultConfig,
  getLanguages,
};
