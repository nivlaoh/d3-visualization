import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@angular/material';

import { SharedModule } from '../shared/shared.module';
import { InfocommRevenueComponent } from '../infocomm-revenue/infocomm-revenue.component';
import { TechnologyComponent } from './technology.component';

export const routerConfig: Routes = [
	{ path: '', component: TechnologyComponent }
];

@NgModule({
	imports: [
    	CommonModule,
    	SharedModule.forRoot(),
    	RouterModule.forChild(routerConfig)
	],
	declarations: [TechnologyComponent, InfocommRevenueComponent]
})
export default class TechnologyModule { }
