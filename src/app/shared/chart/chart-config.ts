export class ChartConfig {
	settings: { fill: string, interpolation: string };
	dataset: Array<{ x: Date, y: number }>;
	categoryNames: Array<string> = [];
}
