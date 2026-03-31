import { InventoryModel } from '../models/inventory.model'
import { AppError } from '../middleware/errorHandler'

export const InventoryService = {
  async getAll() {
    return InventoryModel.findAll()
  },

  async getByProductId(productId: number) {
    const item = await InventoryModel.findByProductId(productId)
    if (!item) throw new AppError('Inventory record not found', 404)
    return item
  },

  async getLowStock() {
    return InventoryModel.getLowStock()
  },

  async getOutOfStock() {
    return InventoryModel.getOutOfStock()
  },

  async adjustStock(productId: number, newQuantity: number, note?: string) {
    if (newQuantity < 0) throw new AppError('Stock quantity cannot be negative', 400)

    const item = await InventoryModel.findByProductId(productId)
    if (!item) throw new AppError('Inventory record not found', 404)

    return InventoryModel.adjustStock(productId, newQuantity, note)
  },

  async update(productId: number, data: {
    reorderLevel?: number
    supplierName?: string
    supplierPhone?: string
  }) {
    const item = await InventoryModel.findByProductId(productId)
    if (!item) throw new AppError('Inventory record not found', 404)
    return InventoryModel.update(productId, data)
  },
}
