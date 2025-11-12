import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AwradService, UserWeekRow } from '../awrad.service';

function startOfISOWeek(date: Date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Mon=0..Sun=6
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}
function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
function format(d: Date) {
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface UserRowWithId extends UserWeekRow {
  id: number;
}

@Component({
  standalone: true,
  selector: 'app-week-table',
  imports: [
    CommonModule,
    TableModule,
    TooltipModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './week-table.html',
  styleUrl: './week-table.css',
})
export class WeekTable {
  filter = '';
  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  private readonly initialNames = [
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
    'جليلة مطوصي',
  ];

  private initialOrder: UserRowWithId[] = [];
  private _dateTips: string[] = [];

  constructor(public svc: AwradService) {
    const wk = this.isoWeek(new Date());
    const base = startOfISOWeek(new Date());

    if (this.svc.rows().length === 0) {
      this.initialNames.forEach((n) =>
        this.svc.upsert({ name: n, week: wk, days: Array(7).fill(false) })
      );
    }

    this.initialOrder = this.initialNames.map((name, index) => {
      const row = this.svc.rows().find((r) => r.name === name);
      return {
        id: index + 1,
        name,
        week: row?.week ?? this.isoWeek(new Date()),
        days: row?.days ?? Array(7).fill(false),
      };
    });

    this._dateTips = Array.from({ length: 7 }, (_, i) =>
      format(addDays(base, i))
    );
  }

  get dateTips() {
    return this._dateTips;
  }

  filtered = computed(() => {
    const f = this.filter.trim().toLowerCase();

    // make sure we only handle rows with valid names
    return this.initialOrder.filter(r => {
      const name = (r.name || '').toLowerCase();
      return name.includes(f);
    });
  });

  save(row: UserWeekRow) {
    this.svc.upsert(row);
  }

  // 🟢 Export Telegram-style report
  exportTelegram() {
    const rows = this.filtered();
    let output = '———~  ﷽ ~——— \n ✨ ملخص أوراد الأسبوع ✨\n 📖 مسار الذاريات - الماهرات بالقرآن 3 📖 \n 📅 جدول الأوراد 📋\n\n';
    let footer = '———~💎💎💎 ~———\n' + '> ✅: انجزت وردها\n' + '> ❌: لم تنجز وردها\n';

    for (const r of rows) {
      const checks = r.days
        .map((d) => (d ? '✅' : '❌'))
        .join('');
      output += `${r.id}. ${r.name}\n${checks}\n`;
    }
    output += footer;

    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `awrad-week-${this.isoWeek(new Date())}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private isoWeek(d: Date) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
  }
}