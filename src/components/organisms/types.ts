import React from 'react';
import { Info, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export type StatusKey = 'booked' | 'limited' | 'available' | 'standard';

export interface StatusConfigValue {
  label: string;
  icon: React.ElementType;
  classes: {
    container: string;
    badge: string;
    icon: string;
    modifier?: string;
    legendMarker: string;
  };
}

export const STATUS_CONFIG: Record<StatusKey, StatusConfigValue> = {
  available: {
    label: 'Disponible',
    icon: CheckCircle2,
    classes: {
      container: 'bg-emerald-50 border-emerald-100',
      badge: 'border-emerald-500 text-emerald-700 bg-emerald-50',
      icon: 'text-emerald-600',
      modifier: 'bg-emerald-500 text-white font-bold hover:bg-emerald-600! hover:text-white!',
      legendMarker: 'bg-emerald-500 border-emerald-600',
    }
  },
  limited: {
    label: 'Limitada',
    icon: AlertCircle,
    classes: {
      container: 'bg-amber-50 border-amber-100',
      badge: 'border-amber-500 text-amber-700 bg-amber-50',
      icon: 'text-amber-600',
      modifier: 'bg-amber-500 text-amber-950 font-medium hover:bg-amber-600! hover:text-amber-950!',
      legendMarker: 'bg-amber-500 border-amber-600',
    }
  },
  booked: {
    label: 'Completo',
    icon: XCircle,
    classes: {
      container: 'bg-slate-50 border-slate-100',
      badge: 'border-slate-300 text-slate-500 bg-slate-50',
      icon: 'text-slate-400',
      modifier: 'bg-slate-100 text-slate-400 line-through opacity-50 cursor-not-allowed',
      legendMarker: 'bg-slate-200 opacity-50',
    }
  },
  standard: {
    label: 'Estándar',
    icon: Info,
    classes: {
      container: 'bg-accent/5 border-border',
      badge: 'border-border text-muted-foreground bg-muted/20',
      icon: 'text-muted-foreground',
      legendMarker: 'bg-accent border-border',
    }
  }
};
