import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'en' | 'fr' | 'ar' | 'de' | 'ja';

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly supported: Lang[] = ['en', 'fr', 'ar', 'de', 'ja'];
  lang = signal<Lang>((localStorage.getItem('lang') as Lang) || 'en');

  constructor(private t: TranslateService) {
    t.addLangs(this.supported);
    t.setDefaultLang('en');
    this.use(this.lang());
  }

  use(l: Lang) {
    this.lang.set(l);
    localStorage.setItem('lang', l);
    this.t.use(l);
    document.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  }
}
