import React from 'react';
import { BookOpen, Shield, Users, Zap, Target, Award } from 'lucide-react';

const About: React.FC = () => {
  const aqiCategories = [
    { range: '0-50', category: 'Good', color: 'bg-green-500', description: 'Air quality is satisfactory' },
    { range: '51-100', category: 'Moderate', color: 'bg-yellow-500', description: 'Acceptable for most people' },
    { range: '101-150', category: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', description: 'Sensitive individuals may experience problems' },
    { range: '151-200', category: 'Unhealthy', color: 'bg-red-500', description: 'Everyone may experience health effects' },
    { range: '201-300', category: 'Very Unhealthy', color: 'bg-purple-500', description: 'Health alert: serious health effects' },
    { range: '301+', category: 'Hazardous', color: 'bg-red-900', description: 'Emergency conditions affecting everyone' },
  ];

  const pollutants = [
    { name: 'PM2.5', description: 'Fine particulate matter (≤2.5 μm)', health: 'Respiratory and cardiovascular issues' },
    { name: 'PM10', description: 'Coarse particulate matter (≤10 μm)', health: 'Respiratory irritation' },
    { name: 'NO2', description: 'Nitrogen dioxide', health: 'Respiratory problems, lung irritation' },
    { name: 'SO2', description: 'Sulfur dioxide', health: 'Respiratory issues, eye irritation' },
    { name: 'CO', description: 'Carbon monoxide', health: 'Reduces oxygen delivery to organs' },
    { name: 'O3', description: 'Ground-level ozone', health: 'Respiratory irritation, chest pain' },
  ];

  const features = [
    { icon: Zap, title: 'Real-time Monitoring', description: 'Live AQI data from Delhi monitoring stations' },
    { icon: Target, title: 'Image Analysis', description: 'AI-powered air quality prediction from photos' },
    { icon: Shield, title: 'Health Alerts', description: 'Personalized recommendations based on conditions' },
    { icon: Users, title: 'Community Focus', description: 'Designed for Delhi residents and visitors' },
  ];

  return (
    <div className="pt-20 space-y-8">

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-purple-600">
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            </div>
            <p className="text-slate-300">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* AQI Categories */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <BookOpen size={24} className="mr-3" />
          AQI Categories
        </h2>
        <div className="space-y-4">
          {aqiCategories.map((category, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-slate-900/50 rounded-lg">
              <div className={`w-16 h-8 ${category.color} rounded text-white text-sm font-bold flex items-center justify-center`}>
                {category.range}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{category.category}</h3>
                <p className="text-slate-400 text-sm">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Pollutants */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">Common Air Pollutants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pollutants.map((pollutant, index) => (
            <div key={index} className="p-4 bg-slate-900/50 rounded-lg">
              <h3 className="font-semibold text-teal-300 mb-2">{pollutant.name}</h3>
              <p className="text-slate-300 text-sm mb-2">{pollutant.description}</p>
              <p className="text-slate-400 text-xs">Health Impact: {pollutant.health}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <Award size={24} className="mr-3" />
          Research Methodology
        </h2>
        <div className="space-y-4 text-slate-300">
          <p>
            Our AQI monitoring system combines traditional sensor-based measurements with cutting-edge 
            machine learning techniques for image-based air quality prediction.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-semibold text-teal-300 mb-3">Data Sources</h3>
              <ul className="space-y-2 text-sm">
                <li>• Central Pollution Control Board (CPCB) real-time data</li>
                <li>• Delhi government monitoring stations</li>
                <li>• Satellite imagery and meteorological data</li>
                <li>• User-contributed environmental photographs</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-teal-300 mb-3">Analysis Methods</h3>
              <ul className="space-y-2 text-sm">
                <li>• Machine learning models for image classification</li>
                <li>• Time-series analysis for trend prediction</li>
                <li>• Correlation analysis between visual and sensor data</li>
                <li>• Real-time data processing and validation</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
            <p className="text-sm text-teal-300">
              <strong>Research Note:</strong> This system is based on ongoing research in environmental 
              monitoring and computer vision. The image analysis feature provides estimations that should 
              be used in conjunction with official monitoring data for comprehensive air quality assessment.
            </p>
          </div>
        </div>
      </div>

      {/* Contact & Support */}
      <div className="bg-gradient-to-r from-teal-500/20 to-purple-600/20 rounded-lg border border-slate-700/50 p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Support & Feedback</h2>
        <p className="text-slate-300 mb-4">
          We're continuously improving our air quality monitoring system. Your feedback helps us 
          better serve the Delhi community.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors">
            Report an Issue
          </button>
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
            Suggest Features
          </button>
          <button className="px-6 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;