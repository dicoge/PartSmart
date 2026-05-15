export type RootTabParamList = {
  index: undefined;
  search: undefined;
  favorites: undefined;
  settings: undefined;
};

export type ProductStackParamList = {
  productDetail: { id: string };
  compare: { ids: string[] };
};