import { Product } from './product.interface';

export interface decodedOrder{
    quantity: number,
    productId: string,
    product: Product,
}