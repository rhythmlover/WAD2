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
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'


const gainerList = ref(null)
const loserList = ref(null)
const activeList = ref(null)


const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '1bf9eeb3bdmsh7519276699b1ba7p11f38fjsn6938ab39f800',
		'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
	}
};

const url1 = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/screeners/get-symbols-by-predefined?scrIds=DAY_GAINERS&start=0&count=100';
const url2 = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/screeners/get-symbols-by-predefined?scrIds=DAY_LOSERS&start=0&count=100';
const url3 = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/screeners/get-symbols-by-predefined?scrIds=MOST_ACTIVES&start=0&count=100';

  
  onMounted(()=>{
    run()
  })

  async function run() {
    try {
          let addhtml = ''
          let stockList = []

          const response1 = await fetch(url1, options)
          const result1 = await response1.text()
          console.log(result1)
          let gainers = result1.finance.result[0]
            for (each in gainers.quotes) {
              let symbol = gainers.quotes[each].symbol
              let shortName = gainers.quotes[each].shortName
              let price = gainers.quotes[each].regularMarketPrice.fmt
              let percChange = gainers.quotes[each].regularMarketChangePercent.fmt
              stockList.push(symbol)
              addhtml +=
                `<tr><td><a href='stockpage.html?selectedSymbol=${symbol}''>` +
                symbol +
                '</td><td>' +
                shortName +
                '</td><td>' +
                price +
                "</td><td class='text-success'>" +
                percChange +
                '</td></tr>'
            }
            gainerList.value.innerHTML += addhtml
            stockList = []
            addhtml = ''
          
        

            const response2 = await fetch(url2, options)
            const result2 = await response2.text()
            let losers = result2.finance.result[0]
            for (each in losers.quotes) {
              let symbol = losers.quotes[each].symbol
              let shortName = losers.quotes[each].shortName
              let price = losers.quotes[each].regularMarketPrice.fmt
              let percChange = losers.quotes[each].regularMarketChangePercent.fmt
              stockList.push(symbol)
              addhtml +=
                `<tr><td><a href='stockpage.html?selectedSymbol=${symbol}''>` +
                symbol +
                '</td><td>' +
                shortName +
                '</td><td>' +
                price +
                "</td><td class='text-danger'>" +
                percChange +
                '</td></tr>'
            }
            loserList.value.innerHTML += addhtml
            stockList = []
            addhtml = ''
          

          const response3 = axios.request(url3, options)
          const result3 = await response3.text()
          active = result3.finance.result[0]
            for (each in active.quotes) {
              let symbol = active.quotes[each].symbol
              let shortName = active.quotes[each].shortName
              let price = active.quotes[each].regularMarketPrice.fmt
              let volume = active.quotes[each].regularMarketVolume.fmt
              stockList.push(symbol)
              addhtml +=
                `<tr><td><a href='stockpage.html?selectedSymbol=${symbol}''>` +
                symbol +
                '</td><td>' +
                shortName +
                '</td><td>' +
                price +
                "</td><td class='text-info'>" +
                volume +
                '</td></tr>'
            }
            activeList.value.innerHTML += addhtml
            stockList = []
            addhtml = ''
          
             
        } catch (error) {
          console.error(error)
        }
  }
</script> -->




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
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const gainerList = ref(null)
const loserList = ref(null)
const activeList = ref(null)

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '1bf9eeb3bdmsh7519276699b1ba7p11f38fjsn6938ab39f800',
    'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
  }
}

const url1 = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/screeners/get-symbols-by-predefined?scrIds=DAY_GAINERS&start=0&count=100'
const url2 = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/screeners/get-symbols-by-predefined?scrIds=DAY_LOSERS&start=0&count=100'
const url3 = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/screeners/get-symbols-by-predefined?scrIds=MOST_ACTIVES&start=0&count=100'

onMounted(() => {
  run()
})

async function run() {
  try {
    
    const responses = await Promise.all([fetch(url1, options), fetch(url2, options), fetch(url3, options)])
    const results = await Promise.all(responses.map(res => res.json()))
    
    let stockList = []
    let addhtml = ''
    

    const [result1, result2, result3] = results

    let gainers = result1.finance.result[0]
    for (const quote of gainers.quotes) {
      let symbol = quote.symbol
      let shortName = quote.shortName
      let price = quote.regularMarketPrice.fmt
      let percChange = quote.regularMarketChangePercent.fmt
      stockList.push(symbol)
      addhtml +=
        `<tr><td><RouterLink :to="{ name: "/StockPage", params: { symbol: ${symbol} }}">${symbol}<RouterLink>` +
        '</td><td>' +
        shortName +
        '</td><td>' +
        price +
        "</td><td class='text-success'>" +
        percChange +
        '</td></tr>'
    }
    gainerList.value.innerHTML += addhtml
    stockList = []
    addhtml = ''

    let losers = result2.finance.result[0]
    for (const quote of losers.quotes) {
      let symbol = quote.symbol
      let shortName = quote.shortName
      let price = quote.regularMarketPrice.fmt
      let percChange = quote.regularMarketChangePercent.fmt
      stockList.push(symbol)
      addhtml +=
        `<tr><td><RouterLink :to="{name:'StockPage', params:{selectedSymbol=${symbol}}}">` +
        symbol +
        '</td><td>' +
        shortName +
        '</td><td>' +
        price +
        "</td><td class='text-danger'>" +
        percChange +
        '</td></tr>'
    }
    loserList.value.innerHTML += addhtml
    stockList = []
    addhtml = ''

    let active = result3.finance.result[0]
    for (const quote of active.quotes) {
      let symbol = quote.symbol
      let shortName = quote.shortName
      let price = quote.regularMarketPrice.fmt
      let volume = quote.regularMarketVolume.fmt
      stockList.push(symbol)
      addhtml +=
        `<tr><td><a href='StockPage.vue?selectedSymbol=${symbol}'>` +
        symbol +
        '</td><td>' +
        shortName +
        '</td><td>' +
        price +
        "</td><td class='text-info'>" +
        volume +
        '</td></tr>'
    }
    activeList.value.innerHTML += addhtml
    stockList = []
    addhtml = ''
  } catch (error) {
    console.error(error)
  }
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
    