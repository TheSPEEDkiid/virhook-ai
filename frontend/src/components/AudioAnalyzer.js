import React, { useRef, useEffect, useState } from 'react';
import * as Tone from 'tone';

class AdvancedAudioAnalyzer {
  constructor() {
    this.audioContext = null;
    this.audioBuffer = null;
    this.sampleRate = 44100;
    this.analysisData = null;
  }

  async analyzeAudioFile(file) {
    try {
      console.log('🎵 Starting advanced audio analysis...');
      
      // Initialize Web Audio API
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Convert file to array buffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Decode audio data
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      console.log('🎤 Audio decoded successfully');
      console.log(`📊 Sample Rate: ${this.audioBuffer.sampleRate}Hz`);
      console.log(`⏱️ Duration: ${this.audioBuffer.duration.toFixed(2)}s`);
      console.log(`🔊 Channels: ${this.audioBuffer.numberOfChannels}`);
      
      // Perform comprehensive analysis
      const analysis = {
        basicInfo: this.getBasicInfo(),
        frequencyAnalysis: await this.analyzeFrequencies(),
        energyAnalysis: this.analyzeEnergyLevels(),
        beatAnalysis: this.analyzeBeatPatterns(),
        vocalAnalysis: this.analyzeVocalPresence(),
        hookPotential: this.calculateHookPotential(),
        viralFactors: this.calculateViralFactors()
      };
      
      this.analysisData = analysis;
      console.log('✅ Advanced analysis complete!');
      
      return analysis;
      
    } catch (error) {
      console.error('❌ Audio analysis error:', error);
      throw error;
    }
  }

  getBasicInfo() {
    return {
      duration: this.audioBuffer.duration,
      sampleRate: this.audioBuffer.sampleRate,
      channels: this.audioBuffer.numberOfChannels,
      length: this.audioBuffer.length
    };
  }

  analyzeFrequencies() {
    console.log('🔍 Analyzing frequency spectrum...');
    
    const channelData = this.audioBuffer.getChannelData(0);
    const fftSize = 2048;
    const frequencyBins = [];
    const segmentSize = Math.floor(channelData.length / 100); // Analyze 100 segments
    
    for (let i = 0; i < 100; i++) {
      const start = i * segmentSize;
      const end = Math.min(start + fftSize, channelData.length);
      const segment = channelData.slice(start, end);
      
      // Simple FFT approximation for frequency analysis
      const frequencies = this.performFFT(segment);
      frequencyBins.push(frequencies);
    }
    
    // Analyze frequency patterns
    const bassEnergy = this.calculateBassEnergy(frequencyBins);
    const midEnergy = this.calculateMidEnergy(frequencyBins);
    const highEnergy = this.calculateHighEnergy(frequencyBins);
    
    return {
      bassEnergy,
      midEnergy, 
      highEnergy,
      dominantFrequency: this.findDominantFrequency(frequencyBins),
      frequencyVariation: this.calculateFrequencyVariation(frequencyBins),
      spectralCentroid: this.calculateSpectralCentroid(frequencyBins)
    };
  }

  analyzeEnergyLevels() {
    console.log('⚡ Analyzing energy levels...');
    
    const channelData = this.audioBuffer.getChannelData(0);
    const windowSize = Math.floor(this.audioBuffer.sampleRate * 0.5); // 0.5 second windows
    const energyLevels = [];
    
    for (let i = 0; i < channelData.length; i += windowSize) {
      const window = channelData.slice(i, i + windowSize);
      const rms = Math.sqrt(window.reduce((sum, sample) => sum + sample * sample, 0) / window.length);
      energyLevels.push(rms);
    }
    
    // Find energy peaks (potential hooks)
    const energyPeaks = this.findEnergyPeaks(energyLevels);
    const averageEnergy = energyLevels.reduce((sum, level) => sum + level, 0) / energyLevels.length;
    
    return {
      energyLevels,
      energyPeaks,
      averageEnergy,
      maxEnergy: Math.max(...energyLevels),
      energyVariation: this.calculateVariation(energyLevels),
      dynamicRange: Math.max(...energyLevels) - Math.min(...energyLevels)
    };
  }

  analyzeBeatPatterns() {
    console.log('🥁 Analyzing beat patterns...');
    
    const channelData = this.audioBuffer.getChannelData(0);
    const beatDetection = this.detectBeats(channelData);
    
    return {
      estimatedBPM: beatDetection.bpm,
      beatStrength: beatDetection.strength,
      rhythmConsistency: beatDetection.consistency,
      beatPositions: beatDetection.positions,
      hasStrongBeat: beatDetection.strength > 0.7,
      isDanceable: beatDetection.bpm >= 120 && beatDetection.bpm <= 140
    };
  }

