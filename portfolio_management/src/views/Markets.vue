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


    <!-- market Sentiment -->
    <div class="sentiment-label">Market Sentiment:
      <span :class="[sentimentBool ? 'text-positive' : 'text-negative']">{{ sentiment }}</span>
    </div>
    <div id="sentimentLine" class="table justify-content-center">
      <table>
        <tr>
          <th>Positive:</th>
          <th>Negative:</th>
        </tr>

        <tr>
          <td>{{ positive }}</td>
          <td>{{ negative }}</td>


        </tr>
      </table>
    </div>
    <!-- News section -->

    <div class="container">
      <div class="row my-4">
        <div class="col-lg-6 col-md-6 mb-md-0 mb-4">

          <div v-for="(article, index) in newsData.slice(0, 2)" :key="index">
            <div class="card m-2 news blur blur-rounded shadow-lg" style="width: 800px; height: 150px;">
              <div class="row g-0">
                <div class="col-md-4">
                  <img :src="article.article_photo_url" class="img-fluid rounded-start"
                    style="object-fit: cover;max-width: 266px; max-height: 150px;">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">{{ article.article_title }}</h5>
                    <p class="card-text">{{ article.article_summary }}</p>
                    <a :href="article.article_url" target="_blank" class="btn btn-primary mt-auto">Read Article</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="showmore" class="container-fluid justify-content-center" v-show="showButtonValue">
            <div class="row justify-cotent-center">
              <div v-for="(article, index) in newsData.slice(2)" :key="index">
                <div class="card m-2 news blur blur-rounded shadow-lg" style="width: 800px; height: 150px;">
                  <div class="row g-0">
                    <div class="col-md-4">
                      <img :src="article.article_photo_url" class="img-fluid rounded-start"
                        style="object-fit: cover;max-width: 266px; max-height: 150px;">
                    </div>
                    <div class="col-md-8">
                      <div class="card-body">
                        <h5 class="card-title">{{ article.article_title }}</h5>
                        <p class="card-text">{{ article.article_summary }}</p>
                        <a :href="article.article_url" target="_blank" class="btn btn-primary mt-auto">Read Article</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button @click="toggleShowMore" id="showButton" class="btn btn-primary" style="margin: 10px">
            {{ showButtonValue ? 'Show Less' : 'Show More' }}
          </button>

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

  const fetchNewsPromise = new Promise((resolve) => {

    const getMarketNews = async () => {

      const options = {
        method: 'GET',
        url: 'https://real-time-finance-data.p.rapidapi.com/market-trends',
        params: {
          trend_type: 'MOST_ACTIVE',
          country: 'us',
          language: 'en'
        },
        headers: {
          'X-RapidAPI-Key': '7e1df04ca4mshc42d90db4b929b5p114deejsn28c65bd112fb',
          'X-RapidAPI-Host': 'real-time-finance-data.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        console.log(response.data.data.news);
        newsData.value = response.data.data.news
        console.log(newsData.value)
        const titlearray = response.data.data.news.map(article => article.article_title);
        titles.value = titlearray.join(' ')
        console.log(titles.value)
        resolve()
      } catch (error) {
        console.error(error);

      }
    }
    getMarketNews()
})

  fetchNewsPromise.then(() => {
    console.log(typeof (titles.value))
    marketSentiment(titles.value)
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
      'X-RapidAPI-Key': '7e1df04ca4mshc42d90db4b929b5p114deejsn28c65bd112fb',
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


// News Section
const sentiment = ref('Positive');
const sentimentBool = ref(true)
const titles = ref('');
const positive = ref('0.67');
const negative = ref('0.13');


const newsData = ref([]);
// News show more function

const showButtonValue = ref(false);


const toggleShowMore = () => {
  showButtonValue.value = !showButtonValue.value;
};

async function marketSentiment(newsdata) {
  const options = {
    method: 'GET',
    url: 'https://easy-sentiment-analysis.p.rapidapi.com/sentiment1',
    params: {
      text: newsdata
    },
    headers: {
      'X-RapidAPI-Key': '985bf11bb6msh4df2b70c188b165p124b6fjsn68131220f132',
      'X-RapidAPI-Host': 'easy-sentiment-analysis.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data)

    // sentiment.value = response.data.Sentiment.Sentiment;
    if (sentiment.value !== 'Positive') {
      sentimentBool.value = false
    }

    console.log(response.data.Sentiment.SentimentScore.Positive)
    positive.value = Number(response.data.Sentiment.SentimentScore.Positive).toFixed(3);
    negative.value = Number(response.data.Sentiment.SentimentScore.Negative).toFixed(3);

    if (positive.value > negative.value) {
      sentiment.value = "Positive"
    }
    else {
      sentiment.value = "Negative"
    }

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

<style>
.news {
  transition: all 0.3s;
}

.news:hover {
  transform: scale(1.1);
}

.news:hover .card-text {
  display: block;
  white-space: normal;
}
</style>
