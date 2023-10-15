async function getTrending() {
  const url =
    'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-trending-tickers?region=US'
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '8a10594436msh268460701326c1ep1b3ccejsnd34c3997dbeb',
      'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
  }

  try {
    const response = await fetch(url, options)
    const result = await response.json()
    const name = 'trending'

    const trending = result.finance.result[0].quotes

    generateTable(name, trending)
    // console.log(result);
  } catch (error) {
    console.error(error)
  }
}

async function getActive() {
  const url = 'https://yahoo-finance15.p.rapidapi.com/api/yahoo/co/collections/most_actives?start=0'
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '8a10594436msh268460701326c1ep1b3ccejsnd34c3997dbeb',
      'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
    }
  }

  try {
    const response = await fetch(url, options)
    const result = await response.json()
    const name = 'active'
    const active = result.quotes

    generateTable(name, active)
    // console.log(result);
  } catch (error) {
    console.error(error)
  }
}

async function getGainer() {
  const url = 'https://yahoo-finance15.p.rapidapi.com/api/yahoo/co/collections/day_gainers?start=0'
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '8a10594436msh268460701326c1ep1b3ccejsnd34c3997dbeb',
      'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
    }
  }

  try {
    const response = await fetch(url, options)
    const result = await response.json()
    const name = 'gainer'
    const gainer = result.quotes

    generateTable(name, gainer)
    // console.log(result);
  } catch (error) {
    console.error(error)
  }
}

async function generateTable(name, data) {
  try {
    let tableHTML = `<h1>Trending Tickers</h1>`

    if (name == 'gainer') {
      tableHTML = `<h1>Stocks: Top Gainers</h1>`
    }
    if (name == 'active') {
      tableHTML = `<h1>Stocks: Most Active</h1>`
    }

    tableHTML += `<table class="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">Symbol</th>
                            <th scope="col">Last Price</th>
                            <th scope="col">Change</th>
                            <th scope="col">% Change</th>
                        <tr>
                    </thead><tbody>`

    if (name == 'active') {
      for (let i = 0; i < 5; i++) {
        let obj = data[i]
        tableHTML += `<tr>
                            <th scope="row">${obj.symbol}</th>
                            <td>${obj.regularMarketDayHigh}</td>
                            <td>${obj.regularMarketChange}</td>
                            <td>${obj.regularMarketChangePercent}</td>
                        </tr>`
      }
    } else {
      for (let i = 0; i < 5; i++) {
        let obj = data[i]
        tableHTML += `<tr>
                            <th scope="row">${obj.symbol}</th>
                            <td>${obj.regularMarketPrice}</td>
                            <td>${obj.regularMarketChange}</td>
                            <td>${obj.regularMarketChangePercent}</td>
                        </tr>`
      }
    }

    tableHTML += `</tbody></table>`
    document.getElementById(`${name}`).innerHTML = tableHTML
  } catch (error) {
    console.error(error)
  }
}

getTrending()
getActive()
getGainer()
