import { Router } from 'express'
import { MovieModel } from '../models/movie.js'
import movies from '../movies.json' with { type: 'json' }
import { randomUUID } from 'crypto'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export const movieRouter = Router()

const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://movies.com'
]

movieRouter.get('/', async (req, res) => {
    const origin = req.header('origin')

    if (ACCEPTED_ORIGINS.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin)
    }

    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    res.json(movies)
})

movieRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
})

movieRouter.post('/', async (req, res) => {
    const result = validateMovie(req.body)

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    const newMoive = await MovieModel.create({ input: result.data })

    res.status(201).json(newMoive)
})

movieRouter.delete('/:id', async (req, res) => {
    const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin)
    }

    const { id } = req.params

    const result = await MovieModel.delete({ id })

    if (result === false) return res.status(404).json({ message: 'Movie not found' })

    return res.json({ message: 'Movie deleted' })
})

movieRouter.patch('/:id', async (req, res) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) return res.status(404).json({ error: JSON.parse(result.error.message) })

    const { id } = req.params
    
    const updateMovie = await MovieModel.update({ id, input: result.data })

    return res.json(updateMovie)
})
