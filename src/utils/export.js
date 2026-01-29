export const downloadCSV = (data) => {
  if (!data || data.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  // 1. Definir los encabezados del CSV
  const headers = [
    "Fecha y Hora",
    "Temp Interior (°C)",
    "Humedad Aire (%)", 
    "Humedad Suelo (%)",
    "Luz (%)",
    "Presion (hPa)",
    "Temp Exterior (°C)"
  ];

  // 2. Convertir cada fila de datos a formato CSV (separado por comas)
  const rows = data.map(item => {
    const date = new Date(item.created_at).toLocaleString();
    return [
      `"${date}"`, // Comillas para evitar problemas con espacios
      item.field1 || 0,
      item.field2 || 0,
      item.field3 || 0,
      item.field4 || 0,
      item.field5 || 0,
      item.field6 || 0
    ].join(",");
  });

  // 3. Unir todo con saltos de línea
  const csvContent = [headers.join(","), ...rows].join("\n");

  // 4. Crear un "blob" (archivo virtual) y forzar la descarga
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `reporte_huerto_${new Date().toISOString().slice(0,10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};