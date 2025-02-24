import { createServer } from 'node:http'
import { dirname, join } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import finalhandler from 'finalhandler'
import serveStatic from 'serve-static'

const isCFEnvironment = env.VCAP_APPLICATION != null
const PORT = isCFEnvironment ? parseInt(env.PORT) : 3030
const uiPath = join(dirname(fileURLToPath(import.meta.url)), './dist')

const serve = serveStatic(uiPath)

const server = createServer(function onRequest(req, res) {
  serve(req, res, finalhandler(req, res))
})

server.listen(PORT, () => console.info(`App running at: http://localhost:${PORT}`))
