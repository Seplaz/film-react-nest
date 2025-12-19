import { Controller, Get, Param } from '@nestjs/common';
import { FilmsDto, ScheduleDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findAll(): FilmsDto[] {
    return [];
  }

  @Get(':id/schedule')
  findSchedule(@Param('id') id: string): ScheduleDto[] {
    return [];
  }
}
