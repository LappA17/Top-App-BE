import { DynamicModule } from '@nestjs/common';
import { ITelegramModuleAsyncOptions } from './telegram.interface';
export declare class TelegramModule {
    static forRootAsync(options: ITelegramModuleAsyncOptions): DynamicModule;
    private static createAsyncOptionsProvider;
}
