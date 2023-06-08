import { writable } from 'svelte/store';
import type { Entry } from '../util/models/entry';

export const searchResults = writable<Entry[] | undefined>(undefined);
