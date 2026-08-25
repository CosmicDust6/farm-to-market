import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import { LanguageProvider, useI18n } from './i18n';
import { AuthProvider, useAuth } from './auth';

const prices = [
  { crop: 'Wheat', price: '₹2,450', change: '+3.2%', trend: 'up', location: 'Hyderabad' },
  { crop: 'Rice', price: '₹3,100', change: '-1.4%', trend: 'down', location: 'Hyderabad' },
  { crop: 'Cotton', price: '₹6,200', change: '+0.8%', trend: 'up', location: 'Warangal' },
];

const buyers = [
  { name: 'Siri Grains Pvt. Ltd.', crop: 'Wheat', need: '500 quintals', place: 'Hyderabad', offer: '₹2,520 / quintal' },
  { name: 'Deccan Agro Traders', crop: 'Cotton', need: '300 quintals', place: 'Warangal', offer: '₹6,310 / quintal' },
  { name: 'Rythu Foods', crop: 'Rice', need: '700 quintals', place: 'Nizamabad', offer: '₹3,180 / quintal' },
];

function PageShell({ children, farmer = false }) {
  const { language, setLanguage, t } = useI18n();
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">Agri<span>Intel</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end>{t('home')}</NavLink>
          <NavLink to="/crop-prediction">{t('cropPrediction')}</NavLink>
          <NavLink to="/price-prediction">{t('pricePrediction')}</NavLink>
        </nav>
        <div className="header-actions">
          {farmer && <><span className="verified-badge">✓ {t('verified')}</span><Link className="support-link" to="/farmer-support">{t('farmerSupport')}</Link></>}
          <button className="language-toggle" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} type="button">{t('language')}</button>
          <Link className="button button-quiet" to="/buyer/login">{t('buyerLogin')}</Link>
          <Link className="button button-primary compact" to="/admin/login">{t('adminLogin')}</Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div><strong>Agri<span>Intel</span></strong><p>{t('footerTagline')}</p></div>
        <nav><a href="#privacy">{t('privacy')}</a><a href="#terms">{t('terms')}</a><a href="#contact">{t('contact')}</a></nav>
        <p>{t('copyright')}</p>
      </footer>
    </div>
  );
}

function PriceCard({ item }) {
  const { t } = useI18n();
  return (
    <article className="price-card">
      <div className="card-title-row"><h3>{t(item.crop.toLowerCase())}</h3><span className={`trend ${item.trend}`}>{item.trend === 'up' ? '↑' : '↓'} {item.change}</span></div>
      <p className="price-value">{item.price} <span>/ quintal</span></p>
      <p className="muted">⌖ {item.location}</p>
    </article>
  );
}

function Home() {
  const { t } = useI18n();
  const { farmerLoggedIn } = useAuth();
  return (
    <PageShell>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{t('welcome')}</p>
          <h1>{t('heroTitle')}</h1>
          <p>{t('heroText')}</p>
          <div className="hero-actions"><Link className="button button-primary" to="/crop-prediction">{t('explore')} <span>→</span></Link><a className="text-link" href="#prices">{t('livePrices')} ↓</a></div>
        </div>
        <div className="hero-visual"><div className="sun" /><div className="landscape-field field-one" /><div className="landscape-field field-two" /><div className="hero-note"><span>{t('todaysMarket')}</span><strong>{t('pricesUpdated')}</strong><small>{t('acrossTelangana')}</small></div></div>
      </section>

      <section className="content-section" id="prices">
        <div className="section-heading"><div><p className="eyebrow">{t('todaysSnapshot')}</p><h2>{t('livePrices')}</h2></div><span className="updated-dot">● {t('updated')}</span></div>
        <div className="price-grid">{prices.map((item) => <PriceCard item={item} key={item.crop} />)}</div>
      </section>

      <section className="content-section tool-section">
        <div className="section-heading"><div><p className="eyebrow">{t('planWithConfidence')}</p><h2>{t('toolsHeading')}</h2></div></div>
        <div className="tool-grid">
          <article className="feature-card crop-feature"><span className="feature-icon">⌁</span><p className="feature-label">{t('soilWeather')}</p><h3>{t('cropFeatureTitle')}</h3><p>{t('cropFeatureText')}</p><Link className="button button-primary full" to="/crop-prediction">{t('startAssessment')} <span>→</span></Link></article>
          <article className="feature-card price-feature"><span className="feature-icon">↗</span><p className="feature-label">{t('planYourSale')}</p><h3>{t('priceFeatureTitle')}</h3><p>{t('priceFeatureText')}</p><Link className="button button-light full" to="/price-prediction">{t('viewForecasts')} <span>→</span></Link></article>
        </div>
      </section>

      <section className="farmer-cta">
        <div><p className="eyebrow">{t('verifiedAccess')}</p><h2>{t('readyConnect')}</h2><p>{t('farmerCtaText')}</p></div>
        <Link className="button button-primary" to="/farmer-login">{t('farmerLoginCta')} <span>→</span></Link>
      </section>
      <section className="support-cta">
        <div>
          <p className="eyebrow">{t('supportTitle')}</p>
          <h2>{t('supportText')}</h2>
          <p className="service-note">{t('serviceNote')}</p>
        </div>
        {farmerLoggedIn && <Link className="button button-light" to="/farmer-support">{t('contactSupport')} <span>→</span></Link>}
      </section>
    </PageShell>
  );
}

