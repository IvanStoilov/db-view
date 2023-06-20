export type Favorite = {
  id: string;
  name: string;
  options: {
    user: string;
    password: string;
    host: string;
    database: string;
    timezone: string;
  };
};
