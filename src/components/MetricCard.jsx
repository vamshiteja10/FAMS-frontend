import React from 'react';

export const MetricCard = ({ title, value, icon, colorTheme = 'green', subtitle }) => {
  const colorMap = {
    green: 'icon-box-green',
    blue: 'icon-box-blue',
    amber: 'icon-box-amber',
    purple: 'icon-box-purple'
  };

  return (
    <div className="metric-card">
      <div className="metric-info">
        <h4>{title}</h4>
        <div className="value">{value}</div>
        {subtitle && <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{subtitle}</p>}
      </div>
      <div className={`metric-icon-box ${colorMap[colorTheme] || 'icon-box-green'}`}>
        {icon}
      </div>
    </div>
  );
};
