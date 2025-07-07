export enum RoutesEnum {
  Home = 'home',
  Content = 'conteúdo',
  Library = 'livraria',
  User = 'perfil',
}

export const Routes: Record<RoutesEnum, string> = {
  [RoutesEnum.Home]: '/',
  [RoutesEnum.Content]: '/content',
  [RoutesEnum.Library]: '/library',
  [RoutesEnum.User]: '/profile',
};
