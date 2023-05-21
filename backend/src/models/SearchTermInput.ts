import { IsString, MinLength } from 'class-validator';

export class SearchTermInput {
  @IsString()
  @MinLength(2)
  searchTerm: string;
}
