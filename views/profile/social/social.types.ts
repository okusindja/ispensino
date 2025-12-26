import { PostProps } from '@/interface/types';
import { Post, User } from '@prisma/client';

export interface SocialProfileProps {
  user: (User & { following: number; followers: number }) | null;
}
