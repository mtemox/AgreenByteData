import React from 'react';

const GaugeWidget = ({ value, min = 0, max = 100, unit, title, color, dangerZone = 80, optimalZone = [40, 60] }) => {
  // Calcular el ángulo (de -135° a 135°, total 270°)
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  const angle = -135 + (percentage / 100) * 270;
  
  // Determinar color según zona
  let statusColor = color;
  if (value >= dangerZone) {
    statusColor = '#ef4444'; // rojo
  } else if (value >= optimalZone[0] && value <= optimalZone[1]) {
    statusColor = '#10b981'; // verde
  } else {
    statusColor = '#f59e0b'; // amarillo
  }

  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 p-6 shadow-2xl overflow-hidden group hover:border-slate-600 transition-all duration-500">
      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Línea superior */}
      <div 
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${statusColor}, transparent)`,
          boxShadow: `0 0 10px ${statusColor}40`
        }}
      />

      {/* Título */}
      <div className="relative mb-2 text-center">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          {title}
        </h3>
      </div>

      {/* Gauge Container */}
      <div className="relative flex items-center justify-center" style={{ height: '200px' }}>
        {/* SVG Gauge - Capa de fondo */}
        <svg className="absolute w-48 h-48" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
          {/* Fondo del arco */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#1e293b"
            strokeWidth="12"
            strokeDasharray="502"
            strokeDashoffset="125.5"
          />
          
          {/* Zona óptima (verde) */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#10b98120"
            strokeWidth="12"
            strokeDasharray="502"
            strokeDashoffset={125.5 - (((optimalZone[0] - min) / (max - min)) * 377)}
          />
          
          {/* Zona de peligro (rojo) */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#ef444420"
            strokeWidth="12"
            strokeDasharray="502"
            strokeDashoffset={125.5 - (((dangerZone - min) / (max - min)) * 377)}
          />
          
          {/* Arco de progreso principal */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={statusColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="502"
            strokeDashoffset={125.5 - ((percentage / 100) * 377)}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${statusColor}60)`
            }}
          />
          
          {/* Marcas del medidor */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const tickAngle = -135 + (tick / 100) * 270;
            const rad = (tickAngle * Math.PI) / 180;
            const x1 = 100 + 72 * Math.cos(rad);
            const y1 = 100 + 72 * Math.sin(rad);
            const x2 = 100 + 78 * Math.cos(rad);
            const y2 = 100 + 78 * Math.sin(rad);
            
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#475569"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Capa de aguja - DEBE estar DESPUÉS del SVG pero ANTES del texto */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Aguja */}
            <div
              className="absolute rounded-full origin-bottom transition-all duration-700 ease-out"
              style={{
                width: '3px',
                height: '65px',
                background: `linear-gradient(to top, ${statusColor}, ${statusColor}60)`,
                transform: `rotate(${angle}deg)`,
                bottom: '50%',
                boxShadow: `0 0 15px ${statusColor}80`,
                transformOrigin: 'bottom center'
              }}
            />
            
            {/* Centro de la aguja */}
            <div 
              className="absolute w-4 h-4 rounded-full"
              style={{ 
                backgroundColor: statusColor,
                boxShadow: `0 0 20px ${statusColor}, 0 0 40px ${statusColor}60`,
                zIndex: 10
              }}
            />
          </div>
        </div>

        {/* Valor central - DEBE estar encima de todo */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ zIndex: 20, pointerEvents: 'none', paddingTop: '70px' }}
        >
          <div className="text-2xl font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
            {value}
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-1">
            {unit}
          </div>
        </div>
      </div>

      {/* Indicadores min/max */}
      <div className="relative flex justify-between text-xs text-slate-500 font-semibold mt-2 px-2">
        <span>{min}</span>
        <span className="text-slate-400">{((max - min) / 2 + min).toFixed(0)}</span>
        <span>{max}</span>
      </div>

      {/* Badge de estado */}
      <div className="relative mt-3 flex justify-center">
        <div 
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ 
            backgroundColor: `${statusColor}20`,
            color: statusColor,
            border: `1px solid ${statusColor}40`
          }}
        >
          {value >= dangerZone ? '⚠️ Peligro' : 
           value >= optimalZone[0] && value <= optimalZone[1] ? '✓ Óptimo' : 
           '⚡ Moderado'}
        </div>
      </div>

      {/* Decoración esquinas */}
      <div className="absolute bottom-2 right-2 w-12 h-12 border-b border-r border-slate-700/30 rounded-br-2xl" />
    </div>
  );
};

export default GaugeWidget;