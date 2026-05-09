"use client";

import CandlestickChart from "@/components/CandlestickChart";

import { useEffect, useState } from "react";

import axios from "axios";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";

interface ChartData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  ma20: number;
  ma50: number;
  rsi: number;
  macd: number;
  macd_signal: number;
}

interface StockData {
  ticker: string;
  latest_close: number;
  highest_price: number;
  lowest_price: number;
  average_volume: number;
  volatility: number;
  chart_data: ChartData[];
}

export default function Home() {

  const [ticker, setTicker] = useState("AAPL");

  const [data, setData] = useState<StockData | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [darkMode, setDarkMode] = useState(true);

  // ✅ SINGLE WATCHLIST STATE ONLY
  const [watchlist, setWatchlist] = useState<string[]>([
    "AAPL",
    "TSLA",
    "NVDA",
    "MSFT",
    "GOOGL",
    "BTC-USD"
  ]);

  const portfolio = [
    {
      stock: "AAPL",
      shares: 10,
      value: "$2450"
    },
    {
      stock: "TSLA",
      shares: 5,
      value: "$1100"
    },
    {
      stock: "NVDA",
      shares: 8,
      value: "$7200"
    }
  ];

  const fetchStock = async () => {

    try {

      setLoading(true);

      setError("");

      // ✅ DIRECT API URL
      const response = await axios.get(
       `${process.env.NEXT_PUBLIC_API_URL}/stock/${ticker}`
      );

      if (response.data.error) {

        setError(response.data.error);

        return;
      }

      setData(response.data);

    } catch (err) {

      console.log(err);

      setError("Failed to fetch stock data");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchStock();

  }, []);

  return (

    <main className={`${darkMode ? "bg-[#020617] text-white" : "bg-[#F8FAFC] text-black"} min-h-screen transition-all duration-500 overflow-hidden`}>

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full"></div>

        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full"></div>

      </div>

      {/* NAVBAR */}
      <nav className={`relative z-10 flex flex-col lg:flex-row justify-between items-center px-6 md:px-10 py-6 gap-4 border-b ${
        darkMode
          ? "border-slate-800 bg-[#020617]/80"
          : "border-slate-300 bg-white/80"
      }`}>

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl shadow-lg">
            📈
          </div>

          <div>

            <h1 className="text-2xl md:text-3xl font-bold">
              StockVision AI
            </h1>

            <p className="text-gray-400 text-sm">
              Real-Time Financial Analytics Dashboard
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4">

          <div className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500 text-green-400">
            Market Open
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105 transition shadow-lg"
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>

        </div>

      </nav>

      {/* HERO */}
      <section className="relative z-10 text-center pt-20 px-4">

        <h2 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight">
          Stock Market Data Analyzer
        </h2>

        <p className="text-gray-400 text-lg md:text-xl mt-6 max-w-3xl mx-auto">
          Analyze stock performance, technical indicators, volatility,
          moving averages, and market trends using real-time financial data.
        </p>

        {/* SEARCH */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-12">

          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchStock();
              }
            }}
            placeholder="Enter Stock Ticker"
            className={`w-full md:w-[400px] px-6 py-4 rounded-2xl outline-none text-lg border ${
              darkMode
                ? "bg-[#0F172A] border-slate-700 text-white"
                : "bg-white border-slate-300 text-black"
            }`}
          />

          <button
            onClick={fetchStock}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-lg font-semibold hover:scale-105 transition duration-300 shadow-lg"
          >
            {loading ? "Loading..." : "Analyze →"}
          </button>

          <button
            onClick={() => {

              if (!watchlist.includes(ticker)) {

                setWatchlist([
                  ...watchlist,
                  ticker
                ]);
              }
            }}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-lg font-semibold hover:scale-105 transition duration-300 shadow-lg"
          >
            + Watchlist
          </button>

        </div>

        {/* WATCHLIST */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">

          {watchlist.map((stock) => (

            <button
              key={stock}
              onClick={() => {
                setTicker(stock);
                setTimeout(() => {
                  fetchStock();
                }, 100);
              }}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
                darkMode
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border border-blue-500 hover:shadow-blue-500/30"
                  : "bg-gradient-to-r from-slate-800 to-slate-900 !text-white border border-slate-700 hover:shadow-slate-500/30"
              }`}
            >
              {stock}
            </button>

          ))}

        </div>

      </section>

      {/* LOADING */}
      {loading && (

        <div className="flex justify-center mt-16 relative z-10">

          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        </div>

      )}

      {/* ERROR */}
      {error && (

        <div className="relative z-10 text-center mt-10 text-red-400 text-xl">
          {error}
        </div>

      )}

      {/* DASHBOARD */}
      {data && !loading && (

        <section className="relative z-10 px-4 md:px-10 py-20">

          {/* HEADER */}
          <div className="mb-10">

            <h3 className="text-4xl font-bold">
              {data.ticker} Dashboard
            </h3>

            <p className="text-gray-400 mt-2">
              Financial metrics and technical analysis
            </p>

          </div>

          {/* METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

            <Card
              title="Latest Close"
              value={`$${data.latest_close}`}
              subtitle="Market Price"
              color="text-blue-400"
              icon="💲"
            />

            <Card
              title="Highest Price"
              value={`$${data.highest_price}`}
              subtitle="52 Week High"
              color="text-green-400"
              icon="📈"
            />

            <Card
              title="Lowest Price"
              value={`$${data.lowest_price}`}
              subtitle="52 Week Low"
              color="text-red-400"
              icon="📉"
            />

            <Card
              title="Average Volume"
              value={`${(data.average_volume / 1000000).toFixed(2)}M`}
              subtitle="Shares Traded"
              color="text-cyan-400"
              icon="📊"
            />

            <Card
              title="Volatility"
              value={data.volatility}
              subtitle="Risk Indicator"
              color="text-orange-400"
              icon="⚡"
            />

            <Card
              title="RSI Indicator"
              value={
                data.chart_data?.length
                  ? data.chart_data[data.chart_data.length - 1]?.rsi.toFixed(2)
                  : "N/A"
              }
              subtitle="Momentum Strength"
              color="text-purple-400"
              icon="📡"
            />

            <Card
              title="AI Signal"
              value={
                data.chart_data?.length &&
                data.chart_data[data.chart_data.length - 1]?.rsi > 70
                  ? "SELL"
                  : data.chart_data[data.chart_data.length - 1]?.rsi < 30
                  ? "BUY"
                  : "HOLD"
              }
              subtitle="AI Trading Suggestion"
              color={
                data.chart_data?.length &&
                data.chart_data[data.chart_data.length - 1]?.rsi > 70
                  ? "text-red-400"
                  : data.chart_data[data.chart_data.length - 1]?.rsi < 30
                  ? "text-green-400"
                  : "text-yellow-400"
              }
              icon="🤖"
            />

          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-12">

            <ChartCard title="Stock Price Trend">

              <ResponsiveContainer width="100%" height={350}>

                <AreaChart data={data.chart_data}>

                  <defs>

                    <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">

                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>

                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>

                    </linearGradient>

                  </defs>

                  <CartesianGrid stroke="#1e293b" />

                  <XAxis dataKey="date" stroke="#94a3b8" />

                  <YAxis stroke="#94a3b8" />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorClose)"
                  />

                </AreaChart>

              </ResponsiveContainer>

            </ChartCard>

            <ChartCard title="Candlestick Chart">

              <CandlestickChart
                data={data.chart_data}
              />

            </ChartCard>

            <ChartCard title="Moving Average Analysis">

              <ResponsiveContainer width="100%" height={350}>

                <LineChart data={data.chart_data}>

                  <CartesianGrid stroke="#1e293b" />

                  <XAxis dataKey="date" stroke="#94a3b8" />

                  <YAxis stroke="#94a3b8" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="ma20"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="ma50"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>

            </ChartCard>

            <ChartCard title="RSI Indicator">

              <ResponsiveContainer width="100%" height={300}>

                <LineChart data={data.chart_data}>

                  <CartesianGrid stroke="#1e293b" />

                  <XAxis dataKey="date" stroke="#94a3b8" />

                  <YAxis domain={[0, 100]} stroke="#94a3b8" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="rsi"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>

            </ChartCard>

            <ChartCard title="MACD Indicator">

              <ResponsiveContainer width="100%" height={300}>

                <LineChart data={data.chart_data}>

                  <CartesianGrid stroke="#1e293b" />

                  <XAxis dataKey="date" stroke="#94a3b8" />

                  <YAxis stroke="#94a3b8" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="macd"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="macd_signal"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>

            </ChartCard>

            <ChartCard title="Portfolio Performance">

              <ResponsiveContainer width="100%" height={350}>

                <BarChart data={portfolio}>

                  <CartesianGrid stroke="#1e293b" />

                  <XAxis dataKey="stock" stroke="#94a3b8" />

                  <YAxis stroke="#94a3b8" />

                  <Tooltip />

                  <Bar
                    dataKey="shares"
                    fill="#3b82f6"
                    radius={[10, 10, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </ChartCard>

          </div>

          {/* STOCK COMPARISON */}
          <div className="mt-12">

            <ChartCard title="Stock Comparison">

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {watchlist.map((stock) => (

                  <div
                    key={stock}
                    className="bg-[#111827] p-5 rounded-2xl border border-slate-700"
                  >

                    <h3 className="text-xl font-bold">
                      {stock}
                    </h3>

                    <p className="text-green-400 mt-2">
                      Live Tracking
                    </p>

                  </div>

                ))}

              </div>

            </ChartCard>

          </div>

          {/* NEWS */}
          <div className="mt-12">

            <ChartCard title="Market News">

              <div className="space-y-4">

                <div className="bg-[#111827] p-5 rounded-2xl border border-slate-700">

                  <h3 className="text-xl font-bold">
                    📈 Tech Stocks Rally Amid AI Growth
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Major technology stocks continue upward momentum as AI investments increase.
                  </p>

                </div>

                <div className="bg-[#111827] p-5 rounded-2xl border border-slate-700">

                  <h3 className="text-xl font-bold">
                    💹 Market Volatility Remains Stable
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Analysts observe balanced market movement despite economic uncertainty.
                  </p>

                </div>

              </div>

            </ChartCard>

          </div>

          {/* FOOTER */}
          <div className="mt-12 bg-[#0f172a]/80 border border-gray-800 rounded-3xl p-8">

            <h2 className="text-2xl font-bold">
              Data Source: Yahoo Finance
            </h2>

            <p className="text-gray-400 mt-4 text-lg">
              This project is for educational purposes only and does not constitute financial advice.
            </p>

          </div>

        </section>

      )}

    </main>
  );
}

/* ===========================
   CARD COMPONENT
=========================== */

function Card({ title, value, subtitle, color, icon }: any) {

  return (

    <div className="bg-gradient-to-br from-[#0F172A] to-[#111827] border border-slate-700 rounded-3xl p-8 shadow-2xl hover:scale-[1.02] transition duration-300">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-400 text-lg">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3 text-white">
            {value}
          </h2>

          <p className={`${color} mt-3 font-medium`}>
            {subtitle}
          </p>

        </div>

        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl border border-slate-700">
          {icon}
        </div>

      </div>

    </div>
  );
}

/* ===========================
   CHART CARD COMPONENT
=========================== */

function ChartCard({ title, children }: any) {

  return (

    <div className="bg-gradient-to-br from-[#0F172A] to-[#111827] border border-slate-700 rounded-3xl p-8 shadow-2xl">

      <h2 className="text-2xl font-bold mb-6 text-white">
        {title}
      </h2>

      {children}

    </div>
  );
}