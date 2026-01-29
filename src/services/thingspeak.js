import axios from 'axios';

// Configuración de tu Canal de ThingSpeak
const CHANNEL_ID = '3205767';
const READ_API_KEY = '9L8VOYKJKM0BMFJQ'; // Tu llave de lectura

// URL base para las peticiones
const API_URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}`;

/**
 * Función para obtener los últimos datos (tiempo real)
 * Trae un número limitado de resultados para ver la tendencia reciente.
 */
export const fetchLatestData = async (results = 20) => {
  try {
    const response = await axios.get(`${API_URL}/feeds.json`, {
      params: {
        api_key: READ_API_KEY,
        results: results // Cantidad de puntos de datos a traer
      }
    });
    
    // Devolvemos solo la parte de "feeds" que es donde están los datos de los sensores
    return response.data;
  } catch (error) {
    console.error("Error conectando con ThingSpeak:", error);
    return null;
  }
};

/**
 * Mapeo de campos para saber qué es cada cosa
 * Esto nos ayuda a no confundir Field 1 con Field 4 en el código
 */
export const SENSOR_MAP = {
  field1: { name: 'Temp. Interior', unit: '°C', color: '#ef4444' }, // Rojo
  field2: { name: 'Humedad Aire', unit: '%', color: '#3b82f6' },   // Azul
  field3: { name: 'Humedad Suelo', unit: '%', color: '#10b981' }, // Verde
  field4: { name: 'Luz', unit: '%', color: '#fbbf24' },           // Amarillo
  field5: { name: 'Presión', unit: 'hPa', color: '#8b5cf6' },     // Violeta
  field6: { name: 'Temp. Exterior', unit: '°C', color: '#f97316' } // Naranja
};