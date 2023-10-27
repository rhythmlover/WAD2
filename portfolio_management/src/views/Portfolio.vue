<template>
  <div class="container mt-7">
    Ticker Symbol: <input type="text" v-model="tickerSymbol" /><span v-if="error_msg.length">{{ error_msg }}</span><br />
    Number of Shares Bought: <input type="number" v-model="numberOfShares" /><br />
    Purchase Price: <input type="text" v-model="purchasePrice" /><br />
    <button name="add" @click="addTicker">Add</button>
    <button name="remove" @click="removeStock">Remove</button>
    <button name="confirm" @click="finalBeta">Confirm Portfolio!</button>
    <div id="result" v-if="finalArr.length > 0">
      <h2 class="pl-2">Breakdown of Portfolio:</h2>
      <table class="mx-2 table">
        <tr>
          <th>Ticker Symbol</th>
          <th>Beta</th>
          <th>Total Amount Invested</th>
        </tr>
        <tr v-for="(stock, index) in finalArr" :key="index">
          <td>{{ stock.name }}</td>
          <td>{{ stock.other_details[0] }}</td>
          <td>
            {{ stock.other_details[1] }}
            <button @click="removeTicker(index)">Remove Ticker</button>
          </td>
        </tr>
      </table>
    </div>
    <div id="final_beta" v-if="showBeta">
      <span>The weighted beta in your portfolio is: {{ totalBeta }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

var error_msg = ref('');
var tickerSymbol = "";
var numberOfShares = 0;
var purchasePrice = "";
var tickerList = [];
var betaList = [];
var totalInvestedList = [];
var totalValue = 0;
var finalArr = reactive([]);
var totalBeta = ref(0);
var showBeta = ref(false);

const addTicker = () => {
  parseFloat(numberOfShares);
  parseFloat(purchasePrice);

  const totalPurchasePricePerTicker = numberOfShares * purchasePrice;
  totalValue += totalPurchasePricePerTicker;

  for (let obj of finalArr) {
    if (obj.name === tickerSymbol) {
      obj.other_details[1] += totalPurchasePricePerTicker;
      tickerSymbol = '';
      numberOfShares = '';
      purchasePrice = '';
      return;
    }
  }

  const url = 'https://mboum-finance.p.rapidapi.com/qu/quote/default-key-statistics';

  axios
    .get(url, {
      params: {
        symbol: tickerSymbol,
      },
      headers: {
        'X-RapidAPI-Key': '915cf03ff5mshb71b6d2e0eccb95p1d3eadjsn75791094d43b',
        'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com',
      },
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.error) {
        error_msg.value = response.data.error;
        tickerSymbol = '';
        numberOfShares = 0;
        purchasePrice = '';
        return;
      } else {
        if (error_msg.value.length) {
          error_msg.value = '';
        }
      }
      const dictionaryNum = response.data.defaultKeyStatistics;
      const beta = dictionaryNum.beta.fmt;

      finalArr.push({
        name: tickerSymbol,
        other_details: [beta, totalPurchasePricePerTicker],
      });

      console.log(finalArr);
      tickerSymbol = '';
      numberOfShares = 0;
      purchasePrice = '';
    })
    .catch((error) => {
      console.log(error.message);
      numberOfShares = 0;
      purchasePrice = '';
    });
};

const finalBeta = () => {
  const weightedList = [];

  for (let i = 0; i < totalInvestedList.length; i++) {
    const value = totalInvestedList[i] / totalValue;
    weightedList.push(value);
  }

  for (let i = 0; i < betaList.length; i++) {
    totalBeta.value += betaList[i] * weightedList[i];
  }

  showBeta.value = true;
};
const removeStock = () => {
  const stockToRemove = prompt('Which stock would you like to remove?');
  if (stockToRemove) {
    const indexToRemove = finalArr.findIndex((obj) => obj.name === stockToRemove);
    if (indexToRemove !== -1) {
      finalArr.splice(indexToRemove, 1);
    }
  }
};
</script>

