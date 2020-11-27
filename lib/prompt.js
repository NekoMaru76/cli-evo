const chalk    = require("chalk");
const ss       = require("string-similarity");
const readline = require("readline");

module.exports = async function(questions) {
    if (!Array.isArray(questions)) throw new Error("questions must be an array");
  
    let answers = [];
    
    function ask(q, extra) {
      if (!q.textColor) q.textColor = {
        question: "white",
        answer: "white",
        cursorOnOption: "yellow",
        cursorNotOnOption: "grey",
        answer_: "white",
        cursorOnSymbol: "yellow",
        cursorNotOnSymbol: "grey"
      };
  
      let input = [];
      let position = 0;
      let cQ;
      let cA;
      let cA_;
      let cOO;
      let cNOO;
      let cNOS;
      let cOS;
  
      if (typeof q == "object" && !Array.isArray(q)) {
        cQ = chalk[q.textColor.question || "white"];
        cA = chalk[q.textColor.answer || "white"];
        cOO = chalk[q.textColor.cursorOnOption || "yellow"];
        cNOO = chalk[q.textColor.cursorNotOnOption || "grey"];
        cOS = chalk[q.textColor.cursorOnSymbol || "yellow"];
        cNOS = chalk[q.textColor.cursorNotOnSymbol || "grey"];
        cA_ = chalk[q.textColor.answer_ || "white"];
  
        if (typeof q.onlyOption === "undefined" && typeof q.options === "object" && !Array.isArray(q.options)) q.onlyOption = false;
        if (q.autoCorrect === true && typeof q.options === "object" && !Array.isArray(q.options)) throw new TypeError("You cannot set autoCorrect to true if options is a JSON");
        if (typeof q.autoCorrect === "undefined") q.autoCorrect = false;
        if (typeof q.print === "undefined") q.print = true;
        if (typeof q.censor === "undefined") q.censor = false;
      } else {
        cQ = chalk.white;
        cA = chalk.white;
        cA_ = chalk.white;
        cOO = chalk.yellow;
        cNOO = chalk.grey;
        cOS = chalk.yellow;
        cNOS = chalk.grey;
      }
  
      if (!cQ) throw new TypeError(`Cannot found color ${q.textColor.question}`);
      if (!cA) throw new TypeError(`Cannot found color ${q.textColor.answer}`);
  
      function print(inp = input, printOption = true, text) {
        console.clear();
        if (text) console.log(text);
        const que = cQ(q.question || q);
        const ans = cA(q.censor ? inp.join("").split("").join("*") : inp.join(""));
        let options = "";
        if (typeof q.options === "object" && Array.isArray(q.options) && !!printOption) {
          if (inp.join("").length === 0 || !q.print && !q.censor) {
            if (q.options.length !== 0) {
              for (let i = 0; i < q.options.length; i++) {
                let a = `${i !== position-1 ? cNOS("○") : cOS(`●`)} ${q.options[i]}\n`;
  
                options += i === position-1 ? cOO(a) : cNOO(a);
              }
            }
          } else if (q.print) {
            let current = { text: null, score: 0 };
            let qop = [];
  
            for (let option of q.options) {
              qop.push({ short: option.length > inp.join("").length ? option.slice(0, -(option.length-inp.join("").length)) : option, full: option });
            }
  
            for (let option of qop) {
              let score = ss.compareTwoStrings(option.short.toLowerCase(), inp.join("").toLowerCase());
              if (current.score < score && score > 0.49) current = { text: option, score: score };
            }
  
            if (!current.text) {
              options = chalk.grey("?");
            } else options = chalk.grey(current.text.full);
          }
        }
        if (q.onlyOption !== true) console.log(chalk.red(`Select your answer from those options (Click Enter to submit your answer) or write the option as your answer or write your own answer!`));
        else console.log(chalk.red("Select your answer from those options (Click Enter to submit your answer) or write the option as your answer!"));
        console.log(`${que}${q.answer_ ? `\n${cA_(q.answer_)}` : ""} ${q.print === true ? ans : ""}\n${options}`);
        let ansLength = q.print === true ? input.join("").length : 0;
        let x = ansLength + q.question.length+1;
        if (position !== 0) {
          x = q.options[position-1].split("\n")[0].length + 2;
        } else if (q.answer_) {
          x = ansLength + q.answer_.length + 1;
        }
        readline.moveCursor(process.stdout,x, (q.question || q).split("\n").length-2-options.split("\n").length+position);
      }
  
      return new Promise(resolve => {
        print(undefined, true, extra);
  
        function getClick(ch, key) {
          if (!key) return input.push(ch), print();
          if (key.ctrl && key.name === "c") process.exit();
          else if (key.name === "space") {
            if (position) return;
            input.push(" ");
            print();
          } else if (key.name === "return" || key.name === "enter") {
            process.stdin.removeListener("keypress", getClick);
            function done() { 
              print(); 
              resolve(input.join("")); 
            }
            if (position === 0) {
              if (q.autoCorrect === true || typeof q.autoCorrect === "number") {
                let current = { text: null, score: 0 };
                let qop = [];
  
                for (let option of q.options) {
                  qop.push({ short: option.length > input.join("").length ? option.slice(0, -(option.length-input.join("").length)) : option , full: option });
                }
  
                for (let option of qop) {
                  let score = ss.compareTwoStrings(option.short.toLowerCase(), input.join("").toLowerCase());
                  if (current.score < score && score > (typeof q.autoCorrect === "number" ? q.autoCorrect : 0.69)) current = { text: option, score: score };
                }
  
                if (!current.text) {
                  if (q.onlyOption === true) return resolve(ask(q, chalk.red(`Invalid option!`)));
                  else done();
                } else {
                  print(current.text.full.split(""));
                  return resolve(current.text.full);
                }
              } else done();
            } else {
              print(q.options[position-1].split(""), false);
              return resolve(q.options[position-1]);
            } 
          } else if (key.name === "backspace") {
            if (position) return;
            delete input[input.length-1];
            input = input.filter(i => !!i);
          } else if (key.name === "up") {
            if (!position && input.join("").length !== 0 && q.print) return;
            if (!Array.isArray(q.options)) return;
            position--;
  
            if (position < 0) position = q.options.length;
          } else if (key.name === "down") {
            if (!position && input.join("").length !== 0 && q.print) return;
            if (!Array.isArray(q.options)) return;
            position++;
  
            if (position > q.options.length) position = 0;
          } else if (!position) input.push(key.shift ? key.name.toUpperCase() : key.name);
  
          print();
        }
  
        process.stdin.on("keypress", getClick);
        process.stdin.setRawMode(true);
        process.stdin.resume();
      });
    }
    
    for (let q of questions) {
      answers.push(await ask(q));
    }
  
    return answers;
};