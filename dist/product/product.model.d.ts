import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
declare class ProductCharacteristic {
    name: string;
    value: string;
}
export interface ProductModel extends Base {
}
export declare class ProductModel extends TimeStamps {
    image: string;
    title: string;
    link: string;
    initialRating: number;
    price: number;
    oldPrice?: number;
    credit: number;
    description: string;
    advantages: string;
    disAdvantages?: string;
    categories: string[];
    tags: string[];
    characteristics: ProductCharacteristic[];
}
export {};
