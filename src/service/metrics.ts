import { Gauge, Registry } from 'prom-client'
import _ from 'lodash'
import axios from 'axios'

const worldometerKeyNameMapping = {
  state:  'state',
  cases: 'cases_total',
  active: 'active_total',
  testsPerOneMillion: 'tests_per_one_million_total',
  deaths: 'deaths_total',
  todayCases: 'today_cases_total',
  todayDeaths: 'today_deaths_total',
  tests: 'tests_total',
}

const jhuKeyNameMapping = {
  province: 'province',
  country:  'country',
  stats:  'stats'
}

const 
export default class MetricsProvider {
  private static initRegistry = _.once(() => {
    if (MetricsProvider.registry != null) {
      return MetricsProvider.registry
    }

    const registry = new Registry()
    registry.setDefaultLabels({ country: 'unknown' })

    for (const key in keyNameMapping) {
      const metric = keyNameMapping[key]
      const gauge: Gauge<string> = new Gauge({
        name: `covid_${metric}`,
        help: key,
        labelNames: ['country', 'province', 'source'],
      })
      registry.registerMetric(gauge)
    }

    return registry
  })

  static registry: Registry = MetricsProvider.initRegistry()

  public static getMetrics = async () => {
    const registry = MetricsProvider.registry
    const states = _.get(
      await axios.get('https://corona.lmao.ninja/v2/states'),
      'data',
    )
    _.each(states, (s) => {
      const { state, ...stats } = s
      for (const key in stats as { [key: string]: number }) {
        const metricKey = `covid_${worldometerKeyNameMapping[key]}`
        const value = _.get(stats, key)
        const gauge = registry.getSingleMetric(metricKey) as Gauge<any>
        if (value != null) {
          gauge.set(
            {
              country: 'USA',
              province: state,
              source: 'worldometer'
            },
            value,
          )
        }
      }
    })
    const blobs = _.get(
      await axios.get('https://disease.sh/v2/jhucsse'),
      'data',
    )
    _.each(blobs, (b) => {
      const { blob, ...stats } = b
      for (const key in stats as { [key: string]: number }) {
        const metricKey = `covid_${jhuKeyNameMapping[key]}`
        const value = _.get(stats, key)
        const gauge = registry.getSingleMetric(metricKey) as Gauge<any>
        if (value != null) {
          gauge.set(
            {
              country: blob['country'],
              province: blob['province'],
              source: 'jhu',
            },
            value,
          )
        }
      }
    }
    return registry.metrics()
  }
}
