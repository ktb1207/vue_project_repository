const path = require('path');

console.log(path.dirname(__filename)); // C:\kongtbCode\ssrDemo2
console.log(path.dirname(__dirname)); // C:\kongtbCode

console.log(path.join(__dirname, '/dist')); // C:\kongtbCode\ssrDemo2\dist
console.log()