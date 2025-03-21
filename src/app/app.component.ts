import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent, HeaderComponent } from './layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <div class="layout-wrapper">
      <app-header></app-header>
      <main class="layout-main">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .layout-main {
      flex: 1;
      padding: 1rem;
      margin-top: 4rem;
    }
  `]
})
export class AppComponent {
  title = 'copilot-demo-app';
}
