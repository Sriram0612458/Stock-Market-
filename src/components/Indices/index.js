import React, { useState, useEffect } from "react";
import axios from "axios";
import { Rings } from 'react-loader-spinner'
import "./index.css";

const Indices = () => {
    const [indices, setIndices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const indexSymbols = [
        { symbol: "^GSPC", name: "S&P 500" },
        { symbol: "^IXIC", name: "Nasdaq" },
        { symbol: "^DJI", name: "Dow Jones" },
        { symbol: "^RUT", name: "Russell 2000" },
        { symbol: "^VIX", name: "Volatility Index" },
    ];

    const fetchIndices = async () => {
        try {
            const requests = indexSymbols.map((index) =>
                axios.get(
                    `https://finnhub.io/api/v1/quote?symbol=${index.symbol}&token=${"ct9go19r01qusoq88un0ct9go19r01qusoq88ung"}`
                )
            );

            const responses = await Promise.all(requests);

            const indicesData = responses.map((response, index) => ({
                name: indexSymbols[index].name,
                price: response.data.c || 0, // Default to 0 if undefined
                percentChange: response.data.dp || 0, // Default to 0 if undefined
            }));

            setIndices(indicesData);
            setLoading(false);
            setError(null);
        } catch (err) {
            setError("Failed to fetch indices data.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIndices(); // Initial fetch
        const interval = setInterval(fetchIndices, 30000); // Fetch every 30 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, []); // Empty dependency array ensures the interval runs continuously

    if (loading) return <div className="loader-logo">
        <Rings color="#ffffff" height={80} width={80} />
    </div>;
    if (error) return <p>{error}</p>;

    return (
        <div className="indicesContainer">
            {indices.map((index) => (
                <div key={index.name} className="indexCard">
                    <h4 className="indicesHeading">{index.name}</h4>
                    <p className="indicesHeading">Price: ${index.price.toFixed(2)}</p>
                    <p
                        className={`percentChange ${index.percentChange >= 0 ? "positive" : "negative"
                            }`}
                    >
                        {index.percentChange >= 0 ? "+" : ""}
                        {index.percentChange.toFixed(2)}%
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Indices;


