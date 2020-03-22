<h1 align="center">
  covid_exporter
</h1>

![CircleCI][shields] ![Docker Image Size (tag)][shields 2]

`covid_exporter` is a Node-based [Prometheus `exporter`][prometheus] providing
real-time updates on the spread of COVID-19 in the US. A preconfigured Docker
image is [available on Docker Hub][docker-hub] for easy deployment.
Alternatively, it is available as a hosted Serverless function at
[covid-prom.jesses.dev][jesses].

Builds on the excellent data-wrangling and responsibly-socially-distanced
collaboration that's gone into the [@NovelCOVID/API][api] project.

### Cool. What can I build with it?

Get creative! Grafana is a great tool for exploring novel (ha) ways of
visualizing data. Here's one of the dashboards I threw together using only the
data provided by this project (available for download at
[`grafana.com`][grafana]):

![Grafana Dashboard](/assets/covid-dashboard.png)

[shields]:
  https://img.shields.io/circleci/build/github/jessestuart/covid_exporter/master?label=CircleCI&logo=CircleCI&token=3b98137d49ab9779533b4d105bb21e5f4c70ca7b
[shields 2]:
  https://img.shields.io/docker/image-size/jessestuart/covid_exporter/latest?logo=Docker
[api]: https://github.com/@NovelCOVID/API
[docker-hub]: https://hub.docker.com/r/jessestuart/covid_exporter
[grafana]: https://grafana.com/grafana/dashboards/11965
[jesses]: https://covid-prom.jesses.dev
[prometheus]: https://prometheus.io/docs/instrumenting/exporters/
