import { IsString, MinLength } from 'class-validator';
import { FetchDepth } from './SearchOptions';

export class SearchTermInput {
  @IsString()
  @MinLength(2, {
    message: 'searchTerm needs to be at least 2 characters long ma boi',
  })
  searchTerm: string;

  fetchDepth?: FetchDepth;
}
