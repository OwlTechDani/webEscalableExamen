import { User } from './user.interface';

export interface Resource {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
  resourceType: string;
  tags: string[];
  imageUrl: string;
  author: User;
  createdAt: string;
}
