import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { notificationService } from './lib/notificationService';
import AppLayout from './components/AppLayout';
import useStore from './store/useStore';
import Home from './pages/Home';
import Mutfak from './pages/Mutfak';
import Finans from './pages/Finans';
import Kasa from './pages/Kasa';
import Alisveris from './pages/Alisveris';
import Saglik from './pages/Saglik';
import Ayarlar from './pages/Ayarlar';
import Profil from './pages/Profil';
import Analiz from './pages/Analiz';
import SplashScreen from './components/SplashScreen';
import UserSelection from './components/UserSelection';
import ErrorBoundary from './components/ErrorBoundary';

// Additional Modules
import Sosyal from './pages/Sosyal';
import Hedefler from './pages/Hedefler';
import Ev from './pages/Ev';
import Pet from './pages/Pet';
import Aracim from './pages/Aracim';
import Tatil from './pages/Tatil';
import Kayitlar from './pages/Kayitlar';
import Achievements from './pages/Achievements';
import Guvenlik from './pages/Guvenlik';
import PersonalityTest from './pages/PersonalityTest';
import PersonalityHub from './pages/PersonalityHub';

function AnimatedRoutes() {
  const location = useLocation();

  // location.pathname key olarak kullanılıyor, AnimatePresence için kritik
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="mutfak" element={<Mutfak />} />
          <Route path="finans" element={<Finans />} />
          <Route path="kasa" element={<Kasa />} />
          <Route path="alisveris" element={<Alisveris />} />
          <Route path="saglik" element={<Saglik />} />
          <Route path="ayarlar" element={<Ayarlar />} />
          <Route path="profil" element={<Profil />} />
          <Route path="analiz" element={<Analiz />} />
          
          {/* Ek Modüller */}
          <Route path="sosyal" element={<Sosyal />} />
          <Route path="hedefler" element={<Hedefler />} />
          <Route path="ev" element={<Ev />} />
          <Route path="pet" element={<Pet />} />
          <Route path="aracim" element={<Aracim />} />
          <Route path="tatil" element={<Tatil />} />
          <Route path="basarilar" element={<Achievements />} />
          <Route path="guvenlik" element={<Guvenlik />} />
          <Route path="kayitlar" element={<Kayitlar />} />
          <Route path="yekta-test" element={<PersonalityTest />} />
          <Route path="personality-hub" element={<PersonalityHub />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = React.useState(true);
  // Uygulama açılışında Supabase'den veri çek ve Realtime başlat
  const initSync = useStore(state => state.initSync);
  const currentUser = useStore(state => state.currentUser);
  
  useEffect(() => {
    initSync();
    notificationService.requestPermission();
  }, [initSync]); 

  return (
    <ErrorBoundary>
      <AnimatePresence>
        {loading && <SplashScreen key="splash" finishLoading={() => setLoading(false)} />}
      </AnimatePresence>
      
      <BrowserRouter>
        <AnimatePresence mode="wait">
          {!loading && !currentUser && <UserSelection key="user-selection-modal" />}
        </AnimatePresence>
        
        <Toaster 
          position="top-center"
          containerStyle={{ top: 'calc(env(safe-area-inset-top, 40px) + 10px)', zIndex: 99999999 }}
          toastOptions={{
            style: {
              borderRadius: '14px',
              background: 'var(--card)',
              color: 'var(--txt)',
              border: '1px solid var(--brd)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 600,
            },
          }}
        />
        {!loading && <AnimatedRoutes />}
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

