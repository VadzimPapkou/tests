const fs = require("fs")

const text = fs.readFileSync("test.txt").toString();


const chunks = text.split(/(\r\n){2,}/gi).map(chunk => ({chunk, fulltext: chunk.match(/\n/gi)?.length === 2}));

const questions = chunks.map((chunkWithMetadata, index) => {
  if(chunkWithMetadata.fulltext) {
    const [question, answer] = chunkWithMetadata.split(/n/gi);
    return {
      question: "fulltext" + question,
      answer,
      id: index
    }
  } else {
    return {
      question: chunkWithMetadata.chunk,
      answer: chunkWithMetadata.chunk.replace(/^[+-]/gi, "? "),
      id: index
    }
  }
});

fs.writeFileSync("test.json", JSON.stringify(questions.map((q) => q.id + ": " + q.question), null, 2));

let currentQuestion = questions[0];
setText(currentQuestion.question)

function setText(text) {
  console.clear();
  console.log(text);
}

process.stdin.on("data", data => {
  data = data.toString().toLowerCase().replace(/\s/, "");

  let prefix;

  switch (data) {
    // random
    case "r":
      currentQuestion = getRandom(questions);
      prefix = currentQuestion.id + " of " + questions.length + "\n";
      setText(prefix + currentQuestion.question)
      break;
    //answer
    case "a":
      prefix = currentQuestion.id + " of " + questions.length + "\n";
      setText(prefix + currentQuestion.answer);
      break;
    // next
    case "n":
      currentQuestion = questions[currentQuestion.id + 1];
      prefix = currentQuestion.id + " of " + questions.length + "\n";
      setText(prefix + currentQuestion.question)
      break;
    // previous
    case "p":
      currentQuestion = questions[currentQuestion.id - 1];
      prefix = currentQuestion.id + " of " + questions.length + "\n";
      setText(prefix + currentQuestion.question)
  }

  if (data.startsWith("i")) {
    console.clear();
    const id = +data.replace(/\D/gi, "")
    global.qa = questions[id];
    console.log(global.qa.question)
  }

  if(data.startsWith("r") && data.endsWith("a")) {
    [from, to] = data.split("-").map(x => +x.replace(/\D/gi, ""));
    currentQuestion = getRandom(questions.slice(from, to));
    setText(currentQuestion.question)
  }
});

function getRandom(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr.splice(index, 1)[0];
}
