<template>
  <div class="container text-center">
    <div class="container">
      <h1 id="stockSymbol">{{ `Stock Symbol: ${tickerName} (${curr_interval})` }}</h1>
    </div>

    <div class="container" id="indices-buttons">
      <div class="row justify-content-start">
        <div class="col-3">
          <button id="snp500" @click="selectSymbol('^GSPC')">S&P 500</button>
          <button id="nasdaq100" @click="selectSymbol('^NDX')">Nasdaq 100</button>
          <button id="dow30" @click="selectSymbol('^DJI')">Dow 30</button>
        </div>
      </div>
    </div>

    <div class="container" id="candlestick-chart">
      <!-- The candlestick chart will be rendered here -->
    </div>

    <div class="container-fluid">
      <div class="row justify-content-between">
        <div class="col-3" id="interval-options">
          <button id="allButton">All time</button>
          <button id="1m" @click="fetchDataAndUpdateChart('Monthly')">1 Month</button>
          <button id="1wk" @click="fetchDataAndUpdateChart('Weekly')">1 Week</button>
        </div>
        <div class="col-3" id="chart-type">
          <button id="candlestick" @click="chartType = 'candlestick'; fetchDataAndUpdateChart(curr_interval)">Candlestick</button>
          <button id="area" @click="chartType = 'area'; fetchDataAndUpdateChart(curr_interval)">Area</button>
        </div>
      </div>
    </div>

    <div class="container" id="trending-container">
      <div id="trending"></div>
      <div id="active"></div>
      <div id="gainer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

onMounted(() => {
  curr_interval.value = 'All';
  selectSymbol('^GSPC');
});

// CHART SECTION
var chart = null;
var chartType = 'candlestick';
var tickerName = ref('');
var tickerSymbol = ref('');
var curr_interval = ref('');

const dataCache = JSON.parse(localStorage.getItem('dataCache')) || {};

const selectSymbol = (symbol) => {
  tickerSymbol.value = symbol;
  fetchDataAndUpdateChart(curr_interval.value);
};

const fetchDataAndUpdateChart = async (interval) => {
  curr_interval.value = interval;
  const dataCacheKey = `${tickerSymbol.value}-${interval}`;

  if (dataCache[dataCacheKey] && typeof dataCache[dataCacheKey] === 'object') {
    const { tickerNameValue, chartData } = dataCache[dataCacheKey];
    renderChart(chartData);
    tickerName.value = tickerNameValue;
  } else {
    try {
      const chartData = await fetchData(interval, tickerSymbol.value);

      dataCache[dataCacheKey] = {
        tickerNameValue: tickerName.value,
        chartData: chartData,
      };

      localStorage.setItem('dataCache', JSON.stringify(dataCache));

      renderChart(chartData);
    } catch (error) {
      console.error(error);
    }
  }
};

const renderChart = (chartData) => {
  if (!chart) {
    const chartOptions = {
      chart: {
        type: chartType,
        name: tickerSymbol.value,
        height: 400,
        width: 1200,
      },
      series: [
        {
          data: chartData,
        },
      ],
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
    };

    // Render the chart
    chart = new ApexCharts(document.querySelector('#candlestick-chart'), chartOptions);
    chart.render();
    console.log('Chart Rendered');
  } else {
    if (chartType == 'area') {
      chart.updateSeries([
        {
          type: chartType,
          data: chartData,
          name: tickerName,
        },
      ]);
    } else {
      chart.updateSeries([
        {
          type: chartType,
          data: chartData,
        },
      ]);
    }
    console.log('Chart Updated');
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
        price.open.toFixed(2),
        price.high.toFixed(2),
        price.low.toFixed(2),
        price.close.toFixed(2)
      ]
    }))

    if (interval === 'Weekly') {
      chartData = chartData.slice(-7)
    } else if (interval === 'Monthly') {
      chartData = chartData.slice(-30)
    } else {
      chartData = chartData
    }
    
    return chartData
  } catch (error) {
    console.error(error)
  }
}
</script>
