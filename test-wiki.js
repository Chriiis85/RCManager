async function test() {
  const parks = ["PortAventura Park", "Terra Mítica", "Ferrari Land", "Parque de Atracciones de Madrid"];
  for (const park of parks) {
    const encoded = encodeURIComponent(park);
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encoded}&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`;
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const res = await fetch(url);
    if (!res.ok) continue;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (pages) {
      const page = Object.values(pages)[0];
      console.log(park, '->', page.imageinfo?.[0]?.thumburl || 'No thumburl');
    } else {
      console.log(park, '-> Not found');
    }
  }
}
test();
