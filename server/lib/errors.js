export class ProductExistsError extends Error {
  code = 420
  message = 'Product exists'
}

export class ProductNotFound extends Error {
  code = 404
  message = 'Error looking up product on amazon.com';
}