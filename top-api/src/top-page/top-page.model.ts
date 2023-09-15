import { prop, index } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export enum TopLevelCategory {
	Courses,
	Sevices,
	Books,
	Products
}

export class hhData {
	@prop()
	count: number;

	@prop()
	juniorSelary: number;

	@prop()
	middleSelary: number;

	@prop()
	seniorSelary: number;
}

export class topPageAdvantages {
	@prop()
	title: string;

	@prop()
	description: string;
}

export interface TopPageModel extends Base { }
@index({ '$**': 'text' })
export class TopPageModel extends TimeStamps {
	@prop({ enum: TopLevelCategory })
	firstCategory: TopLevelCategory;

	@prop()
	secondCategory: string;

	@prop({ unique: true })
	alias: string;

	@prop()
	title: string;

	@prop()
	category: string;

	@prop({ type: () => hhData })
	hh?: hhData;

	@prop({ type: () => [topPageAdvantages] })
	advantages: topPageAdvantages[];

	@prop()
	seoText: string;

	@prop()
	tagsTitle: string;

	@prop({ type: () => [String] })
	tags: string[];
}
