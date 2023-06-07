import { writable } from "svelte/store";

export const randomMeme = writable<{
  subreddit: string;
  title: string;
  post: string;
  url: string;
  author: string;
} | undefined>(undefined)