// src/components/layout/Header/hooks.js
import { useState, useEffect } from 'react';

export const useScrollEffect = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getHeaderOpacity = () => {
    const minScroll = 20;
    const maxScroll = 200;
    
    if (scrollY <= minScroll) return 1;
    if (scrollY >= maxScroll) return 0.85;
    
    const scrollRange = maxScroll - minScroll;
    const scrollProgress = (scrollY - minScroll) / scrollRange;
    return 1 - (scrollProgress * 0.15);
  };

  return { scrolled, scrollY, getHeaderOpacity };
};

export const useMenuState = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    let timeoutId;
    if (hamburgerOpen) {
      timeoutId = setTimeout(() => setMenuVisible(true), 10);
    }
    return () => clearTimeout(timeoutId);
  }, [hamburgerOpen]);

  useEffect(() => {
    if (hamburgerOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    };
  }, [hamburgerOpen]);

  const openHamburgerMenu = () => setHamburgerOpen(true);

  const closeHamburgerMenu = () => {
    setMenuVisible(false);
    setTimeout(() => setHamburgerOpen(false), 400);
  };

  const toggleDropdown = (key) => {
    if (!dropdownOpen[key]) {
      const newDropdowns = {};
      Object.keys(dropdownOpen).forEach(k => {
        newDropdowns[k] = k === key;
      });
      newDropdowns[key] = true;
      setDropdownOpen(newDropdowns);
    } else {
      setDropdownOpen(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  return {
    hamburgerOpen,
    menuVisible,
    dropdownOpen,
    openHamburgerMenu,
    closeHamburgerMenu,
    toggleDropdown
  };
};