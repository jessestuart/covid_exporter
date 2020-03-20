import { register, Registry, Gauge } from "prom-client"
import _ from "lodash"
import axios from "axios"
import express from "express"

const app = express()

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

app.get("/metrics", async (__, res) => {
  register.clear()
  const {
    data: { country, ...stats },
  } = await axios.get("https://corona.lmao.ninja/countries/usa")
  console.log({ country, stats })
  // let { country, ...stats } = await got
  //   .get("https://corona.lmao.ninja/countries/usa")
  //   .json()

  const registry = new Registry()
  for (const key in stats as { [key: string]: any }) {
    const value = _.get(stats, key)
    const gauge: Gauge<string> = new Gauge({
      name: `covid_${keyNameMapping[key]}`,
      help: key,
    })
    gauge.set(value)

    registry.registerMetric(gauge)
  }
  const metricsString = registry.metrics()

  res.setHeader("contentType", "text/plain")
  res.status(200).send(metricsString)
})

app.listen(3000)

export default app

// import { monitor } from "./monitor"

// const { collectDefaultMetrics, Registry } = client
// const register = new Registry()

// Probe every 5th second.
// collectDefaultMetrics({ prefix: "sentry_stats_", register })

// const app = express()

// const sentryErrorsSummary: SummaryConfiguration<any> = {
//   help: "sentry_errors_summary",
//   name: "sentry_errors_summary",
// }

// const sentryCrashesSummary: SummaryConfiguration<any> = {
//   help: "sentry_crashes_summary",
//   name: "sentry_crashes_summary",
// }

// const SentryErrorsHistogram = new client.Summary(sentryErrorsSummary)
// const SentryCrashesHistogram = new client.Summary(sentryCrashesSummary)

// const config = {
//   SENTRY_AUTH:
//     "bcf533cdc4e84931be4d1b5b4c59bf91d1b4461421314e109e67a3befdfde810",
//   org: "eden",
//   project: "patient-app",
//   // filters: [
//   //   {
//   //     name: 'MyFilter',
//   //     searchTerms: ['items I want to see', 'MORE_ITEMS'],
//   //     tags: ['optional-sentry-tags-to-further-group-by-in-new-relic'],
//   //   },
//   // ],
// }

// app.get("/metrics", async (__, res) => {
//   const results = await getMetrics({})
//   const prodErrors = _.filter(results.data, event => {
//     const environment = _.get(
//       _.find(event.tags, { key: "environment" }),
//       "value"
//     )
//     const level = _.get(_.find(event.tags, { key: "level" }), "value")
//     return environment === "Production" && level === "error"
//   })
//   const prodCrashes = _.filter(results.data, event => {
//     const environment = _.get(
//       _.find(event.tags, { key: "environment" }),
//       "value"
//     )
//     const level = _.get(_.find(event.tags, { key: "level" }), "value")
//     return environment === "Production" && level === "fatal"
//   })
//   SentryErrorsHistogram.observe(_.size(prodErrors))
//   SentryCrashesHistogram.observe(_.size(prodCrashes))
//   register.registerMetric(SentryErrorsHistogram)
//   register.registerMetric(SentryCrashesHistogram)
//   res.send(register.metrics())
// })
