import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MiniChart = ({ data, dataKey, title, value, unit, color }) => {
  if (!data || data.length === 0) return null;

  const values = data.map(item => parseFloat(item[dataKey])).filter(val => !isNaN(val));
  if (values.length === 0) return null;

  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;

  // Crear puntos SVG
  const points = values.map((val, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = 100 - ((val - minVal) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  // Calcular tendencia
  const first = values[0];
  const last = values[values.length - 1];
  const change = last - first;
  const changePercent = ((change / first) * 100).toFixed(1);

  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 p-5 shadow-2xl overflow-hidden group hover:border-slate-600 transition-all duration-500">
      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Línea superior */}
      <div 
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 10px ${color}40`
        }}
      />
      
      {/* Header */}
      <div className="relative flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
              {value}
            </span>
            <span className="text-sm text-slate-500">{unit}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div 
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
            style={{ 
              backgroundColor: change > 0 ? 'rgba(16, 185, 129, 0.1)' : change < 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)',
              border: `1px solid ${change > 0 ? 'rgba(16, 185, 129, 0.3)' : change < 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(100, 116, 139, 0.3)'}`,
              color: change > 0 ? '#10b981' : change < 0 ? '#ef4444' : '#64748b'
            }}
          >
            {change > 0 ? <TrendingUp size={14} /> : change < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
            {Math.abs(parseFloat(changePercent))}%
          </div>
        </div>
      </div>

      {/* Mini Chart SVG */}
      <div className="relative">
        <svg className="w-full h-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Área de relleno */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill={`url(#gradient-${dataKey})`}
            opacity="0.3"
          />
          
          {/* Línea */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            style={{
              filter: `drop-shadow(0 0 4px ${color}60)`
            }}
          />
          
          {/* Puntos en los extremos */}
          <circle
            cx="0"
            cy={100 - ((values[0] - minVal) / range) * 100}
            r="2"
            fill={color}
            style={{
              filter: `drop-shadow(0 0 4px ${color})`
            }}
          />
          <circle
            cx="100"
            cy={100 - ((values[values.length - 1] - minVal) / range) * 100}
            r="2"
            fill={color}
            style={{
              filter: `drop-shadow(0 0 4px ${color})`
            }}
          />
          
          {/* Gradiente */}
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.5" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Rango min/max */}
      <div className="relative flex justify-between text-xs text-slate-600 font-semibold mt-2">
        <span>Min: {minVal.toFixed(1)}</span>
        <span>Max: {maxVal.toFixed(1)}</span>
      </div>

      {/* Decoración esquinas */}
      <div className="absolute bottom-2 left-2 w-10 h-10 border-b border-l border-slate-700/30 rounded-bl-2xl" />
    </div>
  );
};

export default MiniChart;