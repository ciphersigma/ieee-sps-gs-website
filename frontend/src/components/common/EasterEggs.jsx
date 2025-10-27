// src/components/common/EasterEggs.jsx
import { useEffect, useState } from 'react';

const EasterEggs = () => {
  const [konamiSequence, setKonamiSequence] = useState([]);
  const [logoClicks, setLogoClicks] = useState(0);
  const [secretKeys, setSecretKeys] = useState([]);

  const konami = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];
  
  const secretCode = ['KeyP', 'KeyC']; // PC for Prashant Chettiyar

  useEffect(() => {
    // Console messages for developers
    console.log('%c🎯 IEEE SPS Gujarat Chapter', 'color: #0066cc; font-size: 20px; font-weight: bold;');
    console.log('%c📡 Signal Processing Excellence Since 2020', 'color: #00aa44; font-size: 14px;');
    console.log('%c🔍 Found the console? You might be developer material!', 'color: #ff6600; font-size: 12px;');

    // Konami code listener
    const handleKeyDown = (e) => {
      setKonamiSequence(prev => {
        const newSequence = [...prev, e.code].slice(-10);
        
        if (JSON.stringify(newSequence) === JSON.stringify(konami)) {
          triggerKonamiEasterEgg();
          return [];
        }
        
        return newSequence;
      });
      
      // Secret developer credit
      setSecretKeys(prev => {
        const newKeys = [...prev, e.code].slice(-2);
        
        if (JSON.stringify(newKeys) === JSON.stringify(secretCode)) {
          triggerDeveloperCredit();
          return [];
        }
        
        return newKeys;
      });
    };

    // Logo click counter
    const handleLogoClick = () => {
      setLogoClicks(prev => {
        const newCount = prev + 1;
        if (newCount === 10) {
          triggerLogoEasterEgg();
          return 0;
        }
        return newCount;
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Add click listener to logo
    const logo = document.querySelector('img[alt*="IEEE"]');
    if (logo) {
      logo.addEventListener('click', handleLogoClick);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (logo) {
        logo.removeEventListener('click', handleLogoClick);
      }
    };
  }, []);

  const triggerKonamiEasterEgg = () => {
    // Create floating signals
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const signal = document.createElement('div');
        signal.innerHTML = '📡';
        signal.style.cssText = `
          position: fixed;
          top: ${Math.random() * 100}vh;
          left: ${Math.random() * 100}vw;
          font-size: 30px;
          z-index: 9999;
          pointer-events: none;
          animation: float 3s ease-out forwards;
        `;
        
        document.body.appendChild(signal);
        setTimeout(() => signal.remove(), 3000);
      }, i * 100);
    }

    // Add CSS animation
    if (!document.getElementById('easter-egg-styles')) {
      const style = document.createElement('style');
      style.id = 'easter-egg-styles';
      style.textContent = `
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-200px) rotate(360deg); opacity: 0; }
        }
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    // Show message
    alert('🎉 Konami Code Activated! Signal Processing Power Unlocked! 📡');
  };

  const triggerLogoEasterEgg = () => {
    const logo = document.querySelector('img[alt*="IEEE"]');
    if (logo) {
      logo.style.animation = 'rainbow 2s infinite';
      setTimeout(() => {
        logo.style.animation = '';
      }, 4000);
    }
    
    console.log('%c🌈 Logo Easter Egg Activated!', 'color: #ff00ff; font-size: 16px; font-weight: bold;');
    alert('🌈 You found the logo secret! IEEE SPS Gujarat appreciates curious minds!');
  };
  
  const triggerDeveloperCredit = () => {
    // Create developer credit overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      z-index: 10000;
      text-align: center;
      font-family: 'Arial', sans-serif;
      animation: fadeInScale 0.5s ease-out;
    `;
    
    overlay.innerHTML = `
      <div style="font-size: 24px; margin-bottom: 10px;">🚀</div>
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">Developer</div>
      <div style="font-size: 22px; font-weight: 900; letter-spacing: 2px; color: #FFD700;">PRASHANT CHETTIYAR</div>
      <div style="font-size: 12px; margin-top: 10px; opacity: 0.8;">Press P+C to reveal</div>
    `;
    
    // Add animation styles if not exists
    if (!document.getElementById('developer-credit-styles')) {
      const style = document.createElement('style');
      style.id = 'developer-credit-styles';
      style.textContent = `
        @keyframes fadeInScale {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      overlay.remove();
    }, 3000);
    
    console.log('%c👨‍💻 Developer: PRASHANT CHETTIYAR', 'color: #FFD700; font-size: 16px; font-weight: bold; background: #333; padding: 5px;');
  };

  return null;
};

export default EasterEggs;