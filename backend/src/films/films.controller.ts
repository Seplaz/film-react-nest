import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { GetFilmsDto } from './dto/films.dto';
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
  async findSchedule(@Param('id') id: string) {
    const film = await this.filmsService.findFilmWithSchedule(id);

    if (!film) {
      throw new NotFoundException(`Фильм ${id} не найден`);
    }

    const items = (film.schedule ?? []).map((session) => ({
      id: session.id,
      daytime: session.daytime,
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken,
    }));

    return {
      total: items.length,
      items: items,
    };
  }
}
