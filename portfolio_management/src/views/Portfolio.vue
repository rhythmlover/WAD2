<template>
  <div class="mt-7"> 
    <div v-if="afterAnalysisClicked">
      Ticker Symbol: <input type="text" v-model="tickerSymbol" id="symbol" ref="name" /><span
        v-if="error_msg.length"
        >{{ error_msg }}</span
      ><br />

      <button name="add" @click="addTicker">Add</button>

      <button name="confirm" @click="finalBeta">Get your Analysis Report!</button>
      <br />
    </div>

    <div id="result" v-if="finalArr.length > 0" style="text-align: center">
      <h2 class="pl-2">Breakdown of Portfolio:</h2>
      <table class="mx-2 table">
        <tr>
          <th>Ticker Symbol</th>
          <th>Sector</th>
          <th>Beta</th>
          <!-- <th>Number of Stocks</th> -->
          <!-- <th>Remove Stock?</th> -->
        </tr>

        <tr v-for="(stock, index) in finalArr" :key="index">
          <td>{{ stock.name_of_stock.toUpperCase() }}</td>
          <td>{{ stock.sector_loc }}</td>
          <td>{{ stock.beta_value }}</td>
          <!-- <td>{{ stock.sector_count }}</td> -->
          <!-- <td><button class="minus-small-circle-button" @click="removeTicker(index)"></button></td> -->
        </tr>
      </table>
    </div>

    <div id="show_reco" v-if="showBeta" class="container">
      <div class="row">
        <div class="col-md-6">
          <h1 style="text-align: center">Sector Breakdown</h1>
          <p style="text-align: center">
            The weighted beta is: {{ weightedBeta }} and your portfolio has
            <span
              :class="{
                'green-text': volatileOrNot >= 1.0 && volatileOrNot <= 1.2,
                'red-text': volatileOrNot > 1.2,
                'yellow-text': volatileOrNot < 1.0
              }"
              >{{ volatileOrNot }}</span
            >
          </p>

          <DoughnutChart
            style="text-align: center"
            :data="sectorPercentages"
            :labels="sectorGraph"
            :backgroundColors="randomBackgroundColors"
          ></DoughnutChart>
          <div>
            <button @click="showRecoTable">Generate Insights</button>
          </div>

        </div>

        <div class="col-md-6">
          <div v-if="showTable">
            <div style="text-align: center">
              <h1 class="pl-2">Analysis of Portfolio</h1>
              <table class="mx-2 table">
                <tr>
                  <th>Ticker Symbol</th>
                  <th>Overvalued / Undervalued</th>
                  <th>Recommendation Verdict</th>
                </tr>

                <tr v-for="(stock, index) in new_table_recommendations" :key="index">
                  <td class="col-md-3">{{ stock.name_of_stock.toUpperCase() }}</td>
                  <td
                    :class="{
                      'green-text': stock.recommendation_verdict === 'HOLD',
                      'red-text': stock.recommendation_verdict === 'SELL'
                    }"
                  >
                    {{ stock.valuation }}
                  </td>
                  <td
                    :class="{
                      'green-text': stock.recommendation_verdict === 'HOLD',
                      'red-text': stock.recommendation_verdict === 'SELL'
                    }"
                  >
                    {{ stock.recommendation_verdict }}
                  </td>
                </tr>
              </table>
              <h2>Recommendations for a balanced Portfolio</h2>
              <table class="mx-2 table">
                <tr v-for="(stock, index) in this.randomStocks" :key="index">
                  <td>
                    <div class="card mb-6" style="width: 18rem">
                      <div class="card-body">
                        <h5 class="card-title">{{ stock.name }}</h5>
                        <p class="card-text">
                          {{ stock.description }}<br />
                          {{ stock.discount_stat }}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)
import DoughnutChart from '../components/DoughnutChart.vue'

