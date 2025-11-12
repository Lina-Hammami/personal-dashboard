import { Component, computed, signal } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Checkbox, CheckboxModule } from 'primeng/checkbox';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { AwradService, UserWeekRow } from '../awrad.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

function startOfISOWeek(date: Date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Mon=0..Sun=6
  d.setDate(d.getDate() - day);
  d.setHours(0,0,0,0);
  return d;
}
function addDays(d: Date, days: number) {
  const x = new Date(d); x.setDate(x.getDate() + days); return x;
}
function format(d: Date) {
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

@Component({
  standalone: true,
  selector: 'app-week-table',
  imports: [CommonModule, TableModule, TooltipModule, CheckboxModule, InputTextModule, InputText, Checkbox, FormsModule],
  templateUrl: './week-table.html',
  styleUrl: './week-table.css',
})
export class WeekTable {
  filter = '';
  days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  // Build example rows if storage is empty
  constructor(public svc: AwradService) {
    if (this.svc.rows().length === 0) {
      const names = [
        'سناء بن عمر',
        'بشرى بن رمضان',
        'نسمة بن رمضان',
        '(جمعة الثامري) أم يزيد',
        'بشرى السعدي',
        'هناء علي',
        'احلام حجاجي',
        'وفاء ثابت',
        'حياة الصيد',
        'صبرية بلعيد ابو غالية',
        'إيمان انبيه',
        'حنان الأزرق',
        'فوزية يوسفى',
        'جليلة مطوصي'
      ];
      const wk = this.isoWeek(new Date());
      const base = startOfISOWeek(new Date());
      names.forEach(n => this.svc.upsert({ name: n, week: wk, days: Array(7).fill(false) }));
      // Pre-fill a couple for demo
      const first = this.svc.rows()[0]; first.days[0] = first.days[2] = true; this.svc.upsert(first);
      // compute date tips
      this._dateTips = Array.from({length:7}, (_,i)=>format(addDays(base,i)));
    } else {
      const base = startOfISOWeek(new Date());
      this._dateTips = Array.from({length:7}, (_,i)=>format(addDays(base,i)));
    }
  }

  private _dateTips: string[] = [];
  get dateTips() { return this._dateTips; }

  filtered = computed(() => {
    const f = this.filter.trim().toLowerCase();
    return this.svc.rows().filter(r => r.name.toLowerCase().includes(f));
  });

  save(row: UserWeekRow) { this.svc.upsert(row); }

  private isoWeek(d: Date) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
    return Math.ceil((((date as any) - (yearStart as any)) / 86400000 + 1)/7);
  }
}