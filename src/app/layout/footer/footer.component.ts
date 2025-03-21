import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="footer p-3">
      <div class="flex justify-content-between align-items-center">
        <p>© {{currentYear}} ConvergeSolution. All rights reserved.</p>
        <div class="social-links">
          <i class="pi pi-facebook mr-2"></i>
          <i class="pi pi-twitter mr-2"></i>
          <i class="pi pi-linkedin"></i>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .footer {
      background-color: #f8f9fa;
      border-top: 1px solid #dee2e6;
      position: fixed;
      bottom: 0;
      width: 100%;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
