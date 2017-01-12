import { Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as moment from 'moment';

import { ChartConfig } from './chart-config';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
	@Input() config: Array<ChartConfig>;
	private host;
	private svg;
	private chartLayer;
	private margin;
	private width;
	private height;
	private xScale;
	private xInScale;
	private colorScale;
	private yScale;
	private xAxis;
	private yAxis;
	private htmlElement: HTMLElement;

	constructor(private element: ElementRef) {
		this.htmlElement = element.nativeElement;
		this.host = d3.select(this.element.nativeElement);
	}

	ngOnInit() {
	}

	ngOnChanges() {
		if (!this.config || this.config.length === 0) return;
		this.setup();
		this.buildSVG();
		this.populate();
		this.drawXAxis();
		this.drawYAxis();
		
	}

	private setup(): void {
		this.margin = { top: 10, right: 10, bottom: 30, left: 40 };
		this.width = this.htmlElement.clientWidth - this.margin.left - this.margin.right;
		this.height = this.width * 0.8 - this.margin.top - this.margin.bottom;
		//this.height = this.htmlElement.clientHeight - this.margin.top - this.margin.bottom;
		//this.xScale = d3.scaleTime().range([0, this.width]);
		this.xScale = d3.scaleBand().range([0, this.width]).paddingInner(0.1);
		this.xInScale = d3.scaleBand();
		this.yScale = d3.scaleLinear().range([this.height, 0]);
		this.colorScale = d3.scaleOrdinal()
			.range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);
	}

	private buildSVG(): void {
		this.host.html('');
		this.svg = this.host.append('svg')
			.attr('width', this.width + this.margin.left + this.margin.right)
			.attr('height', this.height + this.margin.top + this.margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
		this.chartLayer = this.svg.append("g").classed("chartLayer", true);
	}

	private drawXAxis(): void {
		this.xAxis = d3.axisBottom(this.xScale)
			//.ticks(d3.timeYear, 5)
			//.tickFormat(d3.timeFormat('%Y'));
			;
		this.svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + this.height + ')')
			.call(this.xAxis);
	}

	private drawYAxis(): void {
		this.yAxis = d3.axisLeft(this.yScale)
			.tickPadding(5);
		this.svg.append('g')
			.attr('class', 'y axis')
			.call(this.yAxis)
			.append('text')
			.attr('transform', 'rotate(-90)');
	}

	private getMaxY(): number {
		return d3.max(this.config.map(data => {
			return d3.max(data.dataset.map(function(d) {
	            var values = Object.keys(d.values).map(function(key) {
	                return d.values[key].infocomm_industry_revenue;
	            });
            	return d3.max(values);
        	}));
		}));
	}

	private populate(): void {
		this.config.forEach((c: ChartConfig) => {
			this.xScale.domain(c.dataset.map((d: any) => { return d.key; }));
			this.xInScale.domain(c.categoryNames).range([0, this.xScale.bandwidth()]);
			let maxY = this.getMaxY();
			//console.log('maxY', maxY);
			this.yScale.domain([0, maxY]);

			let revenuePoints = this.chartLayer.selectAll('.revenue').data(c.dataset);

			let newRevenue = revenuePoints.enter()
				.append('g')
				.attr('class', 'revenue');

			revenuePoints.merge(newRevenue)
				.attr('transform', (d) => {
					return 'translate(' + [this.xScale(parseInt(d.key)), 0] + ")";
				});

			let bar = newRevenue.selectAll('.bar')
            	.data((d) => { return d.values; });

        	let newBar = bar.enter()
        		.append('rect')
        		.attr('class', 'bar');

        	bar.merge(newBar)
	            .attr('width', this.xInScale.bandwidth())
	            .attr('height', 0)
	            .attr('fill', (d) => { return this.colorScale(d.segment); })
	            .attr('transform', (d) => { return 'translate(' + [this.xInScale(d.segment), this.height] + ')' });
			
			let t = d3.transition(null)
				.duration(1000)
				.ease(d3.easeLinear);

	        bar.merge(newBar).transition(t)
            	.attr('height', (d) => { return this.height - this.yScale(d.infocomm_industry_revenue); })
            	.attr('transform', (d) => { return 'translate(' + [this.xInScale(d.segment), this.yScale(d.infocomm_industry_revenue)] + ')' });
        	
        	let legendRectSize = 18;
        	let legendSpacing = 4;

        	let legend = this.svg.selectAll('.legend')
        		.data(this.colorScale.domain())
        		.enter()
        		.append('g')
        		.attr('class', 'legend')
        		.attr('transform', (d, i) => {
        			let height = legendRectSize + legendSpacing;
    				let offset =  height * this.colorScale.domain().length / 2;
    				let horz = -2 * legendRectSize;
    				let vert = i * height - offset;
    				return 'translate(' + horz + ',' + vert + ')';
        		});

		});
	}
}
