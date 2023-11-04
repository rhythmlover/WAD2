<template>
  <div class="mt-8" v-if="!isLoggedIn">
    <div class="container-fluid w-50">
      <div class="card blur blur-rounded shadow rounded-5" v-if="afterAnalysisClicked">
        <div class="card-header shadow-lg rounded-5 pb-0 pt-2">
          <h4 class="text-center">Please sign in to see this page</h4>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isLoggedIn" class="mt-7">
    <main>
      <div class="container-fluid px-10 mt-3">
        <div class="card rounded-5" v-if="afterAnalysisClicked">
          <div class="card-header shadow-lg rounded-5 pb-0 pt-2">
            <div>
              <div class="row">
                <div class="container form-group font-weight-bold mt-2">
                  Analyze your portfolio by keying in the stocks in your portfolio: &nbsp;
                  <input class="form-control col-lg-10 col-md-10 col-sm-10" type="text" v-model="tickerSymbol" id="symbol"
                    ref="name" @keyup="updateTable" placeholder="Ticker Symbol" />

                  <table ref="searchList" class="table align-items-center mb-0" v-show="showTable">
                    <tbody>
                      <!-- <tr>
                        <th ref="search" colspan="4">
                          <div class="row mx-auto">
                            <div
                              class="col-3 text-uppercase text-dark text-lg font-weight-bolder opacity-7"
                            >
                              <th>Symbol</th>
                            </div>
                            <div
                              class="col-9 text-uppercase text-dark text-lg font-weight-bolder opacity-7"
                            >
                              <th>Name</th>
                            </div>
                          </div>
                        </th>
                      </tr> -->
                      <template v-for="stock in searchedStocks" :key="stock.symbol">
                        <div @click="addTicker(stock.symbol)">
                          <div class="row table-row-link mx-auto">
                            <div class="col-3 mb-0">
                              <tr>
                                <td>{{ stock.symbol }}</td>
                              </tr>
                            </div>
                            <div class="col-3 mb-0">
                              <tr>
                                <td>{{ stock.name }}</td>
                              </tr>
                            </div>
                          </div>
                        </div>
                      </template>
                    </tbody>
                  </table>
                  <span v-if="error_msg.length">{{ error_msg }}</span>
                </div>
              </div>
              <div class="container justify-content-start ms-0 my-3">
                <button class="btn btn-sm mb-0 ms-1" name="add" @click="addTicker()">ADD</button>
                <button class="btn btn-sm mb-0 ms-1" name="confirm" @click="finalBeta">
                  <a href="#result"></a>
                  GET ANALYSIS REPORT
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="card blur blur-rounded shadow-lg mt-5" v-if="afterAnalysisClicked">
          <div id="result" v-if="finalArr.length > 0" class="container mt-5">
            <div class="row">
              <div v-if="!showBeta">
                <h2 style="text-align: center">Breakdown of Portfolio:</h2>
                <table class="table">
                  <thead class="text-center">
                    <tr>
                      <th class="col-4">Ticker Symbol</th>
                      <th class="col-4">Sector</th>
                      <th class="col-4">Beta</th>
                      <th>Remove Stock?</th>
                    </tr>
                  </thead>

                  <tbody class="text-center">
                    <tr v-for="(stock, index) in finalArr" :key="index">
                      <td>{{ stock.name_of_stock.toUpperCase() }}</td>
                      <td>{{ stock.sector_loc }}</td>
                      <td>{{ stock.beta_value }}</td>
                      <td>
                        <button type="button" class="btn btn-sm mb-0 ms-1" @click="removeTicker(index)">
                          Remove Stock
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="container-fluid" v-if="!afterAnalysisClicked">
          <div class="row">
            <div class="col-6 col-md-6 col-sm-12">
              <div class="card blur blur-rounded shadow-lg mx-auto">
                <div class="mt-4 mb-2 mx-3">
                  <h2 style="text-align: center">Breakdown of Portfolio:</h2>
                  <table class="table">
                    <thead class="text-center">
                      <tr>
                        <th class="col-3">Ticker Symbol</th>
                        <th class="col-3">Sector</th>
                        <th class="col-3">Beta</th>
                        <th class="col-3">Remove Stock?</th>
                      </tr>
                    </thead>

                    <tbody class="text-center">
                      <tr v-for="(stock, index) in finalArr" :key="index">
                        <td>{{ stock.name_of_stock.toUpperCase() }}</td>
                        <td>{{ stock.sector_loc }}</td>
                        <td>{{ stock.beta_value }}</td>
                        <td>
                          <button type="button" class="btn btn-sm mb-0 ms-1" @click="removeTicker(index)">
                            Remove Ticker
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="col-6 col-md-6 col-sm-12">
              <div class="card blur blur-rounded shadow-lg mx-auto">
                <div class="mt-4 mb-4 mx-3">
                  <div id="show_reco" v-if="showBeta" class="container-fluid text-center">
                    <h2 style="text-align: center">Sector Breakdown</h2>

                    <div class="d-flex justify-content-center">
                      <DoughnutChart style="text-align: center; max-width: 300px" :data="sectorPercentages"
                        :labels="sectorGraph" :backgroundColors="randomBackgroundColors"></DoughnutChart>
                    </div>
                    <p style="text-align: center">
                      <em><span :class="{
                        'green-text': weightedBeta <= 1.2,
                        'red-text': weightedBeta > 1.2
                      }" style="font-size: 24px; font-family: 'Roboto', sans-serif">{{ volatileOrNot }}</span></em>
                      <span style="font-size: 24px; font-family: 'Roboto', sans-serif">Volatility</span>
                    </p>
                  </div>
                </div>
                <div class="d-flex justify-content-center mt-2">
                  <button class="btn" @click="showRecoTable">
                    <a href="#analysis"></a>
                    Generate Insights
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-12 col-sm-12">
            <div class="card blur blur-rounded shadow-lg mx-auto mt-5">
              <div v-if="showTable" id="analysis" class="container text-center mt-4">
                <h2 class="pl-2">Analysis of Portfolio</h2>
                <table class="mx-2 table">
                  <thead>
                    <tr class="col">
                      <th>Ticker Symbol</th>
                      <th>Overvalued / Undervalued</th>
                      <th>Recommendation Verdict</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(stock, index) in new_table_recommendations" :key="index">
                      <td class="col-md-3">{{ stock.name_of_stock.toUpperCase() }}</td>
                      <td :class="{
                        'green-text': stock.recommendation_verdict === 'HOLD',
                        'red-text': stock.recommendation_verdict === 'SELL'
                      }">
                        {{ stock.valuation }}
                      </td>
                      <td :class="{
                        'green-text': stock.recommendation_verdict === 'HOLD',
                        'red-text': stock.recommendation_verdict === 'SELL'
                      }">
                        {{ stock.recommendation_verdict }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="col-12 col-md-12 col-sm-12">
              <div class="card blur blur-rounded shadow-lg mx-auto mt-5">
                <div v-if="showTable" class="container text-center mt-4 mb-3">
                  <p><em>Type of Stocks Recommended for balanced portfolio:</em></p>
                  <h1 style="text-align: center">
                    <span class="green-text" v-if="determineType === 'Defensive'">
                      <em>{{ determineType }}</em></span>
                    <span class="red-text" v-if="determineType === 'Growth'"><em>{{ determineType }}</em></span>
                  </h1>

                  <div class="row justify-content-center">
                    <div class="col-lg-4 col-md-2 col-sm-1 mx-5 my-4" v-for="(stock, index) in this.randomStocks"
                      :key="index">
                      <div class="card blur blur-rounded shadow-lg">
                        <div class="card-body">
                          <h5 class="card-title">{{ stock.name }}</h5>
                          <p class="card-text">
                            {{ stock.description }}<br />
                            {{ stock.discount_stat }}
                          </p>
                          <!-- <a href="#" class="btn btn-primary">Read More</a> &nbsp; -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="margin-top: 20px">
              <router-link to="/markets">
                <button>Compare to Market</button>
              </router-link>
            </div>
            <div class="pb-10"></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  line-height: 1.5;
  box-sizing: border-box;
}

