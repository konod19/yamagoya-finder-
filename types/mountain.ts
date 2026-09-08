import { DifficultyTier } from "./hut";

export type MountainHut = {
  id: number;
  name: string;
  hut_elevation_text: string | null;
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
  course_time_text: string | null;
  trailhead_access_text: string | null;
  best_season_text: string | null;
  technical_notes_text: string | null;
  elevation_gain_text: string | null;
  highlights_text: string | null;
  fame_text: string | null;
  wildlife_text: string | null;
  information_confidence: string | null;
  huts: MountainHut[];
};
