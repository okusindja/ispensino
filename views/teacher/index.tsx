import { User } from '@prisma/client';
import { FC } from 'react';

const TeacherHome: FC<{ user: User }> = ({ user }) => {
  return <div>{user.name}</div>;
};

export default TeacherHome;
