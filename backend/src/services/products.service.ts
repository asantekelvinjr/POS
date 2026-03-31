import { ProductModel } from '../models/product.model'
import { InventoryModel } from '../models/inventory.model'
import { AppError } from '../middleware/errorHandler'

export const ProductsService = {
  async getAll() {
    return ProductModel.findAll()
  },

  async getById(id: number) {
    const product = await ProductModel.findById(id)
    if (!product) throw new AppError('Product not found', 404)
    return product
  },

  async getByBarcode(barcode: string) {
    const product = await ProductModel.findByBarcode(barcode)
    if (!product) throw new AppError('Product not found for this barcode', 404)
    return product
  },

  async search(term: string) {
    return ProductModel.search(term)
  },

  async create(data: {
    name: string
    category: string
    price: number
    costPrice?: number
    barcode?: string
    description?: string
    imageUrl?: string
    quantity?: number
    reorderLevel?: number
    supplierName?: string
    supplierPhone?: string
  }) {
    // Check barcode uniqueness
    if (data.barcode) {
      const existing = await ProductModel.findByBarcode(data.barcode)
      if (existing) throw new AppError('A product with this barcode already exists', 409)
    }

    const product = await ProductModel.create(data)

    // Create inventory record alongside the product
    await InventoryModel.create({
      productId: product.id,
      quantity: data.quantity || 0,
      reorderLevel: data.reorderLevel || 10,
      supplierName: data.supplierName,
      supplierPhone: data.supplierPhone,
    })

    return product
  },

  async update(id: number, data: Parameters<typeof ProductModel.update>[1] & {
    quantity?: number
    reorderLevel?: number
    supplierName?: string
    supplierPhone?: string
  }) {
    const existing = await ProductModel.findById(id)
    if (!existing) throw new AppError('Product not found', 404)

    // Check barcode uniqueness if changing it
    if (data.barcode && data.barcode !== existing.barcode) {
      const taken = await ProductModel.findByBarcode(data.barcode)
      if (taken) throw new AppError('A product with this barcode already exists', 409)
    }

    const { quantity, reorderLevel, supplierName, supplierPhone, ...productData } = data

    const product = await ProductModel.update(id, productData)

    // Update inventory if stock fields provided
    if (quantity !== undefined || reorderLevel !== undefined || supplierName !== undefined || supplierPhone !== undefined) {
      const inventory = await InventoryModel.findByProductId(id)
      if (inventory) {
        if (quantity !== undefined) {
          await InventoryModel.adjustStock(id, quantity)
        }
        await InventoryModel.update(id, { reorderLevel, supplierName, supplierPhone })
      }
    }

    return product
  },

  async delete(id: number) {
    const existing = await ProductModel.findById(id)
    if (!existing) throw new AppError('Product not found', 404)
    await ProductModel.softDelete(id)
  },
}
