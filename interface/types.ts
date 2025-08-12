export interface UserProps {
  id: string;
  name: string;
  username?: string;
  email: string;
  image?: string;
}

export interface TagProps {
  id: string;
  name: string;
  type: 'USER' | 'RESOURCE' | 'TOPIC';
}

export interface AttachmentProps {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO' | 'PDF' | 'AUDIO';
}

export interface CommentProps {
  id: string;
  content: string;
  createdAt: string;
  author: Pick<UserProps, 'id' | 'name' | 'username'>;
}

export interface LikeProps {
  userId: string;
}

export interface PostProps {
  id: string;
  content: string;
  createdAt: string;
  author: UserProps;
  tags: TagProps[];
  attachments: AttachmentProps[];
  comments: CommentProps[];
  likes: LikeProps[];
  isLiked?: boolean;
}
