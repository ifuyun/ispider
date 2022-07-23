import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import { lastValueFrom } from 'rxjs';
import { Sequelize } from 'sequelize-typescript';
import { DbQueryErrorException } from '../../exceptions/db-query-error.exception';
import { generateId } from '../../helpers/helper';
import { DomainModel } from '../../models/domain.model';
import { LoggerService } from '../logger/logger.service';
import { Domain } from './domain.interface';

@Injectable()
export class DomainService {
  constructor(
    @InjectModel(DomainModel)
    private readonly domainModel: typeof DomainModel,
    private readonly httpService: HttpService,
    private readonly logger: LoggerService,
    private readonly sequelize: Sequelize
  ) {}

  async fetchDomains(page: string) {
    const html = (await lastValueFrom(this.httpService.get(`https://wangguai.com/domain/list${page}.html`))).data;
    const $ = cheerio.load(iconv.encode(html, 'utf8'), { decodeEntities: true });
    const $domains = $('#mylist li');
    const domains: Domain[] = [];
    $domains.each((i, ele) => {
      const $ele = $(ele);
      const price =
        $ele
          .find('dd:eq(1)')
          .html()
          .match(/(\d+(?:,\d+)*(?:.\d+)?)/i)?.[1] || '';
      domains.push({
        name: $ele.find('a:eq(0)').html(),
        description: $ele.find('dd:eq(0)').html(),
        price: Number(price.replace(',', '')) || 0,
        broker: 'wangguai'
      });
    });
    return domains;
  }

  async saveDomains(domains: Domain[]): Promise<boolean> {
    return this.sequelize
      .transaction(async (t) => {
        await this.domainModel.bulkCreate(
          domains.map((item) => ({
            domainId: generateId(),
            domainName: item.name,
            domainDescription: item.description,
            domainPrice: item.price,
            broker: item.broker
          })),
          { transaction: t }
        );
      })
      .then(() => true)
      .catch((e) => {
        this.logger.error({
          message: e.message || '域名保存失败',
          stack: e.stack
        });
        throw new DbQueryErrorException();
      });
  }
}
