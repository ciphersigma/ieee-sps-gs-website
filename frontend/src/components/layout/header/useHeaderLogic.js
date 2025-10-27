// src/components/layout/header/useHeaderLogic.js
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useHeaderLogic = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const location = useLocation();
  const menuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle menu animation timing
  useEffect(() => {
    let timeoutId;
    if (hamburgerOpen) {
      timeoutId = setTimeout(() => setMenuVisible(true), 10);
    }
    return () => clearTimeout(timeoutId);
  }, [hamburgerOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeHamburgerMenu();
      }
    };

    if (hamburgerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hamburgerOpen]);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = hamburgerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [hamburgerOpen]);

  const getHeaderOpacity = () => {
    const minScroll = 20;
    const maxScroll = 200;
    
    if (scrollY <= minScroll) return 1;
    if (scrollY >= maxScroll) return 0.85;
    
    const scrollRange = maxScroll - minScroll;
    const scrollProgress = (scrollY - minScroll) / scrollRange;
    return 1 - (scrollProgress * 0.15);
  };

  const openHamburgerMenu = () => {
    setHamburgerOpen(true);
    document.body.classList.add('menu-open');
  };

  const closeHamburgerMenu = () => {
    setMenuVisible(false);
    setTimeout(() => {
      setHamburgerOpen(false);
      document.body.classList.remove('menu-open');
    }, 400);
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

  const isActive = (path) => location.pathname === path;

  return {
    scrolled,
    scrollY,
    hamburgerOpen,
    menuVisible,
    dropdownOpen,
    menuRef,
    getHeaderOpacity,
    openHamburgerMenu,
    closeHamburgerMenu,
    toggleDropdown,
    isActive
  };
};