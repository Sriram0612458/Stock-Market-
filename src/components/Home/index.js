import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css"; // Import the CSS file

const StockPrices = () => {
    const [categories, setCategories] = useState({});
    const [topStocks, setTopStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Stock categories with at least 5 stocks in each
    const stockCategories = {
        Tech: ["AAPL", "GOOGL", "MSFT", "META", "NVDA"],
        Retail: ["AMZN", "BABA", "COST", "WMT", "TGT"],
        Automotive: ["TSLA", "GM", "F", "TM", "HMC"],
        Entertainment: ["DIS", "NFLX", "CMCSA", "WBD", "ROKU"],
        Finance: ["JPM", "BAC", "GS", "C", "MS"],
    };

    useEffect(() => {
        const fetchStockPrices = async () => {
            try {
                setLoading(true);

                const allStockSymbols = Object.values(stockCategories).flat();
                const requests = allStockSymbols.map((symbol) =>
                    axios.get(
                        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${"ct9go19r01qusoq88un0ct9go19r01qusoq88ung"}`
                    )
                );

                const responses = await Promise.allSettled(requests);

                const stockData = responses
                    .map((response, index) => {
                        if (response.status === "fulfilled" && response.value.data.c > 0) {
                            const symbol = allStockSymbols[index];
                            return {
                                symbol,
                                category: Object.keys(stockCategories).find((category) =>
                                    stockCategories[category].includes(symbol)
                                ),
                                price: response.value.data.c,
                                change: response.value.data.d,
                                percentChange: response.value.data.dp,
                            };
                        }
                        return null;
                    })
                    .filter(Boolean);

                // Group stocks into categories
                const categorizedStocks = stockData.reduce((acc, stock) => {
                    acc[stock.category] = acc[stock.category] || [];
                    acc[stock.category].push(stock);
                    return acc;
                }, {});

                setCategories(categorizedStocks);

                // Select top 5 performing stocks based on percentage change
                const sortedStocks = [...stockData].sort(
                    (a, b) => b.percentChange - a.percentChange
                );
                setTopStocks(sortedStocks.slice(0, 5));

                setLoading(false);
            } catch (err) {
                setError("Failed to fetch stock prices.");
                setLoading(false);
            }
        };

        // Fetch data initially
        fetchStockPrices();

        // Refresh every 30 seconds
        const interval = setInterval(fetchStockPrices, 30000);

        return () => clearInterval(interval); // Cleanup
    }, []);

    if (loading) return <p>Loading stock prices...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <h1 className="header">Stock Prices by Category</h1>

            <div className="topStocks">
                <h2>Top 5 Performing Stocks</h2>
                <div className="table">
                    <div className="tableHeader">
                        <span className="tableCell">Symbol</span>
                        <span className="tableCell">Price</span>
                        <span className="tableCell">% Change</span>
                    </div>
                    {topStocks.map((stock) => (
                        <div key={stock.symbol} className="tableRow">
                            <span className="tableCell">{stock.symbol}</span>
                            <span className="tableCell">${stock.price.toFixed(2)}</span>
                            <span
                                className={`tableCell ${stock.percentChange >= 0 ? "positive" : "negative"
                                    }`}
                            >
                                {stock.percentChange >= 0 ? "+" : ""}
                                {stock.percentChange.toFixed(2)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="categories">
                <h2>Stocks by Category</h2>
                {Object.entries(categories).map(([category, stocks]) => (
                    <div key={category}>
                        <h3>{category}</h3>
                        <div className="table">
                            <div className="tableHeader">
                                <span className="tableCell">Symbol</span>
                                <span className="tableCell">Price</span>
                                <span className="tableCell">% Change</span>
                            </div>
                            {stocks.map((stock) => (
                                <div key={stock.symbol} className="tableRow">
                                    <span className="tableCell">{stock.symbol}</span>
                                    <span className="tableCell">${stock.price.toFixed(2)}</span>
                                    <span
                                        className={`tableCell ${stock.percentChange >= 0 ? "positive" : "negative"
                                            }`}
                                    >
                                        {stock.percentChange >= 0 ? "+" : ""}
                                        {stock.percentChange.toFixed(2)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StockPrices;
