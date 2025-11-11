import { Component, EventEmitter, Output } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, MenubarModule, AvatarModule, ButtonModule, TieredMenuModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  @Output() themeToggle = new EventEmitter<void>();
  @Output() langChange  = new EventEmitter<string>();

  items: MenuItem[] = [
    { label: 'Hub', routerLink: '/' },
    { label: 'Awrād', routerLink: '/awrad' },
    { label: 'Qur’an Progress', routerLink: '/quran' },
  ];

  configMenu: MenuItem[] = [
    { label: 'Toggle Dark Mode', icon: 'pi pi-moon', command: () => this.themeToggle.emit() },
    {
      label: 'Language',
      icon: 'pi pi-globe',
      items: [
        { label: 'English',  command: () => this.langChange.emit('en') },
        { label: 'Français', command: () => this.langChange.emit('fr') },
        { label: 'العربية',  command: () => this.langChange.emit('ar') },
        { label: 'Deutsch',  command: () => this.langChange.emit('de') },
        { label: '日本語',   command: () => this.langChange.emit('ja') },
      ]
    }
  ];
}
