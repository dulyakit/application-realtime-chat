import express, { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { getMessages, createMessage, getChat } from './messageController'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080
const DATABASE_URL = process.env.DATABASE_URL || ''

app.use(express.json())

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal Server Error' })
})

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err: mongoose.Error) => {
    console.error('Mongoose could not connect:', err)
  })

app.get('/messages', getMessages)
app.post('/messages', createMessage)
app.post('/chat', getChat)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`)
})
