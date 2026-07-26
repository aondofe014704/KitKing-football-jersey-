import { Request, Response, NextFunction } from 'express';
import { DeliveryService } from './delivery.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.utils';

const deliveryService = new DeliveryService();

export class DeliveryController {
  async getAllZones(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const zones = await deliveryService.getAllZones(true);
      sendSuccess(res, zones, 'Delivery zones retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAllZonesAdmin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const zones = await deliveryService.getAllZones(false);
      sendSuccess(res, zones, 'Delivery zones retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getZoneByState(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const zone = await deliveryService.getZoneByState(req.params.state);
      sendSuccess(res, zone, zone ? 'Zone found' : 'No delivery zone for this state');
    } catch (error) {
      next(error);
    }
  }

  async createZone(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const zone = await deliveryService.createZone(req.body);
      sendSuccess(res, zone, 'Delivery zone created', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateZone(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const zone = await deliveryService.updateZone(req.params.id, req.body);
      sendSuccess(res, zone, 'Zone updated');
    } catch (error) {
      next(error);
    }
  }

  async deleteZone(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await deliveryService.deleteZone(req.params.id);
      sendSuccess(res, null, 'Zone deleted');
    } catch (error) {
      next(error);
    }
  }
}
