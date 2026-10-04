import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coverage-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <!-- Modal Content -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-slate-100 dark:border-slate-700 relative flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="bg-blue-600 dark:bg-blue-700 px-6 py-4 flex items-center justify-between shrink-0">
          <h3 class="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span class="text-2xl">🌍</span> Cobertura de Datos
          </h3>
          <button (click)="close.emit()" class="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 focus:outline-none">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar">
          
          <!-- CTA / Support -->
          <div class="space-y-3 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/30">
            <h4 class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span>✉️</span> ¡Ayúdanos a mejorar!
            </h4>
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              ¿Falta tu parque favorito, una nueva atracción o ves algún dato desactualizado? Nuestra base de datos crece gracias a la comunidad.
            </p>
            <div class="pt-2">
              <a href="mailto:soporte@rcmanager.app" class="inline-flex items-center gap-2 text-sm font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                soporte@rcmanager.app
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Countries List -->
          <div class="space-y-4">
            <h4 class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-[10px] uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 pb-2">
              <span>📍</span> Países Soportados Actualmente
            </h4>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              @for (country of countries; track country.name) {
                <div class="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-700/50 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-600/50 hover:border-blue-200 dark:hover:border-blue-700 transition-colors">
                  <span class="text-xl leading-none">{{ country.flag }}</span>
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-300 truncate" [title]="country.name">{{ country.name }}</span>
                </div>
              }
            </div>
            
            <p class="text-[10px] text-slate-400 dark:text-slate-500 text-center pt-4 font-medium italic">
              Y seguimos añadiendo nuevos destinos constantemente...
            </p>
          </div>

        </div>
      </div>
    </div>
  `
})
export class CoverageInfoComponent {
  @Output() close = new EventEmitter<void>();

  countries = [
    { name: 'España', flag: '🇪🇸' },
    { name: 'Francia', flag: '🇫🇷' },
    { name: 'Alemania', flag: '🇩🇪' },
    { name: 'Reino Unido', flag: '🇬🇧' },
    { name: 'Italia', flag: '🇮🇹' },
    { name: 'Países Bajos', flag: '🇳🇱' },
    { name: 'Bélgica', flag: '🇧🇪' },
    { name: 'Suecia', flag: '🇸🇪' },
    { name: 'Polonia', flag: '🇵🇱' },
    { name: 'Dinamarca', flag: '🇩🇰' }
  ];
}
