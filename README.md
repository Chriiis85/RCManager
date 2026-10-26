# 🎢 RCManager — Coaster Credits & Theme Parks Hub

[🇪🇸 Ver en Español](#-español) | [🇬🇧 View in English](#-english)

**Live Demo:** [https://rcmanager-nine.vercel.app](https://rcmanager-nine.vercel.app) · **Backend API & Docs:** [https://rc-manager-api.vercel.app](https://rc-manager-api.vercel.app)

---

## 🇪🇸 Español

¡Hola! 👋 Soy **Christian**, desarrollador Web Full Stack apasionado por la tecnología y el mundo de los parques temáticos y las montañas rusas.

En la comunidad de *coaster enthusiasts*, llevar la cuenta rigurosa de tus **credits** (cada montaña rusa distinta a la que te has subido en el mundo), comparar experiencias y saber qué atracciones te faltan por probar en cada parque es una auténtica afición. 

Creé **RCManager** para ofrecer una plataforma web moderna, fluida y completa desarrollada con **Angular 21** y **Tailwind CSS v4**, respaldada por **Supabase** y consumiendo datos en tiempo real de mi propia API desacoplada ([RCManager API](https://github.com/Chriiis85/RCManagerAPI)), además de contar con el asistente inteligente **ParksIA**.

### 🚀 ¿Qué ofrece la aplicación?

- 🎢 **Gestor Personal de Credits:** Registra cada montaña rusa probada con fecha, puntuación de 1 a 10 y estadísticas automáticas de tu historial.
- 🗺️ **Catálogo Global de Parques y Atracciones:** Fichas técnicas completas con datos de velocidad punta, altura, longitud, inversiones, fabricante y estado operativo.
- ⏱️ **Tiempos de Espera en Vivo:** Consulta los minutos de cola y estado de apertura en tiempo real de los principales parques del mundo (PortAventura, Europa-Park, Phantasialand, etc.).
- 🏆 **Rankings Oficiales y de la Comunidad:** Clasificaciones mundiales basadas en los prestigiosos *Golden Ticket Awards* e informes de la industria.
- 📅 **Planificador de Viajes Grupales:** Organiza escapadas a parques con cuenta regresiva en tiempo real, invitaciones entre amigos registrados y lista colaborativa de atracciones prioritarias.
- 🤖 **Asistente Inteligente ParksIA:** Herramienta integrada con inteligencia artificial para resolver dudas técnicas, descubrir récords y optimizar rutas de visita en el parque.
- 🌓 **Modo Oscuro / Claro:** Diseño moderno, responsive y adaptativo con Tailwind CSS v4.

### 💡 Retos técnicos que resolví

1. **Angular 21 Moderno y Reactividad con Signals:**  
   Implementación basada en componentes *Standalone*, eliminando la sobrecarga de módulos tradicionales y aprovechando *Signals* y la nueva sintaxis de control de flujo (`@if`, `@for`) para un rendimiento óptimo en la renderización del catálogo.
2. **Integración Híbrida de Datos (Supabase + REST API Propia):**  
   Gestión de sesiones de usuario y persistencia de *credits* privados en Supabase, combinada con el consumo optimizado de la API RESTful de parques para reducir latencias en listados masivos.
3. **Diseño Mobile-First y Experiencia de Usuario:**  
   Arquitectura visual limpia y accesible pensada para ser consultada cómodamente tanto desde el ordenador al planificar el viaje como desde el móvil dentro del propio parque.

### 🛠️ Tecnologías utilizadas

- **Angular 21** (Standalone Components, Signals, Router)
- **TypeScript 5.9**
- **Tailwind CSS v4** (PostCSS integration)
- **Supabase** (Auth & Database)
- **RxJS**
- **Vercel** (Despliegue y CI/CD)

### 💻 Cómo probarlo en local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Chriiis85/RCManager.git
cd RCManager/RCManager

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
ng serve
# Abrir en el navegador: http://localhost:4200
```

---

## 🇬🇧 English

Hello! 👋 I'm **Christian**, a Full Stack Web Developer passionate about software engineering, theme parks, and roller coasters.

In the coaster enthusiast community, keeping an accurate count of your **credits** (each unique roller coaster you have ridden worldwide), rating them, and discovering unridden rides across global parks is a true passion.

I built **RCManager** to provide a modern, fast, and feature-rich web platform using **Angular 21** and **Tailwind CSS v4**, backed by **Supabase** and powered by real-time data from my custom decoupled backend ([RCManager API](https://github.com/Chriiis85/RCManagerAPI)), along with the AI assistant **ParksIA**.

### 🚀 Key Features

- 🎢 **Personal Coaster Credit Tracker:** Log every roller coaster you ride with date, 1-to-10 rating, and automatic stats on your enthusiast journey.
- 🗺️ **Worldwide Theme Parks & Rides Directory:** Detailed spec sheets with top speed, height, track length, inversions, manufacturer, and operational status.
- ⏱️ **Live Wait Times:** Check real-time queue minutes and ride status from major theme parks worldwide (PortAventura, Europa-Park, Phantasialand, etc.).
- 🏆 **Global Rankings:** Worldwide rankings inspired by the prestigious *Golden Ticket Awards* and community scores.
- 📅 **Trip Planner with Friends:** Schedule park visits with live countdown timers, invite registered friends, and build a shared ride priority checklist.
- 🤖 **ParksIA Smart Assistant:** Integrated AI-powered tool to answer technical ride queries, discover coaster records, and optimize park visit routes.
- 🌓 **Dark / Light Mode:** Modern, accessible, fully responsive interface powered by Tailwind CSS v4.

### 💡 Technical Highlights

1. **Modern Angular 21 Architecture & Signals:**  
   Built entirely with *Standalone Components*, eliminating legacy NgModules and leveraging *Signals* and Angular's built-in control flow (`@if`, `@for`) for snappy catalog rendering.
2. **Hybrid Data Architecture (Supabase + Custom REST API):**  
   User auth and private coaster credits stored via Supabase, complemented by high-performance data consumption from the custom RESTful API backend.
3. **Mobile-First UX:**  
   Clean, adaptive design built to seamlessly handle trip planning on desktop and fast on-the-go lookups on mobile inside theme parks.

### 🛠️ Tech Stack

- **Angular 21** (Standalone Components, Signals, Router)
- **TypeScript 5.9**
- **Tailwind CSS v4**
- **Supabase** (Auth & Database)
- **RxJS**
- **Vercel** (Deploy & Hosting)

### 💻 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/Chriiis85/RCManager.git
cd RCManager/RCManager

# 2. Install dependencies
npm install

# 3. Start local development server
ng serve
# Navigate to: http://localhost:4200
```

---

<div align="center">
  <sub>Desarrollado con dedicación por Christian Moreno Díaz · © RCManager</sub>
</div>
