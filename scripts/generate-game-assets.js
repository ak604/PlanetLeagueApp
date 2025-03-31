const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../assets/games');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Helper function to create a canvas and save it
function createAndSaveImage(filename, width, height, drawFn) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Clear background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  
  // Draw content
  drawFn(ctx);
  
  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(ASSETS_DIR, filename), buffer);
}

// Generate runner game assets
createAndSaveImage('runner.png', 50, 50, (ctx) => {
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(25, 25, 20, 0, Math.PI * 2);
  ctx.fill();
});

createAndSaveImage('asteroid.png', 40, 40, (ctx) => {
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.arc(20, 20, 15, 0, Math.PI * 2);
  ctx.fill();
});

createAndSaveImage('space-bg.png', 800, 600, (ctx) => {
  // Create starry background
  ctx.fillStyle = '#000033';
  ctx.fillRect(0, 0, 800, 600);
  
  // Add stars
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 800;
    const y = Math.random() * 600;
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI * 2);
    ctx.fill();
  }
});

// Generate puzzle game assets
const puzzleColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
puzzleColors.forEach((color, index) => {
  createAndSaveImage(`puzzle-${index + 1}.png`, 80, 80, (ctx) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 80, 80);
    
    // Add pattern
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 40, 40);
  });
});

createAndSaveImage('puzzle-bg.png', 800, 600, (ctx) => {
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, 800, 600);
});

// Generate memory game assets
const memorySymbols = ['🌟', '🌙', '☀️', '⭐'];
memorySymbols.forEach((symbol, index) => {
  createAndSaveImage(`memory-${index + 1}.png`, 80, 80, (ctx) => {
    ctx.fillStyle = '#4a90e2';
    ctx.fillRect(0, 0, 80, 80);
    
    // Add symbol
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, 40, 40);
  });
});

createAndSaveImage('memory-back.png', 80, 80, (ctx) => {
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(0, 0, 80, 80);
  
  // Add pattern
  ctx.fillStyle = '#34495e';
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      ctx.fillRect(10 + i * 15, 10 + j * 15, 10, 10);
    }
  }
});

console.log('Game assets generated successfully!'); 