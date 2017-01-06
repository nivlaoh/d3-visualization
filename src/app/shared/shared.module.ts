import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { ChartComponent } from './chart/chart.component';

@NgModule({
	declarations: [ChartComponent],
	imports: [
		FormsModule,
		MaterialModule.forRoot()
	],
	exports: [
		ChartComponent,
		MaterialModule
	],
	providers: []
})
export class SharedModule {
	static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: []
        };
    }
}