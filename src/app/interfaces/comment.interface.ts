import { User } from './user.interface';

export interface Comment {
  id: number;
  resourceId: number;
  author: User;
  text: string;
  createdAt: string;
}
