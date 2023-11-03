<template>
  <link href="src/assets/css/soft-ui-dashboard.css" rel="stylesheet" />
  <main>
    <div class="background mx-auto" style="
      background-image: url('src/assets/img/curved-images/curved0.jpg');
      width: 90%;
      height: 400px;
      background-repeat: no-repeat;
      background-size: cover;
      border-radius: 30px;
    ">
      <div class="container-fluid mt-7">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-12 mt-4">
            <div class="input-group rounded">
              <div class="input-group mb-4">
                <span class="input-group-text"><i class="ni ni-zoom-split-in"></i></span>
                <input class="form-control" placeholder="     Search" type="search" v-model="searchInput"
                  @keyup="updateTableWithDelay" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-12">
            <div class="card blur blur-rounded shadow rounded-bottom">
              <div class="table-responsive">
                <table class="table align-items-center mb-0" v-show="showActive">
                  <thead>
                    <tr>
                      <th ref="active">
                        <h3 style="text-align: center">Most Active</h3>
                      </th>
                    </tr>
                    <tr>
                      <th ref="active" colspan="4">
                        <div class="row mx-8px">
                          <div class="col-3 text-uppercase text-dark text-lg font-weight-bolder opacity-7">
                      <th>Symbol</th>
              </div>
              <div class="col-3 text-uppercase text-dark text-lg font-weight-bolder opacity-7">
                <th>Name</th>
              </div>
              <div class="col-3 text-uppercase text-dark text-lg font-weight-bolder opacity-7">
                <th>Price</th>
              </div>
              <div class="col-3 text-uppercase text-dark text-lg font-weight-bolder opacity-7">
                <th>Recommendation</th>
              </div>
            </div>
            </th>
            </tr>
            </thead>
            <tbody>
              <template v-for="stock in activeStockList" :key="stock.symbol">
                <RouterLink :to="{
                  name: 'stockpage',
                  params: { symbol: stock.symbol }
                }" style="text-decoration: none">
                  <div class="row mx-auto table-row-link">
                    <div class="col-3 mb-0">
                      <tr>
                        <td>{{ stock.symbol }}</td>
                      </tr>
                    </div>
                    <div class="col-3 mb-0">
                      <tr>
                        <td>{{ stock.displayName }}</td>
                      </tr>
                    </div>
                    <div class="col-3 mb-0">
                      <tr>
                        <td>{{ stock.price }}</td>
                      </tr>
                    </div>
                    <div class="col-3 mb-0">
                      <tr>
                        <td>{{ stock.recommendation }}</td>
                      </tr>
                    </div>
                  </div>
                </RouterLink>
              </template>
            </tbody>
            </table>
            <table ref="searchList" class="table align-items-center mb-0" v-show="showSearch">
              <thead>
                <tr>
                  <th ref="search">
                    <h3 style="text-align: center">Search Results</h3>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th ref="search" colspan="4">
                    <div class="row mx-auto">
                      <div class="col-3 text-uppercase text-dark text-lg font-weight-bolder opacity-7">
                  <th>Symbol</th>
          </div>
          <div class="col-3 text-uppercase text-dark text-lg font-weight-bolder opacity-7">
            <th>Name</th>
          </div>
          <div class="col-3 text-uppercase text-dark text-lg font-weight-bolder opacity-7">
            <th>Price</th>
          </div>
          <div class="col-3 text-uppercase text-dark text-lg font-weight-bolder opacity-7">
            <th>Recommendation</th>
          </div>
        </div>
        </th>
        </tr>
        <template v-for="stock in searchedStocks" :key="stock.symbol">
          <RouterLink :to="{
            name: 'stockpage',
            params: { symbol: stock.symbol }
          }" style="text-decoration: none">
            <div class="row table-row-link mx-auto">
              <div class="col-3 mb-0 text-center wrap-text">
                <tr>
                  <td>{{ stock.symbol }}</td>
                </tr>
              </div>
              <div class="col-3 mb-0 text-center wrap-text">
                <tr>
                  <td>{{ stock.name }}</td>
                </tr>
              </div>
              <div class="col-3 mb-0 text-center wrap-text">
                <tr>
                  <td>{{ stock.price }}</td>
                </tr>
              </div>
              <div class="col-3 mb-0 text-center wrap-text">
                <tr>
                  <td>{{ stock.recommendation }}</td>
                </tr>
              </div>
            </div>
          </RouterLink>
        </template>
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
.table-row-link:hover {
  background-color: lightgrey;
  /* Change to your desired color */
}

