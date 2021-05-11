export type NavMenuType = {
  index: string;
  navLable: string;
  routeName?: string;
  iconName?: string;
  children?: Array<NavMenuType>;
};