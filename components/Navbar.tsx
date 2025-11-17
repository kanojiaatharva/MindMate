
import React from 'react';

type Tab = 'chat' | 'journal' | 'resources' | 'about';

interface NavbarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const NavLink: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
        aria-current={isActive ? 'page' : undefined}
    >
        {label}
    </button>
);

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white shadow-md w-full sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer" 
              onClick={() => setActiveTab('chat')}
            >
              <BrainCircuitIcon className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">MindMate</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink label="Chat" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
              <NavLink label="Journal" isActive={activeTab === 'journal'} onClick={() => setActiveTab('journal')} />
              <NavLink label="Resources" isActive={activeTab === 'resources'} onClick={() => setActiveTab('resources')} />
              <NavLink label="About" isActive={activeTab === 'about'} onClick={() => setActiveTab('about')} />
            </div>
          </div>
          {/* Mobile menu could be added here if needed */}
        </div>
      </nav>
    </header>
  );
};

const BrainCircuitIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 5a3 3 0 1 0-5.993.131M12 5a3 3 0 1 1 5.993.131M12 19a3 3 0 1 0-5.993-.131M12 19a3 3 0 1 1 5.993.131M18 12a3 3 0 1 0-5.993.131M18 12a3 3 0 1 1 5.993.131M6 12a3 3 0 1 0-5.993.131M6 12a3 3 0 1 1 5.993.131M12 5v14M18.13 8.87a3 3 0 0 1-4.24 4.24M12 12h.01" />
        <path d="M5.87 8.87a3 3 0 0 0 4.24 4.24" />
    </svg>
);


export default Navbar;
