import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export class AssetsTranslateLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private prefix: string = 'assets/i18n/',
    private suffix: string = '.json'
  ) {}

  getTranslation(lang: string): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(`${this.prefix}${lang}${this.suffix}`);
  }
}

export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new AssetsTranslateLoader(http);
}
