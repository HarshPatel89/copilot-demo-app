import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenubarModule, SidebarModule, ButtonModule, PanelMenuModule],
  template: `
    <div class="layout-header">
      <p-menubar [model]="items">
        <ng-template pTemplate="start">
          <button pButton icon="pi pi-bars" (click)="toggleSidebar()" class="p-button-text p-button-rounded mr-2"></button>
          <img src="favicon.ico" height="40" class="mr-2">
        </ng-template>
      </p-menubar>

      <p-sidebar [(visible)]="sidebarVisible" [styleClass]="'layout-sidebar'" [showCloseIcon]="false" [baseZIndex]="1000">
        <div class="sidebar-header">
          <h3>Menu</h3>
        </div>
        <p-panelMenu [model]="sidebarItems" [style]="{'width':'100%'}"></p-panelMenu>
      </p-sidebar>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .layout-header {
      position: fixed;
      width: 100%;
      top: 0;
      z-index: 1000;
    }

    .layout-header ::ng-deep .p-menubar {
      border-radius: 0;
      padding: 0.5rem 1rem;
    }

    .sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid var(--surface-border);
      margin-bottom: 1rem;
    }

    ::ng-deep .layout-sidebar {
      .p-sidebar-header {
        display: none;
      }
      
      .p-panelmenu .p-panelmenu-header > a {
        padding: 1rem;
      }
    }
  `]
})
export class HeaderComponent {
  sidebarVisible: boolean = false;

  items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: ['/']
    },
    {
      label: 'Products',
      icon: 'pi pi-list',
      routerLink: ['/products']
    },
    {
      label: 'About',
      icon: 'pi pi-info-circle',
      routerLink: ['/about']
    }
  ];

  sidebarItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: ['/']
    },
    {
      label: 'Products',
      icon: 'pi pi-shopping-cart',
      items: [
        {
          label: 'View Products',
          icon: 'pi pi-list',
          routerLink: ['/products']
        },
        {
          label: 'Add Product',
          icon: 'pi pi-plus',
          routerLink: ['/products/add']
        }
      ]
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog'
    }
  ];

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
