<template>
  <div class="container-fluid text-center">
    <div class="container">
      <!-- Display the selected stock symbol -->
      <h1 id="stockSymbol">{{ `Stock Symbol: ${selectedSymbol} (${curr_interval})` }}</h1>
    </div>

    <div class="container" id="chart">
      <!-- The chart will be rendered here -->
    </div>

    <div class="container-fluid">
      <div class="row justify-content-between">
        <div class="col-3" id="intervalOptions">
          <button id="allButton" @click="fetchDataAndUpdateChart('All')">All Time</button>
          <button id="1m" @click="fetchDataAndUpdateChart('Monthly')">Monthly</button>
          <button id="1wk" @click="fetchDataAndUpdateChart('Weekly')">Weekly</button>
        </div>
        <div class="col-3" id="chart-type">
          <button id="candlestick"
            @click="chartType = 'candlestick'; fetchDataAndUpdateChart(curr_interval)">Candlestick</button>
          <button id="area" @click="chartType = 'area'; fetchDataAndUpdateChart(curr_interval)">Area</button>
        </div>
      </div>
    </div>

    <!-- news section-->
    <div class="container">
      <div class="container-fluid" id="news">
        <!-- only first 2 will show -->
        <div class="row">
          <div v-for="article in newsData.articles.slice(0, 2)" :key="article.title" class="col-lg-6">
            <div class="card m-2" style="width:40rem">
              <img height="300" :src="article.urlToImage" class="card-img-top" alt="...">
              <div class="card-body" style="height: 200px;">
                <h5 class="card-title">{{ article.title }}</h5>
                <p v-if="article.description" class="card-text">{{ article.description.slice(0, 100) }}...</p>
                <a :href="article.url" target="_blank" class="btn btn-primary">Read Article</a>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div id="showmore" class="container-fluid justify-content-center" v-show="showButtonValue">
        <div class="row justify-cotent-center">
          <div v-for="article in newsData.articles.slice(2)" :key="article.title" class="col-lg-6">
            <div class="card m-2" style="width:40rem">
              <img height="300" :src="article.urlToImage" class="card-img-top" alt="...">
              <div class="card-body" style="height: 200px;">
                <h5 class="card-title">{{ article.title }}</h5>
                <p v-if="article.description" class="card-text">{{ article.description.slice(0, 100) }}...</p>
                <a :href="article.url" target="_blank" class="btn btn-primary">Read Article</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button @click="toggleShowMore" id="showButton" class="btn btn-primary" style="margin: 10px">
      {{ showButtonValue ? 'Show Less' : 'Show More' }}
    </button>

    <div class="container" id="comments-form">
      <input type="text" id="name-box" v-model="nameInput" placeholder="Enter name" />
      <input type="text" id="comment-box" v-model="commentInput" placeholder="Enter comment" />
      <button id="post" @click="addComment()">Comment</button>
      <div id="comments-section">
        <div class="card m-3" v-for="comment in comments">
          <div class="card-body">
            <h5 class="card-title">{{ comment.name }}</h5>
            <p class="card-text">{{ comment.comment }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  serverTimestamp,
  query,
} from 'firebase/firestore'
import { useRouter } from 'vue-router';

// INITIALIZE
onMounted(() => {
  curr_interval.value = 'All';
  selectSymbol(selectedSymbol);
  fetchNews(1, selectedSymbol);
  getComments();
})

// ROUTING
const route = useRouter();
var selectedSymbol = route.currentRoute.value.params.symbol;

// CHART SECTION
var chart = null
var chartType = 'candlestick'
var tickerName = ref(selectedSymbol);
var tickerSymbol = ref('');
var curr_interval = ref('');

const dataCache = JSON.parse(localStorage.getItem('dataCache')) || {}

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
    chart = new ApexCharts(document.querySelector('#chart'), chartOptions)
    chart.render()
    console.log('Chart Rendered')
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

async function fetchData(interval, symbol) {
  let historical_data = {
    method: 'GET',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-historical-data',
    params: {
      symbol: symbol,
      region: 'US'
    },
    headers: {
      'X-RapidAPI-Key': 'empty',
      'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
  };

  let quotes = {
    method: 'GET',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
    params: {
      region: 'US',
      symbols: symbol
    },
    headers: {
      'X-RapidAPI-Key': 'empty',
      'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
  };

  if (interval === 'Weekly') {
    historical_data.params.period1 = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
  } else if (interval === 'Monthly') {
    historical_data.params.period1 = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;
  } else {
    historical_data.params.period1 = '0'; // default at ALL
  }

  try {
    const response = await axios.request(historical_data);
    const response_quotes = await axios.request(quotes);
    const stockData = response.data;
    const quotesData = response_quotes.data;

    tickerName.value = quotesData.quoteResponse.result[0].shortName;

    let chartData = stockData.prices.map((price) => ({
      x: new Date(price.date * 1000), // Convert timestamp to Date
      y: [
        price.open.toFixed(2),
        price.high.toFixed(2),
        price.low.toFixed(2),
        price.close.toFixed(2)
      ]
    }));

    if (interval === 'Weekly') {
      chartData = chartData.slice(-7);
    } else if (interval === 'Monthly') {
      chartData = chartData.slice(-30);
    } else {
      chartData = chartData;
    }

    return chartData;
  } catch (error) {
    console.error(error);
  }
}

// NEWS SECTION
const currentQuery = ref('Tesla');
const currentPage = ref(1);
const newsData = ref({ articles: [] });
const showButtonValue = ref(false);

const fetchNews = async (page, q) => {
  try {
    const apiKey = '8ed1d1256b4e4f41996101e7967ad3b5';
    const url = `https://newsapi.org/v2/everything?language=en&q=${q}&pageSize=20&page=${page}&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    newsData.value = data;
  } catch (error) {
    console.error(error);
  }
};

// fetchNews(currentPage.value, currentQuery.value);

const search = () => {
  currentQuery.value = searchInput.value;
  fetchNews(1, currentQuery.value);
};

const prev = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchNews(currentPage.value, currentQuery.value);
  }
};

const next = () => {
  currentPage.value++;
  fetchNews(currentPage.value, currentQuery.value);
};

const toggleShowMore = () => {
  showButtonValue.value = !showButtonValue.value;
};

// COMMENTS SECTION
const db = getFirestore();
const commentsRef = collection(db, selectedSymbol);
const q = query(commentsRef, orderBy('createdAt', 'desc'));

var comments = reactive([]);
var nameInput = ref('');
var commentInput = ref('');

const getComments = async () => {
  onSnapshot(q, (querySnapshot) => {
    if (comments.length > 0) {
      comments = [];
    }
    querySnapshot.forEach((doc) => {
      comments.push(doc.data());
    });
  });
};

const addComment = () => {
  addDoc(commentsRef, {
    name: nameInput.value,
    comment: commentInput.value,
    createdAt: serverTimestamp()
  })
    .then(() => {
      nameInput.value = ''
      commentInput.value = ''
    })
    .catch((error) => {
      console.error('Error adding comment: ', error)
    })
};
</script>