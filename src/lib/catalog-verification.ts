export type CommercialProduct = { price: number; oldPrice?: number | null; stock?: number | null; priceVerified?: boolean | null; stockVerified?: boolean | null }

export function verifiedCommerce(product: CommercialProduct) {
  return {
    price: product.priceVerified === true ? product.price : 0,
    oldPrice: product.priceVerified === true ? product.oldPrice : null,
    stock: product.stockVerified === true ? product.stock ?? 0 : null,
  }
}
