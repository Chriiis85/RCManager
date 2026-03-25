module.exports = async (req, res) => {
  const path = req.url.replace('/api/proxy', '').split('?')[0].replace(/^\/+/g, '');
  const targetUrl = `https://queue-times.com/${path}`;

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Upstream error' });
    }
    const data = await response.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy fetch failed', details: error.message });
  }
};
