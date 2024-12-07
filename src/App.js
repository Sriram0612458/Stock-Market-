//import StockPrices from './components/Home/index';
import Indices from './components/Indices/index';
import StocksApp from './components/CategoryTab/index';
import CryptoApp from "./components/Crypto/crypto"
import './App.css';

function App() {
  return (
    <div className="App">
      <Indices />
      <CryptoApp />
      <StocksApp />
    </div>
  );
}

export default App;
