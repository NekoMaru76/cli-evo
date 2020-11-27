
const keypress = require("keypress");

keypress(process.stdin);

module.exports = { 
  prompt: require(`${__dirname}/lib/prompt.js`), 
  table : require(`${__dirname}/lib/table.js`) 
};