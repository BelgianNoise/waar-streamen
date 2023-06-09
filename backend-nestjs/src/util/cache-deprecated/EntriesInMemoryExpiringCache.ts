import { Injectable } from '@nestjs/common';
import { Entry } from '../../models/Entry';
import { InMemoryExpiringCache } from './InMemoryExpiringCache';

@Injectable()
export class EntriesInMemoryExpiringCache extends InMemoryExpiringCache<
  string,
  Entry[]
> {
  constructor() {
    super();
  }
}
