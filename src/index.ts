import Log from 'pino-http'
import fastify from 'fastify'

import Metrics from './service/metrics'

const app = fastify()
const logger = Log()

app.get('/metrics', async (req: fastify.FastifyRequest, res) => {
  logger(req.req, res.res)
  try {
    const metrics = await Metrics.getMetrics()
    res.type('text/plain').send(metrics)
  } catch (e) {
    console.error(e)
    throw e
  }
})

const port: number =
  process.env.PORT != null ? parseInt(process.env.PORT, 10) : 3000
app.listen(port, '0.0.0.0').then(() => {
  console.log(`Running on port ${port}.`)
})
