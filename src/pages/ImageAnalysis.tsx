import React, { useState, useEffect, useRef } from 'react';
import { Upload, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

// Define the type for the Teachable Machine model
interface TeachableMachineModel {
  predict: (image: HTMLImageElement) => Promise<{ className: string; probability: number }[]>;
}

// Define the AQI class boundaries, recommendations, AND midpoints
const AQI_CONFIG = {
  Good: {
    midpoint: 25,
    recommendations: ['It\'s a great day to be active outside!', 'Enjoy the fresh air.'],
  },
  Moderate: {
    midpoint: 75.5,
    recommendations: [
      'Unusually sensitive people should consider reducing prolonged or heavy exertion.',
      'Keep an eye on symptoms such as coughing or shortness of breath.',
    ],
  },
  Poor: {
    midpoint: 125.5,
    recommendations: [
      'Sensitive groups should reduce prolonged or heavy exertion outdoors.',
      'It’s OK to be active outside, but take more breaks.',
    ],
  },
  Unhealthy: {
    midpoint: 225.5, // Midpoint of 151-300
    recommendations: [
      'SEVERE CONDITION DETECTED - WEAR A MASK OUTDOORS',
      'Sensitive groups should avoid all outdoor physical activity.',
      'Everyone else should reduce prolonged or heavy exertion.',
      'Keep windows and doors closed.',
    ],
  },
  Severe: {
    midpoint: 500.5, // Midpoint of 301-700
    recommendations: [
      'HEALTH ALERT: EVERYONE SHOULD AVOID ALL OUTDOOR EXERTION',
      'Remain indoors and keep activity levels low.',
      'Use air purifiers indoors if available.',
      'Consider relocating temporarily if you belong to a sensitive group.',
    ],
  },
};

const ImageAnalysis: React.FC = () => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    aqi: number;
    category: keyof typeof AQI_CONFIG;
    confidence: number;
    recommendations: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const modelRef = useRef<TeachableMachineModel | null>(null);

  // Load the Teachable Machine model on component mount (no changes here)
  useEffect(() => {
    const loadModel = async () => {
      // @ts-ignore - tmImage is loaded from script tag in index.html
      if (!window.tmImage) {
        setError("Teachable Machine library not found. Please check script tags.");
        setIsModelLoading(false);
        return;
      }
      const URL = "https://teachablemachine.withgoogle.com/models/YDSTdW9b4O/";
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";
      try {
        // @ts-ignore
        modelRef.current = await window.tmImage.load(modelURL, metadataURL);
        setIsModelLoading(false);
      } catch (e) {
        console.error("Failed to load model:", e);
        setError("Failed to load the analysis model. Please try refreshing the page.");
        setIsModelLoading(false);
      }
    };
    loadModel();
  }, []);

  const runAnalysis = async (imageSrc: string) => {
    if (!modelRef.current) {
      setError("Model is not loaded yet.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    setError(null);

    const imageElement = document.createElement('img');
    imageElement.src = imageSrc;

    imageElement.onload = async () => {
      try {
        const predictions = await modelRef.current!.predict(imageElement);

        // --- NEW: Weighted Average Calculation ---
        let weightedAQI = 0;
        for (const prediction of predictions) {
            const category = prediction.className as keyof typeof AQI_CONFIG;
            const probability = prediction.probability;
            const config = AQI_CONFIG[category];
            
            if (config?.midpoint) {
                weightedAQI += probability * config.midpoint;
            }
        }
        
        // For display purposes, find the category with the highest confidence
        const highestPrediction = predictions.reduce(
          (prev, current) => (prev.probability > current.probability ? prev : current)
        );
        const displayCategory = highestPrediction.className as keyof typeof AQI_CONFIG;
        const confidence = highestPrediction.probability;

        // Set the final state using the new AQI value and the top category for labeling
        setAnalysis({
          aqi: Math.round(weightedAQI),
          category: displayCategory,
          confidence: Math.round(confidence * 100),
          recommendations: AQI_CONFIG[displayCategory].recommendations,
        });

      } catch (e) {
        console.error("Analysis failed:", e);
        setError("An error occurred during analysis. Please try a different image.");
      } finally {
        setIsAnalyzing(false);
      }
    };

    imageElement.onerror = () => {
        setError("Failed to load the image for analysis.");
        setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setSelectedImage(imageSrc);
        runAnalysis(imageSrc); // Trigger analysis right after selection
      };
      reader.readAsDataURL(file);
    }
  };
  
  // No changes to handlers or UI rendering logic below this line
  // ... (handleDragOver, handleDragLeave, handleDrop, getAQIColor, getAQIBgColor, return (...))
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 300) return 'text-red-400';
    return 'text-purple-400';
  };

  const getAQIBgColor = (aqi: number) => {
    if (aqi <= 50) return 'from-green-500/20 to-emerald-500/20';
    if (aqi <= 100) return 'from-yellow-500/20 to-orange-500/20';
    if (aqi <= 150) return 'from-orange-500/20 to-red-500/20';
    if (aqi <= 300) return 'from-red-500/20 to-pink-500/20';
    return 'from-purple-500/20 to-red-500/20';
  };

  return (
    <div className="pt-20 space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
          ${isModelLoading ? 'cursor-not-allowed bg-slate-800/20 border-slate-700' : ''}
          ${dragOver
            ? 'border-teal-400 bg-teal-500/10'
            : 'border-slate-600 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
          }
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isModelLoading}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {isModelLoading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400"></div>
            ) : selectedImage ? (
              <CheckCircle size={48} className="text-green-400" />
            ) : (
              <Upload size={48} className="text-slate-400" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {isModelLoading ? 'Loading Analysis Engine...' : (selectedImage ? 'Image Selected' : 'Upload Environmental Photo')}
            </h3>
            <p className="text-slate-400">
              {isModelLoading ? 'Please wait a moment.' : (selectedImage ? 'Analysis in progress or complete.' : 'Drag and drop an image here, or click to select')}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Image Preview */}
      {selectedImage && (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-slate-300 mb-4">Uploaded Image</h3>
          <div className="flex justify-center">
            <img
              src={selectedImage}
              alt="Uploaded for analysis"
              className="max-w-full max-h-64 rounded-lg border border-slate-700"
            />
          </div>
        </div>
      )}

      {/* Analysis Loading */}
      {isAnalyzing && (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
            <span className="text-slate-300">Analyzing image...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
         <div className="bg-red-900/50 rounded-lg border border-red-700/50 p-6">
          <div className="flex items-center justify-center space-x-3">
            <XCircle className="text-red-400" />
            <span className="text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className={`p-6 rounded-2xl bg-gradient-to-r ${getAQIBgColor(analysis.aqi)} border border-slate-700/50`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Analysis Results</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">Top Category Confidence:</span>
              <span className="text-sm font-medium text-white">{analysis.confidence}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">Predicted AQI</h3>
              <div className="flex items-baseline space-x-2">
                <span className={`text-3xl font-bold ${getAQIColor(analysis.aqi)}`}>
                  {analysis.aqi}
                </span>
                <span className={`text-lg font-medium ${getAQIColor(analysis.aqi)}`}>
                  (Top Category: {analysis.category})
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">Health Impact</h3>
              <div className="flex items-center space-x-2">
                {analysis.aqi > 150 ? (
                  <AlertTriangle size={20} className="text-red-400" />
                ) : analysis.aqi > 100 ? (
                  <AlertTriangle size={20} className="text-yellow-400" />
                ) : (
                  <CheckCircle size={20} className="text-green-400" />
                )}
                <span className="text-white">
                  {analysis.aqi > 150 ? 'Unhealthy for everyone' : analysis.aqi > 100 ? 'Unhealthy for sensitive groups' : 'Generally safe'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-300 mb-3">Recommendations for '{analysis.category}'</h3>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-slate-900/50 rounded-lg">
                  {analysis.aqi > 150 && index === 0 ? (
                    <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  )}
                  <span className={`text-sm ${analysis.aqi > 150 && index === 0 ? 'text-red-300 font-semibold' : 'text-slate-300'}`}>
                    {rec}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAnalysis;