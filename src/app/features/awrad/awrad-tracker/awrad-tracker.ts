import { Component } from '@angular/core';
import { WeekTable } from '../week-table/week-table';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-awrad-tracker',
  imports: [CommonModule, WeekTable],
  templateUrl: './awrad-tracker.html',
  styleUrl: './awrad-tracker.css',
})
export class AwradTracker {

}
