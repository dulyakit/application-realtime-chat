// src/index.ts
import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import bodyParser from 'body-parser'
import schema from './schema'
import { PORT, allowedOrigins } from './config'
import { verifyTokenAndGetUserId } from './utils/auth'
import { storeConnection, removeConnection } from './connections'
import { execute, subscribe } from 'graphql'
import { Context } from 'graphql-ws' // Import

// Define a custom context type
interface MyContext {
  userId?: string | number | null
  connectionId?: string
}

async function startServer() {
  const app = express()
  const httpServer = createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  })

  const serverCleanup = useServer(
    {
      schema,
      execute,
      subscribe,
      onConnect: async (ctx) => {
        // Authentication
        const token = ctx.connectionParams?.authToken as string
        const userId = verifyTokenAndGetUserId(token)

        if (!userId) {
          throw new Error('Missing auth token!')
        }
        console.log(`Client connected: User ID ${userId}`)

        // Store connection
        const connectionId = generateConnectionId()
        await storeConnection(userId, connectionId)

        // VERY IMPORTANT:  Return a plain object, NOT a Promise.
        return { userId, connectionId }
      },
      onDisconnect: async (ctx, code, reason) => {
        // Correctly get the context.  We assert the type here.

        // Use type assertion AND optional chaining
        const context = ctx.extra as { context?: MyContext }

        if (context?.context?.userId && context?.context?.connectionId) {
          await removeConnection(
            context.context.userId,
            context.context.connectionId
          )
          console.log(
            `Client disconnected: User ID ${context.context.userId}, Reason: ${reason}, Code: ${code}`
          )
        } else {
          console.log(
            `Client disconnected: No user ID or connection ID found in context, Reason: ${reason}, Code: ${code}`
          )
        }
      },
    },
    wsServer
  )

  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
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
      origin: allowedOrigins,
      credentials: true,
    }),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        if (req) {
          const authHeader = req.headers.authorization || ''
          const token = authHeader.replace('Bearer ', '')
          const userId = verifyTokenAndGetUserId(token)
          return { userId }
        }
        return {}
      },
    })
  )

  // Request logging middleware (optional, but helpful)
  app.use('/graphql', (req, res, next) => {
    console.log(`HTTP request: ${req.method} ${req.originalUrl}`)
    console.log('Request body:', req.body)
    next()
  })

  // Error handling middleware (optional, but good practice)
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

  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`)
    console.log(`Subscriptions ready at ws://localhost:${PORT}/graphql`)
  })
}

// Helper function for generating connection IDs (use a library in production!)
function generateConnectionId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}

startServer()
