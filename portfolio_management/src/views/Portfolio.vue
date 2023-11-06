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
      <div class="container">
        <div class="row">
          <div class="col-lg-6 col-md-8 col-sm-10 col-12 mx-auto">
            <div class="header-text mt-lg-1 mt-sm-2 mt-5">
              "Diversification is a protection against ignorance. It makes very little sense for
              those who know what they're doing." - Warren Buffet
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid px-md-5 px-0 mt-3 pb-8">
        <div class="card rounded-5 card-header shadow-lg p-0 pt-2" v-if="afterAnalysisClicked">
          <div class="row justify-content-center">
            <div class="col-lg-10 col-md-10 col-sm-12">
              <div class="container form-group font-weight-bold mt-4">
                Enter the stocks in your portfolio to see how healthy your portfolio is! &nbsp;
                <input
                  class="form-control"
                  type="text"
                  v-model="tickerSymbol"
                  id="symbol"
                  ref="name"
                  @keyup="updateTable"
                  placeholder="Ticker Symbol"
                />

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
                          <div class="col-9 mb-0">
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
            <div class="container justify-content-start text-center my-3">
              <button
                class="btn bg-gradient-primary px-xl-6 py-lg-3 mx-lg-2 mb-lg-3 px-md-5 py-md-2 mx-md-1 my-md-1 px-5 py-2 ms-1 mb-0 text-xs"
                name="add"
                v-if="!showBeta"
                @click="addTicker(this.tickerSymbol)"
              >
                ADD
              </button>
            </div>
          </div>
        </div>

        <div class="card blur blur-rounded shadow-lg mt-5" v-if="afterAnalysisClicked">
          <div id="result" v-if="finalArr.length > 0" class="container mt-5 container-fluid">
            <div v-if="!showBeta">
              <div class="row justify-content-center">
                <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                  <h2 style="text-align: center">Breakdown of Portfolio:</h2>
                </div>
              </div>
              <div
                class="table-responsive"
                style="max-height: 300px; overflow-y: auto; overflow-x: auto"
              >
                <table class="table">
                  <thead class="text-center">
                    <tr>
                      <th class="col-6 col-md-3 col-lg-3">Ticker Symbol</th>
                      <th class="col-6 col-md-3 col-lg-3">Sector</th>
                      <th class="col-6 col-md-3 col-lg-3">Beta</th>
                      <th class="col-6 col-md-3 col-lg-3">Remove Stock?</th>
                    </tr>
                  </thead>

                  <tbody class="text-center">
                    <transition-group name="list">
                      <tr v-for="(stock, index) in finalArr" :key="index">
                        <td>{{ stock.name_of_stock.toUpperCase() }}</td>
                        <td>{{ stock.sector_loc }}</td>
                        <td>{{ stock.beta_value }}</td>
                        <td>
                          <button
                            class="btn bg-gradient-primary px-lg-4 mx-lg-2 px-md-3 py-md-2 mx-md-1 my-md-1 px-2 py-2 ms-1 mb-0 text-xs"
                            @click="removeTicker(index), show != show"
                          >
                            Remove Stock
                          </button>
                        </td>
                      </tr>
                    </transition-group>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-sm-5 col-8 text-center">
            <button
              class="btn bg-gradient-primary px-lg-4 py-lg-3 mt-4 px-md-3 py-md-2 px-4 py-3 mt-3 text-xs"
              data-toggle="modal"
              data-target="#exampleModal"
              v-if="!showBeta"
              name="confirm"
              @click="finalBeta(), showRecoTable()"
            >
              <a href="#result"></a>
              GET ANALYSIS REPORT
            </button>
          </div>
        </div>
        <!-- <div class="pb-10"></div> -->

        <div class="container-fluid" v-if="!afterAnalysisClicked">
          <!-- <div class="col-12 col-md-12 col-sm-12">
            <div class="card blur blur-rounded shadow-lg mx-2 my-4">
              <div class="row justify-content-center">
                <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                  <h3 style="text-align: center">Breakdown of Portfolio:</h3>
                </div>
              </div>
              <div class="table-responsive" style="max-height: 300px; overflow-y: auto overflow-x: auto;">
                <table class="table">
                  <thead class="text-center">
                    <tr>
                      <th class="col-4 col-md-4 col-lg-4">Ticker Symbol</th>
                      <th class="col-4 col-md-4 col-lg-4">Sector</th>
                      <th class="col-4 col-md-4 col-lg-4">Beta</th>
                    </tr>
                  </thead>

                  <tbody class="text-center">
                    <tr v-for="(stock, index) in finalArr" :key="index">
                      <td class="col-4 col-md-4 col-lg-3.5">
                        {{ stock.name_of_stock.toUpperCase() }}
                      </td>
                      <td class="col-4 col-md-4 col-lg-3.5">{{ stock.sector_loc }}</td>
                      <td class="col-4 col-md-4 col-lg-3.5">{{ stock.beta_value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div> -->

          <div class="col-12 col-md-12 col-sm-12">
            <div class="card blur blur-rounded shadow-lg mx-2 my-4">
              <div class="mt-4 mb-4 container">
                <h3 id="addFromCard" style="text-align: center">Sector Breakdown</h3>
                <div class="row justify-content-center">
                  <div
                    class="col-12 col-sm-12 col-md-12 col-lg-6 align-items-center d-flex aspect-ratio-container"
                  >
                    <!-- <div class=""> -->
                    <DoughnutChart
                      style="text-align: center; width: 100%; height: 100%"
                      :data="sectorPercentages"
                      :labels="sectorGraph"
                      :backgroundColors="randomBackgroundColors"
                      class="img-fluid"
                    >
                    </DoughnutChart>
                    <!-- </div> -->
                  </div>

                  <div class="col-12 col-sm-12 col-md-6 col-lg-6">
                    <!-- Offset for center alignment in medium screens -->
                    <h3 class="mt-md-5 mt-1" style="text-align: center"><em>Volatility:</em></h3>
                    <p style="text-align: center">
                      <em
                        :class="{
                          'green-text': weightedBeta <= 1.2,
                          'red-text': weightedBeta > 1.2
                        }"
                        class="responsive-h1"
                        style="font-weight: bold"
                      >
                        {{ volatileOrNot }}
                      </em>
                    </p>
                    <h3 style="text-align: center"><em>Weighted Beta</em></h3>

                    <p style="text-align: center">
                      <em
                        :class="{
                          'green-text': weightedBeta <= 1.2,
                          'red-text': weightedBeta > 1.2
                        }"
                        class="responsive-h1"
                        style="font-weight: bold"
                      >
                        {{ weightedBeta }}
                      </em>
                    </p>
                    <div>
                      <p>Experts' Recommendation of Beta Level</p>
                      <div class="progress">
                        <div
                          class="progress-bar progress-bar-striped bg-success"
                          role="progressbar"
                          style="width: 50%"
                          aria-valuenow="100"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <div v-if="weightedBeta > 1.2">
                        <p style="margin-top: 20px">
                          Your Portfolio: <span class="red-text">Risky</span>
                        </p>
                        <div class="progress">
                          <div
                            class="progress-bar progress-bar-striped bg-danger"
                            role="progressbar"
                            style="width: 70%"
                            aria-valuenow="100"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>

                      <div v-if="weightedBeta < 1.2">
                        <p style="margin-top: 20px">
                          Your Portfolio: <span class="green-text">Healthy</span>
                        </p>

                        <div class="progress">
                          <div
                            class="progress-bar progress-bar-striped bg-warning"
                            role="progressbar"
                            style="width: 45%"
                            aria-valuenow="100"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row" style="margin-top: 20px">
                  <h3 style="text-align: center" v-if="sectorGraph.length > 3">
                    Portfolio Diversification :
                    <span class="responsive-h1 green-text"><br />Wide</span>
                  </h3>
                  <h3 style="text-align: center" v-if="sectorGraph.length <= 3">
                    Portfolio Diversification :
                    <span class="responsive-h1 red-text"><br />Narrow</span>
                  </h3>
                </div>
                <!-- <div class="row justify-content-center">
                  <div class="col-12 mt-5">
                    <div class="d-flex justify-content-center">
                      <button class="btn" @click="showRecoTable">
                        <a href="#analysis"></a>
                        Recommendations for Portfolio
                      </button>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12 col-md-12 col-sm-12">
              <div class="card blur blur-rounded shadow-lg mx-2 my-4">
                <div class="row justify-content-center">
                  <div class="col-10 col-sm-10 col-md-12 col-lg-12">
                    <h3 class="pt-4" style="text-align: center">Analysis of Portfolio:</h3>
                  </div>
                </div>
                <div
                  class="table-responsive"
                  style="max-height: 300px; overflow-y: auto; overflow-x: auto"
                >
                  <table class="table">
                    <thead class="text-center">
                      <tr>
                        <th class="col-3 col-md-4 col-lg-4">Ticker Symbol</th>
                        <th class="col-3 col-md-4 col-lg-4 text-wrap">Overvalued/Undervalued</th>
                        <th class="col-3 col-md-4 col-lg-4 text-wrap">Recommendation Verdict</th>
                      </tr>
                    </thead>

                    <tbody class="text-center">
                      <transition-group name="list">
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
                      </transition-group>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-12 col-sm-12">
              <div class="card blur blur-rounded shadow-lg mx-auto mt-5">
                <div class="container text-center mt-4 mb-3">
                  <h3><em>Type of Stocks Recommended for balanced portfolio:</em></h3>

                  <h1 style="text-align: center" v-if="volatileOrNot === 'High'">
                    <span
                      @click="toggleBlur"
                      @mouseover="showPrompt"
                      @mouseleave="hidePrompt"
                      v-if="isBlurred"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Click to Find Out!"
                    >
                      <em :class="{ 'blurry-text': isBlurred }">{{ determineType }}</em>
                      <span class="click-prompt fade_in">Click on it</span>
                    </span>
                    <span class="red-text" v-else>
                      <em :class="{ 'blurry-text': isBlurred }">{{ determineType }}</em>
                    </span>
                  </h1>

                  <h1 style="text-align: center" v-else>
                    <span
                      @click="toggleBlur"
                      @mouseover="showPrompt"
                      @mouseleave="hidePrompt"
                      v-if="isBlurred"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Click to Find Out!"
                    >
                      <em :class="{ 'blurry-text': isBlurred }">{{ determineType }}</em>
                      <span class="click-prompt">Click on it</span>
                    </span>
                    <span class="green-text" v-else>
                      <em :class="{ 'blurry-text': isBlurred }">{{ determineType }}</em>
                    </span>
                  </h1>

                  <div class="row justify-content-center">
                    <transition-group name="list">
                      <div
                        class="col-lg-4 col-md-6 col-sm-12 my-4"
                        v-for="(stock, index) in this.randomStocks"
                        :key="index"
                      >
                        <router-link
                          :to="{ name: 'stockpage', params: { symbol: stock.name } }"
                          style="text-decoration: none"
                        >
                          <div class="card blur blur-rounded shadow-lg">
                            <div class="card-body">
                              <h5 class="card-title">{{ stock.name }}</h5>
                              <p class="card-text">
                                {{ stock.description }}<br />
                                {{ stock.discount_stat }}
                                <br />
                                <!-- <button href="#addFromCard"
                                class="btn btn-sm mb-0 ms-1"
                                @click.prevent="addingFromCard(index)"
                              >
                                Add!</button>
                              &nbsp;  -->
                                <!-- <button
                                class="btn btn-sm mb-0 ms-1"
                                data-toggle="modal"
                        
                                name="confirm"
                                @click.prevent="addingFromCard(index),finalBeta(), showRecoTable()"
                              >
                                <a href="#result"></a>
                                Add to Portfolio
                              </button> -->

                                <button
                                  href="#"
                                  class="btn bg-gradient-primary px-lg-4 px-md-3 py-md-2 ms-1 px-sm-3 px-3 py-2 ms-1 mt-3 mb-0 text-xs"
                                >
                                  Read More
                                </button>
                                &nbsp;
                              </p>
                            </div>
                          </div>
                        </router-link>
                      </div>
                    </transition-group>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between mt-5">
              <button
                href="#"
                class="btn bg-gradient-primary px-lg-4 px-md-3 py-md-2 ms-1 px-sm-3 px-4 py-2 ms-1 mb-0 text-xs"
                @click="reset"
              >
                Back
              </button>

              <router-link to="/markets">
                <button
                  class="btn bg-gradient-primary px-lg-4 px-md-3 py-md-2 ms-1 px-sm-3 px-4 py-2 ms-1 mb-0 text-xs"
                >
                  Compare to Market
                </button>
              </router-link>
            </div>
            <!-- <div class="pb-10"></div> -->
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
@import '../assets/css/soft-ui-dashboard.css';

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
      isBlurred: true,
      isHovered: false,
      isClicked: false,
      animate: true,
      revealed: false,
      percentage: 0,
      show: true,

      //  Reference factors
      error_msg: '',
      showBeta: false,
      tickerSymbol: '',

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
          'X-RapidAPI-Key': 'e29108bd6bmsh9a396f313137103p1e921ajsn2ba4b9f2fdcb',
          'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
        }
      }
      try {
        const responsesAll = await Promise.all([fetch(urlAll, optionsAll)])
        this.resultsAll = await Promise.all(responsesAll.map((res) => res.json()))
        // console.log(this.resultsAll)
      } catch (error) {
        console.error(error)
      }
    },

    async updateTable() {
      this.error_msg = ''
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
        this.searchedStocks = filteredStocks.slice(0, 5)
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
      this.tickerSymbol = symbol.trim()
      if (this.tickerSymbol === 'undefined') {
        this.error_msg = 'Please input a valid ticker symbol'
        this.tickerSymbol = ''
        return
      }
      this.showTable = false

      //  Assuming Stock is inside the finalArr
      this.error_msg = ''
      for (let obj of this.finalArr) {
        console.log(this.tickerSymbol)
        if (obj.name_of_stock.toUpperCase() === this.tickerSymbol.toUpperCase()) {
          this.tickerSymbol = ''
          this.error_msg = 'Ticker is already included'
          this.$refs.name.focus()
          return
        }
      }
      //  Extracting API
      this.$refs.name.focus()
      const url = 'https://mboum-finance.p.rapidapi.com/qu/quote/asset-profile'
      axios
        .get(url, {
          params: {
            symbol: this.tickerSymbol
          },
          headers: {
            'X-RapidAPI-Key': 'e29108bd6bmsh9a396f313137103p1e921ajsn2ba4b9f2fdcb',
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
    reset() {
      this.afterAnalysisClicked = true
      this.showBeta = !this.showBeta
      this.showTable = false
      this.isBlurred = false
    },

    addingFromCard(index) {
      this.tickerSymbol = this.randomStocks[index].name
      const url = 'https://mboum-finance.p.rapidapi.com/qu/quote/asset-profile'
      axios
        .get(url, {
          params: {
            symbol: this.tickerSymbol
          },
          headers: {
            'X-RapidAPI-Key': 'e29108bd6bmsh9a396f313137103p1e921ajsn2ba4b9f2fdcb',
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
      this.new_table_recommendations = []
      this.finalBeta()
      this.showRecoTable()
    },
    finalBeta() {
      if (this.finalArr.length < 4) {
        alert('Please input at least 4 stocks to have a more accurate test! ')
      } else {
        this.new_table_recommendations = []
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
                'X-RapidAPI-Key': 'e29108bd6bmsh9a396f313137103p1e921ajsn2ba4b9f2fdcb',
                'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com'
              }
            })
            .then((response) => {
              const randomNumber = (15 + Math.random() * 5).toFixed(2)
              // const backup = ()

              const recommendation_status = response.data.body.recommendationKey
              console.log(recommendation_status)
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
      this.showTable = true
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
    },
    toggleBlur() {
      this.isBlurred = false
      this.isClicked = true
    }
  },
  showPrompt() {
    this.isHovered = true
  },
  hidePrompt() {
    this.isHovered = false
  },
  revealSpoiler() {
    this.revealed = !this.revealed
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
  },
  created() {
    var intval = setInterval(() => {
      if (this.percentage < 101) this.percentage += 0.1
      else clearInterval(intval)
    }, 10)
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

.blurry-text {
  color: transparent;
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
  /* Increased blur values */
  cursor: pointer;
}

.fade-in {
  transition: opacity 0.5s;
  /* Add a transition for opacity */
  opacity: 0;
  /* Initially, the text is hidden */
}

.fade-in.active {
  opacity: 1;
  /* When active class is added, text becomes visible */
}

.click-prompt {
  display: none;
  /* Initially, the prompt is hidden */
  font-size: 14px;
  /* Adjust the font size as needed */
  color: #555;
  /* Text color of the prompt */
  text-align: center;
  /* Center the text horizontally */
  background-color: rgba(255, 255, 255, 0.8);
  /* Semi-transparent white background */
  padding: 5px 10px;
  /* Add padding to the prompt */
  position: absolute;
  /* Positioning absolute for precise placement */
  top: -30px;
  /* Adjust the distance from the text */
  left: 50%;
  /* Center horizontally */
  transform: translateX(-50%);
  /* Center horizontally */
  border-radius: 5px;
  /* Rounded corners for the prompt */
}

.aspect-ratio-container {
  position: relative;
  padding-bottom: 50%;
  /* Adjust this value for your desired aspect ratio */
  height: 0;
  overflow: hidden;
}

.header-text {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 24px;
  color: rgb(128, 48, 175);
  /* Change text color to a nice blue */
  text-align: center;
  margin-top: 20px;
  font-style: italic;
  /* Italicize the text */
}

.highlight {
  font-weight: bold;
  color: #ff4500;
  /* Change color for emphasis to a deep orange */
}

@media (min-width: 0px) {
  .responsive-h1 {
    font-size: 40px;
  }
  .aspect-ratio-container {
    position: relative;
    padding-bottom: 100%;
    /* Adjust this value for your desired aspect ratio */
    height: 0;
    overflow: hidden;
  }
}

@media (min-width: 576px) {
  .responsive-h1 {
    font-size: 50px;
  }
}

@media (min-width: 768px) {
  .responsive-h1 {
    font-size: 60px;
  }
}

@media (min-width: 992px) {
  .responsive-h1 {
    font-size: 70px;
  }
  .aspect-ratio-container {
    position: relative;
    padding-bottom: 50%;
    /* Adjust this value for your desired aspect ratio */
    height: 0;
    overflow: hidden;
  }
}

@media (min-width: 1200px) {
  .responsive-h1 {
    font-size: 80px;
  }
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
