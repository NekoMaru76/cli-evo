
const keypress = require("keypress");

keypress(process.stdin);

module.exports = { 
  single: {
    prompt: require(`${__dirname}/lib/single/prompt.js`), 
    table: require(`${__dirname}/lib/single/table.js`),
    confirm: require(`${__dirname}/lib/single/confirm.js`)
  },
  multi: {
    prompt: require(`${__dirname}/lib/multi/prompt.js`),
    table: require(`${__dirname}/lib/multi/table.js`),
    confirm: require(`${__dirname}/lib/multi/confirm.js`)
  }
};