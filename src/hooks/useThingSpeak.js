import { useState, useEffect } from 'react';
import { fetchLatestData } from '../services/thingspeak';

export const useThingSpeak = () => {
  const [data, setData] = useState([]); // Aquí guardaremos la lista de datos (historial)
  const [channelInfo, setChannelInfo] = useState(null); // Aquí info del canal (nombre, descripción)
  const [loading, setLoading] = useState(true); // Para saber si está cargando
  const [error, setError] = useState(null); // Por si algo falla

  useEffect(() => {
    const getData = async () => {
      try {
        // Pedimos los últimos 50 datos para poder hacer gráficas de tendencias
        const result = await fetchLatestData(50);
        
        if (result) {
          setData(result.feeds); // Guardamos los "feeds" (las mediciones)
          setChannelInfo(result.channel); // Guardamos la info del canal
          setError(null);
        }
      } catch (err) {
        setError("Error al obtener datos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // 1. Llamamos a la función inmediatamente al cargar
    getData();

    // 2. Configuramos un reloj para que llame a la función cada 15 segundos
    // (15000 milisegundos)
    const interval = setInterval(getData, 15000);

    // 3. Limpieza: Si cierras la página, el reloj se detiene
    return () => clearInterval(interval);
  }, []);

  return { data, channelInfo, loading, error };
};