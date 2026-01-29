import React from 'react';

const SensorCard = ({ title, value, unit, icon: Icon, color }) => {
  return (
    <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-600 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-900/50">
      {/* Efecto de brillo superior */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Línea decorativa superior con el color del sensor */}
      <div 
        className="h-0.5 w-full"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 10px ${color}40`
        }}
      />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          {/* Contenido de texto */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              {title}
            </p>
            
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                {value || "--"}
              </span>
              <span className="text-sm font-medium text-slate-500 mt-2">
                {unit}
              </span>
            </div>
          </div>
          
          {/* Icono con efecto holográfico */}
          <div className="relative">
            {/* Glow effect detrás del icono */}
            <div 
              className="absolute inset-0 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"
              style={{ backgroundColor: color }}
            />
            
            {/* Contenedor del icono */}
            <div 
              className="relative p-4 rounded-2xl backdrop-blur-sm border transition-all duration-500 group-hover:scale-110"
              style={{ 
                backgroundColor: `${color}15`,
                borderColor: `${color}40`
              }}
            >
              <Icon 
                size={28} 
                style={{ color: color }}
                className="relative z-10"
              />
            </div>
          </div>
        </div>
        
        {/* Barra de progreso/indicador minimalista */}
        <div className="mt-5 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000 shadow-lg"
            style={{ 
              width: value ? '75%' : '0%',
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}60`
            }}
          />
        </div>
      </div>
      
      {/* Detalles decorativos en las esquinas */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
        <div className="absolute top-2 right-2 w-full h-full border-t border-r border-slate-600 rounded-tr-2xl" />
      </div>
      <div className="absolute bottom-0 left-0 w-20 h-20 opacity-5">
        <div className="absolute bottom-2 left-2 w-full h-full border-b border-l border-slate-600 rounded-bl-2xl" />
      </div>
    </div>
  );
};

export default SensorCard;