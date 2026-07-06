async function test() {
  const parks = ["Epcot", "Disneyland", "Alton Towers", "Heide Park Resort", "Parque de Atracciones de Madrid", "Parque Warner Madrid", "PortAventura Park"];
  for (const park of parks) {
    const encoded = encodeURIComponent(park);
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encoded}&gsrlimit=1&prop=imageinfo&iiprop=url&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data?.query?.pages;
    if (pages) {
      const page = Object.values(pages)[0];
      console.log(park, '->', page.imageinfo?.[0]?.url || 'No image url');
    } else {
      console.log(park, '-> Not found');
    }
  }
}
test();
