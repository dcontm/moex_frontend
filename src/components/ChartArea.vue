<template>
  <v-container>
    <div class="text-center">
      <v-btn @click="fetchdata(1,'CANDLE_INTERVAL_5_MIN')" class="mx-2" fab dark x-small color="primary" outlined>5m</v-btn>
      <v-btn @click="fetchdata(2,'CANDLE_INTERVAL_15_MIN')" class="mx-2" fab dark x-small color="primary" outlined>15m</v-btn>
      <v-btn @click="fetchdata(3,'CANDLE_INTERVAL_HOUR')" class="mx-2" fab dark x-small color="primary" outlined>1h</v-btn>
      <v-btn @click="fetchdata(4,'CANDLE_INTERVAL_DAY')" class="mx-2" fab dark x-small color="primary" outlined>1d</v-btn>
      <br>
    </div>
    <div id="chart">
      <apexchart type="candlestick" height="420" :options="chartOptions" :series="series"></apexchart>
    </div>
    <div id="chart-bar">
      <apexchart type="bar" height="160" :options="chartOptionsBar" :series="seriesBar"></apexchart>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios'
import {getAPI} from '../axios-api'
export default {
  name: 'ChartArea',
  data: () => ({
    width: '',
    period: 4,
    interval: 'CANDLE_INTERVAL_DAY',
    series: [{
      data: [],
    }],
    seriesBar: [{
      data: []
    }],
  }),
  computed: {
    chartOptionsBar: function () {
      return {
        chart: {
          height: 160,
          type: 'bar',
          brush: {
            enabled: true,
            target: 'candles'
            } 
        },
        tooltip: {
          enabled: true,
          custom: function({series, seriesIndex, dataPointIndex, w}) {
            const info = w.config.series[seriesIndex].data[dataPointIndex]
            const months = ["Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября","Ноября", "Декабрья"]
            const date = new Date(info.x)
            const month = months[date.getMonth()]
            const day = date.getDate()
            const valueX = day+" "+month
            return '<div class="arrow_box">' +
            '<span>' +"Объем:"+series[seriesIndex][dataPointIndex] + '</span>' +
            '</div>'
          }
        },
        xaxis: {
          labels: {
            formatter: (value) => {
              return ''
            }
          }
        }
      }
    },
    chartOptions: function () {
      return  {
        chart: {
          type: 'candlestick',
          height: 320,
          id: 'candles'
        },
        title: {
          text: 'График стоимости',
          align: 'left'
        },
        grid: {
          show: true,
          xaxis: {
            lines: {
              show: true
              },
          }
        },
        noData: {
          text: "За последние 12 часов торгов не было!"
        },
        yaxis: {
          tooltip: {
            enabled: false
          },
          crosshairs: {
            width:1,
            stroke: {
              color: 'blue',
              width: 1,
            }
          }
        },
        tooltip: {
          enabled: true,
          custom: function({series, seriesIndex, dataPointIndex, w}) {
            const info = w.config.series[seriesIndex].data[dataPointIndex]
            const months = ["Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября","Ноября", "Декабрья"]
            const date = new Date(info.x)
            const month = months[date.getMonth()]
            const day = date.getDate()
            const valueD = day+" "+month
            let valueT = date.getHours() +':'+ date.getMinutes()
            if (valueT.split(':')[1].length == 1) {
              valueT = valueT+'0'
            }
            const diff = info.y[3] - info.y[0]
            const pct_change = diff/((info.y[0])/100)
            const color = diff > 0 ? 'green' : "red";
            return '<div class="arrow_box">'+
            '<span style="color:blue;"><hr>'+valueD+' '+valueT+'</span><br><hr>'+
            `<span style="color:${color};">${diff} руб.%</span><br>`+
            '<span style="color:blue;">O: '+info.y[0]+'</span><br>'+
            '<span style="color:blue;">H: '+info.y[1]+'</span><br>'+
            '<span style="color:blue;">L: '+info.y[2]+'</span><br>'+
            '<span style="color:blue;">C: '+info.y[3]+'</span>'+
            '</div>'
          }
        },
        xaxis: {
          crosshairs: {
            width:1,
            stroke: {
              color: 'blue',
              width: 1,
              dashArray: 0
            }
          },
          labels: {
            formatter: (value) => {
              const months = ["Янв.","Фев.","Март","Апр.","Май","Июнь","Июль","Авг.","Сент.","Окт.","Нояб.", "Дек"]
              const ticker = new Date(value)
              const month = ticker.getMonth()
              const day = ticker.getDate()
              const hour = ticker.getHours()
              const minute = ticker.getMinutes()
              if (this.period === 3){
                if (hour === 10) {
                  return day
                }
                else {
                  return ''
                }
              }
              else if (this.period === 4) {
                if (day === 1) {
                  return months[month]
                }
                else if (day === 15) {
                  return day
                }
                else {
                  return ''
                }
              }
              else {
                if (hour === 10) {
                  return day
                }
                if (minute === 0) {
                  return hour+':00'
                }
                else {
                  return ''
                }
              }
            }
          },
        }
      }
    }
  },
  created () {
    this.fetchdata(this.period,this.interval)
    let fetchInterval = setInterval(()=> {
      let updated = this.fetchdata(this.period,this.interval)
    },2000)

    this.$once('hook:beforeDestroy', () => clearInterval(fetchInterval));
  },
  methods: {
    fetchdata (period, interval) {
      this.period = period
      this.interval = interval
      const figi = this.$route.params.figi
      const config = {headers: { 'Authorization': 'Bearer ' + this.$store.getters.getToken}, params: {period:period,interval:interval}}
      getAPI.get("/shares/"+figi+"/candles",config)
      .then(response => (this.build(response, period)))
      .catch(error => console.log(error))
    },

    build(candles_data, period) {
      const result = Object.values(candles_data.data).map(values => 
                    new Object({'x': values.time, 'y':[values.open, values.high, values.low, values.close]})
                    )
      const resultbar = Object.values(candles_data.data).map(values => values.volume)
      this.series = [{data:result}]
      this.seriesBar = [{data:resultbar}]
    },
  }
}
</script>