function FarmerLogin() {
  const { t } = useI18n();
  const { loginFarmer } = useAuth();
  const navigate = useNavigate();
  const submit = (event) => { event.preventDefault(); loginFarmer(); navigate('/price-prediction/verified'); };
  return <PageShell><AuthCard eyebrow={t('farmerVerification')} title={t('welcomeBack')} text={t('verifyDetailsText')}><form onSubmit={submit}><Input label={t('farmerNameLabel')} placeholder={t('farmerNamePlaceholder')} /><Input label={t('mobileNumber')} placeholder={t('mobilePlaceholder')} type="tel" /><Input label={t('officialFarmerId')} placeholder={t('farmerIdPlaceholder')} /><button className="button button-primary full" type="submit">{t('verifyAndContinue')} <span>→</span></button></form><p className="form-note">{t('frontendDemoNote')}</p></AuthCard></PageShell>;
}

function CropPrediction() {
  const { t } = useI18n();
  return <PageShell><section className="page-intro"><p className="eyebrow">{t('cropPlanningAssistant')}</p><h1>{t('findRightCrop')}</h1><p>{t('shareConditions')}</p></section><section className="split-page"><form className="panel form-panel"><Input label={t('district')} placeholder={t('districtPlaceholder')} /><div className="two-fields"><Select label={t('soilType')} options={[t('selectSoilType'), t('blackSoil'), t('redSoil'), t('loamySoil')]} /><Select label={t('waterAvailability')} options={[t('selectAvailability'), t('low'), t('medium'), t('high')]} /></div><Select label={t('season')} options={[t('selectSeason'), t('kharif'), t('rabi'), t('summer')]} /><button className="button button-primary full" type="button">{t('getRecommendation')} <span>→</span></button></form><aside className="recommendation"><p className="eyebrow">{t('sampleResult')}</p><span className="recommendation-icon">🌾</span><h2>{t('wheatMaySuit')}</h2><p>{t('basedOnSample')}</p><div className="tip"><strong>{t('tip')}</strong><span>{t('confirmLocalAdvice')}</span></div></aside></section></PageShell>;
}

function PricePredictionGuest() {
  const { t } = useI18n();
  return <PageShell><section className="page-intro"><p className="eyebrow">{t('sellingDecisionAssistant')}</p><h1>{t('planHarvestSale')}</h1><p>{t('exploreSampleForecast')}</p></section><section className="split-page"><form className="panel form-panel"><Select label={t('cropLabel')} options={[t('selectCrop'), t('wheat'), t('rice'), t('cotton')]} /><Input label={t('marketLocation')} placeholder={t('marketLocationPlaceholder')} /><Select label={t('expectedHarvestMonth')} options={[t('selectMonth'), t('october'), t('november'), t('december')]} /><button className="button button-primary full" type="button">{t('generateForecast')} <span>→</span></button></form><aside className="forecast-card"><p className="eyebrow">{t('sampleForecast')}</p><h2>{t('wheatPriceOutlook')}</h2><p className="forecast-price">₹2,520 <span>/ quintal</span></p><p className="positive-text">↑ {t('estimatedIncrease')}</p><div className="chart"><i /><i /><i /><i /><i /><i /></div><div className="locked-box"><span>🔒</span><div><strong>{t('buyerDetailsProtected')}</strong><p>{t('onlyVerifiedFarmers')}</p></div><Link to="/farmer-login">{t('verifyFarmerId')} →</Link></div></aside></section></PageShell>;
}

