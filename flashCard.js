//import all javascript files
var BasicCard = require("./BasicCard"); // constructor for basic card game
var ClozeCard = require("./ClozeCard"); // constructor for cloze card game
var inquirer = require("inquirer"); // inquirer class will prompt the user with questions
var fs = require("fs"); // file read and write functions are in this class
//counter for storing correct answer
var correct = 0;
//counter for storing wrong answer
var wrong = 0;
//cardArray to store the data from the log.txt and cloze_log.txt files
var cardArray = [];

/** This function will prompt the user using inquirer.
 *  Based on the user selection, appropriate function will be called using 
 *  switch statement 
*/
function flashcards() {
    inquirer.prompt([
        {
            type: "list",
            message: "What game would you like to play?",
            choices: ["basic-cards", "basic-quiz", "cloze-quiz", "quit"],
            //choices: ["basic-cards", "cloze-cards", "basic-quiz", "cloze-quiz", "quit"],
            name: "userInput"
        }
    ]).then(function(user) {
        switch (user.userInput) {
            case "basic-cards":
                readCards("log.txt");
                createCards(basicPrompt, "log.txt");
                break;
            
            case "basic-quiz":
                quiz("log.txt", 0);
                break;

            case "cloze-cards":
                readCards("cloze_log.txt");
                createCards(clozePrompt, "cloze_log.txt");
                break;

            case "cloze-quiz":
                quiz("cloze_log.txt", 0);
                break;
            
            case "quit":
                console.log("Thank you for playing! Please come back and play again");
                break;
        }
    });
}


/** 
 * Defining basicPrompt object which will be used by inquirer for asking basic questions 
*/
var basicPrompt = [
    {
        name: "front",
        message: "Enter The Question on Front of the Card: "
    }, 
    {
        name: "back",
        message: "Enter Answer to the question on Back of the Card: "
    }, 
    {
        type: 'confirm',
        name: 'makeMore',
        message: 'Create another card (hit enter for YES)?',
        default: true
    }
]

/** 
 * Defining clozePrompt object which will be used by inquirer for asking cloze questions 
*/
var clozePrompt = [
    {
        name: "text",
        message: "Enter a sentence, put hiding word in bracket, For ex: <I always prefer (coffee)>",
        validate: function(value) {
            var parentheses = /\(\w.+\)/;
            if (value.search(parentheses) > -1) {
                return true;
            }
            return "Please enter a proper word in bracket"
        },
    },
    {
        type: "confirm",
        name: "makeMore",
        message: "Create another card (hit enter for YES)?",
        default: true
    }
]

/** 
 * makeMore object will be prompted by inquirer for confirmation to continue or not 
*/
var makeMore = {
    type: "confirm",
    name: "makeMore",
    message: "Create another card (hit enter for YES)?",
    default: true
}

/** 
 * writeToFile function will write the data to log.txt file
*/
function writeToFile(logToFile, info){
    fs.writeFile(logToFile, info, function(err) {
        if (err)
            console.error(err);
    });
}

/** 
 * readCards function will read from the log.txt and cloze_log.txt files and
 * push the content of the txt file to cardArray array object
*/
function readCards(logToFile){
    cardArray = [];
    fs.readFile(logToFile, "utf8", function(error, data) {
        var jsonContent = JSON.parse(data);
        for (var i = 0; i < jsonContent.length; i++) {
           cardArray.push(jsonContent[i]);
        }
    });
};

/** 
 * createCards function will push the data entered by the user to the cardArray and 
 * write to log.txt file once user does not want to add any additional questions and answers.
 * If user want to add questions, then it will recursively call createCards function
*/
function createCards(promptType, logToFile){
    inquirer.prompt(promptType).then(function(answers) {
        cardArray.push(answers);
        if (answers.makeMore) {
            createCards(promptType, logToFile);
        } else {
            writeToFile(logToFile, JSON.stringify(cardArray));
            flashcards();
        }
    });
};

/** 
 * quiz function will initialize BasicCard or ClozeCard constructor based on 
 * whether the file we read from contains "front" or not. 
 * If it contains "front", then create and initialize BasicCard constructor
 * If it does not contain "front", then create and initialize ClozeCard constructor
 * Prompt the user with the question you read from the file (log.txt for basic questions and 
 * cloze_log.txt for cloze questions).
 * Increment counter of the question as well as right and wrong answer counter based on the user input. 
 * recursively call quiz function until all questions are answered
 * finally display the number of correct and wrong answers entered by the user and start all over again
 * by calling flashcards() function
*/
function quiz(logToFile, x){

    fs.readFile(logToFile, "utf8", function(error, data) {
        var jsonContent = JSON.parse(data);
        if (x < jsonContent.length) {
            if (jsonContent[x].hasOwnProperty("front")) {
                var gameCard = new BasicCard(jsonContent[x].front, jsonContent[x].back);
                var gameQuestion = gameCard.front;
                var gameAnswer = gameCard.back.toLowerCase();
            } else {
               var gameCard = new ClozeCard(jsonContent[x].text, jsonContent[x].cloze);
                var gameQuestion = gameCard.partialText;
                var gameAnswer = gameCard.cloze.toLowerCase();
            }

            inquirer.prompt([
                {
                    name: "question",
                    message: gameQuestion,
                    validate: function(value) {
                        if (value.length > 0) {
                            return true;
                        }
                        return "Please take atleast one guess!";
                    }
                }
            ]).then(function(answers) {
                if(answers.question.toLowerCase().indexOf(gameAnswer) > -1) {
                    console.log("Correct!");
                    correct++;
                    x++;
                    quiz(logToFile, x);
                } else {
                    gameCard.printRightAnswer();
                    wrong++;
                    x++;
                    quiz(logToFile, x);
                }
            })
        } else {
            console.log("Thank you for playing. Here are the final score -");
            console.log("Number of correct answers: " + correct);
            console.log("Number of wrong answers: " + wrong);
            correct = 0;
            wrong = 0;
            flashcards();
        }
    });
};

//Call flashCards function for the first time when this file is called from the CLI
flashcards();