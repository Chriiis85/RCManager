# RCManager — Coaster Credits & Theme Parks Hub

[Ver en Español](#-español) | [View in English](#-english)

**Demo en vivo:** [https://rcmanager-nine.vercel.app](https://rcmanager-nine.vercel.app) · **API & Docs:** [https://rc-manager-api.vercel.app](https://rc-manager-api.vercel.app)

---

## 🇪🇸 Español

¡Hola! 👋 Soy **Christian**, desarrollador Web Full Stack.

En el mundo de los aficionados a los parques temáticos (*coaster enthusiasts*), llevar la cuenta exacta de tus **credits** (cada montaña rusa distinta a la que te has subido) y saber qué atracciones te faltan en cada parque es una afición muy extendida.

Desarrollé **RCManager** como una aplicación web moderna con **Angular 21** y **Tailwind CSS v4**, conectada a **Supabase** para la gestión de usuarios y a mi propia API desacoplada ([RCManager API](https://github.com/Chriiis85/RCManagerAPI)) para el catálogo de atracciones y tiempos de espera en vivo, integrando además el asistente **ParksIA**.

### Qué incluye la aplicación

- **Gestor de credits:** Registra cada montaña rusa que has probado con fecha de visita, puntuación del 1 al 10 y estadísticas automáticas de tu historial.
- **Catálogo de parques y atracciones:** Fichas técnicas con datos de velocidad punta, altura, longitud, tipo de vía, fabricante y estado operativo.
- **Tiempos de espera en vivo:** Consulta los minutos de cola en tiempo real de los principales parques del mundo (PortAventura, Europa-Park, Phantasialand, etc.).
- **Rankings:** Clasificaciones basadas en los premios Golden Ticket Awards y valoraciones de los usuarios.
- **Planificador de viajes:** Organiza visitas a parques con tus amigos, con cuenta atrás interactiva y lista compartida de atracciones prioritarias.
- **Asistente ParksIA:** Herramienta integrada con inteligencia artificial para consultar dudas técnicas, récords o itinerarios recomendados.
- **Modo oscuro y claro:** Interfaz adaptativa construida con Tailwind CSS v4.

### Retos técnicos resueltos

1. **Componentes Standalone y Signals en Angular 21:**  
   Implementé la arquitectura moderna de Angular sin NgModules, apoyándome en *Signals* y en el nuevo control de flujo nativo (`@if`, `@for`) para hacer la navegación y el filtrado del catálogo muy rápidos y reactivos.
2. **Arquitectura desacoplada (Supabase + API propia):**  
   Gestioné la autenticación y los datos personales de los usuarios en Supabase, mientras que el catálogo masivo y las consultas de parques se consumen directamente desde un backend Express independiente para optimizar el rendimiento.
3. **Diseño pensado para móvil:**  
   La interfaz está diseñada para consultarse cómodamente tanto al planificar la escapada desde el ordenador como desde el propio teléfono mientras estás en las colas del parque.

### Tecnologías utilizadas

- **Angular 21** (Standalone Components, Signals, Router)
- **TypeScript 5.9**
- **Tailwind CSS v4**
- **Supabase** (Auth & Database)
- **RxJS**
- **Vercel**

### Cómo probarlo en local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Chriiis85/RCManager.git
cd RCManager/RCManager

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor local
ng serve
# Abrir en el navegador: http://localhost:4200
```

---

## 🇬🇧 English

Hello! 👋 I'm **Christian**, a Full Stack Web Developer.

In the theme park community, enthusiasts track their **credits** (every unique roller coaster ridden worldwide) and plan upcoming trips to hit unridden rides.

I built **RCManager** as a modern web app with **Angular 21** and **Tailwind CSS v4**, backed by **Supabase** for user data and a custom decoupled backend ([RCManager API](https://github.com/Chriiis85/RCManagerAPI)) for ride specs and real-time wait times, alongside the **ParksIA** assistant.

### Features

- **Coaster Credit Tracker:** Log every roller coaster you ride with dates, 1-to-10 ratings, and personal statistics.
- **Parks & Rides Directory:** Detailed specs including top speed, height, track length, manufacturer, and live operational status.
- **Live Queue Times:** Real-time wait minutes across top parks worldwide (PortAventura, Europa-Park, Phantasialand, etc.).
- **Rankings:** World rankings based on Golden Ticket Awards and community scores.
- **Trip Planner:** Organize park trips with friends, tracking countdowns and shared ride wishlists.
- **ParksIA Assistant:** Integrated AI tool to look up coaster records and tips.
- **Dark / Light Mode:** Fully responsive theme switching powered by Tailwind CSS v4.

### Technical Highlights

1. **Angular 21 Standalone Architecture & Signals:**  
   Built without legacy NgModules, using Angular Signals and modern template control flow (`@if`, `@for`) for responsive filtering and state management.
2. **Decoupled Architecture (Supabase + Custom Backend):**  
   User auth and private credits are handled through Supabase, while heavy catalog and queue data are served through a dedicated Express API.
3. **Mobile-First UX:**  
   Designed to run smoothly on desktop during trip planning and on mobile while walking through parks.

### Tech Stack

- **Angular 21** (Standalone Components, Signals, Router)
- **TypeScript 5.9**
- **Tailwind CSS v4**
- **Supabase**
- **RxJS**
- **Vercel**

### Local Setup

```bash
# 1. Clone repository
git clone https://github.com/Chriiis85/RCManager.git
cd RCManager/RCManager

# 2. Install dependencies
npm install

# 3. Start development server
ng serve
```

---

<div align="center">
  <sub>Christian Moreno Díaz · RCManager</sub>
</div>
