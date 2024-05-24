const fs = require('fs');

const readConfig = (language) => {
    const filePath = `config/${language}.txt`;
    if (!fs.existsSync(filePath)) {
        console.log(`Configuration file for ${language} not found. Creating a new one.`);
        fs.writeFileSync(filePath, '');
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return data.split('\n').filter(line => line).map(line => {
        const [nativeWord, learnedWord, nativeDefinition, learnedDefinition] = line.split(';-;');
        return { nativeWord, learnedWord, nativeDefinition, learnedDefinition };
    });
};

const appendToConfig = (language, word) => {
    const filePath = `config/${language}.txt`;
    const line = `${word.nativeWord};-;${word.learnedWord};-;${word.nativeDefinition};-;${word.learnedDefinition}\n`;
    fs.appendFileSync(filePath, line);
};

const rewriteConfig = (language, config) => {
    const filePath = `config/${language}.txt`;
    const data = config.map(word =>
        `${word.nativeWord};-;${word.learnedWord};-;${word.nativeDefinition};-;${word.learnedDefinition}`
    ).join('\n');
    fs.writeFileSync(filePath, data);
};

const readDefaultConfig = () => {
    const filePath = 'config/defaultConfig.txt';
    if (!fs.existsSync(filePath)) {
        console.error('Default configuration file not found. Creating a new one with default language.');
        fs.writeFileSync(filePath, "english");
        return "english";
    }
    return fs.readFileSync(filePath, 'utf8');
};

const writeDefaultConfig = (defaultLanguage) => {
    const filePath = 'config/defaultConfig.txt';
    fs.writeFileSync(filePath, defaultLanguage);
};

const getLanguages = () => {
    const files = fs.readdirSync("config")
        .filter((value) => value !== 'defaultConfig.txt')
        .map((value) => value.slice(0, value.lastIndexOf('.')))
    return files;
}

module.exports = { readConfig, appendToConfig, rewriteConfig, readDefaultConfig, writeDefaultConfig, getLanguages };
