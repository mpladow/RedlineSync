export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getDamageSeverity(marker) {
  return marker.roll === '1-2' ? 'critical' : 'warning';
}

export function getHeatState(heat) {
  if (heat >= 6) return { label: 'Redline', range: '6-8', className: 'redline' };
  if (heat >= 4) return { label: 'Hot', range: '4-5', className: 'hot' };
  return { label: 'Steady', range: '0-3', className: 'steady' };
}
