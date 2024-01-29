import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddBook from './components/AddBook';
import BookDetails from './components/BookDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Books</h1>
          <Routes>
            <Route path="/" element={<AddBook />} />
            <Route path="/book/:bookName" element={<BookDetails />} />
            <Route path="*" element={
              <div>
                <p>404: This is not the webpage you are looking for</p>
              </div>
            } />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
