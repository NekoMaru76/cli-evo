const ask = require(`${__dirname}/../single/confirm.js`);

module.exports = async function(questions) {
    if (!Array.isArray(questions)) throw new Error("questions must be an array");
  
    let answers = [];
    
    for (let q of questions) {
      answers.push(await ask(q));
    }
  
    return answers;
};