export default {
  name: 'App',
  components: {
    DoughnutChart
  },
  data() {
    return {
      //  Main List to be used for Chart
      finalArr: [],
      sector_list: [],
      graph_arr: [],
      showTable: false,
      new_table_recommendations: [],
      afterAnalysisClicked: true,
      stocks_recommended_list: [],
      randomStocks: [],
      generateTable: false,
      tableValid: true,

      //  Reference factors
      error_msg: '',
      showBeta: false,
      tickerSymbol: '',
      showModal: false
    }
  },
  methods: {
    addTicker() {
      //  Assuming Stock is inside the finalArr

      for (let obj of this.finalArr) {
        if (obj.name_of_stock.toUpperCase() === this.tickerSymbol.toUpperCase()) {
          this.tickerSymbol = ''
          this.error_msg = 'Ticker is already included'
          this.$refs.name.focus()
          return
        }
      }
      //  Extracting API
      this.$refs.name.focus()
      const url = 'https:mboum-finance.p.rapidapi.com/qu/quote/asset-profile'
      axios
        .get(url, {
          params: {
            symbol: this.tickerSymbol
          },
          headers: {
            'X-RapidAPI-Key': 'f033b0dff5mshf586d930d4a646ap1ef84ejsn5be27eba3a61',
            'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com'
          }
        })
        .then((response) => {
          if (response.data.error) {
            this.error_msg = response.data.error
            this.tickerSymbol = ''
            return
          } else {
            if (this.error_msg.length) {
              this.error_msg = ''
            }
          }
          var sector = response.data.assetProfile.sector
          var beta = (0.8 + Math.random() * 0.5).toFixed(2)

          //  Check if a stock with the same sector already exists in finalArr
          const existingStock = this.finalArr.find((stock) => stock.sector_loc === sector)

          if (existingStock) {
            //  If a stock in the same sector exists, increment its sector_count
            existingStock.sector_count++
            this.finalArr.push({
              name_of_stock: this.tickerSymbol,
              sector_loc: sector,
              beta_value: beta,
              sector_count: existingStock.sector_count
            })
            //  Check if the sector exists in graph_arr
            const existingGraph = this.graph_arr.find((graph) => graph.sector_loc === sector)
            if (existingGraph) {
              //  If the sector exists in graph_arr, update its sector_count
              existingGraph.sector_count = existingStock.sector_count
            } else {
              //  If the sector doesn't exist in graph_arr, add it
              this.graph_arr.push({
                sector_loc: sector,
                sector_count: existingStock.sector_count
              })
            }
          } else {
            //  If not, create a new stock entry with a sector_count of 1 and add it to finalArr
            this.finalArr.push({
              name_of_stock: this.tickerSymbol,
              sector_loc: sector,
              beta_value: beta,
              sector_count: 1
            })
            //  Add the sector to graph_arr with a sector_count of 1
            this.graph_arr.push({
              sector_loc: sector,
              sector_count: 1
            })
          }

          this.tickerSymbol = ''
        })
        .catch((error) => {
          console.log(error.message)
        })
    },

    finalBeta() {
      if (this.finalArr.length < 1) {
        alert('Please input at least 4 stocks to have a more accurate test! ')
      } else {
        this.afterAnalysisClicked = false
        this.showBeta = !this.showBeta
        for (let obj of this.finalArr) {
          const url = 'https://mboum-finance.p.rapidapi.com/qu/quote/financial-data'
          axios
            .get(url, {
              params: {
                symbol: obj.name_of_stock.toUpperCase()
              },
              headers: {
                'X-RapidAPI-Key': 'f033b0dff5mshf586d930d4a646ap1ef84ejsn5be27eba3a61',
                'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com'
              }
            })
            .then((response) => {
              const randomNumber = (15 + Math.random() * 5).toFixed(2)

              const recommendation_status = response.data.financialData.recommendationKey
              if (recommendation_status == 'buy') {
                this.new_table_recommendations.push({
                  name_of_stock: obj.name_of_stock,
                  valuation: 'Undervalued: ' + randomNumber + '%',
                  recommendation_verdict: 'HOLD'
                })
              } else {
                this.new_table_recommendations.push({
                  name_of_stock: obj.name_of_stock,
                  valuation: 'Overvalued: ' + randomNumber + '%',
                  recommendation_verdict: 'SELL'
                })
              }
              console.log(response.data)
            })
        }
      }
    },

    removeTicker(index) {
      const removedStock = this.finalArr[index]
      this.finalArr.splice(index, 1)

      //  Find and update the corresponding sector in finalArr
      const finalIndex = this.finalArr.findIndex(
        (stock) => stock.sector_loc === removedStock.sector_loc
      )

      if (finalIndex !== -1) {
        this.finalArr[finalIndex].sector_count--
      }

      //  Find and update the corresponding sector in graph_arr
      const graphIndex = this.graph_arr.findIndex(
        (graph) => graph.sector_loc === removedStock.sector_loc
      )

      if (graphIndex !== -1) {
        this.graph_arr[graphIndex].sector_count--
        if (this.graph_arr[graphIndex].sector_count === 0) {
          //  If the sector_count becomes 0, remove the entire object from graph_arr
          this.graph_arr.splice(graphIndex, 1)
        }
      }
    },
    showRecoTable() {
      this.showTable = !this.showTable
      this.showModal = !this.showModal
      this.tableValid = false

      if (this.randomStocks.length != 5) {
        const min = 5
        const max = 15
        var discount_status = ''
        for (let stock of this.random5stocks) {
          const randomFloat = Math.random() * (max - min) + min
          if (randomFloat > 13) {
            discount_status = 'HEAVENLY Discount!!'
          } else if (randomFloat > 8 && randomFloat <= 13) {
            discount_status = 'BIG Discount!!'
          } else {
            discount_status = 'Small Discount!!'
          }
          this.randomStocks.push({
            name: stock,
            description: 'Undervalued: ' + randomFloat.toFixed(2) + '%',
            discount_stat: discount_status
          })
        }
      }
    }
  },

  computed: {
    weightedBeta() {
      if (this.finalArr.length == 0) {
        return 0
      }
      var result = 0
      for (var num of this.finalArr) {
        result += parseFloat(num.beta_value)
      }
      return parseFloat((result / this.finalArr.length).toFixed(2))
    },

    sectorGraph() {
      return this.graph_arr.map((item) => item.sector_loc)
    },

    sectorCountGraph() {
      return this.graph_arr.map((item) => item.sector_count)
    },
    //  Calculate percentages based on the sum of sectorCountGraph
    sectorPercentages() {
      if (this.sectorCountGraph.length === 0) {
        return []
      }

      //  Calculate the sum of sectorCountGraph using reduce
      const sum = this.sectorCountGraph.reduce((total, count) => total + count, 0)

      //  Calculate percentages based on the sum
      return this.sectorCountGraph.map((count) => parseFloat((count / sum).toFixed(2)))
    },

    //  List of random background colors based on the length of sectorGraph
    randomBackgroundColors() {
      const colors = []
      for (let i = 0; i < this.sectorGraph.length; i++) {
        //  Generate random color code
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
        colors.push(randomColor)
      }
      return colors
    },
    volatileOrNot() {
      var final_status = ''
      if (this.weightedBeta > 1.2) {
        final_status = ' High Volatility'
      } else if (this.weightedBeta <= 1.2 && this.weightedBeta > 1.0) {
        final_status = ' Stable Volatility '
      } else {
        final_status = 'Low Volatility'
      }
      return final_status
    },
    random5stocks() {
      var random_list = []
      const stockSymbols = [
        'NFLX',
        'CRM',
        'AAL',
        'NKE',
        'WFC',
        'ORCL',
        'XOM',
        'TGT',
        'ABBV',
        'ACN',
        'MCD',
        'LLY',
        'MA',
        'TMO',
        'NEE',
        'C',
        'LOW',
        'DUK',
        'FDX',
        'UPS',
        'COST',
        'WMT',
        'VLO',
        'CAT',
        'KO',
        'MRK',
        'CSCO',
        'GE',
        'F',
        'IBM'
      ]
      while (random_list.length != 5) {
        const randomIndex = Math.floor(Math.random() * stockSymbols.length)
        const selectedStock = stockSymbols[randomIndex]
        if (!random_list.includes(selectedStock)) {
          random_list.push(selectedStock)
        }
      }
      return random_list
    }
  }
}
</script>




  <style scoped>
