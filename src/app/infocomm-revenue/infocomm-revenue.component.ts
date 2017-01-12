import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as moment from 'moment';
import * as d3 from 'd3';

import { ChartComponent, ChartConfig } from '../shared/index';

@Component({
  selector: 'infocomm-revenue-component',
  templateUrl: './infocomm-revenue.component.html',
  styleUrls: ['./infocomm-revenue.component.scss']
})
export class InfocommRevenueComponent implements OnInit {
	private areaChartConfig: Array<ChartConfig>;
	private statistics: any[] = new Array();
	private rawData: any[];

	constructor(private http: Http) { }

	ngOnInit() {
		d3.csv('/assets/revenue-of-infocomm-industry-by-market-segment.csv', this.cast, (records) => {
			this.rawData = records;
			this.statistics = this.getStats(records);
		});
 	}

 	cast(d) {
        Object.keys(d).forEach((key) => {
            if (!isNaN(+d[key])) d[key] = +d[key];
        })
        return d;
	}

 	getStats(statistics: any[]) {
 		let nested = d3.nest()
 			// .rollup((d: any[]) => {
 			// 	//delete d[0].year;
 			// 	return d[0];
 			// })
 			.key((d: any) => { return d.year; })
 			.entries(statistics);

 		// nested.forEach((d: any) => {
			// d.zz = Object.keys(d.value).map((key) => {
			// 	return { key: key, value: d.value[key] };
			// });
 		// });

 		this.areaChartConfig = new Array<ChartConfig>();
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
		statistics.forEach(stats => {
			if (catMap[stats.segment] == undefined) {
				catMap[stats.segment] = 1;
			}
		});
		config.dataset = nested;
		
		for (let cat in catMap) {
			if (catMap.hasOwnProperty(cat)) {
				config.categoryNames.push(cat);
			}
		}
		this.areaChartConfig.push(config);
		return statistics;
	}

	redraw(event) {
		console.log(event);
		this.areaChartConfig.length = 0;
		this.getStats(this.rawData);
	}

}
