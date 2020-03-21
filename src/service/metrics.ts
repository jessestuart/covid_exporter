import { Gauge, Registry } from 'prom-client'
import _ from 'lodash'
import axios from 'axios'

const keyNameMapping = {
  active: 'active_total',
  cases: 'cases_total',
  casesPerOneMillion: 'cases_per_one_million',
  critical: 'critical_total',
  deaths: 'deaths_total',
  recovered: 'recovered_total',
  todayCases: 'today_cases_total',
  todayDeaths: 'today_deaths_total',
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
        labelNames: ['country', 'date', 'state'],
      })
      registry.registerMetric(gauge)
    }

    return registry
  })

  static registry: Registry = MetricsProvider.initRegistry()

  public static getMetrics = async () => {
    const registry = MetricsProvider.registry
    const states = _.get(
      await axios.get('https://corona.lmao.ninja/states'),
      'data',
    )
    // console.log(states)
    _.each(states, s => {
      const { state, ...stats } = s
      for (const key in stats as { [key: string]: number }) {
        const metricKey = `covid_${keyNameMapping[key]}`
        const value = _.get(stats, key)
        const gauge = registry.getSingleMetric(metricKey) as Gauge<any>
        gauge.set(
          {
            country: 'USA',
            state,
            date: new Date().toLocaleString('en-us').split(',')[0],
          },
          value,
        )
      }
    })
    // } = await axios.get('https://corona.lmao.ninja/countries/usa')

    // for (const key in stats as { [key: string]: number }) {
    //   const metricKey = `covid_${keyNameMapping[key]}`
    //   const value = _.get(stats, key)
    //   const gauge = registry.getSingleMetric(metricKey) as Gauge<any>
    //   gauge.set({ country }, value)
    // }

    return registry.metrics()
  }
}

// const registry: Registry = new Registry()

// const initRegistry = _.once(registry => {
//   for (const key in keyNameMapping) {
//     const metric = keyNameMapping[key]
//     const gauge: Gauge<string> = new Gauge({
//       name: `covid_${metric}`,
//       help: key,
//       labelNames: ['country'],
//     })
//     registry.registerMetric(gauge)
//   }
//   registry.setDefaultLabels({ country: 'USA' })
// })

// export const getMetrics = async (registry: Registry) => {
//   const {
//     data: { country, ...stats },
//   } = await axios.get('https://corona.lmao.ninja/countries/usa')

//   for (const key in stats as { [key: string]: any }) {
//     const metricKey = `covid_${keyNameMapping[key]}`

//     const value = _.get(stats, key)
//     const gauge = registry.getSingleMetric(metricKey) as Gauge<any>
//     gauge.set({ country }, value)
//   }

//   return registry.metrics()
// }
