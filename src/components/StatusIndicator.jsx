import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const StatusIndicator = ({ status = 'normal', title, message, value, unit }) => {
  const statusConfig = {
    optimal: {
      icon: CheckCircle,
      color: '#10b981',
      bgColor: 'from-green-900/50 to-slate-900',
      borderColor: 'border-green-500/30',
      label: 'Óptimo'
    },
    warning: {
      icon: AlertTriangle,
      color: '#f59e0b',
      bgColor: 'from-yellow-900/50 to-slate-900',
      borderColor: 'border-yellow-500/30',
      label: 'Advertencia'
    },
    danger: {
      icon: XCircle,
      color: '#ef4444',
      bgColor: 'from-red-900/50 to-slate-900',
      borderColor: 'border-red-500/30',
      label: 'Crítico'
    },
    normal: {
      icon: Info,
      color: '#3b82f6',
      bgColor: 'from-blue-900/50 to-slate-900',
      borderColor: 'border-blue-500/30',
      label: 'Normal'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`relative bg-gradient-to-br ${config.bgColor} backdrop-blur-xl rounded-2xl border ${config.borderColor} p-5 shadow-2xl overflow-hidden group hover:border-opacity-60 transition-all duration-500`}>
      {/* Línea superior animada */}
      <div 
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
          boxShadow: `0 0 10px ${config.color}40`
        }}
      />

      {/* Pulso animado para estados críticos */}
      {status === 'danger' && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{ 
            background: `radial-gradient(circle at top right, ${config.color}10, transparent)`
          }}
        />
      )}

      <div className="relative flex items-center gap-4">
        {/* Icono con animación */}
        <div className="relative">
          <div 
            className="absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse"
            style={{ backgroundColor: config.color }}
          />
          <div 
            className="relative p-3 rounded-full border"
            style={{ 
              backgroundColor: `${config.color}15`,
              borderColor: `${config.color}40`
            }}
          >
            <Icon 
              size={28} 
              style={{ color: config.color }}
              className={status === 'danger' ? 'animate-bounce' : ''}
            />
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              {title}
            </h3>
            <span 
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ 
                backgroundColor: `${config.color}20`,
                color: config.color
              }}
            >
              {config.label}
            </span>
          </div>
          
          {value && (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                {value}
              </span>
              {unit && <span className="text-sm text-slate-500">{unit}</span>}
            </div>
          )}
          
          {message && (
            <p className="text-sm text-slate-400 mt-1">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;