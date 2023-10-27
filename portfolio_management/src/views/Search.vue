<template>
  <link href="src/assets/css/table.css" rel="stylesheet" />
  <link href="src/assets/css/soft-ui-dashboard.css" rel="stylesheet" />

<div class="background mx-auto" style="background-image: url('src/assets/img/curved-images/curved0.jpg');
  width: 90%;height: 400px;background-repeat:
   no-repeat;background-size: cover;border-radius: 30px;">
  <div class="container-fluid mt-7">

 

    <div class="row justify-content-center">
      <div class="col-10 my-4">
        <div class="input-group rounded">
          <!-- <input
            type="search"
            class="form-control rounded"
            placeholder="Search"
            v-model="searchInput"
            @keyup="updateTable"
          /> -->
          <div class="input-group mb-4">
          <span class="input-group-text"><i class="ni ni-zoom-split-in"></i></span>
          <input class="form-control" placeholder="Search" type="search" v-model="searchInput"
            @keyup="updateTable">
        </div>

        </div>
      </div>
    </div>
    
    <div class="row justify-content-center">
      
      <div class="col-10">
        <div class="card blur blur-rounded shadow" style="min-width: 800px">
        <div class="table-responsive " style="min-width: 800px">
        <table class="table table-hover align-items-center mb-0" v-show="showActive">
          <thead>
            <tr>
              <th ref="active">
                <h3 style="text-align: center">Most Active</h3>
              </th>
            </tr>
            <tr>
              <th ref="active" colspan="4">
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
                    <th>Volume</th>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="stock in activeStockList" :key="stock.symbol">
              <RouterLink
                :to="{ name: 'stockpage', params: { symbol: stock.symbol, name: stock.shortName} }"
                style="text-decoration: none"
              >
                <div class="row mx-auto table-row-link ">
                  <div class="col-3 mb-0">
                    <tr>
                      <td class="d-flex px-2 py-1">{{ stock.symbol }}</td>
                    </tr>
                  </div>
                  <div class="col-3 mb-0">
                    <tr>
                      <td class="d-flex px-2 py-1">{{ stock.shortName }}</td>
                    </tr>
                  </div>
                  <div class="col-3 mb-0">
                    <tr>
                      <td class="d-flex px-2 py-1">{{ stock.price }}</td>
                    </tr>
                  </div>
                  <div class="col-3 mb-0">
                    <tr>
                      <td class="d-flex px-2 py-1">{{ stock.volume }}</td>
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
              <th ref="active" colspan="4">
                <div class="row mx-auto">
                  <div class="col-4  text-uppercase text-dark text-lg font-weight-bolder opacity-7">
                    <th>Symbol</th>
                  </div>
                  <div class="col-4  text-uppercase text-dark text-lg font-weight-bolder opacity-7">
                    <th>Name</th>
                  </div>
                  <div class="col-4  text-uppercase text-dark text-lg font-weight-bolder opacity-7">
                    <th>Exchange</th>
                  </div>
                </div>
              </th>
            </tr>
            <template v-for="stock in searchedStocks" :key="stock.symbol">
              <RouterLink
                :to="{ name: 'stockpage', params: { symbol: stock.symbol, name: stock.shortName } }"
                style="text-decoration: none"
              >
                <div class="row table-row-link mx-auto">
                  <div class="col-4 mb-0">
                    <tr>
                      <td>{{ stock.symbol }}</td>
                    </tr>
                  </div>
                  <div class="col-4 mb-0">
                    <tr>
                      <td>{{ stock.name }}</td>
                    </tr>
                  </div>
                  <div class="col-4 mb-0">
                    <tr>
                      <td>{{ stock.exchange }}</td>
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
</template>

<style>
.table-row-link:hover {
  background-color: lightgrey;
  /* Change to your desired color */
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

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'ba7b0fde8dmshd20587e7d1e1e9bp181bb2jsnbf1afc5de773',
    'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
  }
}

const url =
  'https://apidojo-yahoo-finance-v1.p.rapidapi.com/screeners/get-symbols-by-predefined?scrIds=MOST_ACTIVES&start=0&count=50'

const optionsAll = {
  method: 'GET',
  params: {
    country: 'US',
    format: 'json'
  },
  headers: {
    'X-RapidAPI-Key': 'ba7b0fde8dmshd20587e7d1e1e9bp181bb2jsnbf1afc5de773',
    'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
  }
}

const urlAll = 'https://twelve-data1.p.rapidapi.com/stocks?country=US'

onMounted(() => {
  run()
  getAllStock()
})

const updateTable = () => {
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
    searchedStocks.value = filteredStocks.slice(0, 100)
    console.log('run')
  }
}

async function run() {
  try {
    const responses = await fetch(url, options)
    const results = await responses.json()

    let active = results.finance.result[0]
    let stockList = active.quotes.map((quote) => ({
      symbol: quote.symbol,
      shortName: quote.shortName,
      price: quote.regularMarketPrice.fmt,
      volume: quote.regularMarketVolume.fmt
    }))

    activeStockList.value = stockList
    console.log(stockList)
  } catch (error) {
    console.error(error)
  }
}

async function getAllStock() {
  try {
    const responsesAll = await Promise.all([fetch(urlAll, optionsAll)])
    resultsAll.value = await Promise.all(responsesAll.map((res) => res.json()))
    console.log(resultsAll.value)
  } catch (error) {
    console.error(error)
  }
}
</script>
