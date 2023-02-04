import { TopLevelCategory } from '../top-page.model';
export declare class HhDataDto {
    count: number;
    juniorSalary: number;
    middleSalary: number;
    seniorSalary: number;
}
export declare class TopPageAdvantageDto {
    title: string;
    description: string;
}
export declare class CreateTopPageDto {
    firstCategory: TopLevelCategory;
    secondCategory: string;
    alias: string;
    title: string;
    category: string;
    hh?: HhDataDto;
    advantages: TopPageAdvantageDto[];
    seoText: string;
    tagsTitle: string;
    tags: string[];
}
