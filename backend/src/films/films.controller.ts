import { Controller, Get, Param } from '@nestjs/common';
import { GetFilmsDto, GetScheduleDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAll(): Promise<GetFilmsDto[]> {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  async findSchedule(@Param('id') id: string): Promise<GetScheduleDto[]> {
    return this.filmsService.findScheduleByFilmId(id);
  }
}
