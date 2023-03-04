const STATUSES = {
    NOT_ANSWERED: "Не ответил",
    SUCCESS: "Знаю",
    WRONG: "Не знаю",
};

const q1 = [
    "Способы получения",
    "Свойства",
    "Контроль качества и условия хранения(Подлинность и испытания)"
];

const q2 = [
    "бария сульфата",
    "магния оксида лёгкого и магния оксида тяжёлого",
    "магния сульфата гептагидрата",
    "кальция хлорида гексагидрата и кальция хлорида дигидрата",
    "растворов водорода пероксида",
    "йода",
    "калия хлоридов",
    "натрия и калия бромидов",
    "натрия и калия йодидов",
    "натрия гидрокарбоната",
    "висмута нитрата основного, тяжёлого",
    "борной кислоты и натрия тетрабората",
    "алюминия оксида гидратированного и алюминия фосфата гидратированного",
    "калия перманганата",
    "серебра протеината (протаргол)",
    "цинка оксида",
    "цинка сульфата гептагидрата",
    "железа сульфата гептагидрата",
    "железа хлорида гексагидрата",
    "меди сульфата безводного и меди сульфата пентагидрата"
];

const d = [
    "цинка оксида",
    "цинка сульфата гептагидрата",
    "железа сульфата гептагидрата",
    "железа хлорида гексагидрата",
    "меди сульфата безводного и меди сульфата пентагидрата"
];

const questions = q1.map(a => q2.map(b => a + "\n" + b)).reduce((a, b) => a.concat(b));
const dQuestions = q1.map(a => d.map(b => a + "\n" + b)).reduce((a, b) => a.concat(b));

console.log(questions);

function createTest(textQuestions) {
    const questions = textQuestions.map(text => ({text, status: STATUSES.NOT_ANSWERED}));

    function getRandomUnansweredQuestion() {
        return getRandomElement(questions.filter(q => q.status === STATUSES.NOT_ANSWERED));
    }

    function getRandomWrongQuestion() {
        return getRandomElement(questions.filter(q => q.status === STATUSES.WRONG));
    }

    function setQuestionStatus(question, status) {
        questions.find(q => q === question).status = status;
    }

    function getAllQuestions() {
        return questions;
    }

    return {
        getRandomUnansweredQuestion,
        getRandomWrongQuestion,
        setQuestionStatus,
        getAllQuestions,
    }
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function startTest(questions) {
    const $testContainer = document.querySelector("#test_container");
    const test = createTest(questions);

    const testTemplate = `
        <p class="question"></p>
        <div>
            <button data-next>Случайный вопрос</button>
            <button data-next-wrong style="background: green; border: black">Случайный вопрос, который не знаю</button>
        </div>
        <div>
            <button data-dont-know style="background: grey; border: black">Не знаю</button>
            <button data-know style="background: green; border: yellowgreen">Знаю</button>
        </div>
        <div class="counters"></div>  
    `;

    $testContainer.innerHTML = testTemplate;
    $testContainer.classList.add("test");
    $.data($testContainer, "test", test);

    $testContainer.querySelector("[data-next]").click();
}

document.addEventListener("click", e => {
    const $closestTest = e.target.closest(".test");
    if(!$closestTest) return;

    const test = $.data($closestTest).test;

    const actions = {
        "next": () => {
            console.log("next");
            const question = test.getRandomUnansweredQuestion();
            setCurrentQuestion(question);
            $closestTest.querySelector(".question").innerText = question.text;
        },
        "know": () => {
            console.log("know");
            const currentQuestion = getCurrentQuestion();
            if(!currentQuestion) return;
            test.setQuestionStatus(currentQuestion, STATUSES.SUCCESS);
            updateCounters();
        },
        "dontKnow": () => {
            console.log("dont know");
            const currentQuestion = getCurrentQuestion();
            if(!currentQuestion) return;
            test.setQuestionStatus(currentQuestion, STATUSES.WRONG);
            updateCounters();
        },
        "nextWrong": () => {
            console.log("next wrong");
            const question = test.getRandomWrongQuestion();
            setCurrentQuestion(question);
            $closestTest.querySelector(".question").innerText = question.text;
        }
    }

    function setCurrentQuestion(question) {
        $.data($closestTest, "currentQuestion", question);
    }

    function getCurrentQuestion() {
        return $.data($closestTest).currentQuestion
    }

    function updateCounters() {
        const counters = {
            [STATUSES.WRONG]: 0,
            [STATUSES.SUCCESS]: 0,
            [STATUSES.NOT_ANSWERED]: 0
        };
        test.getAllQuestions().forEach(q => counters[q.status] ? counters[q.status]++ : counters[q.status] = 1);
        $closestTest.querySelector(".counters").innerText = Object.entries(counters).map(counter => counter.join(" ")).join("\n");
    }

    Object.entries(e.target.dataset).map(x => x[0]).forEach(action => actions[action] && actions[action]());
})