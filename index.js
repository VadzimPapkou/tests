const fs = require("fs");

const text = fs.readFileSync("test.txt").toString();


const rawQuestions = text.split(/\s+/gi);

const questions = rawQuestions.map((rawQuestion, index) => {
  const rows = rawQuestion.split("\n");

  const notAnswered = rawQuestion.replace(/^[+-]/gim, "? ");

  return {
    notAnswered,
    answered: rawQuestion,
    id: index
  }
});

