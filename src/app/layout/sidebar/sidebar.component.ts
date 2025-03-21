import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarModule, ButtonModule, PanelMenuModule],
  template: `
    <p-sidebar [(visible)]="visible">
      <h3>Sidebar</h3>
      <p-panelMenu [model]="items"></p-panelMenu>
    </p-sidebar>
    <p-button icon="pi pi-bars" (click)="toggleSidebar()"></p-button>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SidebarComponent {
  visible: boolean = false;
  items = [
    {
      label: 'Menu Item 1',
      icon: 'pi pi-fw pi-file',
      
    },
    {
      label: 'Menu Item 2',
      icon: 'pi pi-fw pi-folder'
    }
  ];

  toggleSidebar() {
    this.visible = !this.visible;
  }
}
