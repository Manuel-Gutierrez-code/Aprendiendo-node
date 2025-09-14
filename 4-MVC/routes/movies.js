import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'

export const movieRouter = Router()

movieRouter.get('/', MovieController.getAll)

movieRouter.get('/:id', MovieController.getById)

movieRouter.post('/', MovieController.create)

movieRouter.delete('/:id', MovieController.delete)

movieRouter.patch('/:id', MovieController.update)
