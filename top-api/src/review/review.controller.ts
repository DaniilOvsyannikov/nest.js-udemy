import { Controller, Post, Body, Delete, Param, Get, HttpException, HttpStatus, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './review.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';
import { IdValidationPipe } from 'src/pipes/id-validaton.pipe';

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) { }

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.reviewService.delete(id);
		if (!deletedDoc) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

	}

	@Get('byProduct/:productId')
	async getByProduct(@Param('productId', IdValidationPipe) productId: string, @UserEmail() email: string) {
		return this.reviewService.findByProductId(productId);

	}

}
