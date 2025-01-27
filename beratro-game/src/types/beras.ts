import { Bera, Sticker } from "@/utils/constants";

export interface BeraPosition {
  id: number;
  bera: Bera;
  index: number;
  level: number;
  sticker?: Sticker;
}
