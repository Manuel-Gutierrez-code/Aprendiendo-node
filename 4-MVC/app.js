import express, { json } from 'express'
import { movieRouter } from './routes/movies.js'

const app = express()
app.use(json())
app.disable('x-powered-by')

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://movies.com'
]

// Todos los recursos que sean MOVIES se identica con /movie
app.use('/movies', movieRouter)

app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin')

  if (ACCEPTED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  }
  res.send(200)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Servidor escuchando en le http://localhost:${PORT}`)
})
