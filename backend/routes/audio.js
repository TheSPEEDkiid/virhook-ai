const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { parseFile } = require('music-metadata');

// This function analyzes audio files to find the most engaging parts
async function analyzeAudioHooks(filePath) {
  try {
    console.log('🎵 Starting audio analysis for:', filePath);
    
    // Get basic metadata from the audio file
    const metadata = await parseFile(filePath);
    console.log('📊 Audio metadata extracted');
    
    // Basic audio analysis (we'll expand this with AI later)
    const analysis = {
      // Basic file info
      duration: metadata.format.duration,
      bitrate: metadata.format.bitrate,
      sampleRate: metadata.format.sampleRate,
      
      // Song information
      title: metadata.common.title || 'Unknown',
      artist: metadata.common.artist || 'Unknown Artist',
      album: metadata.common.album || 'Unknown Album',
      
      // Hook analysis (simplified for now - we'll make this smarter)
      potentialHooks: identifyPotentialHooks(metadata.format.duration),
      
      // Recommendations for different platforms
      platformRecommendations: generatePlatformRecommendations(metadata.format.duration)
    };
    
    console.log('✅ Audio analysis complete');
    return analysis;
    
  } catch (error) {
    console.error('❌ Error analyzing audio:', error);
    throw error;
  }
}

// This identifies potential hook sections in the song
function identifyPotentialHooks(duration) {
  console.log('🎯 Identifying potential hooks...');
  
  // Basic hook identification logic (we'll make this AI-powered later)
  const hooks = [];
  
  if (duration > 30) {
    // Opening hook (first 15-30 seconds)
    hooks.push({
      name: 'Opening Hook',
      startTime: 0,
      endTime: Math.min(30, duration),
      confidence: 0.8,
      reason: 'Strong opening section - great for grabbing attention',
      platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts']
    });
  }
  
  if (duration > 60) {
    // Chorus/Main hook (usually around 25% into the song)
    const chorusStart = Math.floor(duration * 0.25);
    hooks.push({
      name: 'Main Chorus Hook',
      startTime: chorusStart,
      endTime: chorusStart + 30,
      confidence: 0.9,
      reason: 'Likely chorus section - most memorable part',
      platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'YouTube']
    });
  }
  
  if (duration > 120) {
    // Bridge/Climax hook (around 60-70% into the song)
    const bridgeStart = Math.floor(duration * 0.6);
    hooks.push({
      name: 'Bridge/Climax Hook',
      startTime: bridgeStart,
      endTime: bridgeStart + 25,
      confidence: 0.7,
      reason: 'Energy peak - great for emotional impact',
      platforms: ['YouTube', 'Instagram Feed']
    });
  }
  
  return hooks;
}

// Generate platform-specific recommendations
function generatePlatformRecommendations(duration) {
  console.log('📱 Generating platform recommendations...');
  
  return {
    tiktok: {
      recommendedDuration: '15-30 seconds',
      bestHookTiming: '0-15 seconds (immediate impact)',
      tips: [
        'Start with the most engaging part immediately',
        'Use trending sounds or create remixable moments',
        'Keep visual elements dynamic and fast-paced',
        'End with a hook that makes people want to replay'
      ]
    },
    instagram: {
      reels: {
        recommendedDuration: '15-30 seconds',
        bestHookTiming: '0-10 seconds',
        tips: [
          'Hook viewers in the first 3 seconds',
          'Use text overlays for key moments',
          'Create shareable moments',
          'Match the beat with visual transitions'
        ]
      },
      stories: {
        recommendedDuration: '15 seconds max',
        bestHookTiming: '0-5 seconds',
        tips: [
          'Very quick hook needed',
          'Use interactive stickers',
          'Keep it casual and authentic'
        ]
      }
    },
    youtube: {
      shorts: {
        recommendedDuration: '30-60 seconds',
        bestHookTiming: '0-15 seconds',
        tips: [
          'Strong opening to beat the algorithm',
          'Include a call-to-action',
          'Use trending topics or challenges',
          'Optimize for vertical viewing'
        ]
      },
      regular: {
        recommendedDuration: '3-5 minutes',
        bestHookTiming: '0-30 seconds',
        tips: [
          'Tease the best part upfront',
          'Include timestamps for different sections',
          'Create playlist-worthy content',
          'Use compelling thumbnails'
        ]
      }
    }
  };
}

// Route: Analyze uploaded audio file
router.post('/analyze', async (req, res) => {
  try {
    const { filename } = req.body;
    
    if (!filename) {
      return res.status(400).json({ error: 'No filename provided' });
    }
    
    const filePath = path.join('uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Audio file not found' });
    }
    
    console.log('🎵 Analyzing audio file:', filename);
    
    // Perform audio analysis
    const analysis = await analyzeAudioHooks(filePath);
    
    res.json({
      success: true,
      message: 'Audio analysis complete! 🎉',
      filename: filename,
      analysis: analysis
    });
    
  } catch (error) {
    console.error('❌ Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze audio',
      message: error.message 
    });
  }
});

// Route: Get analysis for a specific file
router.get('/analysis/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join('uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Audio file not found' });
    }
    
    const analysis = await analyzeAudioHooks(filePath);
    
    res.json({
      success: true,
      filename: filename,
      analysis: analysis
    });
    
  } catch (error) {
    console.error('❌ Error getting analysis:', error);
    res.status(500).json({ 
      error: 'Failed to get analysis',
      message: error.message 
    });
  }
});

module.exports = router;