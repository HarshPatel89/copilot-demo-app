import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenubarModule],
  template: `
    <p-menubar [model]="items">
      <ng-template pTemplate="start">
        <img src="favicon.ico" height="40" class="mr-2">
      </ng-template>
    </p-menubar>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeaderComponent {
  items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home'
    },
    {
      label: 'Products',
      icon: 'pi pi-list',
      routerLink: '/products'
    },
    {
      label: 'About',
      icon: 'pi pi-info-circle'
    }
  ];
}
