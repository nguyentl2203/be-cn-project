import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ImageInfo, ImageInfoDetails } from './app.dto';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/')
  GetImageInfo(@Body() data: ImageInfo) {
    return this.appService.getImageInfo(data)
  }

  @Post('/details')
  GetImageInfoDetails(@Body() data: ImageInfoDetails) {
    return this.appService.getImageInfoDetails(data)
  }
}
