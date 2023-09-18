import { Controller, Get, Inject, Post } from '@nestjs/common';

import * as services from '@/service';

@Controller('migration')
export class MigrationController {
  constructor(@Inject(services.MigrationService) private readonly migrationService: services.MigrationService) { }

  @Post()
  async migration(): Promise<void> {
    await this.migrationService.runMigration();
  }

  @Get('mode')
  async getMode(): Promise<string> {
    return process.env.STORAGE_MODE ?? 'undefined';
  }
}
