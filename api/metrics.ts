import { NowRequest, NowResponse } from '@now/node'

import Metrics from '../src/service/metrics'

export default async (_: NowRequest, res: NowResponse) => {
  const metrics = await Metrics.getMetrics()
  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send(metrics)
}
