import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import BookRoom from './pages/BookRoom';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Facilities from './pages/Facilities';
import BookingHistory from './pages/BookingHistory';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Gallery from './pages/Gallery';
import Policies from './pages/Policies';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/book" element={<BookRoom />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/history" element={<BookingHistory />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/policies" element={<Policies />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
