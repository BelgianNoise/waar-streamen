
export interface Entry {
  platform: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  language: string;
  seasons: Map<number, number[]>;
}