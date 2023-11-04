<template>
  <main>
    <div class="container-fluid mt-7">
      <div class="col-lg-12 mx-auto">
        <div class="card z-index-2 blur blur-rounded shadow-lg">
          <div class="container-fluid" id="indices-buttons">
            <div class="row justify-content-start">
              <div class="col-lg-5 mt-4">
                <button class="btn bg-gradient-primary mx-1 d-sm-inline d-block" type="button" id="snp500" @click="selectSymbol('^GSPC')">
                  S&P 500
                </button>
                <button class="btn bg-gradient-primary mx-1 d-sm-inline d-block" type="button" id="nasdaq100" @click="selectSymbol('^NDX')">
                  Nasdaq 100
                </button>
                <button class="btn bg-gradient-primary mx-1 d-sm-inline d-block" type="button" id="dow30" @click="selectSymbol('^DJI')">
                  Dow 30
                </button>
              </div>
            </div>
          </div>
          <div class="card-header pb-0 pt-2">
            <h1 id="stockSymbol">{{ `Stock Symbol: ${tickerName} (${curr_interval})` }}</h1>
          </div>
          <div class="card-body py-3 px-0">
            <div class="container-fluid">
              <div class="row justify-content-center">
                <div class="col-12 mx-0" style="overflow-y:hidden; max-width: 100%;" id="candlestick-chart">
                  <!-- The candlestick chart will be rendered here -->
                </div>
              </div>
            </div>
          </div>

          <div class="container-fluid">
            <div class="row justify-content-between">
              <div class="col-lg-6 col-md-7 mb-3" id="interval-options">
                <button class="btn bg-gradient-primary mx-1 d-sm-inline d-block" id="allButton" @click="fetchDataAndUpdateChart('All')">
                  All time
                </button>
                <button class="btn bg-gradient-primary mx-1 d-sm-inline d-block" id="1m" @click="fetchDataAndUpdateChart('Monthly')">
                  1 Month
                </button>
                <button class="btn bg-gradient-primary mx-1 d-sm-inline d-block" id="1wk" @click="fetchDataAndUpdateChart('Weekly')">
                  1 Week
                </button>
              </div>
              <div class="col-xl-2 col-lg-1 col-md-6 mb-3" style="min-width: 25vh;" id="chart-type">
                <button class="btn bg-gradient-primary mx-1" id="candlestick" @click="
                  chartType = 'candlestick'; fetchDataAndUpdateChart(curr_interval)">
                  Candlestick
                </button>
                <button class="btn bg-gradient-primary mx-1" id="area" @click="
                  chartType = 'area'; fetchDataAndUpdateChart(curr_interval)">
                  Area
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row my-4">
        <div class="col-lg-6 col-md-6 mb-md-0 mb-4">
          <div class="card blur blur-rounded shadow-lg">
            <div class="card-header pb-0">
              <div class="row align-center">
                <div class="col-lg-6 col-7">
                  <h3>Day Gainers</h3>
                </div>
                <!-- <div class="col-lg-6 col-5 my-auto text-end">
                <div class="dropdown float-lg-end pe-4">
                  <a class="cursor-pointer" id="dropdownTable" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa fa-ellipsis-v text-secondary"></i>
                  </a>
                  <ul class="dropdown-menu px-2 py-3 ms-sm-n4 ms-n5" aria-labelledby="dropdownTable">
                    <li>
                      <a class="dropdown-item border-radius-md">Action</a>
                    </li>
                    <li>
                      <a class="dropdown-item border-radius-md">Another action</a>
                    </li>
                    <li>
                      <a class="dropdown-item border-radius-md">Something else here</a>
                    </li>
                  </ul>
                </div>
              </div> -->
              </div>
            </div>
            <div class="card-body px-0 pb-2">
              <div class="table-responsive">
                <table class="table mb-0">
                  <thead>
                    <tr>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Company
                      </th>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Price ($)
                      </th>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Change (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="quote in gainer" :key="quote.symbol">
                      <td>
                        <div class="d-flex px-3 py-1">
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">{{ quote.longName }}</h6>
                          </div>
                        </div>
                      </td>
                      <td class="align-middle text-sm">
                        {{ quote.regularMarketPrice }}
                      </td>
                      <td class="align-middle text-sm">
                        <span class="text-s font-weight-bold text-success"
                          :class="{ 'text-danger': quote.regularMarketChangePercent < 0 }">
                          {{ Number(quote.regularMarketChangePercent).toFixed(2) }} </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6 col-md-6 mb-md-0 mb-4">
          <div class="card blur blur-rounded shadow-lg">
            <div class="card-header pb-0">
              <div class="row align-center">
                <div class="col-lg-6 col-7">
                  <h3>Best Sectors</h3>
                </div>
                <!-- <div class="col-lg-6 col-5 my-auto text-end">
                <div class="dropdown float-lg-end pe-4">
                  <a class="cursor-pointer" id="dropdownTable" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa fa-ellipsis-v text-secondary"></i>
                  </a>
                  <ul class="dropdown-menu px-2 py-3 ms-sm-n4 ms-n5" aria-labelledby="dropdownTable">
                    <li>
                      <a class="dropdown-item border-radius-md">Action</a>
                    </li>
                    <li>
                      <a class="dropdown-item border-radius-md">Another action</a>
                    </li>
                    <li>
                      <a class="dropdown-item border-radius-md">Something else here</a>
                    </li>
                  </ul>
                </div>
              </div> -->
              </div>
            </div>
            <div class="card-body px-0 pb-2">
              <div class="table-responsive">
                <table class="table mb-0">
                  <thead>
                    <tr>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Sector
                      </th>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Monthly Change (%)
                      </th>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        YTD Change (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(sector, index) in top5Sectors" :key="index">
                      <td>
                        <div class="d-flex px-3 py-1">
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">{{ sector.description }}</h6>
                          </div>
                        </div>
                      </td>
                      <td class="align-middle text-sm text-success" :class="{ 'text-danger': sector.monthChange < 0 }">
                        {{ sector.monthChange }}
                      </td>
                      <td class="align-middle text-sm">
                        <span class="text-s font-weight-bold text-success"
                          :class="{ 'text-danger': sector.ytdChange < 0 }">
                          {{
                            sector.ytdChange }} </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
@media (min-width: 0px) {
  #candlestick-chart {
    overflow-x: auto;
  }
}

@media (min-width: 576px) {
  #candlestick-chart {
    overflow-x: auto;
  }
}

