console.log(process.argv) //argumentos de entrada

//process.exit(1) //controla proceso y su salida

process.on('exit', (code) => {  //podemos controlar eventos del proceso
    //limpiar los recursos
})

console.log(process.cwd()) // current working directory
