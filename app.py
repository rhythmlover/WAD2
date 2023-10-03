from flask import Flask, render_template, request, jsonify
from yahoo_fin.stock_info import get_data
from datetime import datetime, timedelta

import json
import plotly.utils
import plotly.graph_objs as go

app = Flask(__name__)

@app.route('/')
def index():
    # Calculate start_date as 1 month from today
    start_date = (datetime.today() - timedelta(days=60)).strftime('%Y-%m-%d')

    # Set end_date as today's date
    end_date = datetime.today().strftime('%Y-%m-%d')

    # Fetch historical data for s&p 500 with the selected period and interval
    df = get_data('^GSPC', start_date=start_date,
                  end_date=end_date, index_as_date=True, interval='1d')

    # Create a new candlestick chart with the updated data
    fig = go.Figure(data=[go.Candlestick(x=df.index,
                    open=df['open'],
                    high=df['high'],
                    low=df['low'],
                    close=df['close'])])
    
    # Update the chart layout
    fig.update_layout(xaxis_rangeslider_visible=False, template='plotly_dark')

    # Convert the Plotly chart to HTML
    chart_html = fig.to_html(full_html=False)

    return render_template('index.html', chart_html=chart_html)


@app.route('/update_chart', methods=['POST'])
def update_chart():
    try:
        # Get the start_date from the request
        start_date = request.form['start_date']

        # Set end_date as today's date
        end_date = datetime.today().strftime('%Y-%m-%d')

        # Fetch updated data for s&p 500 with the selected period and interval
        df = get_data('^GSPC', start_date=start_date,
                    end_date=end_date, index_as_date=True, interval='1d')

        # Create a new candlestick chart with the updated data
        fig = go.Figure(data=[go.Candlestick(x=df.index,
                        open=df['open'],
                        high=df['high'],
                        low=df['low'],
                        close=df['close'])])
        
        # Update the chart layout
        fig.update_layout(xaxis_rangeslider_visible=False, template='plotly_dark')
        
        # Serialize the chart data to JSON
        graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return graphJSON
    
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

@app.route('/update_indices', methods=['POST'])
def update_indices():
    try:
        # Get the ticker from the request
        ticker = request.form['ticker']

        # Calculate start_date 1 month from today
        start_date = (datetime.today() - timedelta(days=60)).strftime('%Y-%m-%d')

        # Set end_date as today's date
        end_date = datetime.today().strftime('%Y-%m-%d')

        # Fetch updated data for AAPL with the selected period and interval
        df = get_data(ticker, start_date=start_date,
                    end_date=end_date, index_as_date=True, interval='1d')

        # Create a new candlestick chart with the updated data
        fig = go.Figure(data=[go.Candlestick(x=df.index,
                        open=df['open'],
                        high=df['high'],
                        low=df['low'],
                        close=df['close'])])
        
        # Update the chart layout
        fig.update_layout(xaxis_rangeslider_visible=False, template='plotly_dark')
        
        # Serialize the chart data to JSON
        graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return graphJSON
    
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