function VerifiedPricePrediction() {
  const { t } = useI18n();
  return <PageShell farmer><section className="page-intro compact-intro"><p className="eyebrow">{t('verifiedFarmerWorkspace')}</p><h1>{t('yourPriceOutlook')}</h1><p>{t('sampleListingsDemo')}</p></section><section className="verified-layout"><div className="forecast-card"><p className="eyebrow">{t('wheatForecast')}</p><h2>{t('expectedMandiRange')}</h2><p className="forecast-price">₹2,480–₹2,560 <span>/ quintal</span></p><p className="positive-text">↑ {t('positiveTrend')}</p><div className="chart"><i /><i /><i /><i /><i /><i /></div></div><div className="buyers-panel"><div className="section-heading"><div><p className="eyebrow">{t('protectedListings')}</p><h2>{t('verifiedBuyers')}</h2></div></div>{buyers.map((buyer) => <article className="buyer-row" key={buyer.name}><div><h3>{buyer.name}</h3><p>{buyer.crop} · {buyer.need} · {buyer.place}</p></div><div className="buyer-offer"><strong>{buyer.offer}</strong><button className="small-button">{t('contactBuyer')}</button></div></article>)}</div></section></PageShell>;
}

function FarmerSupport() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  return <PageShell farmer><section className="page-intro"><p className="eyebrow">{t('supportEyebrow')}</p><h1>{t('supportPageTitle')}</h1><p>{t('supportPageText')}</p></section><section className="split-page"><form className="panel form-panel" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><Select label={t('district')} options={[t('selectDistrict'), 'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar']} /><Select label={t('supportType')} options={[t('selectSupportType'), t('cropGuidance'), t('marketAccess'), t('govSchemeGuidance'), t('soilIrrigationSupport')]} /><Input label={t('description')} placeholder={t('briefDescribe')} /><button className="button button-primary full" type="submit">{t('requestSupport')} <span>→</span></button></form><aside className="recommendation support-result"><p className="eyebrow">{submitted ? t('requestSent') : t('supportTitle')}</p><span className="recommendation-icon">🤝</span><h2>{submitted ? t('requestSentText') : t('supportText')}</h2><p>{t('nearestOrgNote')}</p><div className="tip"><strong>{t('privacyLabel')}</strong><span>{t('privacyNote')}</span></div></aside></section></PageShell>;
}

function BuyerLogin() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const submit = (event) => { event.preventDefault(); navigate('/buyer/portal'); };
  return <PageShell><AuthCard eyebrow={t('buyerPortalEyebrow')} title={t('manageRequirements')} text={t('signInText')}><form onSubmit={submit}><Input label={t('emailAddress')} placeholder={t('emailPlaceholder')} type="email" /><Input label={t('password')} placeholder={t('passwordPlaceholder')} type="password" /><button className="button button-primary full" type="submit">{t('buyerLoginBtn')} <span>→</span></button></form><p className="form-note">{t('newBuyer')} <Link to="/buyer/signup">{t('createAccount')}</Link></p></AuthCard></PageShell>;
}

function BuyerSignup() {
  const { t } = useI18n();
  return <PageShell><AuthCard eyebrow={t('buyerRegistration')} title={t('createBuyerAccount')} text={t('registerBusinessText')}><form><Input label={t('businessName')} placeholder={t('businessNamePlaceholder')} /><Input label={t('emailAddress')} placeholder={t('emailPlaceholder')} type="email" /><Input label={t('mobileNumber')} placeholder={t('mobilePlaceholder')} type="tel" /><Input label={t('businessLocation')} placeholder={t('businessLocationPlaceholder')} /><button className="button button-primary full" type="button">{t('createAccountBtn')}</button></form><p className="form-note">{t('businessVerificationNote')}</p></AuthCard></PageShell>;
}

function BuyerPortal() {
  const { t } = useI18n();
  return <PageShell><section className="dashboard-header"><div><p className="eyebrow">{t('buyerPortalLabel')}</p><h1>{t('goodMorning')}</h1><p>{t('manageCurrentReq')}</p></div><Link className="button button-primary" to="/buyer/requirements/new">+ {t('postRequirement')}</Link></section><section className="stat-grid"><Stat label={t('activeRequirements')} value="3" note={t('acrossCrops')} /><Stat label={t('farmerEnquiries')} value="18" note={t('thisWeek')} /><Stat label={t('verifiedResponses')} value="12" note={t('readyToReview')} /></section><section className="panel listing-panel"><div className="section-heading"><div><p className="eyebrow">{t('yourListings')}</p><h2>{t('activeReq2')}</h2></div><button className="button button-light compact">{t('filter')}</button></div>{buyers.map((buyer) => <article className="buyer-row" key={buyer.name}><div><h3>{buyer.crop} requirement</h3><p>{buyer.need} · {t('deliveryNear')} {buyer.place}</p></div><div className="buyer-offer"><strong>{buyer.offer}</strong><button className="small-button">{t('editListing')}</button></div></article>)}</section></PageShell>;
}

