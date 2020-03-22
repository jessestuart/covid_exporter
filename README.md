<h1 align="center">
  covid_exporter
</h1>

`covid_exporter` is a Node-based [Prometheus `exporter`][prometheus] providing
real-time updates on the spread of COVID-19 in the US. A preconfigured Docker
image is [available on Docker Hub][docker-hub] for easy deployment.
Alternatively, it is available as a hosted Serverless function at
[covid-prom.jesses.dev](https://covid-prom.jesses.dev).

Builds on the excellent data-wrangling and responsibly-socially-distanced
collaboration that's gone into [@NovelCOVID/API][api].

### Cool. What can I build with it?

Get creative! Grafana is a great tool for exploring novel (ha) ways of
visualizing data. Here's one of the dashboards I threw together using only the
data provided by this project:

![Grafana Dashboard](/assets/covid-dashboard.png)

[api]: https://github.com/@NovelCOVID/API
[docker-hub]: https://hub.docker.com/r/jessestuart/covid_exporter
[prometheus]: https://prometheus.io/docs/instrumenting/exporters/
