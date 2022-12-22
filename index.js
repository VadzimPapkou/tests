const fs = require("fs")

const text = fs.readFileSync("test.txt").toString();

const answers = text.split(/\n{2,}/gi);
const questions = answers.map(aw => aw.replace(/{.*?}/g, "").replace(/[+-]/gi, "? "));
const questionsAnswers = answers.map((answer, index) => ({answer, question: questions[index], index}))//.slice(192, 213);

fs.writeFileSync("test.json", JSON.stringify(questions.map((q, i) => i + "=" + q), null, 2));

let currentQuestion = questionsAnswers[0];
setText(currentQuestion.question)

function setText(text) {
  console.clear();
  console.log(text);
}

process.stdin.on("data", data => {
  data = data.toString().toLowerCase().replace(/\s/, "");

  console.log(data)

  let prefix;

  switch (data) {
    // random
    case "r":
      currentQuestion = getRandom(questionsAnswers);
      prefix = currentQuestion.index + " of " + questionsAnswers.length + "\n";
      setText(prefix + currentQuestion.question)
      break;
    //answer
    case "a":
      prefix = currentQuestion.index + " of " + questionsAnswers.length + "\n";
      setText(prefix + currentQuestion.answer);
      break;
    // next
    case "n":
      currentQuestion = questionsAnswers[currentQuestion.index + 1];
      prefix = currentQuestion.index + " of " + questionsAnswers.length + "\n";
      setText(prefix + currentQuestion.question)
      break;
    // previous
    case "p":
      currentQuestion = questionsAnswers[currentQuestion.index - 1];
      prefix = currentQuestion.index + " of " + questionsAnswers.length + "\n";
      setText(prefix + currentQuestion.question)
  }

  if (data.startsWith("i")) {
    console.clear();
    const index = +data.replace(/\D/gi, "")
    global.qa = questionsAnswers[index];
    console.log(global.qa.question)
  }

  if(data.startsWith("r") && data.endsWith("a")) {
    [from, to] = data.split("-").map(x => +x.replace(/\D/gi, ""));
    currentQuestion = getRandom(questionsAnswers.slice(from, to));
    setText(currentQuestion.question)
  }
});

function getRandom(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr.splice(index, 1)[0];
}

