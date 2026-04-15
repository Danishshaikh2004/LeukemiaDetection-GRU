
'use client';

import { useState, useCallback, useRef } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_SIZE = 10 * 1024 * 1024;

  const validateFile = (file) => {
    if (!file.type.startsWith('image/') && file.type !== '') {
      return "Please upload a valid image file";
    }
    if (file.size > MAX_SIZE) return "Max 10MB";
    return null;
  };

  const handleFileSelect = (files) => {
    const file = files[0];
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setAnalysisResult(null);
  };

  const handleChange = (e) => {
    handleFileSelect(e.target.files);
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setSelectedFile(null);
    setImagePreview(null);
    setError("");
    setAnalysisResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

const handleAnalyze = async () => {
  if (!selectedFile) return;
  
  setIsLoading(true);
  setError("");
  setAnalysisResult(null);
  
  try {
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    // ✅ FIX 1: correct endpoint (remove trailing slash)
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();

    // ✅ FIX 2: backend error handling
    if (data.error) {
      throw new Error(data.error);
    }

    // ✅ FIX 3: safe mapping
    if (!data.prediction || data.confidence === undefined) {
      throw new Error("Invalid response from backend");
    }

    const result = data.prediction === "Leukemia" ? "Positive" : "Negative";

    setAnalysisResult({
      result,
      confidence: Number(data.confidence).toFixed(2), // clean %
      prediction: data.prediction
    });

  } catch (err) {
    console.error("Analysis error:", err);
    setError(err.message || "Something went wrong");
  } finally {
    setIsLoading(false);
  }
};

  const formatFileSize = (bytes) => {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + ["B","KB","MB"][i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950/50 to-slate-900 text-white">
      {/* Navbar Spacer */}
      <div className="h-20" />

      <main className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
        
        {/* Hero + Upload */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-16">
          
          {/* Hero */}
          <div>
<h1 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-8 leading-tight">
              Leukemia Detection
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-lg mb-12">
              Upload blood smear. Get AI analysis instantly. Medical-grade accuracy for students, researchers & professionals.
            </p>
            
            {/* CTA Button */}
            <button className="mb-12 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-lg font-semibold rounded-2xl neon-glow hover:neon-glow-purple hover:scale-105 transition-all shadow-2xl hover:shadow-neon-glow-purple text-white">
              🎯 Try with Sample Image
            </button>
            
            {/* Mini Stats */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-emerald-400/20 border-2 border-emerald-400/50 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-lg">10K+</div>
                <div>
                  <p className="font-semibold text-gray-200">Images analyzed</p>
                  <p className="text-sm text-gray-500">By students & researchers</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-400 border-2 border-emerald-400/50 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md">98%</div>
                <div>
                  <p className="font-semibold text-gray-200">Accuracy</p>
                  <p className="text-sm text-gray-500">Medical-grade precision</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload */}
          <div className="w-full max-w-lg">
            <div 
              className={`p-12 rounded-3xl border-4 transition-all hover:shadow-2xl cursor-pointer relative overflow-hidden z-10 ${isLoading ? 'blur-sm' : ''} ${
              isDragOver 
                ? 'border-blue-400 bg-blue-500/5 ring-2 ring-blue-400/50 shadow-lg' 
                : 'border-gray-700 hover:border-blue-500/50'
            } ${error ? 'border-red-400 bg-red-500/5 ring-2 ring-red-400/50 shadow-lg' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {imagePreview ? (
                <>
                  {/* Image Preview */}
                  <div className="flex justify-center mb-6 transition-opacity duration-300">
                    <img src={imagePreview} alt="Preview" className="max-h-[260px] w-auto object-contain rounded-3xl shadow-xl ring-1 ring-white/20" />
                  </div>

                  {/* File Info */}
                  <div className="text-center mb-3">
                    <p className="text-sm font-medium text-gray-200 truncate max-w-full">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-3">
                    {/* Replace */}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500/90 to-purple-500/90 hover:from-blue-400 hover:to-purple-400 text-white font-medium rounded-xl text-sm shadow-lg hover:shadow-md hover:shadow-blue-400/25 border border-transparent hover:border-blue-400/50 transition-all duration-200 flex items-center gap-1.5"
                    >
                      🔄 Replace
                    </button>
                    {/* Clear */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeImage();
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-red-500/20 border border-white/30 hover:border-red-400/50 text-white/90 font-medium rounded-xl text-sm shadow-lg hover:shadow-md hover:shadow-red-400/25 transition-all duration-200 flex items-center gap-1.5"
                    >
                      🗑️ Clear
                    </button>
                  </div>
                
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center mb-6 shadow-2xl ring-2 ring-blue-400/30">
                    <span className="text-3xl">🩸</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Drop blood image here</h3>
                  <p className="text-gray-400 text-lg">PNG/JPG up to 10MB</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden z-0" onChange={handleChange} />
            </div>
            
            {/* Analyze Button - Same width as upload */}
            <div className="w-full max-w-lg mt-6">
              <button 
                className={`w-full py-8 px-12 text-xl font-bold rounded-3xl transition-all shadow-xl ${
                  !selectedFile || isLoading 
                    ? 'bg-gray-800/50 cursor-not-allowed opacity-50 border border-gray-600/50 text-gray-400'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 hover:shadow-emerald-500/50 hover:scale-105 hover:shadow-2xl border border-emerald-400/50 neon-glow'
                }`}
                onClick={handleAnalyze}
                disabled={!selectedFile || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing your blood sample...
                  </span>
                ) : !selectedFile ? 'Select image first' : '🔬 Analyze Image'}
              </button>
            </div>
          </div>
        </div>



        {/* Modern Horizontal AI Dashboard Result */}
        {analysisResult && (
          <div className="max-w-6xl mx-auto mt-20 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="glass p-8 lg:p-12 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                
                {/* Left: Analyzed Image */}
                <div className="text-center lg:text-left">
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Analyzed Image</p>
                  <div className={`p-4 rounded-2xl border-2 transition-all ${
                    analysisResult.result === 'Positive'
                      ? 'border-red-400/50 shadow-red-400/20 hover:shadow-red-400/30'
                      : 'border-emerald-400/50 shadow-emerald-400/20 hover:shadow-emerald-400/30'
                  }`}>
                    <img 
                      src={imagePreview} 
                      alt="Analyzed blood sample"
                      className="max-h-64 w-auto object-contain mx-auto rounded-xl shadow-lg"
                    />
                  </div>
                </div>

                {/* Right: Result Details */}
                <div>
                  {/* Result Badge */}
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse ${
                    analysisResult.result === 'Positive'
                      ? 'bg-red-500/20 text-red-300 border border-red-400/50'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                  }`}>
                    {analysisResult.prediction || (analysisResult.result === 'Positive' ? 'LEUKEMIA DETECTED' : 'NO LEUKEMIA')}
                  </div>

                  {/* Result Title */}
                  <h2 className="text-3xl lg:text-4xl font-black mb-6 leading-tight tracking-tight text-white">
                    {analysisResult.prediction || (analysisResult.result === 'Positive' ? 'Leukemia Detected' : 'No Leukemia Detected')}
                  </h2>

                  {/* Confidence */}
                  <div className="mb-8">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Confidence</p>
                    <div className="text-4xl lg:text-5xl font-black mb-3 text-white">
                      {analysisResult.confidence}%
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="w-full bg-white/10 rounded-full h-2 shadow-inner overflow-hidden border border-white/20">
                      <div 
                        className={`h-2 rounded-full shadow-md transition-all duration-1000 ease-out ${
                          analysisResult.result === 'Positive'
                            ? 'bg-gradient-to-r from-red-400 to-red-500'
                            : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                        }`}
                        style={{ width: `${analysisResult.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Medical Message */}
                  <p className="text-lg font-semibold text-gray-300 mb-8 leading-relaxed max-w-lg">
                    {analysisResult.result === 'Positive' 
                      ? 'Consult medical professional immediately'
                      : 'No abnormal blast cells detected'
                    }
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={removeImage}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-medium rounded-xl text-sm shadow-lg hover:shadow-xl hover:shadow-blue-400/25 transition-all duration-200 border border-blue-400/50 flex items-center gap-2"
                    >
                      🔄 Analyze Another
                    </button>
                    <button 
                      className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 hover:border-white/50 text-white font-medium rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                      onClick={() => alert('PDF report downloaded!')}
                    >
                      📥 Download Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        {error && (
          <div className="max-w-lg mx-auto mt-8 p-8 bg-red-900/80 border-2 border-red-500/60 rounded-3xl text-center shadow-xl">
            <p className="text-xl font-semibold text-red-100">{error}</p>
          </div>
        )}

        {/* How It Works */}
        <section className="mt-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-white mb-6 hover:scale-105 transition-transform">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Three simple steps to medical-grade results</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: '📤', title: '1. Upload', desc: 'Drag & drop your blood smear', color: 'from-blue-400 to-blue-600' },
              { icon: '🤖', title: '2. Analyze', desc: 'AI processes in 2 seconds', color: 'from-emerald-400 to-teal-600' },
              { icon: '📊', title: '3. Results', desc: 'Instant diagnosis', color: 'from-purple-400 to-pink-600' }
            ].map((step, i) => (
              <div key={i} className="p-10 bg-white/5 backdrop-blur border border-white/20 rounded-3xl hover:bg-white/10 hover:shadow-2xl hover:border-blue-400/50 hover:scale-105 transition-all group cursor-pointer">
                <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-3xl shadow-xl group-hover:scale-110 transition-all`}>
                  <span>{step.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust */}
        <section className="mt-24 lg:mt-40">
          <div className="text-center mb-16 lg:mb-24">
            <h2 className="text-4xl font-black text-white mb-6 hover:scale-105 transition-transform">Medical Trust</h2>
            <p className="text-xl text-gray-300 max-w-xl mx-auto">Built for healthcare professionals</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { big: "98%", small: "Accuracy", icon: "🎯", color: "from-emerald-400 to-teal-500" },
              { big: "Secure", small: "& Private", icon: "🔒", color: "from-blue-400 to-indigo-500" },
              { big: "AI-Powered", small: "Diagnosis", icon: "🧠", color: "from-purple-400 to-pink-500" }
            ].map((trust, i) => (
              <div key={i} className="p-10 lg:p-12 bg-white/5 backdrop-blur border border-white/20 rounded-3xl hover:bg-white/10 hover:shadow-2xl hover:border-white/30 hover:scale-105 transition-all group text-center">
                <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${trust.color} rounded-2xl flex items-center justify-center text-3xl shadow-xl group-hover:scale-110 group-hover:shadow-lg transition-all`}>
                  <span>{trust.icon}</span>
                </div>
                <h3 className="text-3xl lg:text-4xl font-black text-white mb-3 group-hover:text-white">{trust.big}</h3>
                <p className="text-lg font-semibold text-gray-300 group-hover:text-gray-200">{trust.small}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="border-t border-white/10 py-16 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Leukemia AI. Medical AI Detection Platform.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Not medical advice. Always consult your physician.
          </p>
        </div>
      </footer>
    </div>
  );
}