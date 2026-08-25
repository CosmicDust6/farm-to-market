import { createContext, useContext, useMemo, useState } from 'react';

const copy = {
  en: {
    // Nav / shell
    home: 'Home', cropPrediction: 'Crop Prediction', pricePrediction: 'Price Prediction',
    buyerLogin: 'Buyer Login', adminLogin: 'Admin Login', farmerSupport: 'Farmer Support',
    language: 'हिंदी', welcome: 'Better decisions, season after season',
    logout: 'Logout', farmerLoginNav: 'Farmer Login',
    footerTagline: 'Practical market intelligence for farmers.',
    privacy: 'Privacy', terms: 'Terms', contact: 'Contact', copyright: '© 2024 AgriIntel',

    // Home
    heroTitle: 'Know your crop. Know your market.', heroText: 'Clear mandi prices, useful predictions, and buyer access built for Indian farmers.',
    explore: 'Explore tools', livePrices: 'Live crop prices', updated: 'Updated today',
    todaysSnapshot: "Today's snapshot", todaysMarket: "Today's market", pricesUpdated: 'Prices updated', acrossTelangana: 'Across Telangana mandis',
    planWithConfidence: 'Plan with confidence', toolsHeading: 'Simple tools for every season',
    soilWeather: 'Soil + weather', cropFeatureTitle: 'Crop Prediction', cropFeatureText: 'Find a suitable crop using your local field conditions.', startAssessment: 'Start assessment',
    planYourSale: 'Plan your sale', priceFeatureTitle: 'Price Prediction', priceFeatureText: 'See a clear forecast before deciding when to sell.', viewForecasts: 'View forecasts',
    verifiedAccess: 'Verified access', readyConnect: 'Ready to connect with buyers?', farmerCtaText: 'Buyer details stay protected. Sign in with your official Farmer ID to view and contact verified buyers.',
    farmerLoginCta: 'Farmer Login',
    supportTitle: 'Need help with your farm?', supportText: 'Connect with a nearby agricultural support organisation for guidance and services.',
    contactSupport: 'Contact support NGO', verified: 'Verified Farmer',
    serviceNote: 'Service-only feature. It does not create an NGO account or share buyer information.',
    ngoLoginRequired: 'Login required for NGO contact', ngoLoginRequiredText: 'Sign in with your Farmer ID to unlock the Call / Contact NGO button.',

    offline: 'Offline mode: showing saved information', online: 'Online',

    // Farmer support page
    supportEyebrow: 'Farmer support service', supportPageTitle: 'Find agricultural support near you.',
    supportPageText: 'Share your district and the type of help you need. This service request can later be connected to the support API and NGO directory.',
    district: 'District', selectDistrict: 'Select district', supportType: 'Type of support', selectSupportType: 'Select support type',
    cropGuidance: 'Crop guidance', marketAccess: 'Market access', govSchemeGuidance: 'Government scheme guidance', soilIrrigationSupport: 'Soil or irrigation support',
    briefDescribe: 'Briefly describe the help you need',
    requestSupport: 'Request support', requestSent: 'Support request ready',
    requestSentText: 'Your request has been recorded in this frontend demo. It will be sent to the support service once the backend is connected.',
    nearestOrgNote: 'Nearest-organisation matching will use a trusted NGO directory and the farmer’s verified location when those backend data sources are available.',
    privacyLabel: 'Privacy', privacyNote: 'Your Farmer ID and buyer information are not shared through this support service.',
    callNgo: 'Call NGO', callNgoNote: 'This will place a call to the matched support NGO once phone integration is connected.',
    ngoLockedTitle: 'Sign in to contact the NGO', ngoLockedText: 'The Call / Contact NGO button unlocks once your Farmer ID is verified.',
    goToFarmerLogin: 'Go to Farmer Login',

    // Crop prediction
    cropPlanningAssistant: 'Crop planning assistant', findRightCrop: 'Find the right crop for your field.',
    shareConditions: 'Share a few conditions to receive a simple, mock recommendation.',
    districtPlaceholder: 'e.g. Warangal',
    soilType: 'Soil type', selectSoilType: 'Select soil type', blackSoil: 'Black soil', redSoil: 'Red soil', loamySoil: 'Loamy soil',
    waterAvailability: 'Water availability', selectAvailability: 'Select availability', low: 'Low', medium: 'Medium', high: 'High',
    season: 'Season', selectSeason: 'Select season', kharif: 'Kharif', rabi: 'Rabi', summer: 'Summer',
    getRecommendation: 'Get recommendation', sampleResult: 'Sample result',
    wheatMaySuit: 'Wheat may suit your conditions', basedOnSample: 'Based on the sample field conditions, wheat is shown as a balanced option with moderate water needs.',
    tip: 'Tip', confirmLocalAdvice: 'Confirm local soil and weather advice before making a planting decision.',

    // Price prediction (guest)
    sellingDecisionAssistant: 'Selling decision assistant', planHarvestSale: 'Plan your harvest sale.',
    exploreSampleForecast: 'Explore a sample price forecast, then verify your Farmer ID to access protected buyer details.',
    cropLabel: 'Crop', selectCrop: 'Select crop', wheat: 'Wheat', rice: 'Rice', cotton: 'Cotton',
    marketLocation: 'Market location', marketLocationPlaceholder: 'e.g. Hyderabad',
    expectedHarvestMonth: 'Expected harvest month', selectMonth: 'Select month', october: 'October', november: 'November', december: 'December',
    generateForecast: 'Generate forecast', sampleForecast: 'Sample forecast', wheatPriceOutlook: 'Wheat price outlook',
    estimatedIncrease: 'Estimated 2.8% increase', buyerDetailsProtected: 'Buyer details are protected',
    onlyVerifiedFarmers: 'Only verified farmers can view or contact buyers.', verifyFarmerId: 'Verify Farmer ID',

    // Verified price prediction
    verifiedFarmerWorkspace: 'Verified farmer workspace', yourPriceOutlook: 'Your price outlook and buyer opportunities.',
    sampleListingsDemo: 'These are sample listings for the frontend demo.',
    wheatForecast: 'Wheat forecast', expectedMandiRange: 'Expected mandi range', positiveTrend: 'Positive short-term trend',
    protectedListings: 'Protected listings', verifiedBuyers: 'Verified buyers', contactBuyer: 'Contact buyer',
    loginToViewBuyers: 'Sign in with your Farmer ID', loginToViewBuyersText: 'Verified buyer contacts unlock once your Farmer ID is confirmed.',

    // Buyer login / signup / portal
    buyerPortalEyebrow: 'Buyer portal', manageRequirements: 'Manage your crop requirements',
    signInText: 'Sign in to create and update the requirements verified farmers can view.',
    emailAddress: 'Email address', emailPlaceholder: 'you@business.com', password: 'Password', passwordPlaceholder: 'Enter password',
    buyerLoginBtn: 'Buyer Login', newBuyer: 'New buyer?', createAccount: 'Create an account',
    buyerRegistration: 'Buyer registration', createBuyerAccount: 'Create your buyer account',
    registerBusinessText: 'Register your business to post crop requirements for verified farmers.',
    businessName: 'Business name', businessNamePlaceholder: 'Enter business name',
    mobileNumber: 'Mobile number', mobilePlaceholder: '10-digit mobile number',
    businessLocation: 'Business location', businessLocationPlaceholder: 'City, State',
    createAccountBtn: 'Create account', businessVerificationNote: 'Business verification will be handled by the backend later.',
    buyerPortalLabel: 'Buyer portal', goodMorning: 'Good morning, Siri Grains.', manageCurrentReq: 'Manage your current crop requirements.',
    activeRequirements: 'Active requirements', acrossCrops: 'Across 3 crops', farmerEnquiries: 'Farmer enquiries', thisWeek: 'This week',
    verifiedResponses: 'Verified responses', readyToReview: 'Ready to review', yourListings: 'Your listings', activeReq2: 'Active requirements',
    filter: 'Filter', deliveryNear: 'Delivery near', editListing: 'Edit listing',

    createListing: 'Create listing', myListings: 'My listings', cropCategory: 'Product category', mainCrop: 'Main crop', byProduct: 'By-product / residue',
    location: 'Location', crop: 'Crop', quantity: 'Quantity', quantityPlaceholder: 'e.g. 500 quintals', description: 'Description', postRequirement: 'Post requirement',
    requirementTitle: 'Tell farmers what you need.', requirementText: 'Create a clear crop or by-product requirement for verified farmers.',
    selectCategory: 'Select category', selectProduct: 'Select product', selectLocation: 'Select location',
    targetPrice: 'Target price', targetPricePlaceholder: 'e.g. ₹2,500 / quintal',
    structuredMatching: 'Structured matching', useStandardValues: 'Use standard values for better matches.',
    cropByProductNote: 'Crop, by-product, and location choices are controlled so buyer-farmer matching is not affected by spelling variations.',
    nextIntegration: 'Next integration', nextIntegrationNote: 'This form will submit to POST /api/requests after buyer JWT authentication is connected.',
    requirementReady: 'Requirement ready', requirementCreated: 'Your sample requirement has been created.',

    // Admin
    administration: 'Administration', adminPortalAccess: 'Admin portal access', useAdminCredentials: 'Use your admin credentials to review platform activity.',
    adminEmail: 'Admin email', adminEmailPlaceholder: 'admin@agriintel.in', adminLoginBtn: 'Admin Login', demoInterfaceNote: 'Demo interface only. No real authentication is implemented.',
    platformOverview: 'Platform overview', sampleInfo: 'Sample information for the frontend dashboard.', exportReport: 'Export report',
    verifiedFarmers: 'Verified farmers', thisMonth: '+86 this month', activeBuyers: 'Active buyers', pendingReviewCount: '12 pending review',
    liveListings: 'Live listings', acrossMarkets: 'Across 18 markets', reviewQueue: 'Review queue', recentBuyerReg: 'Recent buyer registrations',
    pending: 'pending', registrationSubmitted: 'Registration submitted today · Business verification pending', review: 'Review', flag: 'Flag',

    // Farmer login
    farmerVerification: 'Farmer verification', welcomeBack: 'Welcome back to your market',
    verifyDetailsText: 'Verify your details against the official Farmer Registry to unlock buyer access.',
    farmerNameLabel: 'Farmer name', farmerNamePlaceholder: 'Enter your full name', officialFarmerId: 'Official Farmer ID', farmerIdPlaceholder: 'Enter Farmer ID',
    verifyAndContinue: 'Verify and continue', frontendDemoNote: 'This is a frontend demo. Registry verification will be connected later.',
  },
  hi: {
    // Nav / shell
    home: 'होम', cropPrediction: 'फसल सुझाव', pricePrediction: 'मूल्य पूर्वानुमान',
    buyerLogin: 'खरीदार लॉगिन', adminLogin: 'एडमिन लॉगिन', farmerSupport: 'किसान सहायता',
    language: 'English', welcome: 'हर मौसम में बेहतर निर्णय',
    logout: 'लॉगआउट', farmerLoginNav: 'किसान लॉगिन',
    footerTagline: 'किसानों के लिए व्यावहारिक बाज़ार जानकारी।',
    privacy: 'गोपनीयता', terms: 'नियम', contact: 'संपर्क करें', copyright: '© 2024 AgriIntel',

    // Home
    heroTitle: 'अपनी फसल जानें। अपना बाज़ार जानें।', heroText: 'स्पष्ट मंडी भाव, उपयोगी अनुमान और किसानों के लिए खरीदार तक सुरक्षित पहुँच।',
    explore: 'उपकरण देखें', livePrices: 'आज के फसल भाव', updated: 'आज अपडेट किया गया',
    todaysSnapshot: 'आज की झलक', todaysMarket: 'आज का बाज़ार', pricesUpdated: 'भाव अपडेट किए गए', acrossTelangana: 'तेलंगाना की मंडियों में',
    planWithConfidence: 'भरोसे के साथ योजना बनाएँ', toolsHeading: 'हर मौसम के लिए सरल उपकरण',
    soilWeather: 'मिट्टी + मौसम', cropFeatureTitle: 'फसल सुझाव', cropFeatureText: 'अपने स्थानीय खेत की स्थिति के आधार पर उपयुक्त फसल जानें।', startAssessment: 'आकलन शुरू करें',
    planYourSale: 'बिक्री की योजना बनाएँ', priceFeatureTitle: 'मूल्य पूर्वानुमान', priceFeatureText: 'बेचने का निर्णय लेने से पहले स्पष्ट पूर्वानुमान देखें।', viewForecasts: 'पूर्वानुमान देखें',
    verifiedAccess: 'सत्यापित पहुँच', readyConnect: 'खरीदारों से जुड़ने के लिए तैयार हैं?', farmerCtaText: 'खरीदार की जानकारी सुरक्षित रहती है। सत्यापित खरीदारों को देखने और संपर्क करने के लिए अपनी आधिकारिक किसान ID से साइन इन करें।',
    farmerLoginCta: 'किसान लॉगिन',
    supportTitle: 'खेती के लिए सहायता चाहिए?', supportText: 'मार्गदर्शन और सेवाओं के लिए नज़दीकी कृषि सहायता संगठन से जुड़ें।',
    contactSupport: 'सहायता NGO से संपर्क करें', verified: 'सत्यापित किसान',
    serviceNote: 'यह केवल सेवा सुविधा है। इससे कोई NGO खाता नहीं बनता और न ही खरीदार की जानकारी साझा होती है।',
    ngoLoginRequired: 'NGO से संपर्क के लिए लॉगिन आवश्यक', ngoLoginRequiredText: 'Call / Contact NGO बटन अनलॉक करने के लिए अपनी किसान ID से साइन इन करें।',

    offline: 'ऑफलाइन मोड: सहेजी हुई जानकारी दिखाई जा रही है', online: 'ऑनलाइन',

    // Farmer support page
    supportEyebrow: 'किसान सहायता सेवा', supportPageTitle: 'अपने पास कृषि सहायता पाएँ।',
    supportPageText: 'अपना जिला और मदद का प्रकार चुनें। बाद में यह अनुरोध सहायता API और NGO निर्देशिका से जोड़ा जाएगा।',
    district: 'जिला', selectDistrict: 'जिला चुनें', supportType: 'सहायता का प्रकार', selectSupportType: 'सहायता का प्रकार चुनें',
    cropGuidance: 'फसल मार्गदर्शन', marketAccess: 'बाज़ार पहुँच', govSchemeGuidance: 'सरकारी योजना मार्गदर्शन', soilIrrigationSupport: 'मिट्टी या सिंचाई सहायता',
    briefDescribe: 'संक्षेप में बताएं कि आपको किस मदद की ज़रूरत है',
    requestSupport: 'सहायता माँगें', requestSent: 'सहायता अनुरोध तैयार है',
    requestSentText: 'इस फ्रंटएंड डेमो में आपका अनुरोध दर्ज किया गया है। बैकएंड जुड़ने पर इसे सहायता सेवा को भेजा जाएगा।',
    nearestOrgNote: 'ये बैकएंड डेटा स्रोत उपलब्ध होने पर, नज़दीकी संगठन मिलान एक विश्वसनीय NGO निर्देशिका और किसान के सत्यापित स्थान का उपयोग करेगा।',
    privacyLabel: 'गोपनीयता', privacyNote: 'इस सहायता सेवा के ज़रिए आपकी किसान ID और खरीदार जानकारी साझा नहीं की जाती।',
    callNgo: 'NGO को कॉल करें', callNgoNote: 'फोन एकीकरण जुड़ने के बाद यह मिलान की गई सहायता NGO को कॉल करेगा।',
    ngoLockedTitle: 'NGO से संपर्क करने के लिए साइन इन करें', ngoLockedText: 'आपकी किसान ID सत्यापित होते ही Call / Contact NGO बटन अनलॉक हो जाएगा।',
    goToFarmerLogin: 'किसान लॉगिन पर जाएँ',

    // Crop prediction
    cropPlanningAssistant: 'फसल योजना सहायक', findRightCrop: 'अपने खेत के लिए सही फसल खोजें।',
    shareConditions: 'सरल, नमूना सुझाव पाने के लिए कुछ जानकारी साझा करें।',
    districtPlaceholder: 'जैसे वारंगल',
    soilType: 'मिट्टी का प्रकार', selectSoilType: 'मिट्टी का प्रकार चुनें', blackSoil: 'काली मिट्टी', redSoil: 'लाल मिट्टी', loamySoil: 'दोमट मिट्टी',
    waterAvailability: 'पानी की उपलब्धता', selectAvailability: 'उपलब्धता चुनें', low: 'कम', medium: 'मध्यम', high: 'अधिक',
    season: 'मौसम', selectSeason: 'मौसम चुनें', kharif: 'खरीफ', rabi: 'रबी', summer: 'ज़ायद',
    getRecommendation: 'सुझाव पाएँ', sampleResult: 'नमूना परिणाम',
    wheatMaySuit: 'गेहूं आपकी स्थितियों के लिए उपयुक्त हो सकता है', basedOnSample: 'नमूना खेत की स्थितियों के आधार पर, गेहूं को मध्यम पानी की आवश्यकता वाले संतुलित विकल्प के रूप में दिखाया गया है।',
    tip: 'सुझाव', confirmLocalAdvice: 'बुवाई का निर्णय लेने से पहले स्थानीय मिट्टी और मौसम की सलाह की पुष्टि करें।',

    // Price prediction (guest)
    sellingDecisionAssistant: 'बिक्री निर्णय सहायक', planHarvestSale: 'अपनी फसल बिक्री की योजना बनाएँ।',
    exploreSampleForecast: 'नमूना मूल्य पूर्वानुमान देखें, फिर सुरक्षित खरीदार जानकारी पाने के लिए अपनी किसान ID सत्यापित करें।',
    cropLabel: 'फसल', selectCrop: 'फसल चुनें', wheat: 'गेहूं', rice: 'चावल', cotton: 'कपास',
    marketLocation: 'बाज़ार स्थान', marketLocationPlaceholder: 'जैसे हैदराबाद',
    expectedHarvestMonth: 'अनुमानित फसल कटाई महीना', selectMonth: 'महीना चुनें', october: 'अक्टूबर', november: 'नवंबर', december: 'दिसंबर',
    generateForecast: 'पूर्वानुमान बनाएँ', sampleForecast: 'नमूना पूर्वानुमान', wheatPriceOutlook: 'गेहूं मूल्य दृष्टिकोण',
    estimatedIncrease: 'अनुमानित 2.8% वृद्धि', buyerDetailsProtected: 'खरीदार की जानकारी सुरक्षित है',
    onlyVerifiedFarmers: 'केवल सत्यापित किसान ही खरीदारों को देख या उनसे संपर्क कर सकते हैं।', verifyFarmerId: 'किसान ID सत्यापित करें',

    // Verified price prediction
    verifiedFarmerWorkspace: 'सत्यापित किसान कार्यक्षेत्र', yourPriceOutlook: 'आपका मूल्य दृष्टिकोण और खरीदार अवसर।',
    sampleListingsDemo: 'ये फ्रंटएंड डेमो के लिए नमूना लिस्टिंग हैं।',
    wheatForecast: 'गेहूं पूर्वानुमान', expectedMandiRange: 'अनुमानित मंडी सीमा', positiveTrend: 'सकारात्मक अल्पकालिक रुझान',
    protectedListings: 'सुरक्षित लिस्टिंग', verifiedBuyers: 'सत्यापित खरीदार', contactBuyer: 'खरीदार से संपर्क करें',
    loginToViewBuyers: 'अपनी किसान ID से साइन इन करें', loginToViewBuyersText: 'आपकी किसान ID की पुष्टि होते ही सत्यापित खरीदार संपर्क अनलॉक हो जाएँगे।',

    // Buyer login / signup / portal
    buyerPortalEyebrow: 'खरीदार पोर्टल', manageRequirements: 'अपनी फसल आवश्यकताएँ प्रबंधित करें',
    signInText: 'सत्यापित किसानों को दिखने वाली आवश्यकताएँ बनाने और अपडेट करने के लिए साइन इन करें।',
    emailAddress: 'ईमेल पता', emailPlaceholder: 'you@business.com', password: 'पासवर्ड', passwordPlaceholder: 'पासवर्ड दर्ज करें',
    buyerLoginBtn: 'खरीदार लॉगिन', newBuyer: 'नए खरीदार हैं?', createAccount: 'खाता बनाएँ',
    buyerRegistration: 'खरीदार पंजीकरण', createBuyerAccount: 'अपना खरीदार खाता बनाएँ',
    registerBusinessText: 'सत्यापित किसानों के लिए फसल आवश्यकताएँ पोस्ट करने हेतु अपना व्यवसाय पंजीकृत करें।',
    businessName: 'व्यवसाय का नाम', businessNamePlaceholder: 'व्यवसाय का नाम दर्ज करें',
    mobileNumber: 'मोबाइल नंबर', mobilePlaceholder: '10 अंकों का मोबाइल नंबर',
    businessLocation: 'व्यवसाय स्थान', businessLocationPlaceholder: 'शहर, राज्य',
    createAccountBtn: 'खाता बनाएँ', businessVerificationNote: 'व्यवसाय सत्यापन बाद में बैकएंड द्वारा किया जाएगा।',
    buyerPortalLabel: 'खरीदार पोर्टल', goodMorning: 'सुप्रभात, सिरी ग्रेन्स।', manageCurrentReq: 'अपनी वर्तमान फसल आवश्यकताएँ प्रबंधित करें।',
    activeRequirements: 'सक्रिय आवश्यकताएँ', acrossCrops: '3 फसलों में', farmerEnquiries: 'किसान पूछताछ', thisWeek: 'इस सप्ताह',
    verifiedResponses: 'सत्यापित प्रतिक्रियाएँ', readyToReview: 'समीक्षा के लिए तैयार', yourListings: 'आपकी लिस्टिंग', activeReq2: 'सक्रिय आवश्यकताएँ',
    filter: 'फ़िल्टर', deliveryNear: 'डिलीवरी स्थान', editListing: 'लिस्टिंग संपादित करें',

    createListing: 'लिस्टिंग बनाएँ', myListings: 'मेरी लिस्टिंग', cropCategory: 'उत्पाद श्रेणी', mainCrop: 'मुख्य फसल', byProduct: 'उप-उत्पाद / अवशेष',
    location: 'स्थान', crop: 'फसल', quantity: 'मात्रा', quantityPlaceholder: 'जैसे 500 क्विंटल', description: 'विवरण', postRequirement: 'माँग पोस्ट करें',
    requirementTitle: 'किसानों को अपनी आवश्यकता बताएँ।', requirementText: 'सत्यापित किसानों के लिए फसल या उप-उत्पाद की स्पष्ट आवश्यकता बनाएँ।',
    selectCategory: 'श्रेणी चुनें', selectProduct: 'उत्पाद चुनें', selectLocation: 'स्थान चुनें',
    targetPrice: 'लक्ष्य मूल्य', targetPricePlaceholder: 'जैसे ₹2,500 / क्विंटल',
    structuredMatching: 'संरचित मिलान', useStandardValues: 'बेहतर मिलान के लिए मानक मान उपयोग करें।',
    cropByProductNote: 'फसल, उप-उत्पाद और स्थान चयन नियंत्रित हैं ताकि वर्तनी की भिन्नताओं से खरीदार-किसान मिलान प्रभावित न हो।',
    nextIntegration: 'अगला एकीकरण', nextIntegrationNote: 'खरीदार JWT प्रमाणीकरण जुड़ने के बाद यह फॉर्म POST /api/requests पर सबमिट होगा।',
    requirementReady: 'आवश्यकता तैयार है', requirementCreated: 'आपकी नमूना आवश्यकता बना दी गई है।',

    // Admin
    administration: 'प्रशासन', adminPortalAccess: 'एडमिन पोर्टल पहुँच', useAdminCredentials: 'प्लेटफ़ॉर्म गतिविधि की समीक्षा के लिए अपने एडमिन क्रेडेंशियल का उपयोग करें।',
    adminEmail: 'एडमिन ईमेल', adminEmailPlaceholder: 'admin@agriintel.in', adminLoginBtn: 'एडमिन लॉगिन', demoInterfaceNote: 'यह केवल डेमो इंटरफ़ेस है। कोई वास्तविक प्रमाणीकरण लागू नहीं है।',
    platformOverview: 'प्लेटफ़ॉर्म अवलोकन', sampleInfo: 'फ्रंटएंड डैशबोर्ड के लिए नमूना जानकारी।', exportReport: 'रिपोर्ट निर्यात करें',
    verifiedFarmers: 'सत्यापित किसान', thisMonth: 'इस महीने +86', activeBuyers: 'सक्रिय खरीदार', pendingReviewCount: '12 समीक्षा लंबित',
    liveListings: 'लाइव लिस्टिंग', acrossMarkets: '18 बाज़ारों में', reviewQueue: 'समीक्षा कतार', recentBuyerReg: 'हाल के खरीदार पंजीकरण',
    pending: 'लंबित', registrationSubmitted: 'पंजीकरण आज सबमिट किया गया · व्यवसाय सत्यापन लंबित', review: 'समीक्षा करें', flag: 'फ़्लैग करें',

    // Farmer login
    farmerVerification: 'किसान सत्यापन', welcomeBack: 'अपने बाज़ार में वापसी पर स्वागत है',
    verifyDetailsText: 'खरीदार पहुँच अनलॉक करने के लिए अपनी जानकारी आधिकारिक किसान रजिस्ट्री से सत्यापित करें।',
    farmerNameLabel: 'किसान का नाम', farmerNamePlaceholder: 'अपना पूरा नाम दर्ज करें', officialFarmerId: 'आधिकारिक किसान ID', farmerIdPlaceholder: 'किसान ID दर्ज करें',
    verifyAndContinue: 'सत्यापित करें और जारी रखें', frontendDemoNote: 'यह एक फ्रंटएंड डेमो है। रजिस्ट्री सत्यापन बाद में जोड़ा जाएगा।',
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
