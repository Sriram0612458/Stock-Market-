import React, { useState, useEffect } from "react";
import axios from "axios";
import { Rings } from 'react-loader-spinner'
import "./index.css";

const StocksApp = () => {
    const [category, setCategory] = useState("Tech");
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);

    const categories = ["Tech", "Finance", "Retail", "Automotive", "Entertainment"];

    const fetchStocks = async (selectedCategory) => {
        setLoading(true);

        const apiKey = "ct9go19r01qusoq88un0ct9go19r01qusoq88ung";
        const categorySymbols = {
            Tech: ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"],
            Finance: ["JPM", "GS", "C", "MS", "BAC"],
            Retail: ["AMZN", "BABA", "COST", "WMT", "TGT"],
            Automotive: ["TSLA", "GM", "F", "TM", "HMC"],
            Entertainment: ["DIS", "NFLX", "CMCSA", "WBD", "ROKU"],
        };

        try {
            const promises = categorySymbols[selectedCategory].map((symbol) =>
                axios.get(
                    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
                )
            );

            const responses = await Promise.all(promises);

            const stocksData = responses.map((res, i) => ({
                name: categorySymbols[selectedCategory][i],
                price: res.data.c || 0,
                percentChange: res.data.dp || 0,
            }));

            setStocks(stocksData);
        } catch (error) {
            console.error("Error fetching stocks:", error.message);
            setStocks([]);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchStocks(category);

        const intervalId = setInterval(() => {
            fetchStocks(category);
        }, 30000);
        return () => clearInterval(intervalId);
    }, [category]);

    return (
        <div className="stocks-container">
            <h1 className="header">Stocks By Categories</h1>

            <div className="categories">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`category-button ${cat === category ? "active" : ""}`}
                        onClick={() => setCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="stocks-grid">
                {loading ? (
                    <div className="loader-logo">
                        <Rings color="#ffffff" height={80} width={80} />
                    </div>
                ) : stocks.length > 0 ? (
                    <div className="table">
                        <div className="tableHeader">
                            <span className="tableCell">Symbol</span>
                            <span className="tableCell">Price</span>
                            <span className="tableCell">% Change</span>
                        </div>
                        {stocks.map((stock, index) => (
                            <div key={index} className="tableRow">
                                <span className="tableCell">{stock.name}</span>
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
                    </div>) : (
                    <p>No stocks available for {category}</p>
                )}
            </div>
        </div>
    );
};

export default StocksApp;

