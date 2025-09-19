import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { createClient } from '@libsql/client'
import 'dotenv/config'

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
})

await turso.execute(`
  CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT
  )`)

const port = process.env.PORT || 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {}
})

io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado')

  socket.on('disconnect', () => {
    console.log('Cliente desconectado')
  })

  socket.on('chat message', async (msg) => {
    let result

    try {
      result = await turso.execute({
        sql: 'INSERT INTO messages (content) VALUES (:msg)',
        args: { msg }
      })
    } catch (e) {
      console.error(e)
      return
    }

    io.emit('chat message', msg, result.lastInsertRowid.toString())
  })

  if (!socket.recovered) {
    try {
      const result = await turso.execute({
        sql: 'SELECT id, content FROM messages WHERE id > ?',
        args: [socket.handshake.auth.serverOffset || 0]
      })

      result.rows.forEach(row => {
        socket.emit('chat message', row.content, row.id.toString())
      })
    } catch (e) {
      console.error(e)
    }
  }
})

app.use(logger('dev'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})
