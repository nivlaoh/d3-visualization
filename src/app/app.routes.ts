import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { TechnologyComponent } from './technology/technology.component';

export const routes: Routes = [
	{ path: 'technology', loadChildren: 'app/technology/technology.module' },
	{ path: '', redirectTo: '/technology', pathMatch: 'full' }
];