import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import Resources from './components/Resources';
import Journal from './components/Journal';
import About from './components/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

type Tab = 'chat' | 'journal' | 'resources' | 'about';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  return (
    <div className="bg-slate-100 h-screen font-sans text-gray-800 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4">
        <div className="relative w-full max-w-4xl h-full max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
           <div className={`tab-pane ${activeTab === 'chat' ? 'active' : ''}`}>
             <div className="flex flex-col h-full">
                <ChatWindow />
             </div>
           </div>
           <div className={`tab-pane ${activeTab === 'journal' ? 'active' : ''}`}>
             <div className="h-full overflow-y-auto p-4 sm:p-6">
                <Journal />
             </div>
           </div>
           <div className={`tab-pane ${activeTab === 'resources' ? 'active' : ''}`}>
             <div className="h-full overflow-y-auto p-4 sm:p-6">
                <Resources />
             </div>
           </div>
           <div className={`tab-pane ${activeTab === 'about' ? 'active' : ''}`}>
             <div className="h-full overflow-y-auto p-4 sm:p-6">
                <About />
             </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;