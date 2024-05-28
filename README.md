# Language Learning CLI

## Overview

The **Language Learning CLI** is a command-line application designed to help users learn and practice new languages. The CLI allows users to add, view, and remove vocabulary words, change languages, and engage in various practice exercises to reinforce their learning.

## Features

- **Add Word**: Add a new vocabulary word with its translation and definition.
- **View Words**: View all added words or filter words by a search term.
- **Change Language**: Switch between different language configurations.
- **Remove Word**: Remove a vocabulary word by selecting from a list or filtering by a search term.
- **Practice**: Engage in practice exercises including translation, reverse translation, matching definitions, and a matching game.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/language-learning-cli.git
   cd language-learning-cli
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the CLI:
   ```bash
   node index.js
   ```

2. Follow the on-screen prompts to add words, view words, change languages, remove words, and practice.

### Commands

- **1. Add a new word**: Add a new vocabulary word along with its translation and definition.
- **2. View words**: View all words or filter words by including a search term.
- **3. Change language**: Change the current language configuration.
- **4. Remove a word**: Remove a word by selecting from a list or filtering by a search term.
- **5. Practice**: Practice using various exercises.
- **0. Exit**: Exit the application.

## Configuration Files

- **config/defaultConfig.txt**: Stores the default language.
- **config/{language}.txt**: Stores the vocabulary words for each language in the format `nativeWord;-;learnedWord;-;learnedDefinition`.
