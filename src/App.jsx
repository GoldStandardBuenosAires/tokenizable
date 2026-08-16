import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import HeroEntrance from '@/components/HeroEntrance';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import ClickSpark from '@/components/ui/click-spark';
import Web3Providers from '@/providers/Web3Providers';
import AuthProvider from '@/providers/AuthProvider';
import Home from '@/pages/Home';
import HowItWorks from '@/pages/HowItWorks';
import Groups from '@/pages/Groups';
import GroupDetail from '@/pages/GroupDetail';
import RoomView from '@/pages/RoomView';
import EventDetail from '@/pages/EventDetail';
import Safety from '@/pages/Safety';
import Governance from '@/pages/Governance';
import Roadmap from '@/pages/Roadmap';
import Join from '@/pages/Join';

export default function App() {
  const [entranceDone, setEntranceDone] = useState(false);

  return (
    <Web3Providers>
      <AuthProvider>
        <div className="min-h-screen bg-ink text-paper">
          <HeroEntrance onComplete={() => setEntranceDone(true)} />
          <ClickSpark>
            <CustomCursor />
            <ScrollToTop />
            <Nav />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/groups/:slug" element={<GroupDetail />} />
                <Route path="/groups/:slug/rooms/:roomId" element={<RoomView />} />
                <Route path="/groups/:slug/events/:eventId" element={<EventDetail />} />
                <Route path="/safety" element={<Safety />} />
                <Route path="/governance" element={<Governance />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/join" element={<Join />} />
              </Routes>
            </main>
            <Footer />
          </ClickSpark>
        </div>
      </AuthProvider>
    </Web3Providers>
  );
}
