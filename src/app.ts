import fastify, { type FastifyInstance } from 'fastify'
import registerRoutes from './routes/registerRoutes'
import fastifyMultipart from '@fastify/multipart'

const swaggerOps = {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Face Ecoding Test API swagger',
      description: 'API documentation for Face Ecoding Test API',
      version: '0.0.1'
    }
  }
}

const swaggerUiOps = {
  routePrefix: '/',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  staticCSP: true
}

export default function buildFastify (opts = {}): FastifyInstance {
  const app = fastify(opts)

  app.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024 // 10 MB
    }
  })
  app.register(require('@fastify/swagger'), swaggerOps)
  app.register(require('@fastify/swagger-ui'), swaggerUiOps)
  app.register(registerRoutes)

  return app
}
