import { useState, useEffect, useCallback } from "react";

export default function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // 서버 사이드 렌더링 방지
    if (typeof window === 'undefined') return false;
    
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // 컴포넌트 마운트 시 DOM과 동기화
  useEffect(() => {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    let shouldBeDark = false;

    if (savedTheme) {
      shouldBeDark = savedTheme === "dark";
    } else {
      shouldBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    // 상태와 DOM이 다르면 DOM을 상태에 맞춤
    if (shouldBeDark !== isDarkMode) {
      setIsDarkMode(shouldBeDark);
    }

    // DOM 클래스 설정
    if (shouldBeDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, []); // 빈 배열로 마운트 시에만 실행

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

  // isDarkMode 상태가 변경될 때 DOM 동기화 (안전장치)
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