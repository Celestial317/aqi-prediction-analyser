import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm border-b border-slate-700/30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-300 to-purple-400 bg-clip-text text-transparent">
                VaayuNet
              </h1>
              <p className="text-sm text-slate-400">AQI analysis</p>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="px-4 py-2 bg-slate-800 rounded-lg">
            <span className="text-sm text-slate-300">Last Updated:</span>
            <span className="ml-2 text-sm font-medium text-white">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;