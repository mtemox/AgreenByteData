import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const HistoryChart = ({ data, dataKey, color, title, unit }) => {
  
  const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Tooltip personalizado futurista
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl px-4 py-3 shadow-2xl">
          <p className="text-slate-400 text-xs font-semibold mb-1">
            {formatTime(label)}
          </p>
          <p className="text-white text-lg font-bold flex items-baseline gap-1">
            <span style={{ color: color }}>{payload[0].value}</span>
            <span className="text-xs text-slate-500">{unit}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
      {/* Efecto de brillo de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Línea decorativa superior */}
      <div 
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 10px ${color}40`
        }}
      />

      {/* Header */}
      <div className="relative mb-6 flex items-center gap-3">
        <div className="w-1 h-6 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}60` }} />
        <h3 className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Historial de {title}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
      </div>
      
      {/* Chart Container - SOLUCIÓN DEFINITIVA con style directo */}
      <div className="relative" style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
              {/* Glow effect para el área */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#334155" 
              strokeOpacity={0.3}
            />
            
            <XAxis 
              dataKey="created_at" 
              tickFormatter={formatTime}
              stroke="#64748b"
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            
            <YAxis 
              stroke="#64748b"
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              unit={unit}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#color${dataKey})`}
              filter="url(#glow)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Detalles decorativos en esquinas */}
      <div className="absolute bottom-2 right-2 w-16 h-16 border-b border-r border-slate-700/30 rounded-br-2xl" />
      <div className="absolute top-2 left-2 w-16 h-16 border-t border-l border-slate-700/30 rounded-tl-2xl" />
    </div>
  );
};

export default HistoryChart;