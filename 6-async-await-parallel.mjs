import { readFile } from "node:fs/promises"

Promise.all([
    readFile('./archivo.txt', 'utf-8'),
    readFile('./archivo-2.txt', 'utf-8')
]).then(([texto1, texto2]) => {
    console.log(texto1)
    console.log(texto2)
})