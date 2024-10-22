import appBuild from './app'

const server = appBuild({
    logger: {
        level: 'info'
      }
})

server.listen({ port: 3000 }, function (err, address) {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  server.log.info(`server listening on ${address}`)
})
