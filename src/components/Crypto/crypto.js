import React, { useState, useEffect } from "react";
import "./crypto.css"; // Styling file for horizontal scrolling animation

const CryptoApp = () => {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch crypto data
    const fetchCryptoData = async () => {
        try {
            const response = await fetch(
                "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h"
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();

            // Map the data to required format
            const topCryptos = data.map((crypto) => ({
                name: crypto.name,
                symbol: crypto.symbol.toUpperCase(),
                price: crypto.current_price,
                change: crypto.price_change_percentage_24h, // 24-hour percentage change
                image: crypto.image,
            }));

            setCryptos(topCryptos);
        } catch (error) {
            console.error("Error fetching crypto data:", error);
        }
        setLoading(false);
    };

    // Fetch data every 10 seconds
    useEffect(() => {
        fetchCryptoData(); // Initial fetch
        const intervalId = setInterval(fetchCryptoData, 10000); // Fetch every 10 seconds

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);

    return (
        <div className="crypto-container">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="scrolling-container">
                    <div className="crypto-items">
                        {cryptos.map((crypto, index) => (
                            <div key={index} className="crypto-item">
                                <div className="box1">
                                    <img
                                        src={crypto.image}
                                        alt={crypto.name}
                                        className="crypto-logo"
                                    />
                                    <p>{crypto.symbol}</p></div>
                                <div>
                                    <p className="priceChange">${crypto.price.toFixed(2)}</p>
                                    <p
                                        className={
                                            crypto.change >= 0
                                                ? "positive-change"
                                                : "negative-change"
                                        }
                                    >
                                        {crypto.change >= 0 ? "+" : ""}
                                        {crypto.change.toFixed(2)}%

                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CryptoApp;





