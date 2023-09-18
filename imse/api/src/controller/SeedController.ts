import { Controller, Inject, Post } from '@nestjs/common';

import * as services from '@/service';

@Controller('seed')
export class SeedController {
  constructor(@Inject(services.SeedService) private readonly seedService: services.SeedService) { }

  @Post()
  async seed(): Promise<void> {
    await this.seedService.seed();
  }
}
