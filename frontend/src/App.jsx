import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { LanguageProvider, useI18n } from './i18n';
import { AuthProvider, useAuth } from './auth';
import { api } from './api';

const defaultPrices = [
  { crop: 'Wheat', price: '₹2,450', change: '+3.2%', trend: 'up', location: 'Hyderabad' },
  { crop: 'Rice', price: '₹3,100', change: '-1.4%', trend: 'down', location: 'Hyderabad' },
  { crop: 'Cotton', price: '₹6,200', change: '+0.8%', trend: 'up', location: 'Warangal' },
  { crop: 'Tomato', price: '₹3,800', change: '+5.4%', trend: 'up', location: 'Bengaluru' },
  { crop: 'Chilli', price: '₹14,500', change: '+2.1%', trend: 'up', location: 'Warangal' },
  { crop: 'Maize', price: '₹2,100', change: '-0.5%', trend: 'down', location: 'Pune' },
];

function PageShell({ children, farmer = false }) {
  const { language, setLanguage, t } = useI18n();
  const { user, farmerLoggedIn, buyerLoggedIn, adminLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">Agri<span>Intel</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end>{t('home')}</NavLink>
          <NavLink to="/crop-prediction">{t('cropPrediction')}</NavLink>
          <NavLink to="/price-prediction">{t('pricePrediction')}</NavLink>
          {farmerLoggedIn && <NavLink to="/price-prediction/verified">{t('verifiedFarmerWorkspace')}</NavLink>}
          {buyerLoggedIn && <NavLink to="/buyer/portal">{t('buyerPortalLabel')}</NavLink>}
          {adminLoggedIn && <NavLink to="/admin/portal">{t('administration')}</NavLink>}
        </nav>
        <div className="header-actions">
          {farmerLoggedIn && (
            <>
              <span className="verified-badge">✓ {user?.name || t('verified')}</span>
              <Link className="support-link" to="/farmer-support">{t('farmerSupport')}</Link>
            </>
          )}
          {buyerLoggedIn && <span className="verified-badge">🏢 {user?.name || 'Buyer'}</span>}
          {adminLoggedIn && <span className="verified-badge">⚡ Admin</span>}

          <button className="language-toggle" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} type="button">
            {t('language')}
          </button>

          {user || farmerLoggedIn || buyerLoggedIn || adminLoggedIn ? (
            <button className="button button-light compact" onClick={handleLogout} type="button">
              {t('logout') || 'Logout'}
            </button>
          ) : (
            <>
              <Link className="button button-quiet" to="/farmer-login">{t('farmerLoginNav') || 'Farmer Login'}</Link>
              <Link className="button button-quiet" to="/buyer/login">{t('buyerLogin')}</Link>
              <Link className="button button-primary compact" to="/admin/login">{t('adminLogin')}</Link>
            </>
          )}
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
      <div className="card-title-row">
        <h3>{t(item.crop.toLowerCase()) || item.crop}</h3>
        <span className={`trend ${item.trend}`}>{item.trend === 'up' ? '↑' : '↓'} {item.change}</span>
      </div>
      <p className="price-value">{item.price} <span>/ quintal</span></p>
      <p className="muted">⌖ {item.location}</p>
    </article>
  );
}

