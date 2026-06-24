import type { DamageMarker, HeatState } from '../types';

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getDamageSeverity(marker: DamageMarker) {
  return marker.isCritical ? 'critical' : 'warning';
}

export function getDamageMarkerId(marker: DamageMarker) {
  return marker.id ?? marker.name;
}

export function getHeatState(heat: number): HeatState {
  if (heat >= 6) return { label: 'Redline', range: '6-8', className: 'redline' };
  if (heat >= 4) return { label: 'Hot', range: '4-5', className: 'hot' };
  return { label: 'Steady', range: '0-3', className: 'steady' };
}
