import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;
  const s = status.toUpperCase();

  let badgeClass = 'badge-gray';
  let label = status;

  if (s === 'GROWING' || s === 'AVAILABLE' || s === 'LOW') {
    badgeClass = 'badge-green';
  } else if (s === 'FLOWERING' || s === 'MEDIUM' || s === 'SUBSIDIZED') {
    badgeClass = 'badge-amber';
  } else if (s === 'HARVESTED' || s === 'INFO_ONLY') {
    badgeClass = 'badge-blue';
  } else if (s === 'HIGH' || s === 'EMERGENCY' || s === 'DAMAGED') {
    badgeClass = 'badge-red';
  } else if (s === 'SOWN') {
    badgeClass = 'badge-purple';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }}></span>
      {label}
    </span>
  );
};