main {
  height: 100vh !important;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

main::-webkit-scrollbar {
  display: none;
}

html,
body {
  overflow: hidden;
  height: 100%;
}

.donut {
  overflow: auto;
  position: relative;
  max-width: 100%;
  max-height: 100vh;
}

button:active {
  transform: scale(1);
}

.table-row-link:hover {
  background-color: lightgrey;
  /* Change to your desired color */
}
</style>

<script>
import axios from 'axios'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)
import DoughnutChart from '../components/DoughnutChart.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, getDoc, updateDoc, doc } from 'firebase/firestore'

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
      volatilityLevel: 1.5, // Example: 1.5 for extreme, 1.0 for moderate, 0.5 for acceptable
      extremeThreshold: 1.3,
      moderateThreshold: 1.0,

      //  Reference factors
      error_msg: '',
      showBeta: false,
      tickerSymbol: '',
      showModal: false,

      isLoggedIn: true,
      auth: null,
      db: null,
      userRef: null,
      uid: '',

      //for autocomplete
      resultsAll: [],
      // showTable: false,
      searchedStocks: []
    }
  },
  mounted() {
    this.router_link = this.$route.path
    this.auth = getAuth()
    this.db = getFirestore()
    this.userRef = collection(this.db, 'users')

    const authStateChangedPromise = new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          this.uid = user.uid
          this.isLoggedIn = true
        } else {
          this.isLoggedIn = false
        }
        resolve()
      })
    })

    authStateChangedPromise.then(() => {
      this.getUserData()
    })

    this.getAllStock()
  },
  methods: {
    async getAllStock() {
      let urlAll = 'https://twelve-data1.p.rapidapi.com/stocks?country=US'
      let optionsAll = {
        method: 'GET',
        params: {
          country: 'US',
          format: 'json'
        },
        headers: {
          'X-RapidAPI-Key': 'f033b0dff5mshf586d930d4a646ap1ef84ejsn5be27eba3a61',
          'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
        }
      }
      try {
        const responsesAll = await Promise.all([fetch(urlAll, optionsAll)])
        this.resultsAll = await Promise.all(responsesAll.map((res) => res.json()))
        console.log(this.resultsAll)
      } catch (error) {
        console.error(error)
      }
    },

    async updateTable() {
      if (this.tickerSymbol === '') {
        this.showTable = false
      } else {
        this.showTable = true
        const filteredStocks = this.resultsAll[0].data.filter((stock) => {
          return (
            stock.symbol.toLowerCase().includes(this.tickerSymbol.toLowerCase()) ||
            stock.name.toLowerCase().includes(this.tickerSymbol.toLowerCase())
          )
        })
        this.searchedStocks = filteredStocks.slice(0, 3)
      }
    },

    async userStoreData(array) {
      const userDocRef = doc(this.db, 'users', this.uid)
      await updateDoc(userDocRef, {
        data: array
      })
    },
    async getUserData() {
      const userDocRef = doc(this.db, 'users', this.uid)
      const docSnap = await getDoc(userDocRef)
      if (docSnap.exists()) {
        this.finalArr = docSnap.data().data
        for (let obj of this.finalArr) {
          const existingGraph = this.graph_arr.find((graph) => graph.sector_loc === obj.sector_loc)
          if (existingGraph) {
            existingGraph.sector_count = obj.sector_count
          } else {
            this.graph_arr.push({
              sector_loc: obj.sector_loc,
              sector_count: obj.sector_count
            })
          }
        }
      } else {
        console.log('No such document!')
      }
    },
    addTicker(symbol) {
      //from clicking, set symbol
      this.tickerSymbol = symbol

      //  Assuming Stock is inside the finalArr
      this.error_msg = ''
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
          console.log(response.data)
          var sector = response.data.body.sector

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
          this.userStoreData(this.finalArr)
          this.tickerSymbol = ''
        })
        .catch((error) => {
          console.log(error.message)
          this.error_msg = 'Please key in a valid ticker symbol!'
          this.tickerSymbol = ''
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

              const recommendation_status = response.data.body.recommendationKey
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

      this.userStoreData(this.finalArr)

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

      if (this.randomStocks.length != 4) {
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
        final_status = 'High'
      } else if (this.weightedBeta <= 1.2) {
        final_status = 'Low '
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
      while (random_list.length != 4) {
        const randomIndex = Math.floor(Math.random() * stockSymbols.length)
        const selectedStock = stockSymbols[randomIndex]
        if (!random_list.includes(selectedStock)) {
          random_list.push(selectedStock)
        }
      }
      return random_list
    },
    determineType() {
      if (this.volatileOrNot === 'High') {
        return 'Defensive'
      } else {
        return 'Growth'
      }
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
  color: green;
  /* Set your desired green color */
}

.red-text {
  color: red;
  /* Set your desired red color */
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
