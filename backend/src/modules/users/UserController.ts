import { NextFunction, Request, Response } from 'express';
import { readPositiveInt, readString } from '../../middlewares/validators';
import { UserService } from './UserService';

export class UserController {
  constructor(private readonly userService: UserService) {}

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json(await this.userService.list());
    } catch (error) {
      next(error);
    }
  };

  assignRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = readPositiveInt(req.params.id, 'id');   // el id viene por la URL como texto
      const body: unknown = req.body;
      const roleName = readString(body, 'role');
      res.status(200).json(await this.userService.assignRole(userId, roleName));
    } catch (error) {
      next(error);
    }
  };
}