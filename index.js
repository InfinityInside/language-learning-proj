const readline = require('readline');
const { readConfig,
    appendToConfig,
    rewriteConfig,
    readDefaultConfig,
    writeDefaultConfig,
    getLanguages
} = require('./utils/fileManager');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'learning-cli> '
});

let currentLanguage = readDefaultConfig();
let config = readConfig(currentLanguage);

const showMenu = () => {
    console.log(`
    Current language: ${currentLanguage}
    1. Add a new word
    2. View words
    3. Change language
    4. Remove a word
   
    10. Exit
    `);
    rl.prompt();
};

const addWord = () => {
    rl.question('Enter the word in your language: ', (nativeWord) => {
        rl.question('Enter the word in the language you learn: ', (learnedWord) => {
            rl.question('Enter the definition in your language: ', (nativeDefinition) => {
                rl.question('Enter the definition in the language you learn: ', (learnedDefinition) => {
                    const word = { nativeWord, learnedWord, nativeDefinition, learnedDefinition };
                    config.push(word);
                    appendToConfig(currentLanguage, word);
                    console.log('Word added successfully!');
                    showMenu();
                });
            });
        });
    });
};

const viewWords = (withMenu=true) => {
    if (config.length === 0) {
        console.log('No words added yet.');
    } else {
        config.forEach((word, index) => {
            console.log(`${index + 1}. ${word.nativeWord} - ${word.learnedWord} - ${word.nativeDefinition} - ${word.learnedDefinition}`);
        });
    }
    if (withMenu)
        showMenu();
};

const changeLanguage = () => {
    const languages = getLanguages();
    languages.forEach((value, index) => {
        console.log(`${index + 1}. ${value}`)
    })
    rl.question('Enter the index of the language or type a name of a language to create one (english, spanish, etc.): ', (input) => {

        const num = +input
        if (num) {
            console.log("num")
            if (num >= 1 && num <= languages.length) {
                currentLanguage = languages[num-1]
            } else {
                console.log("Invalid number.")
            }
        } else {
            console.log("str")
            currentLanguage = input.trim()
        }
        config = readConfig(currentLanguage)
        writeDefaultConfig(currentLanguage)
        console.log(`Language changed to ${currentLanguage}`)
        showMenu();
    });
};

const removeWord = () => {
    viewWords(false);
    rl.question('Enter the index of the word to remove or type 0 to abort: ', (index) => {
        const wordIndex = parseInt(index) - 1;
        if (wordIndex >= -1 && wordIndex < config.length) {
            if (wordIndex === -1) {
                console.log("Aborted removing");
                showMenu()
                return
            }
            config.splice(wordIndex, 1);
            rewriteConfig(currentLanguage, config);
            console.log('Word removed successfully!');
        } else {
            console.log('Invalid index.');
        }
        showMenu();
    });
};

const updateWord = () => {
    rl.question('Enter the index of the word to update: ', (index) => {
        const wordIndex = parseInt(index) - 1;
        if (wordIndex >= 0 && wordIndex < config.length) {
            const word = config[wordIndex];
            rl.question(`Enter the new word in your language (current: ${word.nativeWord}): `, (nativeWord) => {
                rl.question(`Enter the new word in the language you learn (current: ${word.learnedWord}): `, (learnedWord) => {
                    rl.question(`Enter the new definition in your language (current: ${word.nativeDefinition}): `, (nativeDefinition) => {
                        rl.question(`Enter the new definition in the language you learn (current: ${word.learnedDefinition}): `, (learnedDefinition) => {
                            config[wordIndex] = {
                                nativeWord: nativeWord || word.nativeWord,
                                learnedWord: learnedWord || word.learnedWord,
                                nativeDefinition: nativeDefinition || word.nativeDefinition,
                                learnedDefinition: learnedDefinition || word.learnedDefinition
                            };
                            rewriteConfig(currentLanguage, config);
                            console.log('Word updated successfully!');
                            showMenu();
                        });
                    });
                });
            });
        } else {
            console.log('Invalid index.');
            showMenu();
        }
    });
};

rl.on('line', (line) => {
    switch (line.trim()) {
        case '1':
            addWord();
            break;
        case '2':
            viewWords();
            break;
        case '3':
            changeLanguage();
            break;
        case '4':
            removeWord();
            break;

        case '10':
            rl.close();
            break;
        default:
            console.log('Invalid option.');
            showMenu();
            break;
    }
}).on('close', () => {
    console.log('Exiting language CLI.');
    process.exit(0);
});

console.log('Welcome to the Language Learning CLI!');
showMenu();

