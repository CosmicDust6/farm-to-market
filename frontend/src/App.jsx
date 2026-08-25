import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import { LanguageProvider, useI18n } from './i18n';

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
        <div><strong>Agri<span>Intel</span></strong><p>Practical market intelligence for farmers.</p></div>
        <nav><a href="#privacy">Privacy</a><a href="#terms">Terms</a><a href="#contact">Contact</a></nav>
        <p>© 2024 AgriIntel</p>
      </footer>
    </div>
  );
}

function PriceCard({ item }) {
  return (
    <article className="price-card">
      <div className="card-title-row"><h3>{item.crop}</h3><span className={`trend ${item.trend}`}>{item.trend === 'up' ? '↑' : '↓'} {item.change}</span></div>
      <p className="price-value">{item.price} <span>/ quintal</span></p>
      <p className="muted">⌖ {item.location}</p>
    </article>
  );
}

function Home() {
  const { t } = useI18n();
  return (
    <PageShell>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{t('welcome')}</p>
          <h1>{t('heroTitle')}</h1>
          <p>{t('heroText')}</p>
          <div className="hero-actions"><Link className="button button-primary" to="/crop-prediction">{t('explore')} <span>→</span></Link><a className="text-link" href="#prices">{t('livePrices')} ↓</a></div>
        </div>
        <div className="hero-visual"><div className="sun" /><div className="landscape-field field-one" /><div className="landscape-field field-two" /><div className="hero-note"><span>Today’s market</span><strong>Prices updated</strong><small>Across Telangana mandis</small></div></div>
      </section>

      <section className="content-section" id="prices">
        <div className="section-heading"><div><p className="eyebrow">Today’s snapshot</p><h2>{t('livePrices')}</h2></div><span className="updated-dot">● {t('updated')}</span></div>
        <div className="price-grid">{prices.map((item) => <PriceCard item={item} key={item.crop} />)}</div>
      </section>

      <section className="content-section tool-section">
        <div className="section-heading"><div><p className="eyebrow">Plan with confidence</p><h2>Simple tools for every season</h2></div></div>
        <div className="tool-grid">
          <article className="feature-card crop-feature"><span className="feature-icon">⌁</span><p className="feature-label">Soil + weather</p><h3>Crop Prediction</h3><p>Find a suitable crop using your local field conditions.</p><Link className="button button-primary full" to="/crop-prediction">Start assessment <span>→</span></Link></article>
          <article className="feature-card price-feature"><span className="feature-icon">↗</span><p className="feature-label">Plan your sale</p><h3>Price Prediction</h3><p>See a clear forecast before deciding when to sell.</p><Link className="button button-light full" to="/price-prediction">View forecasts <span>→</span></Link></article>
        </div>
      </section>

      <section className="farmer-cta">
        <div><p className="eyebrow">Verified access</p><h2>Ready to connect with buyers?</h2><p>Buyer details stay protected. Sign in with your official Farmer ID to view and contact verified buyers.</p></div>
        <Link className="button button-primary" to="/farmer-login">Farmer Login <span>→</span></Link>
      </section>
      <section className="support-cta">
        <div><p className="eyebrow">{t('supportTitle')}</p><h2>{t('supportText')}</h2><p className="service-note">Service-only feature. It does not create an NGO account or share buyer information.</p></div>
        <Link className="button button-light" to="/farmer-support">{t('contactSupport')} <span>→</span></Link>
      </section>
    </PageShell>
  );
}

function FarmerLogin() {
  const navigate = useNavigate();
  const submit = (event) => { event.preventDefault(); navigate('/price-prediction/verified'); };
  return <PageShell><AuthCard eyebrow="Farmer verification" title="Welcome back to your market" text="Verify your details against the official Farmer Registry to unlock buyer access."><form onSubmit={submit}><Input label="Farmer name" placeholder="Enter your full name" /><Input label="Mobile number" placeholder="10-digit mobile number" type="tel" /><Input label="Official Farmer ID" placeholder="Enter Farmer ID" /><button className="button button-primary full" type="submit">Verify and continue <span>→</span></button></form><p className="form-note">This is a frontend demo. Registry verification will be connected later.</p></AuthCard></PageShell>;
}

