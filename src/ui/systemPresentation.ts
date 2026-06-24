import { Cpu, Crosshair, Radar, Shield, Sparkles, Zap } from 'lucide-react';
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import type { SystemId } from '../types';

type SystemPresentation = {
  icon: ComponentType<LucideProps>;
  accent: string;
};

export const SYSTEM_PRESENTATION: Record<SystemId, SystemPresentation> = {
  mobility: { icon: Zap, accent: '#19a7a5' },
  weapons: { icon: Crosshair, accent: '#e7583e' },
  neural: { icon: Sparkles, accent: '#7c5cff' },
  defence: { icon: Shield, accent: '#e2a93b' },
  reactor: { icon: Cpu, accent: '#f0b947' },
  sensors: { icon: Radar, accent: '#8fcb6b' }
};
