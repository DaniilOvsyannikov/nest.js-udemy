import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ProductModel } from './product.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateProductDto } from './dto/crate-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ReviewModel } from 'src/review/review.model';


export interface AggregatedProduct extends ProductModel {
	review: ReviewModel[];
	reviewCount: number;
	reviewAvg: number;
}
@Injectable()
export class ProductService {
	constructor(@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>) { }

	async create(dto: CreateProductDto) {
		return this.productModel.create(dto);
	}

	async findById(id: string) {
		return this.productModel.findById(id).exec();
	}
	async deleteById(id: string) {
		return this.productModel.findByIdAndDelete(id).exec()
	}
	async updateById(id: string, dto: CreateProductDto) {
		return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec()
	}
	async findWithReviews(dto: FindProductDto): Promise<AggregatedProduct[]> {
		const products = await this.productModel.aggregate([
			{
				$match: {
					categories: dto.category
				}
			},
			{
				$sort: {
					_id: 1
				}
			},
			{
				$limit: dto.limit
			},
			{
				$lookup: {
					from: 'Review',
					localField: '_id',
					foreignField: 'productId',
					as: 'review'
				}
			},
			{
				$addFields: {
					reviewCount: { $size: '$review' },
					reviewAvg: { $avg: '$review.rating' },
					reviews: {
						$function: {
							body: `function(reviews){
								reviews.sort((a,b)=> new Date(b.createdAt)- new Date(a.createdAt))
								return reviews;
							}`,
							args: ['$reviews'],
							lang: 'js'
						}
					}
				}
			}
		]).exec();
		return products as AggregatedProduct[];

	}
}