function Home() {
  const { t } = useI18n();
  const { farmerLoggedIn } = useAuth();
  const [livePrices, setLivePrices] = useState(defaultPrices);

  useEffect(() => {
    // Fetch live prediction prices from backend
    const cropsToFetch = [
      { crop: 'wheat', location: 'Hyderabad' },
      { crop: 'rice', location: 'Hyderabad' },
      { crop: 'cotton', location: 'Warangal' },
      { crop: 'tomato', location: 'Bengaluru' },
      { crop: 'chilli', location: 'Warangal' },
      { crop: 'maize', location: 'Pune' },
    ];

    Promise.allSettled(
      cropsToFetch.map(({ crop, location }) => api.predictPrice({ crop, location }))
    ).then((results) => {
      const updated = results.map((res, index) => {
        if (res.status === 'fulfilled' && res.value) {
          const data = res.value;
          const sign = data.change_percentage >= 0 ? '+' : '';
          return {
            crop: data.crop,
            price: `₹${data.current_price.toLocaleString()}`,
            change: `${sign}${data.change_percentage}%`,
            trend: data.trend === 'up' ? 'up' : 'down',
            location: data.location,
          };
        }
        return defaultPrices[index];
      });
      setLivePrices(updated);
    }).catch(() => {
      // Keep defaults if API fails
    });
  }, []);

  return (
    <PageShell>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{t('welcome')}</p>
          <h1>{t('heroTitle')}</h1>
          <p>{t('heroText')}</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/crop-prediction">{t('explore')} <span>→</span></Link>
            <a className="text-link" href="#prices">{t('livePrices')} ↓</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="sun" />
          <div className="landscape-field field-one" />
          <div className="landscape-field field-two" />
          <div className="hero-note">
            <span>{t('todaysMarket')}</span>
            <strong>{t('pricesUpdated')}</strong>
            <small>{t('acrossTelangana')}</small>
          </div>
        </div>
      </section>

      <section className="content-section" id="prices">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('todaysSnapshot')}</p>
            <h2>{t('livePrices')}</h2>
          </div>
          <span className="updated-dot">● {t('updated')}</span>
        </div>
        <div className="price-grid">
          {livePrices.map((item) => <PriceCard item={item} key={item.crop} />)}
        </div>
      </section>

      <section className="content-section tool-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('planWithConfidence')}</p>
            <h2>{t('toolsHeading')}</h2>
          </div>
        </div>
        <div className="tool-grid">
          <article className="feature-card crop-feature">
            <span className="feature-icon">⌁</span>
            <p className="feature-label">{t('soilWeather')}</p>
            <h3>{t('cropFeatureTitle')}</h3>
            <p>{t('cropFeatureText')}</p>
            <Link className="button button-primary full" to="/crop-prediction">{t('startAssessment')} <span>→</span></Link>
          </article>
          <article className="feature-card price-feature">
            <span className="feature-icon">↗</span>
            <p className="feature-label">{t('planYourSale')}</p>
            <h3>{t('priceFeatureTitle')}</h3>
            <p>{t('priceFeatureText')}</p>
            <Link className="button button-light full" to="/price-prediction">{t('viewForecasts')} <span>→</span></Link>
          </article>
        </div>
      </section>

      <section className="farmer-cta">
        <div>
          <p className="eyebrow">{t('verifiedAccess')}</p>
          <h2>{t('readyConnect')}</h2>
          <p>{t('farmerCtaText')}</p>
        </div>
        <Link className="button button-primary" to="/farmer-login">{t('farmerLoginCta')} <span>→</span></Link>
      </section>
      <section className="support-cta">
        <div>
          <p className="eyebrow">{t('supportTitle')}</p>
          <h2>{t('supportText')}</h2>
          <p className="service-note">{t('serviceNote')}</p>
        </div>
        <Link className="button button-light" to={farmerLoggedIn ? "/farmer-support" : "/farmer-login"}>
          {t('contactSupport')} <span>→</span>
        </Link>
      </section>
    </PageShell>
  );
}

function FarmerLogin() {
  const { t } = useI18n();
  const { loginFarmer } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Ramesh Kumar',
    phone: '9876543210',
    farmer_id: 'FARM1001',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.loginFarmer({
        phone: formData.phone,
        farmer_id: formData.farmer_id.trim().toUpperCase(),
        name: formData.name,
      });
      loginFarmer(res.user, res.token);
      navigate('/price-prediction/verified');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your Farmer ID (Try FARM1001 to FARM1005).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <AuthCard eyebrow={t('farmerVerification')} title={t('welcomeBack')} text={t('verifyDetailsText')}>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={submit}>
          <label className="field">
            <span>{t('farmerNameLabel')}</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('farmerNamePlaceholder')}
              required
            />
          </label>
          <label className="field">
            <span>{t('mobileNumber')}</span>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t('mobilePlaceholder')}
              required
            />
          </label>
          <label className="field">
            <span>{t('officialFarmerId')}</span>
            <input
              name="farmer_id"
              value={formData.farmer_id}
              onChange={handleChange}
              placeholder={t('farmerIdPlaceholder')}
              required
            />
          </label>
          <button className="button button-primary full" type="submit" disabled={loading}>
            {loading ? 'Verifying...' : t('verifyAndContinue')} <span>→</span>
          </button>
        </form>
        <p className="form-note">
          Valid demo IDs: <strong>FARM1001, FARM1002, FARM1003, FARM1004, FARM1005</strong>
        </p>
      </AuthCard>
    </PageShell>
  );
}

