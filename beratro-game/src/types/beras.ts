import { Bera, Sticker } from "@/utils/constants";

export interface BeraPosition {
  id: string;
  bera: Bera;
  index: number;
  level: number;
  sticker?: Sticker;
}
