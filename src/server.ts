import appBuild from './app'

const host = appBuild({
  logger: {
    level: 'info'
  }
})

host.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    host.log.error(err)
    process.exit(1)
  }
  host.log.info(`server listening on ${address}`)
})

export default function server () {
  return host
}