@media (min-width: 768px) {
  #candlestick-chart {
    overflow-x: hidden;
  }
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { parseString } from 'xml2js';

// CHART SECTION
var chart = null
var chartType = 'candlestick'
var tickerName = ref('')
var tickerSymbol = ref('')
var curr_interval = ref('')

const dataCache = JSON.parse(localStorage.getItem('dataCache')) || {}

onMounted(async () => {
  curr_interval.value = 'All'
  selectSymbol('^GSPC')
  const getDataPromise = new Promise((resolve) => {
    getGainerData()
    parseXML()
    resolve()
  })
  getDataPromise.then(() => {

  })
})

const selectSymbol = (symbol) => {
  tickerSymbol.value = symbol
  fetchDataAndUpdateChart(curr_interval.value)
}

const fetchDataAndUpdateChart = async (interval) => {
  curr_interval.value = interval
  const dataCacheKey = `${tickerSymbol.value}-${interval}`

  if (dataCache[dataCacheKey] && typeof dataCache[dataCacheKey] === 'object') {
    const { tickerNameValue, chartData } = dataCache[dataCacheKey]
    renderChart(chartData)
    tickerName.value = tickerNameValue
  } else {
    try {
      const chartData = await fetchData(interval, tickerSymbol.value)

      dataCache[dataCacheKey] = {
        tickerNameValue: tickerName.value,
        chartData: chartData
      }

      localStorage.setItem('dataCache', JSON.stringify(dataCache))

      renderChart(chartData)
    } catch (error) {
      console.error(error)
    }
  }
}

const renderChart = (chartData) => {
  if (!chart) {
    const chartOptions = {
      chart: {
        type: chartType,
        name: tickerSymbol.value,
        height: 400,
        width: 1700,
        labels: {
          style: {
            fontSize: '40px'
          }
        },
        responsive: [
          {
            breakpoint: 576,
            options: {
              chart: {
                height: 100,
                width: 300 // Adjust width for screens <576px
              },
              labels: {
                style: {
                  fontSize: '0.5rem'
                }
              }
            }
          },
          {
            breakpoint: 768,
            options: {
              chart: {
                height: 200,
                width: 500 // Adjust width for screens >=576px and <768px
              },
              labels: {
                style: {
                  fontSize: '0.6rem'
                }
              }
            }
          },
          {
            breakpoint: 992,
            options: {
              labels: {
                style: {
                  fontSize: '0.8rem'
                }
              }
            }
          },
          {
            breakpoint: 1200,
            options: {
              labels: {
                style: {
                  fontSize: '0.8rem'
                }
              }
            }
          },
          {
            breakpoint: 1600,
            options: {
              labels: {
                style: {
                  fontSize: '1rem'
                }
              }
            }
          }
        ]
      },      
      series: [
        {
          data: chartData
        }
      ],
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      }
    }

    
    // Destroy the existing chart if it exists
    if (chart) {
      chart.destroy();
    }

    // Render the chart
    chart = new ApexCharts(document.querySelector('#candlestick-chart'), chartOptions)
    chart.render()
    console.log('Chart Rendered')

    // Handle window resize events
    window.addEventListener('resize', resizeChart);
  } else {
    if (chartType == 'area') {
      chart.updateSeries([
        {
          type: chartType,
          data: chartData,
          name: tickerName
        }
      ])
    } else {
      chart.updateSeries([
        {
          type: chartType,
          data: chartData
        }
      ])
    }
    console.log('Chart Updated')
  }
}

