const http = require('node:http')
const fs = require('node:fs')

const desiredPort = process.env.PORT || 1234

const processRequest = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  if (req.url === '/') {
    res.end('Bienvenido mi página de inicio')
  } else if (req.url === '/imagen') {
    fs.readFile('./2-API-desde_0/foto.jpg', (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end('<h1> 500 Internal server error </h1>')
      } else {
        res.setHeader('Content-Type', 'image/jpg')
        res.end(data)
      }
    })
  } else if (req.url === '/contacto') {
    res.end('Contacto')
  } else {
    res.statusCode = 404
    res.end('<h1> 404 </h1>')
  }
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
  console.log(`Server is running on port http://localhost:${desiredPort}`)
})
