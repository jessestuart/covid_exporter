"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prom_client_1 = require("prom-client");
const lodash_1 = __importDefault(require("lodash"));
const got_1 = __importDefault(require("got"));
const express_1 = __importDefault(require("express"));
const app = express_1.default();
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
};
app.get("/metrics", async (__, res) => {
    prom_client_1.register.clear();
    let _a = await got_1.default
        .get("https://corona.lmao.ninja/countries/usa")
        .json(), { country } = _a, stats = __rest(_a, ["country"]);
    const registry = new prom_client_1.Registry();
    for (const key in stats) {
        const value = lodash_1.default.get(stats, key);
        const gauge = new prom_client_1.Gauge({
            name: `covid_${keyNameMapping[key]}`,
            help: key,
        });
        gauge.set(value);
        registry.registerMetric(gauge);
    }
    const metricsString = registry.metrics();
    res.setHeader("contentType", "text/plain");
    res.status(200).send(metricsString);
});
console.log("port", { port: process.env.PORT });
app.listen(3000);
exports.default = app;
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
//# sourceMappingURL=index.js.map