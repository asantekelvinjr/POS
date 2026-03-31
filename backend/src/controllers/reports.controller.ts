import { Request, Response, NextFunction } from 'express'
import { ReportsService } from '../services/reports.service'

export const ReportsController = {
  async daily(req: Request, res: Response, next: NextFunction) {
    try {
      const { date } = req.query
      const data = await ReportsService.getDailySummary(date as string)
      res.json({ success: true, data })
    } catch (err) { next(err) }
  },

  async weekly(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ReportsService.getWeeklySummary()
      res.json({ success: true, data })
    } catch (err) { next(err) }
  },

  async monthly(req: Request, res: Response, next: NextFunction) {
    try {
      const { year, month } = req.query
      const data = await ReportsService.getMonthlySummary(
        year  ? Number(year)  : undefined,
        month ? Number(month) : undefined
      )
      res.json({ success: true, data })
    } catch (err) { next(err) }
  },

  async topProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, days } = req.query
      const data = await ReportsService.getTopProducts(
        limit ? Number(limit) : 10,
        days  ? Number(days)  : 7
      )
      res.json({ success: true, data })
    } catch (err) { next(err) }
  },

  async cashierPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const { days } = req.query
      const data = await ReportsService.getCashierPerformance(days ? Number(days) : 7)
      res.json({ success: true, data })
    } catch (err) { next(err) }
  },

  async paymentBreakdown(req: Request, res: Response, next: NextFunction) {
    try {
      const { days } = req.query
      const data = await ReportsService.getPaymentMethodBreakdown(days ? Number(days) : 7)
      res.json({ success: true, data })
    } catch (err) { next(err) }
  },

  async inventory(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ReportsService.getInventoryReport()
      res.json({ success: true, data })
    } catch (err) { next(err) }
  },

  async summary(req: Request, res: Response, next: NextFunction) {
    try {
      const now = new Date()
      const startDate = (req.query.startDate as string) ||
        new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const endDate = (req.query.endDate as string) || now.toISOString()
      const data = await ReportsService.getSalesSummary(startDate, endDate)
      res.json({ success: true, data })
    } catch (err) { next(err) }
  },
}
