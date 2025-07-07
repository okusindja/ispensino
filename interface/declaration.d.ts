import { NextPage } from 'next';

import { HomePageProps } from '@/views/home/home.types';
import { NewsItem } from '@/views/news/news.types';

export interface NextPageDefaultProps {
  now: number;
  pageTitle: string;
}

export interface SessionUserProps {
  uid: string;
  email: string | null;
}
export interface NextPageWithSessionProps {
  user: SessionUserProps;
}

export type NextPageWithSession = NextPage<NextPageWithSessionProps>;

export type NextPageWithProps = NextPage<NextPageDefaultProps>;

export interface NewsCollectionProps {
  news: NewsItem[];
}

export interface NewsDetailsPageProps {
  newDetails: NewsItem;
  allNews: NewsItem[];
}

export type NextPageWithNewsDetailsProps = NextPage<
  NewsDetailsPageProps & NextPageDefaultProps
>;

export type NextPageWithNewsProps = NextPage<
  NewsCollectionProps & NextPageDefaultProps
>;

export type NextPageWithHomeContent = NextPage<
  HomePageProps & NextPageDefaultProps
>;