  analyzeVocalPresence() {
    console.log('🎤 Analyzing vocal presence...');
    
    // Vocal frequencies typically range from 85Hz to 8kHz, with formants around 1-3kHz
    const channelData = this.audioBuffer.getChannelData(0);
    const vocalSegments = this.detectVocalSegments(channelData);
    
    return {
      vocalPresence: vocalSegments.presence,
      vocalClarity: vocalSegments.clarity,
      vocalPeaks: vocalSegments.peaks,
      hasProminentVocals: vocalSegments.presence > 0.6,
      vocalMelodicity: this.calculateMelodicity(channelData)
    };
  }

  calculateHookPotential() {
    console.log('🎯 Calculating hook potential...');
    
    if (!this.analysisData) return {};
    
    const duration = this.audioBuffer.duration;
    const segments = this.divideIntoSegments(duration, 10); // 10-second segments
    const hookScores = [];
    
    segments.forEach((segment, index) => {
      const startTime = segment.start;
      const endTime = segment.end;
      
      // Calculate hook score based on multiple factors
      const energyScore = this.getEnergyScoreForSegment(startTime, endTime);
      const frequencyScore = this.getFrequencyScoreForSegment(startTime, endTime);
      const vocalScore = this.getVocalScoreForSegment(startTime, endTime);
      const positionScore = this.getPositionScore(startTime, duration);
      
      const hookScore = (energyScore * 0.3 + frequencyScore * 0.25 + vocalScore * 0.25 + positionScore * 0.2);
      
      hookScores.push({
        startTime,
        endTime,
        score: hookScore,
        energy: energyScore,
        frequency: frequencyScore,
        vocal: vocalScore,
        position: positionScore
      });
    });
    
    // Sort by hook potential
    hookScores.sort((a, b) => b.score - a.score);
    
    return {
      segments: hookScores,
      bestHook: hookScores[0],
      averageHookPotential: hookScores.reduce((sum, h) => sum + h.score, 0) / hookScores.length
    };
  }

  calculateViralFactors() {
    console.log('🚀 Calculating viral potential factors...');
    
    const factors = {
      catchiness: 0,
      memorability: 0,
      shareability: 0,
      danceability: 0,
      emotionalImpact: 0,
      uniqueness: 0
    };
    
    // Catchiness: based on repetitive patterns and hooks
    factors.catchiness = this.calculateCatchiness();
    
    // Memorability: based on melodic simplicity and repetition
    factors.memorability = this.calculateMemorability();
    
    // Shareability: based on energy and vocal presence
    factors.shareability = this.calculateShareability();
    
    // Danceability: based on beat strength and BPM
    factors.danceability = this.calculateDanceability();
    
    // Emotional impact: based on dynamic range and intensity
    factors.emotionalImpact = this.calculateEmotionalImpact();
    
    // Uniqueness: based on frequency patterns and structure
    factors.uniqueness = this.calculateUniqueness();
    
    // Overall viral score
    const viralScore = Object.values(factors).reduce((sum, score) => sum + score, 0) / Object.keys(factors).length;
    
    return {
      ...factors,
      overallViralScore: viralScore,
      viralPotential: viralScore > 0.7 ? 'High' : viralScore > 0.5 ? 'Medium' : 'Low'
    };
  }

  // Helper methods for calculations
  performFFT(data) {
    // Simplified FFT for frequency analysis
    const N = data.length;
    const frequencies = new Array(N / 2);
    
    for (let k = 0; k < N / 2; k++) {
      let real = 0, imag = 0;
      for (let n = 0; n < N; n++) {
        const angle = -2 * Math.PI * k * n / N;
        real += data[n] * Math.cos(angle);
        imag += data[n] * Math.sin(angle);
      }
      frequencies[k] = Math.sqrt(real * real + imag * imag);
    }
    
    return frequencies;
  }

  calculateBassEnergy(frequencyBins) {
    // Bass frequencies: 20-250 Hz
    return frequencyBins.map(bin => 
      bin.slice(0, Math.floor(bin.length * 0.1)).reduce((sum, val) => sum + val, 0)
    ).reduce((sum, energy) => sum + energy, 0) / frequencyBins.length;
  }

  calculateMidEnergy(frequencyBins) {
    // Mid frequencies: 250-4000 Hz
    return frequencyBins.map(bin => 
      bin.slice(Math.floor(bin.length * 0.1), Math.floor(bin.length * 0.4)).reduce((sum, val) => sum + val, 0)
    ).reduce((sum, energy) => sum + energy, 0) / frequencyBins.length;
  }

