import { TelegramService } from 'src/telegram/telegram.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
export declare class ReviewController {
    private readonly reviewService;
    private readonly telegramService;
    constructor(reviewService: ReviewService, telegramService: TelegramService);
    create(dto: CreateReviewDto): Promise<import("@typegoose/typegoose").DocumentType<import("./review.model").ReviewModel, import("@typegoose/typegoose/lib/types").BeAnObject>>;
    notify(dto: CreateReviewDto): Promise<void>;
    delete(id: string): Promise<void>;
    getByProduct(productId: string, email: string): Promise<import("@typegoose/typegoose").DocumentType<import("./review.model").ReviewModel, import("@typegoose/typegoose/lib/types").BeAnObject>[]>;
}
