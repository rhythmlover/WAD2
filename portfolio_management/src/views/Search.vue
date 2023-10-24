<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-8 my-4">
        <div class="input-group rounded">
          <input type="search" class="form-control rounded" placeholder="Search" v-model="searchInput"
            @keyup="updateTable" />
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-8">
        <table ref="activeList" class="table table-light table-hover" v-show="showActive">
          <thead>
          <tr>
            <th ref="active" colspan="4">
              <h3>Most Active</h3>
            </th>
          </tr>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stock in activeStockList" :key="stock.symbol">
            <td>{{ stock.symbol }}</td>
            <td>{{ stock.shortName }}</td>
            <td>{{ stock.price }}</td>
            <td class="text-info">{{ stock.volume }}</td>
          </tr>
        </tbody>
        </table>
          <table ref="searchList" class="table table-light table-hover" v-show="showSearch">
          <thead>
            <tr>
            <th ref="search" colspan="3">
              <h3>Search Results</h3>
            </th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Exchange</th>
            </tr>
            <tr v-for="stock in searchedStocks" :key="stock.symbol">
              <td>{{ stock.symbol }}</td>
              <td>{{ stock.name }}</td>
              <td>{{ stock.exchange }}</td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const activeStockList = ref([])
var showActive = ref(true)
const searchList = ref(null)
var searchInput = ref("")
var showSearch = ref(false)
const resultsAll = ref([]);
const searchedStocks = ref([])

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'ffa142738emsh5efab3a432e8f94p17e56djsn3cffa46a4bfe',
    'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
  }
}

const url = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/screeners/get-symbols-by-predefined?scrIds=MOST_ACTIVES&start=0&count=100'

const optionsAll = {
  method: 'GET',
  params: {
    country: 'US',
    format: 'json'
  },
  headers: {
    'X-RapidAPI-Key': 'ffa142738emsh5efab3a432e8f94p17e56djsn3cffa46a4bfe',
    'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
  }
}

const urlAll = 'https://twelve-data1.p.rapidapi.com/stocks?country=US'


onMounted(() => {
  run()
  getAllStock()
})

const updateTable = () => {
  if (searchInput.value.trim() === "") {
    showActive.value = true
    showSearch.value = false
  }
  else {
    showActive.value = false
    showSearch.value = true
  }
  const filteredStocks = resultsAll.value[0].data.filter(stock => {
      return (
        stock.symbol.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchInput.value.toLowerCase())
      )
    })
    searchedStocks.value = filteredStocks
  }



async function run() {
  try {
    const responses = await fetch(url, options);
    const results = await responses.json();

    let active = results.finance.result[0];
    let stockList = active.quotes.map(quote => ({
      symbol: quote.symbol,
      shortName: quote.shortName,
      price: quote.regularMarketPrice.fmt,
      volume: quote.regularMarketVolume.fmt
    }));

    activeStockList.value = stockList
    console.log(activeList.value)
  } catch (error) {
    console.error(error);
  }
}

async function getAllStock() {
  try {
    const responsesAll = await Promise.all([fetch(urlAll, optionsAll)])
    resultsAll.value = await Promise.all(responsesAll.map(res => res.json()))
    console.log(resultsAll.value);
  } catch (error) {
    console.error(error);
  }
}
</script>

<style>
.box {
  background-color: #f8f9fa;
}

.bull {
  color: green;
}

.bear {
  color: red;
}

th {
  text-align: center;
}

td {
  text-align: center;
}
</style>


