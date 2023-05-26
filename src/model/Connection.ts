import { Favorite } from "./Favorite";

export type Connection = Favorite & {
  connectionId: string;
};
