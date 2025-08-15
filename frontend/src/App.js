import React, { useState } from 'react';
import { CloudArrowUpIcon, MusicalNoteIcon, SparklesIcon, PlayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('audio/')) {
        setFile(droppedFile);
      } else {
        alert('Please upload an audio file (MP3, WAV, M4A, FLAC)');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const droppedFile = e.target.files[0];
      if (droppedFile.type.startsWith('audio/')) {
        setFile(droppedFile);
      } else {
        alert('Please upload an audio file (MP3, WAV, M4A, FLAC)');
      }
    }
  };

  const uploadAndAnalyze = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('audio', file);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Upload the file
      const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUploadProgress(100);
      clearInterval(progressInterval);
      
      console.log('Upload successful:', uploadResponse.data);
      setIsUploading(false);
      setIsAnalyzing(true);

      // Analyze the uploaded file
      const analysisResponse = await axios.post('http://localhost:5000/api/audio/analyze', {
        filename: uploadResponse.data.filename
      });

      console.log('Analysis complete:', analysisResponse.data);
      setAnalysis(analysisResponse.data.analysis);
      setIsAnalyzing(false);

    } catch (error) {
      console.error('Error:', error);
      setIsUploading(false);
      setIsAnalyzing(false);
      setUploadProgress(0);
      alert('Error processing file. Please make sure your backend server is running and try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetApp = () => {
    setFile(null);
    setAnalysis(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsAnalyzing(false);
  };

  return (
    <div className="app">
      {/* Animated Background Elements */}
      <div className="bg-animation">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="logo animate-fade-in">
            <MusicalNoteIcon className="logo-icon" />
            <h1>ViralHook AI</h1>
          </div>
          <p className="tagline animate-fade-in-delay">
            Find the perfect hooks in your music for viral social media content
          </p>
          <div className="features animate-fade-in-delay-2">
            <span className="feature-badge">🎵 AI-Powered Analysis</span>
            <span className="feature-badge">📱 Platform Optimization</span>
            <span className="feature-badge">⚡ Instant Results</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Upload Section */}
        {!file && !analysis && (
          <div className="upload-section animate-slide-up">
            <div
              className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <CloudArrowUpIcon className="upload-icon" />
              <h3>Drag & Drop Your Music</h3>
              <p>or click to browse files</p>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="file-input"
              />
              <div className="supported-formats">
                Supports: MP3, WAV, M4A, FLAC
              </div>
              <div className="upload-hint">
                Maximum file size: 50MB
              </div>
            </div>
          </div>
        )}

        {/* File Selected */}
        {file && !analysis && (
          <div className="file-selected-section animate-slide-up">
            <div className="file-info-card">
              <div className="file-icon-container">
                <MusicalNoteIcon className="file-icon" />
              </div>
              <div className="file-details">
                <h4>{file.name}</h4>
                <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            {isUploading && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="progress-text">{Math.round(uploadProgress)}% uploaded</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                className="analyze-button"
                onClick={uploadAndAnalyze}
                disabled={isUploading || isAnalyzing}
              >
                {isUploading && (
                  <>
                    <ArrowPathIcon className="spinning-icon" />
                    Uploading...
                  </>
                )}
                {isAnalyzing && (
                  <>
                    <div className="pulse-loader">
                      <div className="pulse pulse-1"></div>
                      <div className="pulse pulse-2"></div>
                      <div className="pulse pulse-3"></div>
                    </div>
                    Analyzing Hooks...
                  </>
                )}
                {!isUploading && !isAnalyzing && (
                  <>
                    <SparklesIcon className="button-icon" />
                    Analyze Hooks
                  </>
                )}
              </button>

              <button className="secondary-button" onClick={resetApp}>
                Choose Different File
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {analysis && (
          <div className="results-section animate-fade-in">
            <div className="results-header">
              <h2>🎯 Hook Analysis Complete!</h2>
              <button className="new-analysis-button" onClick={resetApp}>
                <SparklesIcon className="button-icon" />
                Analyze New Track
              </button>
            </div>

            {/* Song Info Card */}
<div className="song-info-card animate-slide-up">
  <h3>📊 Track Information</h3>
  <div className="info-grid">
    <div className="info-item">
      <span className="label">Title:</span>
      <span className="value">{analysis.title}</span>
    </div>
    <div className="info-item">
      <span className="label">Artist:</span>
      <span className="value">{analysis.artist}</span>
    </div>
    <div className="info-item">
      <span className="label">Duration:</span>
      <span className="value">{formatTime(analysis.duration)}</span>
    </div>
    <div className="info-item">
      <span className="label">Sample Rate:</span>
      <span className="value">{analysis.sampleRate} Hz</span>
    </div>
    {analysis.genreAnalysis && (
      <div className="info-item">
        <span className="label">Genre:</span>
        <span className="value">{analysis.genreAnalysis.primary}</span>
      </div>
    )}
    {analysis.audioQuality && (
      <div className="info-item">
        <span className="label">Audio Quality:</span>
        <span className="value quality-badge">{analysis.audioQuality.rating}</span>
      </div>
    )}
  </div>

  {/* Add Genre Tags */}
  {analysis.genreAnalysis && analysis.genreAnalysis.characteristics.length > 0 && (
    <div className="genre-section">
      <h4>🎵 Genre Characteristics</h4>
      <div className="genre-tags">
        {analysis.genreAnalysis.characteristics.map((char, idx) => (
          <span key={idx} className="genre-tag">{char}</span>
        ))}
      </div>
    </div>
  )}

  {/* Add Mood Analysis */}
  {analysis.moodAnalysis && (
    <div className="mood-section">
      <h4>🎭 Mood Analysis</h4>
      <div className="mood-grid">
        <div className="mood-item">
          <span className="mood-label">Primary Mood:</span>
          <span className="mood-value">{analysis.moodAnalysis.primaryMood}</span>
        </div>
        <div className="mood-tags">
          {analysis.moodAnalysis.emotionalTags.map((tag, idx) => (
            <span key={idx} className="mood-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )}

  {/* Add Viral Potential */}
  {analysis.viralFactors && (
    <div className="viral-section">
      <h4>🚀 Viral Potential</h4>
      <div className="viral-score">
        <span className="viral-label">Overall Score:</span>
        <span className="viral-value">{Math.round(analysis.viralFactors.overall * 100)}%</span>
      </div>
      <div className="viral-factors">
        <div className="factor">
          <span>Catchiness: {Math.round(analysis.viralFactors.catchiness * 100)}%</span>
        </div>
        <div className="factor">
          <span>Shareability: {Math.round(analysis.viralFactors.shareability * 100)}%</span>
        </div>
        <div className="factor">
          <span>Memorability: {Math.round(analysis.viralFactors.memorability * 100)}%</span>
        </div>
      </div>
    </div>
  )}
</div>

            {/* Hooks Section */}
            <div className="hooks-section animate-slide-up-delay">
              <h3>🎵 Identified Hooks</h3>
              <div className="hooks-grid">
                {analysis.potentialHooks.map((hook, index) => (
                  <div
                    key={index}
                    className="hook-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="hook-header">
                      <PlayIcon className="hook-icon" />
                      <div className="hook-info">
                        <h4>{hook.name}</h4>
                        <p className="hook-time">
                          {formatTime(hook.startTime)} - {formatTime(hook.endTime)}
                        </p>
                      </div>
                      <div className="confidence-badge">
                        {Math.round(hook.confidence * 100)}%
                      </div>
                    </div>
                    <p className="hook-reason">{hook.reason}</p>
                    <div className="hook-platforms">
                      {hook.platforms.map((platform, idx) => (
                        <span key={idx} className="platform-tag">{platform}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Recommendations */}
            <div className="platforms-section animate-slide-up-delay-2">
              <h3>📱 Platform Recommendations</h3>
              <div className="platforms-grid">
                <div className="platform-card tiktok">
                  <div className="platform-header">
                    <h4>🎵 TikTok</h4>
                    <span className="platform-tag">{analysis.platformRecommendations.tiktok.recommendedDuration}</span>
                  </div>
                  <p className="timing">Best Hook: {analysis.platformRecommendations.tiktok.bestHookTiming}</p>
                  <ul className="tips-list">
                    {analysis.platformRecommendations.tiktok.tips.slice(0, 3).map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="platform-card instagram">
                  <div className="platform-header">
                    <h4>📸 Instagram Reels</h4>
                    <span className="platform-tag">{analysis.platformRecommendations.instagram.reels.recommendedDuration}</span>
                  </div>
                  <p className="timing">Best Hook: {analysis.platformRecommendations.instagram.reels.bestHookTiming}</p>
                  <ul className="tips-list">
                    {analysis.platformRecommendations.instagram.reels.tips.slice(0, 3).map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="platform-card youtube">
                  <div className="platform-header">
                    <h4>📺 YouTube Shorts</h4>
                    <span className="platform-tag">{analysis.platformRecommendations.youtube.shorts.recommendedDuration}</span>
                  </div>
                  <p className="timing">Best Hook: {analysis.platformRecommendations.youtube.shorts.bestHookTiming}</p>
                  <ul className="tips-list">
                    {analysis.platformRecommendations.youtube.shorts.tips.slice(0, 3).map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;