import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {appConfig} from "./app/app.config";


console.log('Starting bootstrap...');
bootstrapApplication(AppComponent, appConfig)
  .then(() => console.log('Bootstrap complete'))
  .catch(err => console.error('Bootstrap error:', err));
