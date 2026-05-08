import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Create folders
folders = ["data", "images", "reports", "outputs"]

for folder in folders:
    os.makedirs(folder, exist_ok=True)

# User input
ticker = input("Enter Stock Ticker: ")
start_date = input("Enter Start Date (YYYY-MM-DD): ")
end_date = input("Enter End Date (YYYY-MM-DD): ")

# Fetch stock data
print("\nDownloading stock data...")

stock_data = yf.download(ticker, start=start_date, end=end_date)

# Save raw data
csv_path = f"data/{ticker}_stock_data.csv"
stock_data.to_csv(csv_path)

print(f"Data saved to {csv_path}")

# Data Cleaning
stock_data.dropna(inplace=True)

# Daily Returns
stock_data['Daily Return'] = stock_data['Close'].pct_change()

# Moving Averages
stock_data['MA20'] = stock_data['Close'].rolling(window=20).mean()
stock_data['MA50'] = stock_data['Close'].rolling(window=50).mean()

# Volatility
volatility = stock_data['Daily Return'].std()

# Highest and Lowest Price
highest_price = stock_data['High'].max()
lowest_price = stock_data['Low'].min()

# Summary Statistics
summary = stock_data.describe()

summary.to_csv(f"outputs/{ticker}_summary.csv")

# =========================
# PRICE CHART
# =========================

plt.figure(figsize=(12,6))

plt.plot(stock_data['Close'], label='Closing Price')
plt.plot(stock_data['MA20'], label='20-Day MA')
plt.plot(stock_data['MA50'], label='50-Day MA')

plt.title(f'{ticker} Stock Price Analysis')
plt.xlabel('Date')
plt.ylabel('Price')
plt.legend()

price_chart = f"images/{ticker}_price_chart.png"
plt.savefig(price_chart)

print(f"Price chart saved to {price_chart}")

# =========================
# DAILY RETURNS DISTRIBUTION
# =========================

plt.figure(figsize=(10,5))

sns.histplot(stock_data['Daily Return'].dropna(), bins=50)

plt.title(f'{ticker} Daily Returns Distribution')

returns_chart = f"images/{ticker}_returns_distribution.png"
plt.savefig(returns_chart)

print(f"Returns chart saved to {returns_chart}")

# =========================
# FINAL REPORT
# =========================

report_path = f"reports/{ticker}_report.txt"

with open(report_path, "w") as report:

    report.write("STOCK MARKET ANALYSIS REPORT\n")
    report.write("="*50 + "\n\n")

    report.write(f"Ticker: {ticker}\n")
    report.write(f"Volatility: {volatility}\n")
    report.write(f"Highest Price: {highest_price}\n")
    report.write(f"Lowest Price: {lowest_price}\n\n")

    report.write("SUMMARY STATISTICS\n")
    report.write(summary.to_string())

print(f"Report saved to {report_path}")

print("\nAnalysis Completed Successfully!")