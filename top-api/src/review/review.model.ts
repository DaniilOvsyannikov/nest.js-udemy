import { prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export interface RewiewModel extends Base { }
export class ReviewModel extends TimeStamps {
	@prop()
	name: string;

	@prop()
	title: string;

	@prop()
	discription: string;

	@prop()
	rating: number;

	@prop()
	createdAt: Date;
}
