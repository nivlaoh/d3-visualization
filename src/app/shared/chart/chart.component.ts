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
	private margin;
	private width;
	private height;
	private xScale;
	private innerXScale;
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
		this.xScale = d3.scaleTime().range([0, this.width]);
		//this.xScale = d3.scaleBand().range([0, this.width]);
		this.innerXScale = d3.scaleBand();
		this.yScale = d3.scaleLinear().range([this.height, 0]);
		this.colorScale = d3.scaleOrdinal()
			.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
	}

	private buildSVG(): void {
		this.host.html('');
		this.svg = this.host.append('svg')
			.attr('width', this.width + this.margin.left + this.margin.right)
			.attr('height', this.height + this.margin.top + this.margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
	}

	private drawXAxis(): void {
		this.xAxis = d3.axisBottom(this.xScale)
			.ticks(d3.timeYear, 5)
			.tickFormat(d3.timeFormat('%Y'));
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
		let maxValuesOfAreas = [];
		this.config.forEach(data => maxValuesOfAreas.push(Math.max.apply(Math, data.dataset.map(d => d.y))));
		return Math.max(...maxValuesOfAreas);
	}

	private populate(): void {
		this.config.forEach((config: ChartConfig) => {
			this.xScale.domain(d3.extent(config.dataset, (d: any) => d.x));
			//this.innerXScale.domain(config.categoryNames).rangeRoundBands([0, this.xScale.rangeBand()]);
			this.yScale.domain([0, this.getMaxY()]);
			this.svg.append('path')
				.datum(config.dataset)
				//.data(config.dataset)
				.attr('class', 'line')
				.attr('d', d3.line()
					.x((d: any) => this.xScale(d.x))
					.y((d: any) => this.yScale(d.y)));
		});
	}
}
