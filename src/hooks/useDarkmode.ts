import { useState, useEffect, useCallback } from "react";

export default function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // 서버 사이드 렌더링 환경에서는 기본값 false (light) 반환
    if (typeof window === 'undefined') return false;
    
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    
    // localStorage에 저장된 값이 없으면 기본값으로 light 사용
    // (시스템 설정 무시하고 항상 light가 기본)
    return false;
  });

  // 컴포넌트 마운트 시 DOM과 localStorage 동기화
  useEffect(() => {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    
    let shouldBeDark = false;
    
    if (savedTheme) {
      shouldBeDark = savedTheme === "dark";
    } else {
      // localStorage에 값이 없으면 기본값 light로 설정하고 저장
      shouldBeDark = false;
      localStorage.setItem("theme", "light");
    }

    // 상태 업데이트 (필요한 경우만)
    if (shouldBeDark !== isDarkMode) {
      setIsDarkMode(shouldBeDark);
    }

    // DOM 클래스 설정
    if (shouldBeDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, []); // 마운트 시에만 실행

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
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
  }, []);

  // isDarkMode 상태 변경 시 DOM 동기화
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDarkMode]);

  return { isDarkMode, toggleDarkMode };
}