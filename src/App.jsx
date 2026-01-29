import { downloadCSV } from './utils/export';
import { Download } from 'lucide-react';
import React, { useState } from 'react';
import { useThingSpeak } from './hooks/useThingSpeak';
import { SENSOR_MAP } from './services/thingspeak';
import SensorCard from './components/SensorCard';
import HistoryChart from './components/HistoryChart';
import { 
  Thermometer, Droplets, Sun, Gauge, CloudSun, Sprout, Activity, Wifi, WifiOff 
} from 'lucide-react';
import StatsPanel from './components/StatsPanel';
import { calculateVPD, getVPDStatus } from './utils/metrics';

import GaugeWidget from './components/GaugeWidget';
import CircularProgress from './components/CircularProgress';
import MiniChart from './components/MiniChart';
import StatusIndicator from './components/StatusIndicator';

const ICONS = {
  field1: Thermometer,
  field2: Droplets,
  field3: Sprout,
  field4: Sun,
  field5: Gauge,
  field6: CloudSun
};

function App() {
  
  const { data, channelInfo, loading, error } = useThingSpeak();
  const [selectedField, setSelectedField] = useState('field1');

  const latestFeed = data && data.length > 0 ? data[data.length - 1] : null;

  // Calculamos VPD si tenemos los datos necesarios
  const vpd = latestFeed ? calculateVPD(latestFeed.field1, latestFeed.field2) : null;
  const vpdStatus = getVPDStatus(vpd);

  // Pantalla de carga futurista
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block">
          {/* Círculo exterior giratorio */}
          <div className="w-20 h-20 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
          {/* Icono central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Sprout className="text-emerald-400" size={32} />
          </div>
        </div>
        <p className="mt-6 text-slate-400 font-semibold tracking-wider animate-pulse">
          Conectando con el Huerto Inteligente...
        </p>
      </div>
    </div>
  );

  // Pantalla de error
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="bg-red-950/30 border border-red-800/50 rounded-2xl p-8 max-w-md backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/30">
            <WifiOff className="text-red-400" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-400">Error de Conexión</h3>
            <p className="text-slate-400 text-sm mt-1">No se pudo conectar con ThingSpeak</p>
          </div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
          <p className="text-red-300 text-sm font-mono">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Efectos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern de fondo */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto p-6">
        
        {/* Header mejorado */}
        <header className="mb-10">
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Lado izquierdo */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-40" />
                  <div className="relative p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl backdrop-blur-sm">
                    <Sprout className="text-emerald-400" size={32} />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">
                    {channelInfo ? channelInfo.name : 'Monitor IoT'}
                  </h1>
                  <p className="text-slate-400 mt-1 flex items-center gap-2">
                    <Wifi className="text-emerald-500" size={14} />
                    Panel de control y análisis de datos
                  </p>
                </div>
              </div>

              {/* Lado derecho - Última actualización */}
              <div className="bg-slate-800/50 rounded-xl px-4 py-3 border border-slate-700/50">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Última Lectura
                </div>
                <div className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  {latestFeed ? new Date(latestFeed.created_at).toLocaleString() : '--'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Grid de Tarjetas de Sensores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {Object.keys(SENSOR_MAP).map((fieldKey) => {
            const sensorConfig = SENSOR_MAP[fieldKey];
            const IconComponent = ICONS[fieldKey] || Thermometer;
            const isSelected = selectedField === fieldKey;
            
            return (
              <div 
                key={fieldKey} 
                onClick={() => setSelectedField(fieldKey)}
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'scale-105 ring-2 ring-offset-2 ring-offset-slate-900' 
                    : 'hover:scale-[1.02]'
                }`}
                style={{ 
                  ringColor: isSelected ? sensorConfig.color : 'transparent'
                }}
              >
                <SensorCard
                  title={sensorConfig.name}
                  value={latestFeed ? latestFeed[fieldKey] : '--'}
                  unit={sensorConfig.unit}
                  color={sensorConfig.color}
                  icon={IconComponent}
                />
              </div>
            );
          })}
        </div>

        {/* Sección de Widgets Adicionales - Después del grid de sensores */}
        {latestFeed && data.length > 0 && (
          <>
            <div className="mb-6 flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-blue-500" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Monitoreo en Tiempo Real
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              
              {/* Velocímetro de Temperatura */}
              <GaugeWidget
                value={parseFloat(latestFeed.field1) || 0}
                min={0}
                max={50}
                unit="°C"
                title="Temperatura Interior"
                color="#ef4444"
                dangerZone={35}
                optimalZone={[18, 28]}
              />

              {/* Progreso Circular de Humedad */}
              <CircularProgress
                value={parseFloat(latestFeed.field2) || 0}
                max={100}
                title="Nivel de Humedad"
                subtitle="Porcentaje actual"
                color="#3b82f6"
                icon={Droplets}
              />

              {/* Mini Chart de Luz */}
              <MiniChart
                data={data.slice(-20)}
                dataKey="field4"
                title="Intensidad Lumínica"
                value={latestFeed.field4}
                unit="lux"
                color="#f59e0b"
              />

              {/* Mini Chart de Presión */}
              <MiniChart
                data={data.slice(-20)}
                dataKey="field5"
                title="Presión Atmosférica"
                value={latestFeed.field5}
                unit="hPa"
                color="#8b5cf6"
              />
            </div>
          </>
        )}

        {/* Panel de Inteligencia Agronómica (VPD) */}
        {latestFeed && (
          <div className="relative group bg-gradient-to-br from-emerald-900/80 to-teal-900/80 backdrop-blur-xl border border-emerald-700/50 rounded-2xl p-6 shadow-2xl mb-10 overflow-hidden hover:border-emerald-600/50 transition-all duration-500">
            {/* Efecto de brillo */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Línea superior decorativa */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" style={{ boxShadow: '0 0 10px rgba(52, 211, 153, 0.4)' }} />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Información izquierda */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400 rounded-xl blur-xl opacity-40" />
                  <div className="relative p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl backdrop-blur-sm">
                    <Sprout className="text-emerald-300" size={24} />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent mb-2 flex items-center gap-2">
                    Estado Metabólico de la Planta (VPD)
                  </h2>
                  <p className="text-sm text-emerald-100/80 max-w-xl">
                    Calculado en base a Temperatura ({latestFeed.field1}°C) y Humedad ({latestFeed.field2}%). 
                    Indica si la planta puede respirar correctamente.
                  </p>
                </div>
              </div>

              {/* Datos VPD derecha */}
              <div className="bg-slate-900/50 rounded-xl px-6 py-4 border border-emerald-500/30 backdrop-blur-sm min-w-[200px]">
                <div className="text-center">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
                    VPD Actual
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                    {vpd || '--'} 
                    <span className="text-base font-normal text-emerald-300/60 ml-1">kPa</span>
                  </div>
                  <div className={`mt-3 inline-block px-3 py-1 rounded-lg text-sm font-bold ${vpdStatus.color}`}>
                    {vpdStatus.label}
                  </div>
                </div>
              </div>
            </div>

            {/* Decoración esquinas */}
            <div className="absolute bottom-2 right-2 w-16 h-16 border-b border-r border-emerald-700/30 rounded-br-2xl" />
          </div>
        )}

        {/* Sección de Análisis y Gráfico */}
        {data.length > 0 && (
          <div className="space-y-6">
            
            {/* Header de sección de análisis con botón de exportar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div 
                    className="absolute inset-0 rounded-xl blur-xl opacity-40"
                    style={{ backgroundColor: SENSOR_MAP[selectedField].color }}
                  />
                  <div 
                    className="relative p-3 rounded-xl backdrop-blur-sm border"
                    style={{ 
                      backgroundColor: `${SENSOR_MAP[selectedField].color}15`,
                      borderColor: `${SENSOR_MAP[selectedField].color}40`
                    }}
                  >
                    <Activity 
                      size={24}
                      style={{ color: SENSOR_MAP[selectedField].color }}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Análisis Detallado
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {SENSOR_MAP[selectedField].name}
                  </p>
                </div>
              </div>

              {/* Botón de Exportar CSV */}
              <button 
                onClick={() => downloadCSV(data)}
                disabled={loading || !data.length}
                className="group relative bg-gradient-to-br from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 border border-slate-600 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:scale-105 overflow-hidden"
              >
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-center gap-2">
                  <Download size={18} className="group-hover:animate-bounce" />
                  <span>Exportar CSV</span>
                </div>
              </button>
            </div>

            <div className="flex-1 h-px bg-gradient-to-r from-slate-700 via-slate-600 to-transparent mb-6" />

            {/* Panel de Estadísticas */}
            <StatsPanel 
              data={data}
              dataKey={selectedField}
              color={SENSOR_MAP[selectedField].color}
              unit={SENSOR_MAP[selectedField].unit}
            />

            {/* Gráfico Histórico */}
            <HistoryChart 
              data={data}
              dataKey={selectedField}
              color={SENSOR_MAP[selectedField].color}
              title={SENSOR_MAP[selectedField].name}
              unit={SENSOR_MAP[selectedField].unit}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            Powered by ThingSpeak IoT Platform
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </footer>

      </div>
    </div>
  );
}

export default App;