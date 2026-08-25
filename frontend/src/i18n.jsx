import { createContext, useContext, useMemo, useState } from 'react';

const copy = {
  en: {
    home: 'Home', cropPrediction: 'Crop Prediction', pricePrediction: 'Price Prediction',
    buyerLogin: 'Buyer Login', adminLogin: 'Admin Login', farmerSupport: 'Farmer Support',
    language: 'हिंदी', welcome: 'Better decisions, season after season',
    heroTitle: 'Know your crop. Know your market.', heroText: 'Clear mandi prices, useful predictions, and buyer access built for Indian farmers.',
    explore: 'Explore tools', livePrices: 'Live crop prices', updated: 'Updated today',
    supportTitle: 'Need help with your farm?', supportText: 'Connect with a nearby agricultural support organisation for guidance and services.',
    contactSupport: 'Contact support NGO', verified: 'Verified Farmer',
    offline: 'Offline mode: showing saved information', online: 'Online',
    supportEyebrow: 'Farmer support service', supportPageTitle: 'Find agricultural support near you.',
    supportPageText: 'Share your district and the type of help you need. This service request can later be connected to the support API and NGO directory.',
    district: 'District', supportType: 'Type of support', requestSupport: 'Request support',
    requestSent: 'Support request ready', requestSentText: 'Your request has been recorded in this frontend demo. It will be sent to the support service once the backend is connected.',
    createListing: 'Create listing', myListings: 'My listings', cropCategory: 'Product category', mainCrop: 'Main crop', byProduct: 'By-product / residue',
    location: 'Location', crop: 'Crop', quantity: 'Quantity', description: 'Description', postRequirement: 'Post requirement',
    requirementTitle: 'Tell farmers what you need.', requirementText: 'Create a clear crop or by-product requirement for verified farmers.',
  },
  hi: {
    home: 'होम', cropPrediction: 'फसल सुझाव', pricePrediction: 'मूल्य पूर्वानुमान',
    buyerLogin: 'खरीदार लॉगिन', adminLogin: 'एडमिन लॉगिन', farmerSupport: 'किसान सहायता',
    language: 'English', welcome: 'हर मौसम में बेहतर निर्णय',
    heroTitle: 'अपनी फसल जानें। अपना बाज़ार जानें।', heroText: 'स्पष्ट मंडी भाव, उपयोगी अनुमान और किसानों के लिए खरीदार तक सुरक्षित पहुँच।',
    explore: 'उपकरण देखें', livePrices: 'आज के फसल भाव', updated: 'आज अपडेट किया गया',
    supportTitle: 'खेती के लिए सहायता चाहिए?', supportText: 'मार्गदर्शन और सेवाओं के लिए नज़दीकी कृषि सहायता संगठन से जुड़ें।',
    contactSupport: 'सहायता NGO से संपर्क करें', verified: 'सत्यापित किसान',
    offline: 'ऑफलाइन मोड: सहेजी हुई जानकारी दिखाई जा रही है', online: 'ऑनलाइन',
    supportEyebrow: 'किसान सहायता सेवा', supportPageTitle: 'अपने पास कृषि सहायता पाएँ।',
    supportPageText: 'अपना जिला और मदद का प्रकार चुनें। बाद में यह अनुरोध सहायता API और NGO निर्देशिका से जोड़ा जाएगा।',
    district: 'जिला', supportType: 'सहायता का प्रकार', requestSupport: 'सहायता माँगें',
    requestSent: 'सहायता अनुरोध तैयार है', requestSentText: 'इस फ्रंटएंड डेमो में आपका अनुरोध दर्ज किया गया है। बैकएंड जुड़ने पर इसे सहायता सेवा को भेजा जाएगा।',
    createListing: 'लिस्टिंग बनाएँ', myListings: 'मेरी लिस्टिंग', cropCategory: 'उत्पाद श्रेणी', mainCrop: 'मुख्य फसल', byProduct: 'उप-उत्पाद / अवशेष',
    location: 'स्थान', crop: 'फसल', quantity: 'मात्रा', description: 'विवरण', postRequirement: 'माँग पोस्ट करें',
    requirementTitle: 'किसानों को अपनी आवश्यकता बताएँ।', requirementText: 'सत्यापित किसानों के लिए फसल या उप-उत्पाद की स्पष्ट आवश्यकता बनाएँ।',
  },
};

const I18nContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('agriintel-language') || 'en');
  const value = useMemo(() => ({
    language,
    setLanguage: (nextLanguage) => {
      localStorage.setItem('agriintel-language', nextLanguage);
      setLanguage(nextLanguage);
    },
    t: (key) => copy[language][key] || copy.en[key] || key,
  }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside LanguageProvider');
  return context;
}
