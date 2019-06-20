import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { <%= appTitle %>Module } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(<%= appTitle %>Module)
  .catch(err => console.error(err));
