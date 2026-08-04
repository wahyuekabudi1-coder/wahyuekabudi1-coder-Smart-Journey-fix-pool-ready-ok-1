import React from 'react';
import ShareTourMain from '../sharetour/App';
import { LanguageCurrencyProvider } from '../sharetour/LanguageCurrencyContext';

export default function ShareTourView() {
  return (
    <LanguageCurrencyProvider>
      <ShareTourMain />
    </LanguageCurrencyProvider>
  );
}
