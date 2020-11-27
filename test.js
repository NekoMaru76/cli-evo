const cli = require(`${__dirname}/index.js`);

(async () => {
  await cli.prompt([{
    question: "How you greeting?",
    textColor: {
      question: "green",
      answer: "blue",
      answer_: "red",
      cursorOnOption: "cyan",
      cursorNotOnOption: "grey",
      cursorOnSymbol: "cyan",
      cursorNotOnSymbol: "grey"
    },
    options: ["Hi", "Hello"],
    autoCorrect: 0.50,
    onlyOption: true
  }, {
    question: "What's your gender?",
    textColor: {
      question: "green",
      answer: "blue",
      answer_: "red",
      cursorOnOption: "cyan",
      cursorNotOnOption: "grey",
      cursorOnSymbol: "cyan",
      cursorNotOnSymbol: "grey"
    },
    options: ["Male", "Female"],
    autoCorrect: 0.50,
    onlyOption: false,
    print: false
  }, {
    question: "How you breathing?",
    textColor: {
      question: "green",
      answer: "blue",
      answer_: "red",
      cursorOnOption: "cyan",
      cursorNotOnOption: "grey",
      cursorOnSymbol: "cyan",
      cursorNotOnSymbol: "grey"
    },
    answer_: "Answer:",
    options: ["I didn't breath", "inhale"],
    autoCorrect: 0.50,
    onlyOption: true
  }]);
  await cli.table({
    question: "What's your breakfast schedules?",
    textColor: {
      question: "green",
      tableBorder: "yellow",
      rows: "green",
      optionName: "blue",
      optionValue: "blue"
    },
    rows: [
      {
        name: "Monday",
        maxTotalAnswers: 1
      },
      {
        name: "Tuesday",
        maxTotalAnswers: 1
      },
      {
        name: "Wednesday",
        maxTotalAnswers: 1
      },
      {
        name: "Thursday",
        maxTotalAnswers: 1
      },
      {
        name: "Friday",
        maxTotalAnswers: 1
      },
      {
        name: "Saturday",
        maxTotalAnswers: 1
      },
      {
        name: "Sunday",
        maxTotalAnswers: 1
      }
    ],
    options: ["Sandwich", "Eag", "None", "Fried Rice"]
  });
  process.exit();
})();