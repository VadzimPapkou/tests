async function main() {
  const text = await fetch("test.txt").then(res => res.text());

  const $instruction = document.createElement("p");
  $instruction.innerHTML = `
  p - предыдущий вопрос <br>
  n - следующий вопрос <br>
  a - показать ответ <br>
  na - скрыть ответ <br>
  w - добавить к неправильным вопросам <br>
  s [n] - показать вопрос под номером n 
  `

  const $wrong = document.createElement("div");
  $wrong.innerText = "Не правильно: ";

  function wrong(number) {
    $wrong.innerText += " " + number;
  }

  const $output = document.createElement("div");
  $output.style.border = "1px solid #000";
  $output.style.minHeight = "300px";
  
  function log(text) {
    $output.innerText += text;
  }
  
  function clear() {
    $output.innerText = "";
  }

  const $input = document.createElement("form");
  const $submit = document.createElement("button");
  $submit.innerText = "Submit"
  $input.append(
    document.createElement("input"),
    $submit
  )

  document.body.append($instruction, $wrong, $output, $input);


  const rawQuestions = text.split(/(\r?\n\r?){2,}/gi)
                           .filter(x => x.length > 1)
  ;

  const questions = rawQuestions.map((rawQuestion, index) => {
    const rows = rawQuestion
      .split("\n");

    const questionText = rows[0];
    const variants = rows.slice(1);
    const variantsShuffled = shuffle(variants);
    const variantsNotAnswered = variantsShuffled.map(v => v.replace(/^[+-]/gim, "? "));

    const answered = [questionText, ...variantsShuffled].join("\n");
    const notAnswered = [questionText, ...variantsNotAnswered].join("\n");

    return {
      notAnswered,
      answered,
      id: index
    }
  });

  let currentQuestion = questions[0];

  handleSubmit("n");

  $input.addEventListener("submit", e => {
    e.preventDefault();
    const data = e.target.querySelector("input").value;
    e.target.querySelector("input").value = "";
    handleSubmit(data);
  });

  function handleSubmit(data) {
    const [action, rawParams] = data.split(" ");

    console.log(action, rawParams);

    const createFooter = (question) => `\nВопрос ${question.id} из ${questions.length}`;

    const logWithFooter = (question, questionText) => {
      clear();
      log(questionText);
      log(createFooter(question));
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
        wrong(currentQuestion.id);
        break;
      case "s":
        currentQuestion = questions[rawParams];
        logWithFooter(currentQuestion, currentQuestion.notAnswered);
    }
  }
}

function shuffle(arr) {
  arr = [...arr];
  return arr.sort(function() { return 0.5 - Math.random() });
}

main();