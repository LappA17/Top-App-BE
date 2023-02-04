import { ConfigService } from '@nestjs/config';
import { ITelegramOptions } from 'src/telegram/telegram.interface';
export declare const getTelegramConfig: (configService: ConfigService) => ITelegramOptions;
