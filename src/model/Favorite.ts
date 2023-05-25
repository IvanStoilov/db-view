export type Favorite = {
  favoriteId: string;
  name: string;
  user: string;
  password: string;
  host: string;
  database: string;
};

export type Connection = Favorite & {
  connectionId: string;
};
