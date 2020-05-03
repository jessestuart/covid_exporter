import { Gauge, Registry } from 'prom-client'
import _ from 'lodash'
import axios from 'axios'

const keyNameMapping = {
  state:  'state',
  cases: 'cases_total',
  active: 'active_total',
  testsPerOneMillion: 'tests_per_one_million_total',
  deaths: 'deaths_total',
  todayCases: 'today_cases_total',
  todayDeaths: 'today_deaths_total',
  tests: 'tests_total',
}

export default class MetricsProvider {
  private static initRegistry = _.once(() => {
    if (MetricsProvider.registry != null) {
      return MetricsProvider.registry
    }

    const registry = new Registry()
    registry.setDefaultLabels({ country: 'USA' })

    for (const key in keyNameMapping) {
      const metric = keyNameMapping[key]
      const gauge: Gauge<string> = new Gauge({
        name: `covid_${metric}`,
        help: key,
        labelNames: ['country', 'state'],
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
        const metricKey = `covid_${keyNameMapping[key]}`
        const value = _.get(stats, key)
        const gauge = registry.getSingleMetric(metricKey) as Gauge<any>
        if (value != null) {
          gauge.set(
            {
              country: 'USA',
              state,
            },
            value,
          )
        }
      }
    })

    return registry.metrics()
  }
}
