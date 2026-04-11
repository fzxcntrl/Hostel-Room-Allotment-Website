import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import BookRoom from './pages/BookRoom';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import BookingHistory from './pages/BookingHistory';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Policies from './pages/Policies';
import { AuthProvider } from './context/AuthContext';
import Chatbot from './components/Chatbot';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/book" element={<BookRoom />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/history" element={<BookingHistory />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/policies" element={<Policies />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Layout>
        <AnimatedRoutes />
      </Layout>
      <Chatbot />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
