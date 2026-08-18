import { DifficultyTier } from "./hut";

export type MountainHut = {
  id: number;
  name: string;
};

export type Mountain = {
  id: number;
  name: string;
  area: string | null;
  elevation_text: string | null;
  difficulty_tier: DifficultyTier | null;
  prefecture: string | null;
  image_url: string | null;
  image_credit: string | null;
  huts: MountainHut[];
};