function CropPrediction() {
  return <PageShell><section className="page-intro"><p className="eyebrow">Crop planning assistant</p><h1>Find the right crop for your field.</h1><p>Share a few conditions to receive a simple, mock recommendation.</p></section><section className="split-page"><form className="panel form-panel"><Input label="District" placeholder="e.g. Warangal" /><div className="two-fields"><Select label="Soil type" options={['Select soil type', 'Black soil', 'Red soil', 'Loamy soil']} /><Select label="Water availability" options={['Select availability', 'Low', 'Medium', 'High']} /></div><Select label="Season" options={['Select season', 'Kharif', 'Rabi', 'Summer']} /><button className="button button-primary full" type="button">Get recommendation <span>→</span></button></form><aside className="recommendation"><p className="eyebrow">Sample result</p><span className="recommendation-icon">🌾</span><h2>Wheat may suit your conditions</h2><p>Based on the sample field conditions, wheat is shown as a balanced option with moderate water needs.</p><div className="tip"><strong>Tip</strong><span>Confirm local soil and weather advice before making a planting decision.</span></div></aside></section></PageShell>;
}

function PricePredictionGuest() {
  return <PageShell><section className="page-intro"><p className="eyebrow">Selling decision assistant</p><h1>Plan your harvest sale.</h1><p>Explore a sample price forecast, then verify your Farmer ID to access protected buyer details.</p></section><section className="split-page"><form className="panel form-panel"><Select label="Crop" options={['Select crop', 'Wheat', 'Rice', 'Cotton']} /><Input label="Market location" placeholder="e.g. Hyderabad" /><Select label="Expected harvest month" options={['Select month', 'October', 'November', 'December']} /><button className="button button-primary full" type="button">Generate forecast <span>→</span></button></form><aside className="forecast-card"><p className="eyebrow">Sample forecast</p><h2>Wheat price outlook</h2><p className="forecast-price">₹2,520 <span>/ quintal</span></p><p className="positive-text">↑ Estimated 2.8% increase</p><div className="chart"><i /><i /><i /><i /><i /><i /></div><div className="locked-box"><span>🔒</span><div><strong>Buyer details are protected</strong><p>Only verified farmers can view or contact buyers.</p></div><Link to="/farmer-login">Verify Farmer ID →</Link></div></aside></section></PageShell>;
}

function VerifiedPricePrediction() {
  return <PageShell farmer><section className="page-intro compact-intro"><p className="eyebrow">Verified farmer workspace</p><h1>Your price outlook and buyer opportunities.</h1><p>These are sample listings for the frontend demo.</p></section><section className="verified-layout"><div className="forecast-card"><p className="eyebrow">Wheat forecast</p><h2>Expected mandi range</h2><p className="forecast-price">₹2,480–₹2,560 <span>/ quintal</span></p><p className="positive-text">↑ Positive short-term trend</p><div className="chart"><i /><i /><i /><i /><i /><i /></div></div><div className="buyers-panel"><div className="section-heading"><div><p className="eyebrow">Protected listings</p><h2>Verified buyers</h2></div></div>{buyers.map((buyer) => <article className="buyer-row" key={buyer.name}><div><h3>{buyer.name}</h3><p>{buyer.crop} · {buyer.need} · {buyer.place}</p></div><div className="buyer-offer"><strong>{buyer.offer}</strong><button className="small-button">Contact buyer</button></div></article>)}</div></section></PageShell>;
}

