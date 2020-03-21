import express from 'express'
import morgan from 'morgan'

import Metrics from './service/metrics'

const app = express()
app.use(morgan('common'))

app.get('/metrics', async (__, res) => {
  const metrics = await Metrics.getMetrics()

  res.type('text/plain').send(metrics)
})

const port = process.env.PORT || 3000
app.listen(port).on('listening', () => console.log(`Running on port ${port}.`))
