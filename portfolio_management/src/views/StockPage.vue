<template>
  <main>
    <div class="container-fluid mt-7" style="background-image: url('src\assets\img\curved-images\curved-10.jpg')">
      <div class="col-lg-12 mx-auto">
        <div class="card z-index-2 blur blur-rounded shadow-lg rounded-5 mt-7">
          <div class="card-header pb-0 pt-2">
            <!-- Display the selected stock symbol -->
            <h1 class="text-center responsive-h1" id="stockSymbol">{{ `Stock Symbol: ${selectedSymbol} ${selectedName} (${curr_interval})` }}</h1>
          </div>


          <div class="card-body p-3">
            <div class="container-fluid">
              <div class="row justify-content-center">
                <div class="col-12 mx-auto" style="overflow-x:auto; max-width: 100%;" id="chart">
                  <!-- The candlestick chart will be rendered here -->
                </div>
              </div>
            </div>
          </div>

          <div class="container-fluid">
            <div class="row justify-content-between">
              <div class="col-lg-6 col-md-7 mb-3" id="interval-options">
              <!-- <div class="col-4 col-lg-6 text-center" id="intervalOptions"> -->
                <button class="btn bg-gradient-primary mx-1 d-sm-inline d-block" id="allButton" @click="fetchDataAndUpdateChart('All')">All Time</button>
                <button class="btn bg-gradient-primary mx-1 d-sm-inline d-block" id="1m" @click="fetchDataAndUpdateChart('Monthly')">Monthly</button>
                <button class="btn bg-gradient-primary mx-1 d-sm-inline d-block" id="1wk" @click="fetchDataAndUpdateChart('Weekly')">Weekly</button>
              </div>

              <div class="col-xl-2 col-lg-1 col-md-6 mb-3" style="min-width: 25vh;" id="chart-type">
              <!-- <div class="col-3 col-lg-4 text-center" id="chart-type"> -->
                <button class="btn bg-gradient-primary mx-1" id="candlestick"
                  @click="chartType = 'candlestick'; fetchDataAndUpdateChart(curr_interval)">Candlestick</button>
                <button class="btn bg-gradient-primary mx-1" id="area" @click="chartType = 'area'; fetchDataAndUpdateChart(curr_interval)">Area</button>
              </div>
            </div>
          </div>
        </div> 

        <div class="card blur blur-rounded shadow rounded-5 mt-4">
          <!-- market Sentiment -->
          <div class="card-body p-3">
            <div class="container text-center">
              <div class="row">
                <div class="col-md-6 col-sm-12">
                  <div class="sentiment-label">
                    <h3 class="responsive-h3">Market Sentiment: </h3>
                    <span :class="[sentimentBool ? 'text-positive' : 'text-negative']">{{ sentiment }}</span>
                  </div>
                </div>

                <div class="col-md-6 col-sm-12 col-12">
                  <div id="sentimentLine" class="table-responsive">
                    <table class="table my-2">
                      <thead>
                        <tr>
                          <th class="text-uppercase text-secondary font-weight-bolder opacity-7 p-0 p-sm-2">Positive</th>
                          <th class="text-uppercase text-secondary font-weight-bolder opacity-7 ps-sm-5 ps-2 p-sm-2 p-0">Negative</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td class="text-center">{{ positive }}</td>
                          <td class="text-center ps-sm-5 ps-2">{{ negative }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>            
          </div>  
        </div>

        <div class="card blur blur-rounded shadow rounded-5 mt-4">
          <div class="card-body py-0">
            <div class="row">
              <div class="container-fluid justify-content-center" id="news">
                <!-- only first 2 will show -->
                <div class="row justify-content-center">
                  <div v-for="article in newsData.articles.slice(0, 2)" :key="article.title" class="col-md-6 justify-content-center mt-4 p-0">
                    <div class="card w-auto border m-sm-2 news" style="width:500px">
                      <img height="550" :src="article.urlToImage" class="card-img-top img-fluid" alt="...">
                      <div class="card-body d-flex flex-column p-md-2 p-2" style="height: 180px;">
                        <h5 class="card-title responsive-h5">{{ article.title }}</h5>
                        <p v-if="article.description" class="card-text text-truncate responsive-text">{{ article.description }}...</p>
                        <a :href="article.url" target="_blank" class="btn btn-primary mb-0">Read Article</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div id="showmore" class="container-fluid justify-content-center" v-show="showButtonValue">
                <div class="row justify-cotent-center">
                  <div v-for=" article  in  newsData.articles.slice(2) " :key="article.title" class="col-md-6 justify-content-center mt-4 p-0">
                    <div class="card w-auto border m-sm-2 news" style="width:500px">
                      <img height="550" :src="article.urlToImage" class="card-img-top img-fluid" alt="...">
                      <div class="card-body d-flex flex-column p-md-2 p-2" style="height: 200px;">
                        <h5 class="card-title responsive-h5">{{ article.title }}</h5>
                        <p v-if="article.description" class="card-text text-truncate responsive-text">{{ article.description.slice(0, 100) }}...
                        </p>
                        <a :href="article.url" target="_blank" class="btn btn-primary">Read Article</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mt-2 mx-3">
              <button @click="toggleShowMore" id="showButton" class="btn bg-gradient-primary">
                {{ showButtonValue ? 'Show Less' : 'Show More' }}
              </button>
            </div>
          </div>
        </div>


        <div class="card blur blur-rounded shadow rounded-5 my-4">
          <div class="card-header text-center my-0 pb-0">
            <h3 class="responsive-h3">Forum</h3>
          </div>
          <div class="card-body py-0">
            <div class="row">
              <div class="container form-group font-weight-bold mt-2">
                <input class="form-control responsive-text my-3 col-lg-10 col-md-10 col-sm-10" type="text" id="name-box" v-model="nameInput" placeholder="Enter name" />
                <textarea class="form-control responsive-text col-lg-10 col-md-10 col-sm-10" type="text" id="comment-box" v-model="commentInput" placeholder="Enter comment" />
              </div>
            </div>

            <div class="row mx-3 mb-sm-5 m-4">
              <button class="btn bg-gradient-primary" id="post" @click="addComment()">Comment</button>
            </div>

            <div class="row mx-3" v-for="comment in comments">
              <div class="card border mb-sm-4 mb-3 p-md-3 p-1">
                <div class="card-body p-sm-5 p-md-2 p-3">
                  <h5 class="card-title responsive-h5">{{ comment.name }}</h5>
                  <p class="card-text responsive-text">{{ comment.comment }}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>


      <!-- <div class="card m-3" v-for="comment in comments">
        <div class="card-body">
          <h5 class="card-title">{{ comment.name }}</h5>
          <p class="card-text">{{ comment.comment }}</p>
        </div>
      </div> -->


      <!-- news section-->
      <!-- <div class="container">
        <div class="container-fluid justify-content-center" id="news"> -->
          <!-- only first 2 will show -->
          <!-- <div class="row justify-content-center"> -->
            <!-- <div v-for=" article  in  newsData.articles.slice(0, 2) " :key="article.title" class="col-xxl-6">
              <div class="card m-2 news" style="width:500px">
                <img height="300" :src="article.urlToImage" class="card-img-top" alt="...">
                <div class="card-body d-flex flex-column" style="height: 200px;">
                  <h5 class="card-title">{{ article.title }}</h5>
                  <p v-if="article.description" class="card-text  text-truncate">{{ article.description }}...</p>
                  <a :href="article.url" target="_blank" class="btn btn-primary mt-auto">Read Article</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="showmore" class="container-fluid justify-content-center" v-show="showButtonValue">
          <div class="row justify-cotent-center">
            <div v-for=" article  in  newsData.articles.slice(2) " :key="article.title"
              class="col-xxl-6 justify-content-center">
              <div class="card m-2 news" style="width:500px">
                <img height="300" :src="article.urlToImage" class="card-img-top" alt="...">
                <div class="card-body d-flex flex-column" style="height: 200px;">
                  <h5 class="card-title">{{ article.title }}</h5>
                  <p v-if="article.description" class="card-text text-truncate">{{ article.description.slice(0, 100) }}...
                  </p>
                  <a :href="article.url" target="_blank" class="btn btn-primary mt-auto">Read Article</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button @click="toggleShowMore" id="showButton" class="btn btn-primary" style="margin: 10px">
        {{ showButtonValue ? 'Show Less' : 'Show More' }}
      </button> -->

  </main>
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
  console.log(selectedName.value)
  const fetchNewsPromise = new Promise((resolve) => {

    const fetchNews = async (page = 1, q = selectedName.value) => {
      try {
        const apiKey = '8ed1d1256b4e4f41996101e7967ad3b5';
        const url = `https://newsapi.org/v2/everything?language=en&q=${q}&pageSize=20&page=${page}&apiKey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        newsData.value = data;
        // console.log(newsData);

        const titles = newsData.value.articles.map(article => article.title);
        console.log(titles)
        description.value = titles.join(' ');
        console.log(description.value)
        resolve();
      } catch (error) {
        console.error(error);
      }
    };
    fetchNews(1, selectedName.value)
  })

  fetchNewsPromise.then(() => {
    console.log(typeof(description.value))
    marketSentiment(description.value)
  })

  getComments();
})

// ROUTING
const route = useRouter();
var selectedSymbol = route.currentRoute.value.params.symbol;
var selectedName = ref('');
// CHART SECTION
var chart = null
var chartType = 'candlestick'
var tickerName = selectedName;
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
        width: 1700
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

    // Render the chart
    chart = new ApexCharts(document.querySelector('#chart'), chartOptions)
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
    if (screenWidth < 576) {
      chart.updateOptions({
        chart: {
          height: 400,
          width: 450, 
        },
      });
    } else {
      chart.updateOptions({
        chart: {
          height: 400,
          width: document.querySelector('#candlestick-chart').clientWidth,
        },
      });
    }
  }
};

async function fetchData(interval, symbol) {
  let historical_data = {
    method: 'GET',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-historical-data',
    params: {
      symbol: symbol,
      region: 'US'
    },
    headers: {
      'X-RapidAPI-Key': '6da3574d9cmsh2f06bbb69119e81p1b4af4jsn3e2517723248',
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
      'X-RapidAPI-Key': '6da3574d9cmsh2f06bbb69119e81p1b4af4jsn3e2517723248',
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
    selectedName.value = quotesData.quoteResponse.result[0].shortName;
    // console.log(stockData)
    let chartData = stockData.prices.map((price) => ({
      x: new Date(price.date * 1000), // Convert timestamp to Date
      y: [
        Number(price.open).toFixed(2),
        Number(price.high).toFixed(2),
        Number(price.low).toFixed(2),
        Number(price.close).toFixed(2)
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
const newsData = ref({ articles: [] });
const showButtonValue = ref(false);
const description = ref('');
// const fetchNews = async (page, q) => {
//   try {
//     const apiKey = '8ed1d1256b4e4f41996101e7967ad3b5';
//     const url = `https://newsapi.org/v2/everything?language=en&q=${q}&pageSize=20&page=${page}&apiKey=${apiKey}`;
//     const response = await fetch(url);
//     const data = await response.json();
//     newsData.value = data;
//     console.log(newsData)
//     for (let i = 0; i < 3; i++) {
//       description.value += newsData.value.articles[i].description + ' ';
//     }
//     console.log(description)
//     resolve()
//   } catch (error) {
//     console.error(error);
//   }
// };

// fetchNews(currentPage.value, currentQuery.value);

// const search = () => {
//   currentQuery.value = searchInput.value;
//   fetchNews(1, currentQuery.value);
// };

// const prev = () => {
//   if (currentPage.value > 1) {
//     currentPage.value--;
//     fetchNews(currentPage.value, currentQuery.value);
//   }
// };

// const next = () => {
//   currentPage.value++;
//   fetchNews(currentPage.value, currentQuery.value);
// };

const toggleShowMore = () => {
  showButtonValue.value = !showButtonValue.value;
};


// Market Sentiment Section

const sentiment = ref('Positive');
const positive = ref('0.67');
const mixed = ref('0.20');
const negative = ref('0.13');
const sentimentBool = ref(true)



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
    mixed.value = Number(response.data.Sentiment.SentimentScore.Mixed).toFixed(3);

    if(positive.value > negative.value){
      sentiment.value = "Positive"
    }
    else{
      sentiment.value = "Negative"
    }

  } catch (error) {
    console.error(error);
  }
}


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

<style>
@import '../assets/css/soft-ui-dashboard.css';

.sentiment-label {
  padding: 15px 0px;
  font-weight: bold;
  font-size: 30px;
}


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


.text-positive {
  color: green;
}

.text-negative {
  color: red;
}


@media (min-width: 0px) {
  .responsive-text {
    font-size: 0.7rem;
  }

  
  .responsive-h1 {
    font-size: 24px;
  }

  .responsive-h3 {
    font-size: 22px;
  }

  .responsive-h5 {
    font-size: 0.9rem;
    font-weight: bold;
  }
}

@media (min-width: 576px) {
  .responsive-text {
    font-size: 0.6rem;
  }
  
  .responsive-h1 {
    font-size: 29px;
  }

  .responsive-h3 {
    font-size: 23px;
  }

  .responsive-h5 {
    font-size: 17px;
    font-weight: bold;
  }
}

@media (min-width: 768px) {
  .responsive-text {
    font-size: 0.8rem;
  }

  .responsive-h1 {
    font-size: 42px;
  }

  .responsive-h3 {
    font-size: 24px;
  }

  .responsive-h5 {
    font-size: 16px;
    font-weight: bold;
  }
}

@media (min-width: 992px) {
  .responsive-text {
    font-size: 0.8rem;
  }

  .responsive-h1 {
    font-size: 50px;
  }

  .responsive-h3 {
    font-size: 30px;
  }

  .responsive-h5 {
    font-size: 25px;
    font-weight: bold;
  }
}

@media (min-width: 1200px) {
  .responsive-text {
    font-size: 1rem;
  }

  .responsive-h1 {
    font-size: 50px;
  }

  .responsive-h3 {
    font-size: 30px;
  }

  .responsive-h5 {
    font-size: 25px;
    font-weight: bold;
  }
}
</style>


