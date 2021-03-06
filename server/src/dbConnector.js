import mongoose from 'mongoose'

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/amazonProducts')

const productSchema = new mongoose.Schema({
  ASIN: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  rank: { type: Array, required: true },
  reviews: { type: Array }
})

const Products = mongoose.model('products', productSchema)

export { Products }
