<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-4 box">
        <table ref="gainerList" class="table table-dark">
          <tr>
            <th ref="gainer" colspan="4">
              <h1>Top Gainers</h1>
            </th>
          </tr>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>%</th>
          </tr>

          <tr v-for="quote in gainers.quotes">
            <td>
              <RouterLink :to="{ name: 'stockpage', params: { symbol: quote.symbol } }">
                {{ quote.symbol }}
              </RouterLink>
            </td>
            <td>
              {{ quote.shortName }}
            </td>
            <td>
              {{ quote.regularMarketPrice.fmt }}
            </td>
            <td class='text-success'>
              {{ quote.regularMarketChangePercent.fmt }}
            </td>
          </tr>




        </table>
      </div>
      <div class="col-4 box">
        <table ref="loserList" class="table table-dark">
          <tr>
            <th ref="loser" colspan="4">
              <h1>Top Losers</h1>
            </th>
          </tr>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>%</th>
          </tr>

          <tr v-for="quote in losers.quotes">
            <td>

              <RouterLink :to="{ name: 'stockpage', params: { symbol: quote.symbol } }">
                <!-- <stockpage :selectedSymbol="quote.symbol" />  -->
                {{ quote.symbol }}
              </RouterLink>

            </td>
            <td>
              {{ quote.shortName }}
            </td>
            <td>
              {{ quote.regularMarketPrice.fmt }}
            </td>
            <td class='text-success'>
              {{ quote.regularMarketChangePercent.fmt }}
            </td>
          </tr>

        </table>
      </div>
      <div class="col-4 box">
        <table ref="activeList" class="table table-dark">
          <tr>
            <th ref="active" colspan="4">
              <h1>Most Active</h1>
            </th>
          </tr>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>Volume</th>
          </tr>

          <tr v-for="quote in active.quotes">
            <td>

              <RouterLink :to="{ name: 'stockpage', params: { symbol: quote.symbol } }">
                <!-- <stockpage :selectedSymbol="quote.symbol" />  -->
                {{ quote.symbol }}
              </RouterLink>


            </td>
            <td>
              {{ quote.shortName }}
            </td>
            <td>
              {{ quote.regularMarketPrice.fmt }}
            </td>
            <td class='text-success'>
              {{ quote.regularMarketChangePercent.fmt }}
            </td>
          </tr>

        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

onMounted(() => {
  run()
})

const props = defineProps(['stockSymbol'])

console.log(gainers)
var gainers = ref('')
var losers = ref('')
var active = ref('')
var options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'empty',
    'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
  }
}

const url1 = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/screeners/get-symbols-by-predefined?scrIds=DAY_GAINERS&start=0&count=100'
const url2 = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/screeners/get-symbols-by-predefined?scrIds=DAY_LOSERS&start=0&count=100'
const url3 = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/screeners/get-symbols-by-predefined?scrIds=MOST_ACTIVES&start=0&count=100'

async function run() {
  try {

    const responses = await Promise.all([fetch(url1, options), fetch(url2, options), fetch(url3, options)])
    const results = await Promise.all(responses.map(res => res.json()))

    const [result1, result2, result3] = results
    gainers.value = result1.finance.result[0]
    losers.value = result2.finance.result[0]
    active.value = result3.finance.result[0]
  } catch (error) {
    console.error(error)
  }
}

function AssignValue(symbol) {
  selectedSymbol = symbol
}

</script>





<style>
.box {
  background-color: black;
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



    <!-- <template>
      <div class="container-fluid">
        <div class="row">
          <div class="col-4 box">
            <table ref="gainerList" class="table table-dark">
              <tr>
                <th ref="gainer" colspan="4">
                  <h1>Top Gainers</h1>
                </th>
              </tr>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Price</th>
                <th>%</th>
              </tr>
              <tr v-for="quote in gainerQuotes" :key="quote.symbol">
                <td>
                  <router-link :to="{ name: 'StockPage', params: { symbol: quote.symbol }}">
                    {{ quote.symbol }}
                  </router-link>
                </td>
                <td>{{ quote.shortName }}</td>
                <td>{{ quote.regularMarketPrice.fmt }}</td>
                <td class="text-success">{{ quote.regularMarketChangePercent.fmt }}</td>
              </tr>
            </table>
          </div>
          <div class="col-4 box">
            <table ref="loserList" class="table table-dark">
              <tr>
                <th ref="loser" colspan="4">
                  <h1>Top Losers</h1>
                </th>
              </tr>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Price</th>
                <th>%</th>
              </tr>
              <tr v-for="quote in loserQuotes" :key="quote.symbol">
                <td>
                  <router-link :to="{ name: 'StockPage', params: { symbol: quote.symbol }}">
                    {{ quote.symbol }}
                  </router-link>
                </td>
                <td>{{ quote.shortName }}</td>
                <td>{{ quote.regularMarketPrice.fmt }}</td>
                <td class="text-danger">{{ quote.regularMarketChangePercent.fmt }}</td>
              </tr>
            </table>
          </div>
          <div class="col-4 box">
            <table ref="activeList" class="table table-dark">
              <tr>
                <th ref="active" colspan="4">
                  <h1>Most Active</h1>
                </th>
              </tr>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Price</th>
                <th>Volume</th>
              </tr>
              <tr v-for="quote in activeQuotes" :key="quote.symbol">
                <td>
                  <router-link :to="{ name: '/StockPage', params: { symbol: quote.symbol }}">
                    {{ quote.symbol }}
                  </router-link>
                </td>
                <td>{{ quote.shortName }}</td>
                <td>{{ quote.regularMarketPrice.fmt }}</td>
                <td class="text-info">{{ quote.regularMarketVolume.fmt }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </template>
    
    <script setup>
    import { ref, onMounted } from 'vue';
    
    
    const gainerList = ref(null);
    const loserList = ref(null);
    const activeList = ref(null);
    
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '1bf9eeb3bdmsh7519276699b1ba7p11f38fjsn6938ab39f800',
        'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
      }
    };
    
    const url1 =
      'https://apidojo-yahoo-finance-v1.p.rapidapi.com/screeners/get-symbols-by-predefined?scrIds=DAY_GAINERS&start=0&count=100';
    const url2 =
      'https://apidojo-yahoo-finance-v1.p.rapidapi.com/screeners/get-symbols-by-predefined?scrIds=DAY_LOSERS&start=0&count=100';
    const url3 =
      'https://apidojo-yahoo-finance-v1.p.rapidapi.com/screeners/get-symbols-by-predefined?scrIds=MOST_ACTIVES&start=0&count=100';
    
    let gainerQuotes = ref([]);
    let loserQuotes = ref([]);
    let activeQuotes = ref([]);
    
    onMounted(async () => {
      try {
        const [result1, result2, result3] = await Promise.all([
          axios.get(url1, options),
          axios.get(url2, options),
          axios.get(url3, options)
        ]);
    
        gainerQuotes.value = result1.data.finance.result[0].quotes;
        loserQuotes.value = result2.data.finance.result[0].quotes;
        activeQuotes.value = result3.data.finance.result[0].quotes;
      } catch (error) {
        console.error(error);
      }
    });
    </script>
    
    <style>
    .box {
      background-color: black;
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
    </style> -->
    