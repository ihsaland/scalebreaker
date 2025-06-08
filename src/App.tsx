import { BrowserRouter } from 'react-router-dom';
import Automata from './components/Automata';
import GoogleAnalytics from './components/GoogleAnalytics';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <GoogleAnalytics />
        <Automata />
      </div>
    </BrowserRouter>
  );
}

export default App;
