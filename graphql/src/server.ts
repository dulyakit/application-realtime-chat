import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer' // Import
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import bodyParser from 'body-parser'
import schema from './schema'
import 'dotenv/config' // Use this instead of require('dotenv').config()

const PORT = process.env.PORT || 4001

;(async function () {
  const app = express()
  const httpServer = createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  })

  const serverCleanup = useServer(
    {
      schema,
    },
    wsServer
  )

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }), // Add plugin
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: ['http://192.168.0.15:3000', 'http://localhost:3000'], // ระบุ origin ที่อนุญาติทั้งหมด
      credentials: true,
    }),
    bodyParser.json(),
    expressMiddleware(server)
  )

  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`)
    console.log(`Subscriptions ready at ws://localhost:${PORT}/graphql`) // Add this line
  })

  wsServer.on('connection', (ws) => {
    console.log('Client connected to WebSocket')

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket')
    })

    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  })

  app.use('/graphql', (req, res, next) => {
    console.log(`HTTP request: ${req.method} ${req.originalUrl}`)
    console.log('Request body:', req.body) // Log request body
    next()
  })

  // Error handling middleware
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error(err.stack)
      res.status(500).send('Something broke!')
    }
  )
})()
