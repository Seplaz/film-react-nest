import { Controller, Get, Param } from '@nestjs/common';
import { GetFilmsDto, GetScheduleDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAll(): Promise<{ total: number; items: GetFilmsDto[] }> {
    const items = await this.filmsService.findAll();
    return {
      total: items.length,
      items: items,
    };
  }

  @Get(':id/schedule')
  async findSchedule(
    @Param('id') id: string,
  ): Promise<{ total: number; items: GetScheduleDto[] }> {
    const items = await this.filmsService.findScheduleByFilmId(id);
    return {
      total: items.length,
      items: items,
    };
  }
}
