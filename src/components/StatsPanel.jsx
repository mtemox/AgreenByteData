import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, AlertTriangle, BarChart3 } from 'lucide-react';
import { calculateRateOfChange } from '../utils/metrics';

const StatsPanel = ({ data, dataKey, color, unit }) => {
  
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const values = data
      .map(item => parseFloat(item[dataKey]))
      .filter(val => !isNaN(val));

    if (values.length === 0) return null;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = (sum / values.length).toFixed(1);

    // Calculamos la tasa de cambio (Predicción)
    const rate = calculateRateOfChange(data, dataKey);
    const rateVal = parseFloat(rate);

    // Decidimos el mensaje según la velocidad de cambio
    let prediction = "Estable";
    let alertColor = "text-slate-400";
    let bgAlert = "from-slate-900 to-slate-800";
    let borderAlert = "border-slate-700/50";
    let iconAlert = Minus;
    
    if (rateVal > 5) {
      prediction = "Subiendo Rápido";
      alertColor = "text-red-400";
      bgAlert = "from-red-950/50 to-slate-900";
      borderAlert = "border-red-500/30";
      iconAlert = TrendingUp;
    } else if (rateVal > 1) {
      prediction = "Subiendo Levemente";
      alertColor = "text-orange-400";
      bgAlert = "from-orange-950/30 to-slate-900";
      borderAlert = "border-orange-500/30";
      iconAlert = TrendingUp;
    } else if (rateVal < -5) {
      prediction = "Cayendo en Picada";
      alertColor = "text-red-400";
      bgAlert = "from-red-950/50 to-slate-900";
      borderAlert = "border-red-500/30";
      iconAlert = TrendingDown;
    } else if (rateVal < -1) {
      prediction = "Bajando Levemente";
      alertColor = "text-blue-400";
      bgAlert = "from-blue-950/30 to-slate-900";
      borderAlert = "border-blue-500/30";
      iconAlert = TrendingDown;
    }

    return { min, max, avg, rate: rateVal, prediction, alertColor, bgAlert, borderAlert, iconAlert };
  }, [data, dataKey]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Tarjeta de PROMEDIO */}
      <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-all duration-500 hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent" style={{ boxShadow: '0 0 10px rgba(168, 85, 247, 0.3)' }} />
        
        <div className="relative p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-purple-500" />
              Promedio
            </p>
            <p className="text-3xl font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
              {stats.avg} <span className="text-sm font-normal text-slate-500">{unit}</span>
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 rounded-xl blur-xl opacity-30" />
            <div className="relative p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm">
              <Activity size={20} className="text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta de RANGO (Min/Max) */}
      <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-all duration-500 hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)' }} />
        
        <div className="relative p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-500" />
            Min / Max
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                {stats.min}
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-2xl font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                {stats.max}
              </span>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-xl blur-xl opacity-30" />
              <div className="relative p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm">
                <BarChart3 size={20} className="text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta de VELOCIDAD DE CAMBIO */}
      <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-all duration-500 hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div 
          className="h-0.5 w-full bg-gradient-to-r from-transparent to-transparent"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${stats.rate > 0 ? '#f97316' : '#3b82f6'}, transparent)`,
            boxShadow: `0 0 10px ${stats.rate > 0 ? 'rgba(249, 115, 22, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
          }}
        />
        
        <div className="relative p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className={`w-1 h-1 rounded-full ${stats.rate > 0 ? 'bg-orange-500' : 'bg-blue-500'}`} />
              Velocidad
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                {Math.abs(stats.rate).toFixed(1)}
              </p>
              <span className="text-xs text-slate-500">{unit}/h</span>
            </div>
          </div>
          
          <div className="relative">
            <div 
              className="absolute inset-0 rounded-xl blur-xl opacity-30"
              style={{ backgroundColor: stats.rate > 0 ? '#f97316' : '#3b82f6' }}
            />
            <div 
              className="relative p-3 rounded-xl backdrop-blur-sm border"
              style={{ 
                backgroundColor: stats.rate > 0 ? 'rgba(249, 115, 22, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                borderColor: stats.rate > 0 ? 'rgba(249, 115, 22, 0.3)' : 'rgba(59, 130, 246, 0.3)'
              }}
            >
              {stats.rate > 0 ? 
                <TrendingUp size={20} className="text-orange-400" /> : 
                <TrendingDown size={20} className="text-blue-400" />
              }
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta de PREDICCIÓN/ALERTA */}
      <div className={`group relative bg-gradient-to-br ${stats.bgAlert} rounded-xl border ${stats.borderAlert} overflow-hidden hover:border-slate-600 transition-all duration-500 hover:shadow-2xl`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div 
          className="h-0.5 w-full"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${
              stats.alertColor === 'text-red-400' ? '#ef4444' : 
              stats.alertColor === 'text-orange-400' ? '#f97316' : 
              stats.alertColor === 'text-blue-400' ? '#3b82f6' : '#64748b'
            }, transparent)`,
            boxShadow: `0 0 10px ${
              stats.alertColor === 'text-red-400' ? 'rgba(239, 68, 68, 0.3)' : 
              stats.alertColor === 'text-orange-400' ? 'rgba(249, 115, 22, 0.3)' : 
              stats.alertColor === 'text-blue-400' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(100, 116, 139, 0.3)'
            }`
          }}
        />
        
        <div className="relative p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <AlertTriangle size={12} className={stats.alertColor} />
              Análisis
            </p>
            <p className={`text-xl font-bold ${stats.alertColor}`}>
              {stats.prediction}
            </p>
          </div>
          
          <div className="relative">
            <div 
              className="absolute inset-0 rounded-xl blur-xl opacity-30"
              style={{ 
                backgroundColor: stats.alertColor === 'text-red-400' ? '#ef4444' : 
                                stats.alertColor === 'text-orange-400' ? '#f97316' : 
                                stats.alertColor === 'text-blue-400' ? '#3b82f6' : '#64748b'
              }}
            />
            <div 
              className="relative p-3 rounded-xl backdrop-blur-sm border"
              style={{ 
                backgroundColor: stats.alertColor === 'text-red-400' ? 'rgba(239, 68, 68, 0.1)' : 
                                stats.alertColor === 'text-orange-400' ? 'rgba(249, 115, 22, 0.1)' : 
                                stats.alertColor === 'text-blue-400' ? 'rgba(59, 130, 246, 0.1)' : 
                                'rgba(100, 116, 139, 0.1)',
                borderColor: stats.alertColor === 'text-red-400' ? 'rgba(239, 68, 68, 0.3)' : 
                            stats.alertColor === 'text-orange-400' ? 'rgba(249, 115, 22, 0.3)' : 
                            stats.alertColor === 'text-blue-400' ? 'rgba(59, 130, 246, 0.3)' : 
                            'rgba(100, 116, 139, 0.3)'
              }}
            >
              <stats.iconAlert size={20} className={stats.alertColor} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StatsPanel;