function FarmerSupport() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  return <PageShell farmer><section className="page-intro"><p className="eyebrow">{t('supportEyebrow')}</p><h1>{t('supportPageTitle')}</h1><p>{t('supportPageText')}</p></section><section className="split-page"><form className="panel form-panel" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><Select label={t('district')} options={['Select district', 'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar']} /><Select label={t('supportType')} options={['Select support type', 'Crop guidance', 'Market access', 'Government scheme guidance', 'Soil or irrigation support']} /><Input label={t('description')} placeholder="Briefly describe the help you need" /><button className="button button-primary full" type="submit">{t('requestSupport')} <span>→</span></button></form><aside className="recommendation support-result"><p className="eyebrow">{submitted ? t('requestSent') : t('supportTitle')}</p><span className="recommendation-icon">🤝</span><h2>{submitted ? t('requestSentText') : t('supportText')}</h2><p>Nearest-organisation matching will use a trusted NGO directory and the farmer’s verified location when those backend data sources are available.</p><div className="tip"><strong>Privacy</strong><span>Your Farmer ID and buyer information are not shared through this support service.</span></div></aside></section></PageShell>;
}

function BuyerLogin() {
  const navigate = useNavigate();
  const submit = (event) => { event.preventDefault(); navigate('/buyer/portal'); };
  return <PageShell><AuthCard eyebrow="Buyer portal" title="Manage your crop requirements" text="Sign in to create and update the requirements verified farmers can view."><form onSubmit={submit}><Input label="Email address" placeholder="you@business.com" type="email" /><Input label="Password" placeholder="Enter password" type="password" /><button className="button button-primary full" type="submit">Buyer Login <span>→</span></button></form><p className="form-note">New buyer? <Link to="/buyer/signup">Create an account</Link></p></AuthCard></PageShell>;
}

function BuyerSignup() {
  return <PageShell><AuthCard eyebrow="Buyer registration" title="Create your buyer account" text="Register your business to post crop requirements for verified farmers."><form><Input label="Business name" placeholder="Enter business name" /><Input label="Email address" placeholder="you@business.com" type="email" /><Input label="Mobile number" placeholder="10-digit mobile number" type="tel" /><Input label="Business location" placeholder="City, State" /><button className="button button-primary full" type="button">Create account <span>→</span></button></form><p className="form-note">Business verification will be handled by the backend later.</p></AuthCard></PageShell>;
}

function BuyerPortal() {
  const { t } = useI18n();
  return <PageShell><section className="dashboard-header"><div><p className="eyebrow">Buyer portal</p><h1>Good morning, Siri Grains.</h1><p>Manage your current crop requirements.</p></div><Link className="button button-primary" to="/buyer/requirements/new">+ {t('postRequirement')}</Link></section><section className="stat-grid"><Stat label="Active requirements" value="3" note="Across 3 crops" /><Stat label="Farmer enquiries" value="18" note="This week" /><Stat label="Verified responses" value="12" note="Ready to review" /></section><section className="panel listing-panel"><div className="section-heading"><div><p className="eyebrow">Your listings</p><h2>Active requirements</h2></div><button className="button button-light compact">Filter</button></div>{buyers.map((buyer) => <article className="buyer-row" key={buyer.name}><div><h3>{buyer.crop} requirement</h3><p>{buyer.need} · Delivery near {buyer.place}</p></div><div className="buyer-offer"><strong>{buyer.offer}</strong><button className="small-button">Edit listing</button></div></article>)}</section></PageShell>;
}

function NewBuyerRequirement() {
  const { t } = useI18n();
  const [posted, setPosted] = useState(false);
  return <PageShell><section className="page-intro"><p className="eyebrow">Buyer portal</p><h1>{t('requirementTitle')}</h1><p>{t('requirementText')}</p></section><section className="split-page"><form className="panel form-panel" onSubmit={(event) => { event.preventDefault(); setPosted(true); }}><Select label={t('cropCategory')} options={['Select category', t('mainCrop'), t('byProduct')]} /><Select label={t('crop')} options={['Select product', 'Wheat', 'Rice', 'Cotton', 'Maize', 'Rice Husk', 'Paddy Straw', 'Sugarcane Bagasse']} /><Select label={t('location')} options={['Select location', 'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar']} /><Input label={t('quantity')} placeholder="e.g. 500 quintals" /><Input label="Target price" placeholder="e.g. ₹2,500 / quintal" /><button className="button button-primary full" type="submit">{t('postRequirement')} <span>→</span></button></form><aside className="recommendation support-result"><p className="eyebrow">{posted ? 'Requirement ready' : 'Structured matching'}</p><span className="recommendation-icon">📋</span><h2>{posted ? 'Your sample requirement has been created.' : 'Use standard values for better matches.'}</h2><p>Crop, by-product, and location choices are controlled so buyer-farmer matching is not affected by spelling variations.</p><div className="tip"><strong>Next integration</strong><span>This form will submit to POST /api/requests after buyer JWT authentication is connected.</span></div></aside></section></PageShell>;
}