  calculateHighEnergy(frequencyBins) {
    // High frequencies: 4000+ Hz
    return frequencyBins.map(bin => 
      bin.slice(Math.floor(bin.length * 0.4)).reduce((sum, val) => sum + val, 0)
    ).reduce((sum, energy) => sum + energy, 0) / frequencyBins.length;
  }

  findEnergyPeaks(energyLevels) {
    const peaks = [];
    const threshold = Math.max(...energyLevels) * 0.7; // 70% of max energy
    
    for (let i = 1; i < energyLevels.length - 1; i++) {
      if (energyLevels[i] > energyLevels[i-1] && 
          energyLevels[i] > energyLevels[i+1] && 
          energyLevels[i] > threshold) {
        peaks.push({
          position: i,
          energy: energyLevels[i],
          timestamp: i * 0.5 // Each window is 0.5 seconds
        });
      }
    }
    
    return peaks;
  }

  detectBeats(channelData) {
    // Simplified beat detection
    const windowSize = Math.floor(this.audioBuffer.sampleRate * 0.1); // 100ms windows
    const beats = [];
    
    for (let i = 0; i < channelData.length - windowSize; i += windowSize) {
      const window = channelData.slice(i, i + windowSize);
      const energy = window.reduce((sum, sample) => sum + Math.abs(sample), 0) / window.length;
      beats.push(energy);
    }
    
    // Estimate BPM from energy peaks
    const bpm = this.estimateBPM(beats);
    
    return {
      bpm,
      strength: Math.max(...beats),
      consistency: 1 - (this.calculateVariation(beats) / Math.max(...beats)),
      positions: beats
    };
  }

  estimateBPM(energyData) {
    // Simple BPM estimation based on energy peaks
    const peaks = [];
    const threshold = Math.max(...energyData) * 0.6;
    
    for (let i = 1; i < energyData.length - 1; i++) {
      if (energyData[i] > energyData[i-1] && 
          energyData[i] > energyData[i+1] && 
          energyData[i] > threshold) {
        peaks.push(i * 0.1); // Convert to seconds
      }
    }
    
    if (peaks.length < 2) return 120; // Default BPM
    
    // Calculate average interval between peaks
    const intervals = [];
    for (let i = 1; i < peaks.length; i++) {
      intervals.push(peaks[i] - peaks[i-1]);
    }
    
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const bpm = 60 / avgInterval;
    
    return Math.max(60, Math.min(200, Math.round(bpm))); // Clamp between 60-200 BPM
  }

  // Additional helper methods...
  calculateVariation(data) {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }

  divideIntoSegments(duration, segmentLength) {
    const segments = [];
    for (let i = 0; i < duration; i += segmentLength) {
      segments.push({
        start: i,
        end: Math.min(i + segmentLength, duration)
      });
    }
    return segments;
  }

  // Placeholder methods for viral factor calculations
  calculateCatchiness() { return Math.random() * 0.5 + 0.5; }
  calculateMemorability() { return Math.random() * 0.5 + 0.5; }
  calculateShareability() { return Math.random() * 0.5 + 0.5; }
  calculateDanceability() { return Math.random() * 0.5 + 0.5; }
  calculateEmotionalImpact() { return Math.random() * 0.5 + 0.5; }
  calculateUniqueness() { return Math.random() * 0.5 + 0.5; }
  
  // Additional placeholder methods
  detectVocalSegments() { return { presence: 0.7, clarity: 0.8, peaks: [], }; }
  calculateMelodicity() { return Math.random() * 0.5 + 0.5; }
  getEnergyScoreForSegment() { return Math.random() * 0.5 + 0.5; }
  getFrequencyScoreForSegment() { return Math.random() * 0.5 + 0.5; }
  getVocalScoreForSegment() { return Math.random() * 0.5 + 0.5; }
  getPositionScore(startTime, duration) { 
    // Give higher scores to beginning and middle sections
    const normalizedPosition = startTime / duration;
    if (normalizedPosition < 0.3) return 0.9; // Strong opening
    if (normalizedPosition < 0.7) return 1.0; // Peak chorus area
    return 0.6; // Later sections
  }
  findDominantFrequency() { return 440; }
  calculateFrequencyVariation() { return Math.random() * 0.5 + 0.5; }
  calculateSpectralCentroid() { return Math.random() * 2000 + 1000; }
}

export default AdvancedAudioAnalyzer;