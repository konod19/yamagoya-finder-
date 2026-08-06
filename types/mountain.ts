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
  huts: MountainHut[];
};
