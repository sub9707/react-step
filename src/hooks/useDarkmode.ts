import { useState, useEffect, useCallback } from "react";

export default function useDarkMode() {
  // 초기 상태 undefined
  const [isDarkMode, setIsDarkMode] = useState<boolean | undefined>(undefined);

  // 초기화 함수
  const initializeTheme = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const html = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    let shouldBeDark = false;
    
    if (savedTheme) {
      shouldBeDark = savedTheme === "dark";
    } else {
      shouldBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    
    // DOM 먼저 설정
    if (shouldBeDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    
    // 상태 설정
    setIsDarkMode(shouldBeDark);
  }, []);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    if (isDarkMode === undefined) return; 
    
    setIsDarkMode((prev) => {
      const newMode = !prev;
      const html = document.documentElement;
      
      if (newMode) {
        html.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        html.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      
      return newMode;
    });
  }, [isDarkMode]);

  // 상태 변경 시 DOM 동기화 (안전장치)
  useEffect(() => {
    if (isDarkMode === undefined) return;
    
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDarkMode]);

  return { 
    isDarkMode: isDarkMode ?? false, // undefined면 false 반환
    toggleDarkMode,
    isInitialized: isDarkMode !== undefined
  };
}