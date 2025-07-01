export interface NewsItem {
  title: {
    en: string;
    pt: string;
  };
  location: string;
  date: string;
  image: string;
  slug: string;
  description: {
    en: string;
    pt: string;
  };
  content: {
    en: string;
    pt: string;
  };
  author: string;
  category: 'team' | 'player' | 'general';
  isHeadline: boolean;
  reference: {
    name: string;
    slug: string;
  };
}

export interface NewsCollection {
  news: ReadonlyArray<NewsItem>;
}

export interface NewDetailsProps {
  newDetails: NewsItem;
  allNews: NewsItem[];
}