function CropPrediction() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    location: 'Warangal',
    soil_type: 'black',
    water_availability: 'medium',
    land_area: '3.5',
    budget: '40000',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.predictCrop(formData);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Crop recommendation failed. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial recommendation
    handlePredict();
  }, []);

  return (
    <PageShell>
      <section className="page-intro">
        <p className="eyebrow">{t('cropPlanningAssistant')}</p>
        <h1>{t('findRightCrop')}</h1>
        <p>{t('shareConditions')}</p>
      </section>
      <section className="split-page">
        <form className="panel form-panel" onSubmit={handlePredict}>
          {error && <div className="error-banner">{error}</div>}
          <label className="field">
            <span>{t('district')}</span>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder={t('districtPlaceholder')}
              required
            />
          </label>
          <div className="two-fields">
            <label className="field">
              <span>{t('soilType')}</span>
              <select name="soil_type" value={formData.soil_type} onChange={handleChange} required>
                <option value="black">{t('blackSoil') || 'Black Soil'}</option>
                <option value="red">{t('redSoil') || 'Red Soil'}</option>
                <option value="loamy">{t('loamySoil') || 'Loamy Soil'}</option>
                <option value="sandy">Sandy Soil</option>
                <option value="clay">Clay Soil</option>
              </select>
            </label>
            <label className="field">
              <span>{t('waterAvailability')}</span>
              <select name="water_availability" value={formData.water_availability} onChange={handleChange} required>
                <option value="low">{t('low') || 'Low'}</option>
                <option value="medium">{t('medium') || 'Medium'}</option>
                <option value="high">{t('high') || 'High'}</option>
              </select>
            </label>
          </div>
          <div className="two-fields">
            <label className="field">
              <span>Land Area (Acres)</span>
              <input
                name="land_area"
                type="number"
                step="0.1"
                min="0.5"
                value={formData.land_area}
                onChange={handleChange}
                required
              />
            </label>
            <label className="field">
              <span>Budget (₹)</span>
              <input
                name="budget"
                type="number"
                step="1000"
                min="5000"
                value={formData.budget}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <button className="button button-primary full" type="submit" disabled={loading}>
            {loading ? 'Evaluating Soil & Conditions...' : t('getRecommendation')} <span>→</span>
          </button>
        </form>

        <aside className="recommendation">
          <p className="eyebrow">{t('sampleResult')}</p>
          <span className="recommendation-icon">🌾</span>
          <h2>
            {result?.recommended_crop ? `${result.recommended_crop} is highly recommended!` : t('wheatMaySuit')}
          </h2>
          <p>
            {result?.confidence
              ? `Our machine learning model identified ${result.recommended_crop} as the optimal match with ${result.confidence}% confidence for your soil type and water conditions in ${formData.location}.`
              : t('basedOnSample')}
          </p>

          {result?.top_recommendations && (
            <div className="rec-list">
              <p className="eyebrow" style={{ marginTop: '12px' }}>Top Suitable Crops</p>
              {result.top_recommendations.map((item) => (
                <div className="rec-item" key={item.crop}>
                  <div className="rec-label">
                    <span>{item.crop}</span>
                    <span>{item.confidence}%</span>
                  </div>
                  <div className="rec-bar-bg">
                    <div className="rec-bar-fill" style={{ width: `${Math.min(100, Math.max(10, item.confidence * 1.5))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="tip">
            <strong>{t('tip')}</strong>
            <span>{t('confirmLocalAdvice')}</span>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

function PricePredictionGuest() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    crop: 'wheat',
    location: 'Hyderabad',
  });
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForecast = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.predictPrice(formData);
      setForecast(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch price prediction.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleForecast();
  }, []);

  return (
    <PageShell>
      <section className="page-intro">
        <p className="eyebrow">{t('sellingDecisionAssistant')}</p>
        <h1>{t('planHarvestSale')}</h1>
        <p>{t('exploreSampleForecast')}</p>
      </section>
      <section className="split-page">
        <form className="panel form-panel" onSubmit={handleForecast}>
          {error && <div className="error-banner">{error}</div>}
          <label className="field">
            <span>{t('cropLabel')}</span>
            <select name="crop" value={formData.crop} onChange={handleChange} required>
              <option value="wheat">Wheat</option>
              <option value="rice">Rice</option>
              <option value="cotton">Cotton</option>
              <option value="tomato">Tomato</option>
              <option value="potato">Potato</option>
              <option value="onion">Onion</option>
              <option value="chilli">Chilli</option>
              <option value="maize">Maize</option>
              <option value="groundnut">Groundnut</option>
            </select>
          </label>
          <label className="field">
            <span>{t('marketLocation')}</span>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder={t('marketLocationPlaceholder')}
              required
            />
          </label>
          <button className="button button-primary full" type="submit" disabled={loading}>
            {loading ? 'Analyzing Market Prices...' : t('generateForecast')} <span>→</span>
          </button>
        </form>

        <aside className="forecast-card">
          <p className="eyebrow">{t('sampleForecast')}</p>
          <h2>{forecast ? `${forecast.crop} in ${forecast.location}` : t('wheatPriceOutlook')}</h2>
          <p className="forecast-price">
            {forecast ? `₹${forecast.current_price.toLocaleString()}` : '₹2,520'} <span>/ quintal</span>
          </p>
          <p className={`positive-text ${forecast?.trend === 'down' ? 'trend down' : ''}`}>
            {forecast?.trend === 'up' ? '↑ ' : '↓ '}
            {forecast ? `Expected next month: ₹${forecast.predicted_price.toLocaleString()} (${forecast.change_percentage >= 0 ? '+' : ''}${forecast.change_percentage}%)` : t('estimatedIncrease')}
          </p>

          {forecast?.history && (
            <div>
              <div className="chart">
                {forecast.history.map((pt, i) => {
                  const maxP = Math.max(...forecast.history.map(h => h.price), 1);
                  const heightPercent = Math.max(20, Math.round((pt.price / maxP) * 100));
                  return (
                    <i
                      key={i}
                      style={{
                        height: `${heightPercent}%`,
                        background: pt.is_future ? 'linear-gradient(to top, #c68b28, #f4e4b8)' : undefined,
                      }}
                      title={`${pt.month}: ₹${pt.price}`}
                    />
                  );
                })}
              </div>
              <div className="chart-labels">
                {forecast.history.map((pt, i) => (
                  <span key={i} style={{ fontWeight: pt.is_future ? '700' : 'normal' }}>{pt.month}</span>
                ))}
              </div>
            </div>
          )}

          <div className="locked-box" style={{ marginTop: '20px' }}>
            <span>🔒</span>
            <div>
              <strong>{t('buyerDetailsProtected')}</strong>
              <p>{t('onlyVerifiedFarmers')}</p>
            </div>
            <Link to="/farmer-login">{t('verifyFarmerId')} →</Link>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

function VerifiedPricePrediction() {
  const { t } = useI18n();
  const { farmerLoggedIn } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [location, setLocation] = useState('Hyderabad');
  const [forecast, setForecast] = useState(null);
  const [matchedBuyers, setMatchedBuyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contactedBuyer, setContactedBuyer] = useState(null);
  const [listingForm, setListingForm] = useState({ show: false, crop_name: 'tomato', location: 'Hyderabad', description: '' });
  const [listingMsg, setListingMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [priceRes, matchesRes] = await Promise.allSettled([
        api.predictPrice({ crop: selectedCrop, location }),
        api.getBuyerMatches(selectedCrop, location),
      ]);

      if (priceRes.status === 'fulfilled') {
        setForecast(priceRes.value);
      }
      if (matchesRes.status === 'fulfilled') {
        setMatchedBuyers(matchesRes.value || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCrop, location]);

  const handlePostListing = async (e) => {
    e.preventDefault();
    try {
      await api.createCropListing(listingForm);
      setListingMsg('Crop listing published successfully for buyers to view!');
      setListingForm({ show: false, crop_name: selectedCrop, location, description: '' });
    } catch (err) {
      setListingMsg(err.message || 'Failed to publish listing');
    }
  };

  return (
    <PageShell farmer={farmerLoggedIn}>
      <section className="page-intro compact-intro">
        <p className="eyebrow">{t('verifiedFarmerWorkspace')}</p>
        <h1>{t('yourPriceOutlook')}</h1>
        <p>Real-time price forecasts connected to verified active buyers in the network.</p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', alignItems: 'center' }}>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>Select Crop:</span>
            <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
              <option value="tomato">Tomato</option>
              <option value="rice">Rice</option>
              <option value="wheat">Wheat</option>
              <option value="chilli">Chilli</option>
              <option value="onion">Onion</option>
              <option value="potato">Potato</option>
              <option value="cotton">Cotton</option>
              <option value="groundnut">Groundnut</option>
            </select>
          </label>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>Market Location:</span>
            <input value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>
          <button
            className="button button-light"
            style={{ marginTop: '22px' }}
            onClick={() => setListingForm({ ...listingForm, show: !listingForm.show })}
            type="button"
          >
            + Create Crop Listing
          </button>
        </div>
      </section>

      {listingMsg && <div className="success-banner" style={{ margin: '0 32px 16px' }}>{listingMsg}</div>}

      {listingForm.show && (
        <section className="content-section" style={{ paddingTop: 0 }}>
          <form className="panel form-panel" onSubmit={handlePostListing}>
            <h3>Post Crop Listing for Buyers</h3>
            <div className="two-fields">
              <label className="field">
                <span>Crop Name</span>
                <input
                  value={listingForm.crop_name}
                  onChange={(e) => setListingForm({ ...listingForm, crop_name: e.target.value })}
                  required
                />
              </label>
              <label className="field">
                <span>Farm Location</span>
                <input
                  value={listingForm.location}
                  onChange={(e) => setListingForm({ ...listingForm, location: e.target.value })}
                  required
                />
              </label>
            </div>
            <label className="field">
              <span>Description / Quantity</span>
              <input
                value={listingForm.description}
                onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })}
                placeholder="e.g. 50 Quintals Grade A harvest ready in 2 weeks"
              />
            </label>
            <button className="button button-primary" type="submit">Publish Listing</button>
          </form>
        </section>
      )}

      <section className="verified-layout">
        <div className="forecast-card">
          <p className="eyebrow">{forecast?.crop || selectedCrop} Forecast</p>
          <h2>{t('expectedMandiRange')}</h2>
          <p className="forecast-price">
            {forecast ? `₹${(forecast.current_price * 0.95).toFixed(0)} – ₹${(forecast.current_price * 1.05).toFixed(0)}` : '₹2,480–₹2,560'}{' '}
            <span>/ quintal</span>
          </p>
          <p className="positive-text">
            {forecast ? `Projected next month: ₹${forecast.predicted_price.toLocaleString()} (${forecast.trend === 'up' ? 'Positive trend' : 'Slight dip'})` : t('positiveTrend')}
          </p>

          {forecast?.history && (
            <div>
              <div className="chart">
                {forecast.history.map((pt, i) => {
                  const maxP = Math.max(...forecast.history.map(h => h.price), 1);
                  const heightPercent = Math.max(20, Math.round((pt.price / maxP) * 100));
                  return (
                    <i
                      key={i}
                      style={{
                        height: `${heightPercent}%`,
                        background: pt.is_future ? 'linear-gradient(to top, #c68b28, #f4e4b8)' : undefined,
                      }}
                      title={`${pt.month}: ₹${pt.price}`}
                    />
                  );
                })}
              </div>
              <div className="chart-labels">
                {forecast.history.map((pt, i) => (
                  <span key={i} style={{ fontWeight: pt.is_future ? '700' : 'normal' }}>{pt.month}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="buyers-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t('protectedListings')}</p>
              <h2>{t('verifiedBuyers')} ({matchedBuyers.length})</h2>
            </div>
          </div>

          {matchedBuyers.length === 0 ? (
            <p className="muted">No direct buyer matches found for this crop/location. Post a listing above so buyers can reach out!</p>
          ) : (
            matchedBuyers.map((buyer) => (
              <article className="buyer-row" key={buyer.buyer_id || buyer.name}>
                <div>
                  <h3>{buyer.name}</h3>
                  <p>
                    {buyer.interested_crop || selectedCrop} · {buyer.location || 'Pan-India'} ·{' '}
                    <span className="status-badge resolved">{buyer.match_reason || `${buyer.match_score}% Match`}</span>
                  </p>
                  {contactedBuyer === buyer.buyer_id && (
                    <div className="success-banner" style={{ marginTop: '8px' }}>
                      📞 <strong>Phone:</strong> {buyer.phone || '9876543210'} | ✉️ <strong>Email:</strong> {buyer.email || 'buyer@trade.com'}
                    </div>
                  )}
                </div>
                <div className="buyer-offer">
                  <button
                    className="small-button"
                    onClick={() => setContactedBuyer(contactedBuyer === buyer.buyer_id ? null : buyer.buyer_id)}
                    type="button"
                  >
                    {contactedBuyer === buyer.buyer_id ? 'Hide Contact' : t('contactBuyer')}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </PageShell>
  );
}

function FarmerSupport() {
  const { t } = useI18n();
  const { farmerLoggedIn } = useAuth();
  const [district, setDistrict] = useState('Warangal');
  const [supportType, setSupportType] = useState('crop guidance');
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [myQueries, setMyQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadQueries = async () => {
    if (farmerLoggedIn) {
      try {
        const queries = await api.getMySupportQueries();
        setMyQueries(queries || []);
      } catch {
        // guest or non-auth
      }
    }
  };

  useEffect(() => {
    loadQueries();
  }, [farmerLoggedIn]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const fullQuestion = `[${district} - ${supportType}] ${question}`;
    try {
      await api.createSupportQuery(fullQuestion);
      setSubmitted(true);
      setQuestion('');
      loadQueries();
    } catch (err) {
      setError(err.message || 'Failed to submit support request. Please verify farmer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell farmer={farmerLoggedIn}>
      <section className="page-intro">
        <p className="eyebrow">{t('supportEyebrow')}</p>
        <h1>{t('supportPageTitle')}</h1>
        <p>{t('supportPageText')}</p>
      </section>
      <section className="split-page">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          {error && <div className="error-banner">{error}</div>}
          {submitted && <div className="success-banner">Support request dispatched successfully! An advisor will assist shortly.</div>}

          <label className="field">
            <span>{t('district')}</span>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} required>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Warangal">Warangal</option>
              <option value="Nizamabad">Nizamabad</option>
              <option value="Karimnagar">Karimnagar</option>
              <option value="Vijayawada">Vijayawada</option>
            </select>
          </label>

          <label className="field">
            <span>{t('supportType')}</span>
            <select value={supportType} onChange={(e) => setSupportType(e.target.value)} required>
              <option value="Crop guidance">{t('cropGuidance')}</option>
              <option value="Market access">{t('marketAccess')}</option>
              <option value="Government schemes">{t('govSchemeGuidance')}</option>
              <option value="Soil & Irrigation">{t('soilIrrigationSupport')}</option>
            </select>
          </label>

          <label className="field">
            <span>{t('description')}</span>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t('briefDescribe')}
              required
            />
          </label>

          <button className="button button-primary full" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : t('requestSupport')} <span>→</span>
          </button>
        </form>

        <aside className="recommendation support-result">
          <p className="eyebrow">{submitted ? t('requestSent') : t('supportTitle')}</p>
          <span className="recommendation-icon">🤝</span>
          <h2>{submitted ? t('requestSentText') : t('supportText')}</h2>
          <p>{t('nearestOrgNote')}</p>

          {myQueries.length > 0 && (
            <div style={{ marginTop: '16px', display: 'grid', gap: '8px' }}>
              <p className="eyebrow">Your Support Tickets</p>
              {myQueries.map((q) => (
                <div key={q.id} className="buyer-row" style={{ padding: '8px 0' }}>
                  <span style={{ fontSize: '13px' }}>{q.question}</span>
                  <span className={`status-badge ${q.status}`}>{q.status}</span>
                </div>
              ))}
            </div>
          )}

          <div className="tip">
            <strong>{t('privacyLabel')}</strong>
            <span>{t('privacyNote')}</span>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

function BuyerLogin() {
  const { t } = useI18n();
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: 'freshmart@example.com',
    password: 'buyer123',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.loginBuyer(formData);
      loginUser(res.user, res.token);
      navigate('/buyer/portal');
    } catch (err) {
      setError(err.message || 'Invalid buyer email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <AuthCard eyebrow={t('buyerPortalEyebrow')} title={t('manageRequirements')} text={t('signInText')}>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={submit}>
          <label className="field">
            <span>{t('emailAddress')}</span>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('emailPlaceholder')}
              required
            />
          </label>
          <label className="field">
            <span>{t('password')}</span>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('passwordPlaceholder')}
              required
            />
          </label>
          <button className="button button-primary full" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : t('buyerLoginBtn')} <span>→</span>
          </button>
        </form>
        <p className="form-note">
          {t('newBuyer')} <Link to="/buyer/signup">{t('createAccount')}</Link>
        </p>
      </AuthCard>
    </PageShell>
  );
}

function BuyerSignup() {
  const { t } = useI18n();
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Telangana Agro Traders',
    email: 'telanganaagro@example.com',
    phone: '9848012345',
    location: 'Warangal',
    interested_crop: 'cotton',
    password: 'buyer123',
    confirm_password: 'buyer123',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.registerBuyer(formData);
      loginUser(res.user, res.token);
      navigate('/buyer/portal');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <AuthCard eyebrow={t('buyerRegistration')} title={t('createBuyerAccount')} text={t('registerBusinessText')}>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={submit}>
          <label className="field">
            <span>{t('businessName')}</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('businessNamePlaceholder')}
              required
            />
          </label>
          <div className="two-fields">
            <label className="field">
              <span>{t('emailAddress')}</span>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('emailPlaceholder')}
                required
              />
            </label>
            <label className="field">
              <span>{t('mobileNumber')}</span>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t('mobilePlaceholder')}
                required
              />
            </label>
          </div>
          <div className="two-fields">
            <label className="field">
              <span>{t('businessLocation')}</span>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder={t('businessLocationPlaceholder')}
                required
              />
            </label>
            <label className="field">
              <span>Primary Interested Crop</span>
              <select name="interested_crop" value={formData.interested_crop} onChange={handleChange} required>
                <option value="wheat">Wheat</option>
                <option value="rice">Rice</option>
                <option value="cotton">Cotton</option>
                <option value="tomato">Tomato</option>
                <option value="chilli">Chilli</option>
                <option value="maize">Maize</option>
              </select>
            </label>
          </div>
          <div className="two-fields">
            <label className="field">
              <span>{t('password')}</span>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
            <label className="field">
              <span>Confirm Password</span>
              <input
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <button className="button button-primary full" type="submit" disabled={loading}>
            {loading ? 'Registering...' : t('createAccountBtn')}
          </button>
        </form>
        <p className="form-note">{t('businessVerificationNote')}</p>
      </AuthCard>
    </PageShell>
  );
}

function BuyerPortal() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [farmerListings, setFarmerListings] = useState([]);
  const [selectedReqMatches, setSelectedReqMatches] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqs, listings] = await Promise.allSettled([
        api.getMyBuyerRequests(),
        api.getAllListings(),
      ]);

      if (reqs.status === 'fulfilled') setRequests(reqs.value || []);
      if (listings.status === 'fulfilled') setFarmerListings(listings.value || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const viewMatchesForReq = async (requestId) => {
    try {
      const matches = await api.getRequestMatches(requestId);
      setSelectedReqMatches({ requestId, matches });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageShell>
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">{t('buyerPortalLabel')}</p>
          <h1>{t('goodMorning')} {user?.name || ''}</h1>
          <p>{t('manageCurrentReq')}</p>
        </div>
        <Link className="button button-primary" to="/buyer/requirements/new">+ {t('postRequirement')}</Link>
      </section>

      <section className="stat-grid">
        <Stat label={t('activeRequirements')} value={requests.length || '1'} note={t('acrossCrops')} />
        <Stat label="Active Farmer Listings" value={farmerListings.length || '3'} note="Available today" />
        <Stat label={t('verifiedResponses')} value="100%" note="Direct verification" />
      </section>

      {selectedReqMatches && (
        <section className="panel listing-panel" style={{ marginBottom: '24px' }}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Direct Matches</p>
              <h2>Matching Farmers for Request #{selectedReqMatches.requestId}</h2>
            </div>
            <button className="small-button" onClick={() => setSelectedReqMatches(null)} type="button">Close</button>
          </div>
          {selectedReqMatches.matches.length === 0 ? (
            <p className="muted">No farmers with active listings for this crop yet.</p>
          ) : (
            selectedReqMatches.matches.map((m, i) => (
              <article className="buyer-row" key={i}>
                <div>
                  <h3>Farmer: {m.farmer_name}</h3>
                  <p>{m.crop} · {m.location} · {m.description || 'Harvest ready'}</p>
                </div>
                <span className="status-badge resolved">{m.match_reason}</span>
              </article>
            ))
          )}
        </section>
      )}

      <section className="panel listing-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('yourListings')}</p>
            <h2>{t('activeReq2')}</h2>
          </div>
        </div>

        {requests.length === 0 ? (
          <p className="muted">No requirements posted yet. Click "+ Post Requirement" to match with farmers.</p>
        ) : (
          requests.map((req) => (
            <article className="buyer-row" key={req.id}>
              <div>
                <h3>{req.crop_name} requirement</h3>
                <p>Location: {req.location} · Status: <span className="status-badge active">{req.status}</span></p>
              </div>
              <div className="buyer-offer">
                <button className="small-button" onClick={() => viewMatchesForReq(req.id)} type="button">
                  View Matched Farmers
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="panel listing-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Market Listings</p>
            <h2>Active Farmer Produce Available</h2>
          </div>
        </div>

        {farmerListings.length === 0 ? (
          <p className="muted">No farmer listings available right now.</p>
        ) : (
          farmerListings.map((lst) => (
            <article className="buyer-row" key={lst.id}>
              <div>
                <h3>{lst.crop_name} - Farmer: {lst.farmer_name}</h3>
                <p>Location: {lst.location} · {lst.description || 'Direct from farm'}</p>
              </div>
              <div className="buyer-offer">
                <span className="status-badge active">Available</span>
              </div>
            </article>
          ))
        )}
      </section>
    </PageShell>
  );
}

function NewBuyerRequirement() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    crop_name: 'tomato',
    location: 'Hyderabad',
  });
  const [loading, setLoading] = useState(false);
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.createBuyerRequest(formData);
      setPosted(true);
      setTimeout(() => {
        navigate('/buyer/portal');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to post requirement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <section className="page-intro">
        <p className="eyebrow">{t('buyerPortalLabel')}</p>
        <h1>{t('requirementTitle')}</h1>
        <p>{t('requirementText')}</p>
      </section>
      <section className="split-page">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          {error && <div className="error-banner">{error}</div>}
          {posted && <div className="success-banner">Requirement created! Redirecting to portal...</div>}

          <label className="field">
            <span>{t('crop')}</span>
            <select name="crop_name" value={formData.crop_name} onChange={handleChange} required>
              <option value="wheat">Wheat</option>
              <option value="rice">Rice</option>
              <option value="cotton">Cotton</option>
              <option value="tomato">Tomato</option>
              <option value="potato">Potato</option>
              <option value="onion">Onion</option>
              <option value="chilli">Chilli</option>
              <option value="maize">Maize</option>
              <option value="groundnut">Groundnut</option>
            </select>
          </label>

          <label className="field">
            <span>{t('location')}</span>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Hyderabad, Warangal, Pune"
              required
            />
          </label>

          <button className="button button-primary full" type="submit" disabled={loading}>
            {loading ? 'Publishing...' : t('postRequirement')} <span>→</span>
          </button>
        </form>

        <aside className="recommendation support-result">
          <p className="eyebrow">{posted ? t('requirementReady') : t('structuredMatching')}</p>
          <span className="recommendation-icon">📋</span>
          <h2>{posted ? t('requirementCreated') : t('useStandardValues')}</h2>
          <p>{t('cropByProductNote')}</p>
          <div className="tip">
            <strong>Matching Engine</strong>
            <span>Automatically connects your request with active farmers in the region.</span>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

function AdminLogin() {
  const { t } = useI18n();
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: 'admin@farmtomarket.com',
    password: 'Admin@123',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.loginAdmin(formData);
      loginUser(res.user, res.token);
      navigate('/admin/portal');
    } catch (err) {
      setError(err.message || 'Admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <AuthCard eyebrow={t('administration')} title={t('adminPortalAccess')} text={t('useAdminCredentials')}>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={submit}>
          <label className="field">
            <span>{t('adminEmail')}</span>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('adminEmailPlaceholder')}
              required
            />
          </label>
          <label className="field">
            <span>{t('password')}</span>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('passwordPlaceholder')}
              required
            />
          </label>
          <button className="button button-primary full" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : t('adminLoginBtn')} <span>→</span>
          </button>
        </form>
        <p className="form-note">
          Default Admin: <strong>admin@farmtomarket.com</strong> / <strong>Admin@123</strong>
        </p>
      </AuthCard>
    </PageShell>
  );
}

function AdminPortal() {
  const { t } = useI18n();
  const [stats, setStats] = useState({ total_farmers: 0, total_buyers: 0, total_support_queries: 0 });
  const [farmers, setFarmers] = useState([]);
  const [buyersList, setBuyersList] = useState([]);
  const [supportQueries, setSupportQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, farmersRes, buyersRes, supportRes] = await Promise.allSettled([
        api.getAdminStats(),
        api.getAdminFarmers(),
        api.getAdminBuyers(),
        api.getAdminSupport(),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (farmersRes.status === 'fulfilled') setFarmers(farmersRes.value || []);
      if (buyersRes.status === 'fulfilled') setBuyersList(buyersRes.value || []);
      if (supportRes.status === 'fulfilled') setSupportQueries(supportRes.value || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleResolve = async (id) => {
    try {
      await api.resolveSupportQuery(id, 'resolved');
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageShell>
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">{t('administration')}</p>
          <h1>{t('platformOverview')}</h1>
          <p>Live analytics and operational controls across farmers, buyers, and inquiries.</p>
        </div>
        <button className="button button-light" onClick={loadAdminData} type="button">
          Refresh Data
        </button>
      </section>

      <section className="stat-grid">
        <Stat label="Total Registered Farmers" value={stats.total_farmers} note="Verified Farmers" />
        <Stat label="Total Registered Buyers" value={stats.total_buyers} note="Active in Market" />
        <Stat label="Total Support Queries" value={stats.total_support_queries} note="Assistance requests" />
      </section>

      <section className="panel listing-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Support Queue</p>
            <h2>Farmer Support Requests</h2>
          </div>
        </div>

        {supportQueries.length === 0 ? (
          <p className="muted">No support queries pending.</p>
        ) : (
          supportQueries.map((q) => (
            <article className="buyer-row" key={q.id}>
              <div>
                <h3>Farmer: {q.farmer_name}</h3>
                <p>{q.question}</p>
              </div>
              <div className="review-actions">
                <span className={`status-badge ${q.status}`}>{q.status}</span>
                {q.status === 'open' && (
                  <button className="small-button" onClick={() => handleResolve(q.id)} type="button">
                    Mark Resolved
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </section>

      <section className="panel listing-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Buyer Network</p>
            <h2>Registered Buyers</h2>
          </div>
        </div>

        {buyersList.length === 0 ? (
          <p className="muted">No buyers registered.</p>
        ) : (
          buyersList.map((buyer) => (
            <article className="buyer-row" key={buyer.id}>
              <div>
                <h3>{buyer.name}</h3>
                <p>Email: {buyer.email} · Phone: {buyer.phone} · Interest: {buyer.interested_crop || 'Various'} · Location: {buyer.location || 'Pan-India'}</p>
              </div>
              <span className="status-badge resolved">Active</span>
            </article>
          ))
        )}
      </section>
    </PageShell>
  );
}

function AuthCard({ eyebrow, title, text, children }) {
  return (
    <section className="auth-page">
      <div className="auth-aside">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
        <div className="auth-art"><span>✦</span><span>⌁</span><span>◒</span></div>
      </div>
      <div className="auth-card">{children}</div>
    </section>
  );
}

function Stat({ label, value, note }) {
  return (
    <article className="stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{note}</span>
    </article>
  );
}

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
