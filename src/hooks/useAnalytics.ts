import { useCallback } from 'react';
import { trackEvent, trackCustomEvent } from '../utils/analytics';

export const useAnalytics = () => {
  const trackButtonClick = useCallback((buttonName: string) => {
    trackEvent('click', 'button', buttonName);
  }, []);

  const trackFormSubmit = useCallback((formName: string) => {
    trackEvent('submit', 'form', formName);
  }, []);

  const trackSearch = useCallback((searchTerm: string) => {
    trackCustomEvent('search', {
      search_term: searchTerm,
    });
  }, []);

  const trackPurchase = useCallback((transactionId: string, value: number) => {
    trackCustomEvent('purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'KRW',
    });
  }, []);

  return {
    trackButtonClick,
    trackFormSubmit,
    trackSearch,
    trackPurchase,
  };
};