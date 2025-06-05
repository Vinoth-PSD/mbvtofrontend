import { useEffect } from 'react';

const GoogleAnalytics = () => {
  useEffect(() => {
    // Load the Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-J5CB1Y1M5W';
    document.head.appendChild(script1);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-J5CB1Y1M5W');

    // Cleanup function
    return () => {
      document.head.removeChild(script1);
    };
  }, []);

  return null;
};

export default GoogleAnalytics; 