import { Course, User } from '@prisma/client';
import { NextPage } from 'next';

import { HomePageProps } from '@/views/home/home.types';

export interface NextPageDefaultProps {
  now: number;
  pageTitle: string;
}

export interface UserProps extends User {
  teachingCourses: Course[];
}

export interface SessionUserProps {
  uid: string;
  email: string | null;
}
export interface NextPageWithSessionProps {
  user: SessionUserProps;
}

export interface NextPageWithUserProps {
  loggedUser: UserProps;
  user: SessionUserProps;
}

export type NextPageWithUser = NextPage<NextPageWithUserProps>;

export type NextPageWithSession = NextPage<NextPageWithSessionProps>;

export type NextPageWithProps = NextPage<NextPageDefaultProps>;

export type NextPageWithHomeContent = NextPage<
  HomePageProps & NextPageDefaultProps
>;