.wrap-text {
    word-wrap: break-word;
  }

.text-center{
  text-align: center  ;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const activeStockList = ref([])
var showActive = ref(true)
const searchList = ref(null)
var searchInput = ref('')
var showSearch = ref(false)
const resultsAll = ref([])
const searchedStocks = ref([])
var current = ref('')

const options = {
  method: 'GET',
  params: {start: '0'},
  headers: {
    'X-RapidAPI-Key': 'e29108bd6bmsh9a396f313137103p1e921ajsn2ba4b9f2fdcb',
    'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com'
  }
}

const url =
  'https://mboum-finance.p.rapidapi.com/co/collections/most_actives'

const optionsAll = {
  method: 'GET',
  params: {
    country: 'US',
    format: 'json'
  },
  headers: {
    'X-RapidAPI-Key': 'e29108bd6bmsh9a396f313137103p1e921ajsn2ba4b9f2fdcb',
    'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
  }
}

const urlAll = 'https://twelve-data1.p.rapidapi.com/stocks?country=US&exchange=NASDAQ'

const urlReco = 'https://mboum-finance.p.rapidapi.com/qu/quote/financial-data'

onMounted(() => {
  run()
  getAllStock()
})

let timeout = null;

const updateTableWithDelay = () => {
  clearTimeout(timeout);
  timeout = setTimeout(updateTable, 500); // 500 milliseconds delay
};

const updateTable = async () => {
  if (searchInput.value.trim() === '') {
    showActive.value = true
    showSearch.value = false
  } else {
    showActive.value = false
    showSearch.value = true
  }
  if (showSearch.value === true) {
    const filteredStocks = resultsAll.value[0].data.filter((stock) => {
      return (
        stock.symbol.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchInput.value.toLowerCase())
      )
    })
    searchedStocks.value = filteredStocks.slice(0, 3)
    for (const stock of searchedStocks.value) {
      stock.recommendation = "Loading...";
      stock.price = "Loading...";
    }
    for(const stock of searchedStocks.value) {
      current.value = stock.symbol;
        let [recc, price] = await getReco();
        console.log(recc, price);
        stock.recommendation = recc;
        stock.price = price;
        console.log('run');
    };
    console.log(searchedStocks.value);
  }
}


async function run() {
  try {
    const responses = await fetch(url, options)
    const results = await responses.json()
    let active = results.body.slice(0,2);
    let stockList = active.map(async (quote) => {
      current.value = quote.symbol;
      let [recc, price] = await getReco();
      return {
        symbol: quote.symbol,
        displayName: quote.displayName,
        recommendation: recc,
        price: price
      };
    });

    activeStockList.value = await Promise.all(stockList);
  } catch (error) {
    console.error(error)
  }
}

async function getAllStock() {
  try {
    const responsesAll = await Promise.all([fetch(urlAll, optionsAll)])
    resultsAll.value = await Promise.all(responsesAll.map((res) => res.json()))
  } catch (error) {
    console.error(error)
  }
}

async function getReco() {
  try {
    const response = await axios.get(urlReco, {
      params: {
        symbol: current.value
      },
      headers: {
        'X-RapidAPI-Key': 'e29108bd6bmsh9a396f313137103p1e921ajsn2ba4b9f2fdcb',
        'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com'
      }
    });
    return [response.data.body.recommendationKey.toUpperCase(),
    response.data.body.currentPrice.fmt];
  }
  catch (error) {
    console.error(error);
    return ["None","None"]
  }
}
</script>