const resizeChart = () => {
  const screenWidth = window.innerWidth;
  if (chart) {
    if (screenWidth < 768){
      chart.updateOptions({
      chart: {
        height: 250,
        width: 400,
      },
    });
    }
    else{
      chart.updateOptions({
      chart: {
        width: document.querySelector('#candlestick-chart').clientWidth,
      },
    });
    }
  }
};


// const resizeChart = () => {
//   if (chart) {
//     chart.updateOptions({
//       chart: {
//         height: document.querySelector('#candlestick-chart').clientHeight,
//         width: document.querySelector('#candlestick-chart').clientWidth,
//       },
//     });
//   }
// };

async function fetchData(interval, symbol_selected) {
  let historical_data = {
    method: 'GET',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-historical-data',
    params: {
      symbol: symbol_selected,
      region: 'US'
    },
    headers: {
      'X-RapidAPI-Key': 'empty',
      'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
  }

  let quotes = {
    method: 'GET',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
    params: {
      symbols: symbol_selected,
      region: 'US'
    },
    headers: {
      'X-RapidAPI-Key': 'empty',
      'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
  }

  if (interval === 'Weekly') {
    historical_data.params.period1 = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60
  } else if (interval === 'Monthly') {
    historical_data.params.period1 = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60
  } else {
    historical_data.params.period1 = '0' //default at ALL
  }

  try {
    const response = await axios.request(historical_data)
    const response_quotes = await axios.request(quotes)
    const stockData = response.data
    const quotesData = response_quotes.data

    tickerName.value = quotesData.quoteResponse.result[0].shortName
    let chartData = stockData.prices.map((price) => ({
      x: new Date(price.date * 1000), // Convert timestamp to Date
      y: [
        Number(price.open).toFixed(2),
        Number(price.high).toFixed(2),
        Number(price.low).toFixed(2),
        Number(price.close).toFixed(2)
      ]
    }))

    if (interval === 'Weekly') {
      chartData = chartData.slice(-7)
    } else if (interval === 'Monthly') {
      chartData = chartData.slice(-30)
    }

    return chartData
  } catch (error) {
    console.error(error)
  }
}

const gainer = ref([])

const getGainerData = async () => {
  const url = 'https://yahoo-finance15.p.rapidapi.com/api/yahoo/co/collections/day_gainers?start=0'
  const options = {
    method: 'GET',
    url: 'https://yahoo-finance15.p.rapidapi.com/api/yahoo/co/collections/day_gainers',
    params: { start: '0' },
    headers: {
      'X-RapidAPI-Key': 'empty',
      'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options)
    const result = await response.json()
    gainer.value = result.body.slice(0, 5)
  } catch (error) {
    console.error(error)
  }
}

const getSectorData = async () => {
  const options = {
    method: 'GET',
    url: 'https://fidelity-investments.p.rapidapi.com/market/get-sectors',
    headers: {
      'X-RapidAPI-Key': 'empty',
      'X-RapidAPI-Host': 'fidelity-investments.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const top5Sectors = ref([]);

// Define a function to clean and format the data
const cleanData = (rawData) => {
  return rawData.map((item) => ({
    description: item["DESCRIPTION"][0], // Extract the first item from the array
    monthChange: parseFloat(item["MONTH_CHANGE"][0]),
    ytdChange: parseFloat(item["YTD_CHANGE"][0]),
  }));
};


const parseXML = async () => {
  const xmlData = await getSectorData(); // Wait for the promise to resolve
  parseString(xmlData, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    const sectors = result.Chart.Symbol;

    // Sort sectors by MONTHLY Change in descending order
    sectors.sort((a, b) => b.MONTH_CHANGE - a.MONTH_CHANGE);

    // Clean and format the top 5 sectors data
    const cleanedData = cleanData(sectors.slice(0, 5));
    console.log(cleanedData);
    top5Sectors.value = cleanedData;
  });
};
</script>
