import { Language } from './Language';
import { Platform } from './Platform';
import { Transform } from 'class-transformer';

export class Entry {
  platform: Platform;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  language: Language;

  @Transform(({ value }) =>
    Object.keys(value)
      .map((k) => ({ [k]: [...value[k]] }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
  )
  seasons: Map<number, Set<number>>;
}
