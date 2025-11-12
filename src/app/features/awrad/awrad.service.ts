import { Injectable, signal } from '@angular/core';
import { StorageService } from '../../core/storage/local-storage.service';

export interface UserWeekRow {
  name: string;
  week: number;    // ISO week number
  days: boolean[]; // Mon..Sun
}

const KEY = 'awradRows';

@Injectable({ providedIn: 'root' })
export class AwradService {
  /** reactive list of all week rows */
  rows = signal<UserWeekRow[]>([]);

  constructor(private store: StorageService) {
    const initial = this.store.getItem<UserWeekRow[]>(KEY, []);
    this.rows.set(initial);
  }

  /** Insert or update a user-week row */
  upsert(row: UserWeekRow) {
    const list = [...this.rows()];
    const idx = list.findIndex(r => r.name === row.name && r.week === row.week);

    if (idx >= 0) list[idx] = row;
    else list.push(row);

    this.rows.set(list);
    this.store.setItem(KEY, list);
  }

  /** Remove a row (optional helper) */
  remove(row: UserWeekRow) {
    const list = this.rows().filter(r => !(r.name === row.name && r.week === row.week));
    this.rows.set(list);
    this.store.setItem(KEY, list);
  }

  /** Clear all data (optional helper) */
  clear() {
    this.rows.set([]);
    this.store.removeItem(KEY);
  }
}
