// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';
import { MixerProvider } from './context/MixerContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import AdminPanel from './pages/AdminPanel'; // Добавляем импорт админ-панели

function App() {
  return (
    <Router>
      <AuthProvider>
        <MixerProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<AdminPanel />} /> {/* Добавляем маршрут админ-панели */}
            </Routes>
          </Layout>
        </MixerProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;