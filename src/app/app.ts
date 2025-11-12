import { Component, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';
import { Topbar } from './layout/topbar/topbar';
import { PrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura'; // ✅ pick any: Lara, Nora, Material, etc.

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Topbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private translate = inject(TranslateService);
  private primeng = new PrimeNG(); // ✅ create PrimeNG instance for runtime theme change
  isDark = signal(false);

  constructor() {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.setLang(savedLang);

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('p-input-filled', true);
    this.applyTheme(savedTheme === 'dark');
  }

  setLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  isRtl = () => (this.translate.currentLang || 'en') === 'ar';

  toggleTheme() {
    this.applyTheme(!this.isDark());
  }

  private applyTheme(dark: boolean) {
    this.isDark.set(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');

    this.primeng.onThemeChange({
      preset: Aura,
      options: {
        darkMode: dark
      }
    });

    document.documentElement.classList.toggle('app-dark', dark);
  }
}
