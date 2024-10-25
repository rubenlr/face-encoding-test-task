import buildFastify from './app'
import * as dotenv from 'dotenv'

dotenv.config()

function start () {
  const app = buildFastify({
    logger: {
      level: 'info'
    }
  })

  app.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    app.log.info(`server listening on ${address}`)
  })

  return app
}

start()
