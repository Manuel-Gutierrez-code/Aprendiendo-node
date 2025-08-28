const path = require('node:path')

console.log(path.sep)

const filePhat = path.join('content', 'subfolder', 'test.txt')
console.log(filePhat)

const base = path.basename(filePhat)
console.log(base)

const extension = path.extname(filePhat) //Devuelve la extensión
console.log(extension)