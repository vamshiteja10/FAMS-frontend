import React from 'react';

export const WeatherWidget = () => {
  return (
    <div className="weather-widget">
      <div className="weather-metric">
        <span style={{ fontSize: 36 }}>⛅</span>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>29°C · Partly Cloudy</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>District Agri Weather Station (Live Advisory)</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
        <div>
          <span style={{ opacity: 0.8 }}>Humidity:</span> <strong>64%</strong>
        </div>
        <div>
          <span style={{ opacity: 0.8 }}>Rain Chance:</span> <strong>20%</strong>
        </div>
        <div>
          <span style={{ opacity: 0.8 }}>Wind:</span> <strong>12 km/h (SW)</strong>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 6 }}>
          🌱 <strong>Good condition for foliar spray</strong>
        </div>
      </div>
    </div>
  );
};