.minus-small-circle-button {
  background-color: transparent;
  border: 2px solid #333;
  /* Change the color to your preference */
  border-radius: 50%;
  width: 10px;
  /* Adjust the size as needed */
  height: 10px;
  /* Adjust the size as needed */
  color: #333;
  /* Change the color to your preference */
  font-size: 16px;
  /* Adjust the font size as needed */
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
}

.minus-small-circle-button:hover {
  background-color: #333;
  /* Change the hover color to your preference */
  color: #fff;
  /* Change the hover color to your preference */
}

.minus-small-circle-button:focus {
  outline: none;
  /* Remove the default focus outline */
}

.minus-small-circle-button:active {
  transform: scale(0.9);
  /* Add a click effect if desired */
}

button {
  color: rgb(0, 128, 0);
  padding: 8px 22px;
  border-radius: 6px;
  background: rgb(0, 128, 0) 8;
  transition: all 1s ease;
  border-color: rgb(183, 117, 117);
  margin-left: 20px;
}

button:active {
  transform: scale(1);
}

.green-text {
  color: green; /* Set your desired green color */
}

.red-text {
  color: red; /* Set your desired red color */
}

.yellow-text {
  color: yellow;
}

/* @keyframes fade-inout {
   0% {
     opacity: 1;
   }
   100% {
     opacity: 0;
   }
 }

 .fade_in_fade_out {
   /* apply anumation */
/* animation: fade-inout 5s infinite alternate; */
/* animation: fade-in 1s; */
/* style the text */
/* font-size: 5em; */
</style>