function NewBuyerRequirement() {
  const { t } = useI18n();
  const [posted, setPosted] = useState(false);
  return <PageShell><section className="page-intro"><p className="eyebrow">{t('buyerPortalLabel')}</p><h1>{t('requirementTitle')}</h1><p>{t('requirementText')}</p></section><section className="split-page"><form className="panel form-panel" onSubmit={(event) => { event.preventDefault(); setPosted(true); }}><Select label={t('cropCategory')} options={[t('selectCategory'), t('mainCrop'), t('byProduct')]} /><Select label={t('crop')} options={[t('selectProduct'), t('wheat'), t('rice'), t('cotton'), 'Maize', 'Rice Husk', 'Paddy Straw', 'Sugarcane Bagasse']} /><Select label={t('location')} options={[t('selectLocation'), 'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar']} /><Input label={t('quantity')} placeholder={t('quantityPlaceholder')} /><Input label={t('targetPrice')} placeholder={t('targetPricePlaceholder')} /><button className="button button-primary full" type="submit">{t('postRequirement')} <span>→</span></button></form><aside className="recommendation support-result"><p className="eyebrow">{posted ? t('requirementReady') : t('structuredMatching')}</p><span className="recommendation-icon">📋</span><h2>{posted ? t('requirementCreated') : t('useStandardValues')}</h2><p>{t('cropByProductNote')}</p><div className="tip"><strong>{t('nextIntegration')}</strong><span>{t('nextIntegrationNote')}</span></div></aside></section></PageShell>;
}

function AdminLogin() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const submit = (event) => { event.preventDefault(); navigate('/admin/portal'); };
  return <PageShell><AuthCard eyebrow={t('administration')} title={t('adminPortalAccess')} text={t('useAdminCredentials')}><form onSubmit={submit}><Input label={t('adminEmail')} placeholder={t('adminEmailPlaceholder')} type="email" /><Input label={t('password')} placeholder={t('passwordPlaceholder')} type="password" /><button className="button button-primary full" type="submit">{t('adminLoginBtn')} <span>→</span></button></form><p className="form-note">{t('demoInterfaceNote')}</p></AuthCard></PageShell>;
}

function AdminPortal() {
  const { t } = useI18n();
  return <PageShell><section className="dashboard-header"><div><p className="eyebrow">{t('administration')}</p><h1>{t('platformOverview')}</h1><p>{t('sampleInfo')}</p></div><button className="button button-light">{t('exportReport')}</button></section><section className="stat-grid"><Stat label={t('verifiedFarmers')} value="1,248" note={t('thisMonth')} /><Stat label={t('activeBuyers')} value="96" note={t('pendingReviewCount')} /><Stat label={t('liveListings')} value="214" note={t('acrossMarkets')} /></section><section className="panel listing-panel"><div className="section-heading"><div><p className="eyebrow">{t('reviewQueue')}</p><h2>{t('recentBuyerReg')}</h2></div><span className="updated-dot">● 12 {t('pending')}</span></div>{['GreenLeaf Commodities', 'Telangana Farm Foods', 'Harvest Link Traders'].map((name) => <article className="buyer-row" key={name}><div><h3>{name}</h3><p>{t('registrationSubmitted')}</p></div><div className="review-actions"><button className="small-button">{t('review')}</button><button className="small-button danger">{t('flag')}</button></div></article>)}</section></PageShell>;
}

function AuthCard({ eyebrow, title, text, children }) { return <section className="auth-page"><div className="auth-aside"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{text}</p><div className="auth-art"><span>✦</span><span>⌁</span><span>◒</span></div></div><div className="auth-card">{children}</div></section>; }
function Input({ label, placeholder, type = 'text' }) { return <label className="field"><span>{label}</span><input type={type} placeholder={placeholder} required /></label>; }
function Select({ label, options }) { return <label className="field"><span>{label}</span><select defaultValue="" required>{options.map((option, index) => <option value={index === 0 ? '' : option} key={option} disabled={index === 0}>{option}</option>)}</select></label>; }
function Stat({ label, value, note }) { return <article className="stat-card"><p>{label}</p><strong>{value}</strong><span>{note}</span></article>; }

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/farmer-login" element={<FarmerLogin />} />
            <Route path="/farmer-support" element={<FarmerSupport />} />
            <Route path="/crop-prediction" element={<CropPrediction />} />
            <Route path="/price-prediction" element={<PricePredictionGuest />} />
            <Route path="/price-prediction/verified" element={<VerifiedPricePrediction />} />
            <Route path="/buyer/login" element={<BuyerLogin />} />
            <Route path="/buyer/signup" element={<BuyerSignup />} />
            <Route path="/buyer/portal" element={<BuyerPortal />} />
            <Route path="/buyer/requirements/new" element={<NewBuyerRequirement />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/portal" element={<AdminPortal />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
