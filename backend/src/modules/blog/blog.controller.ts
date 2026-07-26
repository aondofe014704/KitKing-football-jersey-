import { Request, Response, NextFunction } from 'express';
import { BlogService } from './blog.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.utils';

const blogService = new BlogService();

export class BlogController {
  async getAllPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await blogService.getAllPosts(req.query as Record<string, string>);
      sendSuccess(res, result.posts, 'Posts retrieved', 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getPostBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await blogService.getPostBySlug(req.params.slug);
      sendSuccess(res, post, 'Post retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createPost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await blogService.createPost(req.user!.userId, req.body);
      sendSuccess(res, post, 'Post created', 201);
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await blogService.updatePost(req.params.id, req.body);
      sendSuccess(res, post, 'Post updated');
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await blogService.deletePost(req.params.id);
      sendSuccess(res, null, 'Post deleted');
    } catch (error) {
      next(error);
    }
  }
}