function AdminLogin() {
  const navigate = useNavigate();
  const submit = (event) => { event.preventDefault(); navigate('/admin/portal'); };
  return <PageShell><AuthCard eyebrow="Administration" title="Admin portal access" text="Use your admin credentials to review platform activity."><form onSubmit={submit}><Input label="Admin email" placeholder="admin@agriintel.in" type="email" /><Input label="Password" placeholder="Enter password" type="password" /><button className="button button-primary full" type="submit">Admin Login <span>→</span></button></form><p className="form-note">Demo interface only. No real authentication is implemented.</p></AuthCard></PageShell>;
}

function AdminPortal() {
  return <PageShell><section className="dashboard-header"><div><p className="eyebrow">Administration</p><h1>Platform overview</h1><p>Sample information for the frontend dashboard.</p></div><button className="button button-light">Export report</button></section><section className="stat-grid"><Stat label="Verified farmers" value="1,248" note="+86 this month" /><Stat label="Active buyers" value="96" note="12 pending review" /><Stat label="Live listings" value="214" note="Across 18 markets" /></section><section className="panel listing-panel"><div className="section-heading"><div><p className="eyebrow">Review queue</p><h2>Recent buyer registrations</h2></div><span className="updated-dot">● 12 pending</span></div>{['GreenLeaf Commodities', 'Telangana Farm Foods', 'Harvest Link Traders'].map((name, index) => <article className="buyer-row" key={name}><div><h3>{name}</h3><p>Registration submitted today · Business verification pending</p></div><div className="review-actions"><button className="small-button">Review</button><button className="small-button danger">Flag</button></div></article>)}</section></PageShell>;
}

function AuthCard({ eyebrow, title, text, children }) { return <section className="auth-page"><div className="auth-aside"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{text}</p><div className="auth-art"><span>✦</span><span>⌁</span><span>◒</span></div></div><div className="auth-card">{children}</div></section>; }
function Input({ label, placeholder, type = 'text' }) { return <label className="field"><span>{label}</span><input type={type} placeholder={placeholder} required /></label>; }
function Select({ label, options }) { return <label className="field"><span>{label}</span><select defaultValue="" required>{options.map((option, index) => <option value={index === 0 ? '' : option} key={option} disabled={index === 0}>{option}</option>)}</select></label>; }
function Stat({ label, value, note }) { return <article className="stat-card"><p>{label}</p><strong>{value}</strong><span>{note}</span></article>; }

function App() {
  return <LanguageProvider><BrowserRouter><Routes><Route path="/" element={<Home />} /><Route path="/farmer-login" element={<FarmerLogin />} /><Route path="/farmer-support" element={<FarmerSupport />} /><Route path="/crop-prediction" element={<CropPrediction />} /><Route path="/price-prediction" element={<PricePredictionGuest />} /><Route path="/price-prediction/verified" element={<VerifiedPricePrediction />} /><Route path="/buyer/login" element={<BuyerLogin />} /><Route path="/buyer/signup" element={<BuyerSignup />} /><Route path="/buyer/portal" element={<BuyerPortal />} /><Route path="/buyer/requirements/new" element={<NewBuyerRequirement />} /><Route path="/admin/login" element={<AdminLogin />} /><Route path="/admin/portal" element={<AdminPortal />} /></Routes></BrowserRouter></LanguageProvider>;
}

export default App;
