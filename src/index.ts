import { Registry, Gauge } from "prom-client"
import _ from "lodash"
import axios from "axios"
import express from "express"
import morgan from "morgan"

const app = express()
const registry: Registry = new Registry()

app.use(morgan("common"))

const keyNameMapping = {
  active: "active_total",
  cases: "cases_total",
  casesPerOneMillion: "cases_per_one_million",
  critical: "critical_total",
  deaths: "deaths_total",
  recovered: "recovered_total",
  todayCases: "today_cases_total",
  todayDeaths: "today_deaths_total",
}

const initRegistry = _.once(registry => {
  for (const key in keyNameMapping) {
    const metric = keyNameMapping[key]
    const gauge: Gauge<string> = new Gauge({
      name: `covid_${metric}`,
      help: key,
      labelNames: ["country"],
    })
    registry.registerMetric(gauge)
  }
  registry.setDefaultLabels({ country: "USA" })
})

app.get("/metrics", async (__, res) => {
  const {
    data: { country, ...stats },
  } = await axios.get("https://corona.lmao.ninja/countries/usa")

  for (const key in stats as { [key: string]: any }) {
    const metricKey = `covid_${keyNameMapping[key]}`

    const value = _.get(stats, key)
    const gauge = registry.getSingleMetric(metricKey) as Gauge<any>
    gauge.set({ country }, value)
  }

  const metricsString = registry.metrics()

  res.setHeader("contentType", "text/plain")
  res.status(200).send(metricsString)
})

initRegistry(registry)
const port = process.env.PORT || 3000
app.listen(port).on("listening", () => console.log(`Running on port ${port}.`))

export default app
