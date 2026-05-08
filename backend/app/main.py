from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd

app = FastAPI(
    title="Stock Market Data Analyzer API",
    version="1.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home Route
@app.get("/")
def home():
    return {
        "message": "Stock Market Analyzer API Running Successfully"
    }

# Stock Analysis Route
@app.get("/stock/{ticker}")
def get_stock_data(ticker: str):

    try:

        # Download stock data
        # Download Stock Data
stock = yf.Ticker(ticker)

data = stock.history(period="1y")
          # Fix MultiIndex columns
        if isinstance(data.columns, pd.MultiIndex):
            data.columns = data.columns.get_level_values(0)
        # Empty check
        if data.empty:
            return {
                "error": "No stock data found"
            }

        # Reset index
        data.reset_index(inplace=True)

        # Remove null values
        data.dropna(inplace=True)

        # Daily Return
        data["Daily Return"] = data["Close"].pct_change()

        # Moving Averages
        data["MA20"] = data["Close"].rolling(20).mean()

        data["MA50"] = data["Close"].rolling(50).mean()

        # RSI Calculation (Manual)
        delta = data["Close"].diff()

        gain = delta.clip(lower=0)

        loss = -delta.clip(upper=0)

        avg_gain = gain.rolling(14).mean()

        avg_loss = loss.rolling(14).mean()

        rs = avg_gain / avg_loss

        data["RSI"] = 100 - (100 / (1 + rs))

        # MACD Calculation (Manual)
        ema12 = data["Close"].ewm(span=12, adjust=False).mean()

        ema26 = data["Close"].ewm(span=26, adjust=False).mean()

        data["MACD"] = ema12 - ema26

        data["MACD_SIGNAL"] = (
            data["MACD"].ewm(span=9, adjust=False).mean()
        )

        # Volatility
        volatility = data["Daily Return"].std()

        # Final Response
        response = {

            "ticker": ticker.upper(),

            "highest_price": round(
                float(data["High"].max().item()), 2
            ),

            "lowest_price": round(
                float(data["Low"].min().item()), 2
            ),

            "latest_close": round(
                float(data["Close"].iloc[-1].item()), 2
            ),

            "average_volume": round(
                float(data["Volume"].mean().item()), 2
            ),

            "volatility": round(
                float(volatility.item()), 4
            ),

            "chart_data": [

   {
    "date": str(row["Date"])[:10],

    "open": round(float(row["Open"]), 2),

    "high": round(float(row["High"]), 2),

    "low": round(float(row["Low"]), 2),

    "close": round(float(row["Close"]), 2),

    "ma20": (
        round(float(row["MA20"]), 2)
        if pd.notna(row["MA20"])
        else None
    ),

    "ma50": (
        round(float(row["MA50"]), 2)
        if pd.notna(row["MA50"])
        else None
    ),

    "rsi": (
        round(float(row["RSI"]), 2)
        if pd.notna(row["RSI"])
        else None
    ),

    "macd": (
        round(float(row["MACD"]), 2)
        if pd.notna(row["MACD"])
        else None
    ),

    "macd_signal": (
        round(float(row["MACD_SIGNAL"]), 2)
        if pd.notna(row["MACD_SIGNAL"])
        else None
    )
}

    for _, row in data.tail(60).iterrows()
]
        }

        return response

    except Exception as e:

        return {
            "error": str(e)
        }