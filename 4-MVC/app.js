import express, { json } from 'express'
import cors from 'cors'
import { movieRouter } from './routes/movies.js'

const app = express()
app.use(json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:8081',
      'http://movies.com'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) return callback(null, true)

    return callback(new Error('Not allowed bt CORS'))
  }
}))

app.disable('x-powered-by')

// Todos los recursos que sean MOVIES se identica con /movie
app.use('/movies', movieRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Servidor escuchando en le http://localhost:${PORT}`)
})
