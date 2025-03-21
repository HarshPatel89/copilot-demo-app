import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent, HeaderComponent } from './layout';

/**
 * Root component of the application. Provides the main layout structure including
 * header, sidebar, main content area, and footer.
 * 
 * This component serves as the application shell and handles the overall layout
 * using a flex-based container system.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  /** The title of the application */
  title = 'copilot-demo-app';
}
