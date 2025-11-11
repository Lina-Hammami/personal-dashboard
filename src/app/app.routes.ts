import { Routes } from '@angular/router';
import { AwradTracker } from './features/awrad/awrad-tracker/awrad-tracker';
import { HifdhProgress } from './features/hifdh/hifdh-progress/hifdh-progress';
import { Hub } from './pages/hub/hub';


export const routes: Routes = [
  { path: '', component: Hub },
  { path: 'awrad', component: AwradTracker },
  { path: 'hifdh', component: HifdhProgress },
  { path: '**', redirectTo: '' }
];
