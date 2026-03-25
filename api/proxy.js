module.exports = async (req, res) => {
  // Obtenemos el path desde la query (enviado por vercel.json) o desde la URL
  const path = req.query.path || req.url.replace('/api/proxy', '').split('?')[0].replace(/^\/+/g, '');
  const targetUrl = `https://queue-times.com/${path}`;

  try {
    const response = await fetch(targetUrl);
    
    // Si la API remota da error, devolvemos ese error
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error in queue-times.com', status: response.status });
    }

    const data = await response.json();
    
    // Cabeceras para evitar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};
