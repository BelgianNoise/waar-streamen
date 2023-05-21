import { Injectable } from '@nestjs/common';
import { Entry } from '../../../models/Entry';
import { Retriever } from '../Retriever';
import { parseLanguage } from '../../../models/Language';
import parse from 'node-html-parser';

@Injectable()
export class VtmGoRetriever extends Retriever {
  constructor() {
    super('https://vtm.be/vtmgo/zoeken', 'VTM GO');
  }

  async retrieve(searchTerm: string): Promise<Entry[]> {
    const reqUrl = new URL(this.baseSearchUrl);
    reqUrl.searchParams.append('query', searchTerm);
    const result = await fetch(reqUrl);

    if (!result.ok || result.status !== 200) {
      throw new Error(`Status (${result.status})`);
    }

    if (result.headers.get('content-type') !== 'text/html') {
      throw new Error(`Content-Type: ${result.headers.get('content-type')}`);
    }

    const text = await result.text();
    const parsed = parse(text);

    return [];
  }
}
