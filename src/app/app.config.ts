/**
 * Application-wide configuration module that sets up core Angular features and third-party integrations.
 * 
 * This configuration:
 * - Enables zone.js change detection with event coalescing for better performance
 * - Sets up the Angular router
 * - Configures animations support
 * - Initializes PrimeNG with the Aura theme
 */

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    provideHttpClient(),
  ]
};
