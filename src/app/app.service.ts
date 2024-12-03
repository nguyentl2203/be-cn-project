import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { Key } from './app.collection';
import { IndexService } from 'src/index/index.service';
import { ImageInfo } from './app.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  index: number = 0
  api_key: string = ''
  headers: any = {}
  constructor(
    private httpService: HttpService,
    private keyService: Key,
    private indexService: IndexService,
  ) {}
  async getImageInfo(data: ImageInfo) {
    try {
      this.index = await this.indexService.getIndex();
      this.api_key = this.keyService.Api_key_Array[this.index];
      if (!this.api_key) {
        throw new HttpException('Invalid API Key Index', 400);
      }
      this.headers = {
        'Api-Key': this.api_key,
        'Content-Type': 'application/json',
      };
      const url1 = 'https://insect.kindwise.com/api/v1/usage_info';
      const check = await firstValueFrom(
        this.httpService.get(url1, { headers: this.headers }),
      );
      if (check.data.remaining.total <= 0) {
        this.index = await this.indexService.updateIndexByPlusOne()
        this.api_key = this.keyService.Api_key_Array[this.index];
        this.headers = {
          'Api-Key': this.api_key,
          'Content-Type': 'application/json',
        };
      }
      const params = {
        details: 'common_names,url,description,images,danger',
        language: 'en',
      };
      const url2 = `https://insect.kindwise.com/api/v1/identification?details=${params.details}&language=${params.language}`;
      const payload = {
        images: [data.images[0]],
        latitude: 49.207,
        longitude: 16.608,
        similar_images: true,
      };
      const res = await firstValueFrom(
        this.httpService.post(url2, payload, { headers: this.headers }),
      );
      return res.data;
    } catch (error) {
      console.error('Error fetching image info:', error.message);
      throw new Error('Failed to fetch image info');
    }
  }
}