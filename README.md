# Portfolio Management

## Status

Under Development

### Downloading the source code

Clone the repository:

```bash
git clone https://github.com/rhythmlover/WAD2.git
cd portfolio_management
```

To update the source code to the latest commit, run the following command inside the `portfolio_management` directory:

```bash
git pull
```

To install all project dependencies, run the following command inside the `portfolio_management` directory:
```bash
npm install
```

To run the Vue server, run the following command inside the `portfolio_management` directory:
```bash
npm run dev
```

### API related errors

In the event there are several components not displaying data, it is due to an expired subscription/exceed-limit api-key. Please contact us or generate a new API key by subscribing to the relevant APIs found on [RapidAPI](https://rapidapi.com/hub). After activating a key, please replace your new API key in the respective part of our code generating an API fetch error.