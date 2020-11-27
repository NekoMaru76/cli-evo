const chalk = require("chalk");
const Table = require("table");

module.exports = async function(config) {
    if (!(!Array.isArray(config) && typeof config === "object")) throw new TypeError(`config must be an object`);
    if (!Array.isArray(config.options)) throw new TypeError(`options must be an array`);
    if (!Array.isArray(config.rows)) throw new TypeError(`rows must be an array`);
    if (!config.textColor) config.textColor = {
      tableBorder: "yellow",
      question   : "green",
      rows: "green",
      optionName: "blue",
      optionValue: "blue"
    };
    if (!config.tableBorder) config.tableBorder = "honeywell";
  
    let tC       = chalk[config.textColor.tableBorder || "yellow"];
    let tQ       = chalk[config.textColor.question    || "green" ];
    let tR       = chalk[config.textColor.rows        || "green" ];
    let tON      = chalk[config.textColor.optionName  || "blue"  ];
    let tOV      = chalk[config.textColor.optionValue || "blue" ];
    let selected = {};
    let position = {
      x: 0,
      y: 0
    };
  
    if (!tC ) throw new TypeError(`Cannot found ${config.textColor.tableBorder} color`);
    if (!tQ ) throw new TypeError(`Cannot found ${config.textColor.question   } color`);
    if (!tR ) throw new TypeError(`Cannot found ${config.textColor.rows       } color`);
    if (!tON) throw new TypeError(`Cannot found ${config.textColor.optionName } color`);
    if (!tOV) throw new TypeError(`Cannot found ${config.textColor.optionValue} color`);
  
    for (let ans of config.rows) {
      selected[ans.name] = {};
  
      if (typeof ans.onlyOneAnswer === "undefined") ans.onlyOneAnswer = false;
  
      for (let a of config.options) {
        selected[ans.name][a] = false;
      }
    }
  
    function print(extra) {
      console.clear();
      if (extra) console.log(chalk.red(extra));
      console.log(chalk.red(`Select your answer(s) by click Space on them and submit your final answer(s) with Enter! And you can move your cursor with keypad/wasd!`))
      console.log(tQ(config.question));
  
      let datas = [[""]];
      let configTable = {
        border: Table.getBorderCharacters(config.tableBorder),
        columns: [{ aligmnent: "center" }]
      };
  
      config.options.forEach(ans => {
        datas[0].push(tON(ans));
      });
  
      let y = 0;
      for (let [k,v] of Object.entries(selected)) {
        let n = [];
        let x = 0;
  
        for (let j of Object.values(v)) {
          n.push(tOV(j ? (position.x === x && position.y === y ? "[ ● ]" : " ● ") : (position.x === x && position.y === y ? "[ ○ ]" : " ○ ")));
          configTable.columns.push({ alignment: "center" });
  
          x++;
        }
  
        datas.push([tR(k),...n]);
  
        y++;
      }
  
      console.log(tC(Table.table(datas, configTable)));
    }
  
    return new Promise((resolve) => {
      function listener(ch,key) {
        if (!key) return;
    
        if (key.ctrl && key.name === "c") {
          process.exit();
        } else if (key.name === "up" || key.name === "w") {
          position.y--;
    
          if (position.y < 0) position.y = config.rows.length-1;
    
          print();
        } else if (key.name === "left" || key.name === "a") {
          position.x--;
    
          if (position.x < 0) position.x = Object.values(selected[Object.keys(selected)[0]]).length-1;
    
          print();
        } else if (key.name === "right" || key.name === "d") {
          position.x++;
    
          if (position.x > Object.values(selected[Object.keys(selected)[0]]).length-1) position.x = 0;
    
          print();
        } else if (key.name === "down" || key.name === "s" || key.name === "x") {
          position.y++;
    
          if (position.y > config.rows.length-1) position.y = 0;
    
          print();
        } else if (key.name === 'space') {
          let total = 0;
          let m     = selected[Object.keys(selected)[position.y]];
  
          for (let i = 0; i < Object.values(m).length; i++) {
            if (selected[Object.keys(selected)[position.y]][Object.keys(m)[i]] === true && i !== position.x) total++;
  
            if (total >= config.rows[position.y].maxTotalAnswers) return print(`You only can submit ${total} answers.`);
          }
  
          m = selected[Object.keys(selected)[position.y]];
          let k = m[Object.keys(m)[position.x]];
          if (k) selected[Object.keys(selected)[position.y]][Object.keys(m)[position.x]] = false;
          else selected[Object.keys(selected)[position.y]][Object.keys(m)[position.x]] = true;
  
          m = selected[Object.keys(selected)[position.y]];
          k = m[Object.keys(m)[position.x]];
  
          print();
        } else if (key.name === "enter" || key.name === "return") {
          process.stdin.removeListener("keypress", listener);
          return resolve(selected);
        }
      }
    
      process.stdin.on("keypress", listener);
      process.stdin.setRawMode(true);
      process.stdin.resume();
    
      print();
    });
};