const chalk    = require("chalk");
const ss       = require("string-similarity");
const readline = require("readline");

module.exports = async function(question) {
    if (!(!Array.isArray(question) && typeof question === "object")) throw new Error("question must be an object");
    
    function ask(q, extra) {
      if (!q.textColor) q.textColor = {
        question: "white",
        answer: "white",
        answer_: "white"
      };
  
      let input = [];
      let cQ;
      let cA;
      let cA_;
  
      if (typeof q == "object" && !Array.isArray(q)) {
        cQ = chalk[q.textColor.question || "white"];
        cA = chalk[q.textColor.answer || "white"];
        cA_ = chalk[q.textColor.answer_ || "white"];
  
        if (typeof q.autoCorrect === "undefined") q.autoCorrect = false;
        if (typeof q.print === "undefined") q.print = true;
        if (typeof q.censor === "undefined") q.censor = false;
      } else {
        cQ = chalk.white;
        cA = chalk.white;
        cA_ = chalk.white;
      }
  
      if (!cQ) throw new TypeError(`Cannot found color ${q.textColor.question}`);
      if (!cA) throw new TypeError(`Cannot found color ${q.textColor.answer}`);
  
      function print(inp = input, text) {
        console.clear();
        if (text) console.log(chalk.red(text));
        const que = cQ(q.question || q);
        const ans = cA(q.censor ? inp.join("").split("").join("*") : inp.join(""));
        console.log(`${que} (y/N)${q.answer_ ? `\n${cA_(q.answer_)}` : ""} ${q.print === true ? ans : ""}`);
        let ansLength = q.print === true ? input.join("").length : 0;
        let x = ansLength + q.question.length+2 + "(y/n)".length;
        if (q.answer_) x = q.answer_.length;
        readline.moveCursor(process.stdout,x,((q.question || q).split("\n").length-2) + (q.answer_ ? 1 : 0));
      }
  
      return new Promise(resolve => {
        print(undefined, extra);
  
        function getClick(ch, key) {
          if (!key) return input.push(ch), print();
          if (key.ctrl && key.name === "c") process.exit();
          else if (key.name === "space") {
            input.push(" ");
            print();
          } else if (key.name === "return" || key.name === "enter") {
            function done(inq) {
              process.stdin.removeListener("keypress", getClick);
              print(); 
              resolve(inq); 
            }
            const combined = input.join("").toLowerCase();
            if (["y", "yes"].includes(combined)) done(true);
            else if (["n", "no"].includes(combined)) done(false);
            else return print(undefined, "Invalid Answer! You only can answer with `y/n`!");
          } else if (key.name === "backspace") {
            delete input[input.length-1];
            input = input.filter(i => !!i);
          } else input.push(key.shift ? key.name.toUpperCase() : key.name);
  
          print();
        }
  
        process.stdin.on("keypress", getClick);
        process.stdin.setRawMode(true);
        process.stdin.resume();
      });
    }
    
    return await ask(question);
};