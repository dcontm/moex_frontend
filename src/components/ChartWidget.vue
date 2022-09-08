<template>
  <v-container>
    <div>
      <v-btn @click="fetchdata(1,'CANDLE_INTERVAL_5_MIN')" class="mx-2" fab dark x-small color="primary" outlined>5m</v-btn>
      <v-btn @click="fetchdata(2,'CANDLE_INTERVAL_15_MIN')" class="mx-2" fab dark x-small color="primary" outlined>15m</v-btn>
      <v-btn @click="fetchdata(3,'CANDLE_INTERVAL_HOUR')" class="mx-2" fab dark x-small color="primary" outlined>1h</v-btn>
      <v-btn @click="fetchdata(4,'CANDLE_INTERVAL_DAY')" class="mx-2" fab dark x-small color="primary" outlined>1d</v-btn>
      <br>
      <v-row class="py-5 px-5">
        <v-chip-group mandatory active-class="primary--text">
          <v-chip @click="changeTypeChart('candles')">Свечи</v-chip>
          <v-chip @click="changeTypeChart('line')">Линия</v-chip>
        </v-chip-group>
      </v-row>
    </div>
    <div id="chart" v-if="type_chart=='line'">
      <apexchart type="line" height="420" :options="chartOptionsLine" :series="series"></apexchart>
    </div>
    <div id="chart" v-else>
      <apexchart type="candlestick" height="420" :options="chartOptionsCandle" :series="series"></apexchart>
    </div>
    <div id="chart-bar">
      <apexchart type="bar" height="160" :options="chartOptionsBar" :series="seriesBar"></apexchart>
    </div>
  </v-container>
</template>

<script>
import {getAPI} from '../axios-api'
export default {
  name: 'ChartArea',
  data: () => ({
    type_chart: 'candles',
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
    chartOptionsCandle: function () {
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
            const pct_change = (diff/((info.y[0])/100)).toFixed(2)
            const color = diff > 0 ? 'green' : "red";
            return '<div class="arrow_box">'+
            '<span style="color:blue;"><hr>'+valueD+' '+valueT+'</span><br><hr>'+
            `<span style="color:${color};">${pct_change}%</span><br>`+
            '<span style="color:blue;">Откр.: '+info.y[0]+'</span><br>'+
            '<span style="color:blue;">Макс.: '+info.y[1]+'</span><br>'+
            '<span style="color:blue;">Мин.: '+info.y[2]+'</span><br>'+
            '<span style="color:blue;">Закр.: '+info.y[3]+'</span>'+
            '</div>'
          }
        },
        noData: {
          text: "За последние 12 часов торгов не было!"
        },
        yaxis: {
          tooltip: {
            enabled: false
          },
          labels: {
            formatter: (value) => {
              if (value > 10) {
                return value.toFixed(2)
              } else {
                return value.toFixed(5)
              }
            }
          },
          crosshairs: {
            width:1,
            stroke: {
              color: 'blue',
              width: 1,
            }
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
    },
    chartOptionsLine: function () {
      return {
        grid: {
          xaxis: {
              lines: {
                  show: true
              }
          },   
          yaxis: {
              lines: {
                  show: true
              }
          },  
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
            return '<div class="arrow_box">'+
            '<span style="color:blue;"><hr>'+valueD+' '+valueT+'</span><br><hr>'+
            '<span style="color:blue;">'+(info.y > 10 ? info.y.toFixed(2) : info.y.toFixed(5))+'руб.'+'</span><br>'+
            '</div>'
          }
        },
  
        noData: {
          text: "За последние 12 часов торгов не было!"
        },
        yaxis: {
          tooltip: {
            enabled: true
          },
          labels: {
            formatter: (value) => {
              if (value > 10) {
                return value.toFixed(2)
              } else {
                return value.toFixed(5)
              }
            }
          },
          crosshairs: {
            width:1,
            stroke: {
              color: 'blue',
              width: 1,
            }
          }
        },
        xaxis: {
          tooltip: {
            enabled: false
          },
          tickAmount:1,
          datetimeUTC: false,
          type: 'datetime',
          labels: {
            rotate:0,
            datetimeFormatter: {
                year: 'yyyy',
                month: "MMM 'yy",
                day: 'dd MMM',
                hour: 'HH:mm',
            },
          },
          crosshairs: {
            width:1,
            stroke: {
              color: 'blue',
              width: 1,
            }
          }
        },
      }
    },
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
      let result = []
      if (this.type_chart == "line") {
          result = Object.values(candles_data.data).map(values => 
            new Object({'x': values.time, 'y':((values.high+values.low)/2)})
            )
      }
      else {
          result = Object.values(candles_data.data).map(values => 
            new Object({'x': values.time, 'y':[values.open, values.high, values.low, values.close]})
            )
      }
      const resultbar = Object.values(candles_data.data).map(values => values.volume)
      this.series = [{data:result}]
      this.seriesBar = [{data:resultbar}]
    },

    changeTypeChart(type) {
      this.type_chart = type
    }
  }
}
</script>
