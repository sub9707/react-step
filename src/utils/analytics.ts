import ReactGA from 'react-ga4';

const TRACKING_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';

export const initGA = () => {
  if (!TRACKING_ID) {
    console.warn('GA4 측정 ID가 설정되지 않았습니다.');
    return;
  }

  try {
    ReactGA.initialize(TRACKING_ID, {
      testMode: process.env.NODE_ENV === 'test',
      gtagOptions: {
        debug_mode: process.env.NODE_ENV === 'development',
      },
    });
    
    console.log('GA4 초기화 완료');
  } catch (error) {
    console.error('GA4 초기화 실패:', error);
  }
};

// 페이지뷰 추적
export const trackPageView = (path: string, title?: string) => {
  ReactGA.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
  });
};

// 이벤트 추적
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  ReactGA.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// 사용자 정의 이벤트
export const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  ReactGA.gtag('event', eventName, parameters);
};