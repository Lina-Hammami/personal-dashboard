import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MenuItem, SharedModule } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../core/theme/theme.service';

// standalone imports
import { Menubar } from 'primeng/menubar';
import { TieredMenu } from 'primeng/tieredmenu';
import { Button } from 'primeng/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [ Menubar, TieredMenu, SharedModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css'],
})
export class Topbar {
  @Input() items: MenuItem[] = [
    { label: 'Hub', routerLink: '/' },
    { label: 'Awrād', routerLink: '/awrad' },
    { label: 'Qur’an Progress', routerLink: '/quran' }
  ];

  // events to parent (optional)
  @Output() langChange = new EventEmitter<string>();
  @Output() themeToggle = new EventEmitter<'light' | 'dark'>();

  private translate = inject(TranslateService);
  private theme = inject(ThemeService);

  isDark = this.theme.mode;

  // right-side dropdown models
  settingsMenu: MenuItem[] = [];
  langMenu: MenuItem[] = [];

  constructor() {
    this.translate.addLangs(['en', 'ar', 'fr']);
    this.translate.setDefaultLang('en');

    this.buildSettingsMenu();
    this.buildLangMenu();
  }

  // ⚙️ settings dropdown (dark/light + placeholders)
  private buildSettingsMenu() {
    this.settingsMenu = [
      {
        label: this.isDark() ? 'Light Mode' : 'Dark Mode',
        icon: this.isDark() ? 'pi pi-sun' : 'pi pi-moon',
        command: () => {
          this.theme.toggle();
          this.themeToggle.emit(this.isDark());
          this.updateSettingsMenuLabel();
        },
      },
      { separator: true },
      { label: 'Profile', icon: 'pi pi-user', command: () => console.log('Profile clicked') },
      { label: 'Parameters', icon: 'pi pi-cog', command: () => console.log('Parameters clicked') },
    ];
  }

  private updateSettingsMenuLabel() {
    const i = this.settingsMenu.find(m => m.icon === 'pi pi-sun' || m.icon === 'pi pi-moon');
    if (i) {
      i.label = this.isDark() ? 'Light Mode' : 'Dark Mode';
      i.icon  = this.isDark() ? 'pi pi-sun' : 'pi pi-moon';
    }
  }

  // 🌐 language dropdown
  private buildLangMenu() {
    this.langMenu = [
      { label: 'العربية',  icon: 'pi pi-flag-fill', command: () => this.setLang('ar') },
      { label: 'Français', icon: 'pi pi-flag-fill', command: () => this.setLang('fr') },
      { label: 'English',  icon: 'pi pi-flag-fill', command: () => this.setLang('en') },
    ];
  }

  private setLang(lang: string) {
    this.translate.use(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.langChange.emit(lang);
  }
}
