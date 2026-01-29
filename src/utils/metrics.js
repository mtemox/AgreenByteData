/**
 * Calcula el Déficit de Presión de Vapor (VPD) en kPa.
 */
export const calculateVPD = (temp, hum) => {
  // 1. Validación estricta: Si no hay datos, devolvemos null
  if (temp === undefined || temp === null || hum === undefined || hum === null) {
    return null;
  }

  // 2. Conversión: Aseguramos que sean números flotantes
  const t = parseFloat(temp);
  const h = parseFloat(hum);

  // 3. Segunda validación: Si la conversión falló (NaN), devolvemos null
  if (isNaN(t) || isNaN(h)) return null;

  // 4. Fórmula Matemática
  const svp = 0.61078 * Math.exp((17.27 * t) / (t + 237.3));
  const avp = svp * (h / 100);
  const vpd = svp - avp;

  // Si el resultado es negativo (físicamente imposible pero posible por error de sensor), ponemos 0
  return Math.max(0, vpd).toFixed(2);
};

export const getVPDStatus = (vpd) => {
  // Si vpd es null o 'NaN' (como string), devolvemos estado por defecto
  if (!vpd || vpd === 'NaN') return { label: 'Esperando datos...', color: 'text-slate-400' };
  
  const val = parseFloat(vpd);
  
  if (val < 0.4) return { label: 'Peligro Hongo (Muy Húmedo)', color: 'text-red-500' };
  if (val < 0.8) return { label: 'Baja Transpiración', color: 'text-blue-500' };
  if (val <= 1.2) return { label: 'Zona Ideal (Crecimiento)', color: 'text-green-500' };
  if (val <= 1.6) return { label: 'Alto Estrés (Seco)', color: 'text-orange-500' };
  return { label: 'Peligro Deshidratación', color: 'text-red-600' };
};

/**
 * Calcula la velocidad de cambio de un sensor.
 * Retorna cuánto cambia el valor por hora.
 * Ejemplo: -5.0 significa que baja 5 unidades cada hora.
 */
export const calculateRateOfChange = (data, fieldKey) => {
  if (!data || data.length < 5) return null; // Necesitamos al menos 5 datos

  // Tomamos el último dato y uno de hace unos minutos (ej. 10 posiciones atrás)
  const lastIndex = data.length - 1;
  const prevIndex = Math.max(0, data.length - 10); // Aprox 2-3 minutos atrás

  const lastItem = data[lastIndex];
  const prevItem = data[prevIndex];

  const valNow = parseFloat(lastItem[fieldKey]);
  const valPrev = parseFloat(prevItem[fieldKey]);
  
  const timeNow = new Date(lastItem.created_at).getTime();
  const timePrev = new Date(prevItem.created_at).getTime();

  // Diferencia de tiempo en horas
  const diffHours = (timeNow - timePrev) / (1000 * 60 * 60);

  if (diffHours === 0) return 0;

  // Tasa = Diferencia Valor / Diferencia Tiempo
  const rate = (valNow - valPrev) / diffHours;

  return rate.toFixed(1);
};