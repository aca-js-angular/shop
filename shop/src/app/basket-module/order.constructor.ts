import { Product } from '../products-module/product-interface';

export class Order {
    constructor(
        public product: Product,
        public quantity: number,
    ){}
}