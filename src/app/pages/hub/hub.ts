import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hub',
    standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './hub.html',
  styleUrl: './hub.css',
})
export class Hub {
  constructor(private router: Router) {}
  go(path: string) { this.router.navigateByUrl(path); }
}