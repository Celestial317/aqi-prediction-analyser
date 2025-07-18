import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>© 2025 AQI Monitor. Made with</span>
            <Heart size={14} className="text-red-500" />
            <span>by Dell Aspire Scholars</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-slate-400 mt-2 md:mt-0">
            <span>Data Source: CPCB Delhi</span>
            <span>•</span>
            <span>Research-Based Analysis</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;