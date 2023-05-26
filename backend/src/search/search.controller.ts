import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { SearchTermInput } from '../models/SearchTermInput';
import { StringDefinedPipe } from '../pipes/StringDefined.pipe';
import { SearchService } from './search.service';
import { Entry } from '../models/Entry';
import { FetchDepth } from '../models/SearchOptions';

@Controller('/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // Validation using a custom pipe
  @Get('/query')
  async searchQuery(
    @Query('searchTerm', StringDefinedPipe) searchTerm: string,
    @Query('fetchDepth') fetchDepth: FetchDepth,
  ): Promise<Entry[]> {
    return this.searchService.search(searchTerm, fetchDepth);
  }

  // idem "
  @Get('/param/:searchTerm')
  async searchParam(
    @Param('searchTerm', StringDefinedPipe) searchTerm: string,
    @Query('fetchDepth') fetchDepth: FetchDepth,
  ): Promise<Entry[]> {
    return this.searchService.search(searchTerm, fetchDepth);
  }

  // Validation using a dumb throwing function
  @Post('/body')
  async searchBody(
    @Body('searchTerm') searchTerm: string,
    @Body('fetchDepth') fetchDepth: FetchDepth,
  ): Promise<Entry[]> {
    this.dumbStringValidation(searchTerm);
    return this.searchService.search(searchTerm, fetchDepth);
  }

  // Validation using the built in ValidationPipe using annotations in
  // the SearchTermInput class
  @Post('/body/full')
  async searchBodyFull(
    @Body(ValidationPipe) input: SearchTermInput,
  ): Promise<Entry[]> {
    return this.searchService.search(input.searchTerm, input.fetchDepth);
  }

  dumbStringValidation(searchTerm: string) {
    if (!searchTerm) {
      throw new BadRequestException('searchTerm is a required query parameter');
    }
    if (searchTerm.length < 2) {
      throw new BadRequestException('searchTerm must be at least 2 characters');
    }
  }
}
