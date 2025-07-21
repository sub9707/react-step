import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-[#3e3e3e] hover:bg-[#2b2b2b] dark:bg-[#f8f8f8] dark:hover:bg-[#c2c2c2] text-white dark:text-[#2b2b2b] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
          aria-label="맨 위로 이동"
        >
          <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;