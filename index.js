const fs = require("fs");
const _ = require("lodash");

const text = fs.readFileSync("test.txt").toString();


const rawQuestions = text.split(/(\r?\n\r?){2,}/gi)
  .filter(x => x.length > 1)
;

const questions = rawQuestions.map((rawQuestion, index) => {
  const rows = rawQuestion
    .split("\n");

  const questionText = rows[0];
  const variants = rows.slice(1);
  const variantsShuffled = _.shuffle(variants);
  const variantsNotAnswered = variantsShuffled.map(v => v.replace(/^[+-]/gim, "? "));

  const answered = [questionText, ...variantsShuffled].join("\n");
  const notAnswered = [questionText, ...variantsNotAnswered].join("\n");

  return {
    notAnswered,
    answered,
    id: index
  }
});

fs.writeFileSync("test.json", JSON.stringify(rawQuestions));

let currentQuestion = questions[0];

console.log(currentQuestion)

process.stdin.on("data", data => {
  data = String(data).replace(/[\n\r]/gi, "");

  const [action, rawParams] = data.split(":");

  const createFooter = (question) => `Вопрос ${question.id} из ${questions.length}`;

  const logWithFooter = (question, questionText) => {
    console.clear();
    console.log(questionText);
    console.log(createFooter(question));
  }

  switch (action) {
    case "n":
      currentQuestion = questions[currentQuestion.id + 1];
      logWithFooter(currentQuestion, currentQuestion.notAnswered);
      break;
    case "p":
      currentQuestion = questions[currentQuestion.id - 1];
      logWithFooter(currentQuestion, currentQuestion.notAnswered);
      break;
    case "a":
      logWithFooter(currentQuestion, currentQuestion.answered);
      break;
    case "na":
      logWithFooter(currentQuestion, currentQuestion.notAnswered);
      break;
    case "w":
      fs.appendFileSync("wrong.txt", " " + currentQuestion.id)
  }
});

