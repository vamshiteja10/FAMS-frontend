import React from 'react';

export const MarketPriceTicker = () => {
  const prices = [
    { crop: 'Paddy (Basmati)', mandi: 'Karnal', price: '₹4,150/qtl', change: '+2.1%' },
    { crop: 'Cotton (Medium)', mandi: 'Rajkot', price: '₹7,200/qtl', change: '+1.4%' },
    { crop: 'Wheat (Sharbati)', mandi: 'Sehore', price: '₹3,420/qtl', change: '-0.5%' },
    { crop: 'Soybean (Yellow)', mandi: 'Indore', price: '₹4,680/qtl', change: '+0.8%' },
    { crop: 'Groundnut', mandi: 'Kurnool', price: '₹6,400/qtl', change: '+1.9%' },
    { crop: 'Maize', mandi: 'Davangere', price: '₹2,250/qtl', change: '+0.4%' }
  ];

  return (
    <div className="market-ticker">
      <span className="ticker-title">APMC Mandi Rates</span>
      <div className="ticker-items">
        {prices.concat(prices).map((item, idx) => (
          <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <strong>{item.crop}:</strong>
            <span style={{ color: '#86efac' }}>{item.price}</span>
            <span style={{ fontSize: 11, color: item.change.startsWith('+') ? '#4ade80' : '#f87171' }}>
              ({item.change})
            </span>
            <span style={{ opacity: 0.4 }}>|</span>
          </span>
        ))}
      </div>
    </div>
  );
};
