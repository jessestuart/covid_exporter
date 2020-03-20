import got from "got"
import prom from "prom-client"

import { NowRequest, NowResponse } from "@now/node"

const keyNameMapping = {
  active: "active_total",
  cases: "cases_total",
  casesPerOneMillion: "cases_per_one_million",
  country: "country",
  critical: "critical_total",
  deaths: "deaths_total",
  recovered: "recovered_total",
  todayCases: "today_cases_total",
  todayDeaths: "today_deaths_total",
}

export default async (_req: NowRequest, res: NowResponse) => {
  const stats = await got.get("https://corona.lmao.ninja/countries/usa").json()
  delete stats["country"]

  const registry = new prom.Registry()
  for (const key in stats as { [key: string]: any }) {
    const value = stats[key]
    const gauge: prom.Gauge<string> = new prom.Gauge({
      name: `covid_${keyNameMapping[key]}`
      help: key,
    })
    gauge.set(value)

    registry.registerMetric(gauge)
  }

  res.setHeader("contentType", "text/plain")
  res.status(200).send(registry.metrics())
}
