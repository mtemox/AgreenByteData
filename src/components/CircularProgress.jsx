import React from 'react';

const CircularProgress = ({ value, max = 100, title, subtitle, color, icon: Icon }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 p-6 shadow-2xl overflow-hidden group hover:border-slate-600 transition-all duration-500">
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

      <div className="relative flex flex-col items-center">
        {/* SVG Círculo */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="absolute w-full h-full transform -rotate-90">
            {/* Círculo de fondo */}
            <circle
              cx="88"
              cy="88"
              r="70"
              fill="none"
              stroke="#1e293b"
              strokeWidth="10"
            />
            
            {/* Círculo de progreso */}
            <circle
              cx="88"
              cy="88"
              r="70"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${color}60)`
              }}
            />
          </svg>

          {/* Contenido central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            {Icon && (
              <div className="relative mb-2">
                <div 
                  className="absolute inset-0 rounded-full blur-xl opacity-40"
                  style={{ backgroundColor: color }}
                />
                <div 
                  className="relative p-3 rounded-full border"
                  style={{ 
                    backgroundColor: `${color}15`,
                    borderColor: `${color}40`
                  }}
                >
                  <Icon size={24} style={{ color: color }} />
                </div>
              </div>
            )}
            
            <div className="text-2xl font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
              {percentage.toFixed(0)}%
            </div>
            
            <div className="text-xs text-slate-500 font-semibold mt-1">
              {value} / {max}
            </div>
          </div>
        </div>

        {/* Textos */}
        <div className="text-center mt-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Decoración esquinas */}
      <div className="absolute bottom-2 right-2 w-12 h-12 border-b border-r border-slate-700/30 rounded-br-2xl" />
    </div>
  );
};

export default CircularProgress;