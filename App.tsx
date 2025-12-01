import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import Policy from './components/Policy';
import Trust from './components/Trust';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingCTA from './components/FloatingCTA';
import RecentSales from './components/RecentSales';
import Process from './components/Process';
import Chatbot from './components/Chatbot';
import Partners from './components/Partners';
import Testimonials from './components/Testimonials';

function App() {
  return (
    <div className="min-h-screen font-sans antialiased text-gray-900 bg-white">
      <Header />
      <main>
        <Hero />
        <Partners />
        <Process />
        <Products />
        <Policy />
        <Testimonials />
        <Trust />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
      <RecentSales />
      <Chatbot />
    </div>
  );
}

export default App;
