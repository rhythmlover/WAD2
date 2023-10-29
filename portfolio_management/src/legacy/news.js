let currentQuery = 'Apple Inc.'
let currentPage = 1

let fetchNews = async (page, q) => {
  console.log(`Fetching News for ${q}, Page number ${page}...`)

  var url =
    'https://newsapi.org/v2/everything?' +
    'language=en&' +
    'q=' +
    q +
    '&pageSize=20&' +
    'page=' +
    page +
    '&apiKey=8ed1d1256b4e4f41996101e7967ad3b5'

  var req = new Request(url)

  let a = await fetch(req)
  let response = await a.json()
  console.log(JSON.stringify(response))

  console.log(response)
  let str = "<div class='container-fluid justify-content-center'><div class='row'>"
  resultCount.innerHTML = response.totalResults
  for (let item of response.articles) {
    if (item.urlToImage != null) {
      str =
        str +
        `<div class="col-lg-6"><div class="card m-2" style="width:40rem">
                <img height=300 src="${item.urlToImage}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>`
      if (item.description != null) {
        str += `<p class="card-text"> ${item.description.slice(0, 100)}...    </p >`
      }
      str += `<a href="${item.url}" target="_blank" class="btn btn-primary">Read Article</a>
                </div>
            </div>
        </div>`
    }
  }
  str += `</div>
</div>`
  document.querySelector('.content').innerHTML = str
}

fetchNews(1, currentQuery)
search.addEventListener('click', (e) => {
  e.preventDefault()
  let query = searchInput.value
  currentQuery = query

  fetchNews(1, query)
})
prev.addEventListener('click', (e) => {
  e.preventDefault()
  if (currentPage > 1) {
    currentPage = currentPage - 1

    fetchNews(currentPage, currentQuery)
  }
})
next.addEventListener('click', (e) => {
  e.preventDefault()
  currentPage = currentPage + 1

  fetchNews(currentPage, currentQuery)
})
