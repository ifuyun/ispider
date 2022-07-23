import { Controller, Get, Render } from '@nestjs/common';
import { Domain } from './domain.interface';
import { DomainService } from './domain.service';

@Controller('domain')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Get()
  @Render('pages/domain-list')
  async getDomain() {
    let allDomains: Domain[] = [];
    const times = 0;
    let page = times * 100 + 1; // max: 1344
    while (page <= (times + 1) * 100) {
      const domains = await this.domainService.fetchDomains('00' + page);
      const result = await this.domainService.saveDomains(domains);
      if (result) {
        allDomains = allDomains.concat(domains);
      }
      page += 1;
    }

    return {
      domains: allDomains
    };
  }
}
