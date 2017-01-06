import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as moment from 'moment';

import { ChartComponent, ChartConfig } from '../shared/index';

@Component({
  selector: 'infocomm-revenue-component',
  templateUrl: './infocomm-revenue.component.html',
  styleUrls: ['./infocomm-revenue.component.scss']
})
export class InfocommRevenueComponent implements OnInit {
	private areaChartConfig: Array<ChartConfig>;
	private statistics: any[] = new Array();
	private csvData: any[] = [];

	constructor(private http: Http) { }

	ngOnInit() {
		this.http.get('/assets/revenue-of-infocomm-industry-by-market-segment.csv')
			.subscribe(res => {
				this.extractData(res);
				this.getStats();
			});
 	}

 	getStats() {
 		this.areaChartConfig = new Array<ChartConfig>();
 		this.csvData.forEach(data => {
 			this.statistics.push({
 				year: parseInt(data[0]),
 				segment: data[1],
 				revenue: parseFloat(data[2])
 			});
 		});
 		let config = new ChartConfig();
		config.settings = {
			fill: 'rgba(1, 67, 163, 100)',
			interpolation: 'monotone'
		};
		if (config.dataset == undefined) {
			config.dataset = new Array();
			config.categoryNames = new Array();
		}
		let catMap = {};
		this.statistics.forEach(stats => {
			config.dataset.push({ x: moment(stats.year, 'YYYY').toDate(), y: stats.revenue });
			if (catMap[stats.segment] == undefined) {
				catMap[stats.segment] = 1;
			}
		});
		
		for (let cat in catMap) {
			if (catMap.hasOwnProperty(cat)) {
				config.categoryNames.push(cat);
			}
		}
		this.areaChartConfig.push(config);
	}

	private extractData(res: Response) {

		let csvData = res['_body'] || '';
		let allTextLines = csvData.split(/\r\n|\n/);
		let headers = allTextLines[0].split(',');
		let lines = [];

		for (let i = 0; i < allTextLines.length; i++) {
			if (i>0) {
			    // split content based on comma
			    let data = allTextLines[i].split(',');
			    if (data.length == headers.length) {
			        let tarr = [];
			        for (let j = 0; j < headers.length; j++) {
			            tarr.push(data[j]);
			        }
			        lines.push(tarr);
			    }
			}
		}
		this.csvData = lines;
	}

}
