import { Request, Response, NextFunction } from 'express';
import { GalleryService } from './gallery.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.utils';

const galleryService = new GalleryService();

export class GalleryController {
  async getAllImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const images = await galleryService.getAllImages(true);
      sendSuccess(res, images, 'Gallery retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAllImagesAdmin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const images = await galleryService.getAllImages(false);
      sendSuccess(res, images, 'Gallery retrieved');
    } catch (error) {
      next(error);
    }
  }

  async addImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const image = await galleryService.addImage(req.body);
      sendSuccess(res, image, 'Image added', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const image = await galleryService.updateImage(req.params.id, req.body);
      sendSuccess(res, image, 'Image updated');
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await galleryService.deleteImage(req.params.id);
      sendSuccess(res, null, 'Image deleted');
    } catch (error) {
      next(error);
    }
  }

  async reorderImages(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await galleryService.reorderImages(req.body.imageIds);
      sendSuccess(res, null, 'Images reordered');
    } catch (error) {
      next(error);
    }
  }
}
