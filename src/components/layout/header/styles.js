// src/components/layout/Header/styles.js
export const headerStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  body.menu-open {
    position: relative;
  }
  
  button, a {
    transition-property: color, background-color, border-color, transform, scale, opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
  }
  
  .hover\\\\:scale-105:hover {
    transform: scale(1.05);
  }
  
  .hover\\\\:scale-110:hover {
    transform: scale(1.1);
  }
`;