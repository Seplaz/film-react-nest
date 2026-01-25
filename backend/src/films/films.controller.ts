import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { GetFilmsDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAll(): Promise<{ total: number; items: GetFilmsDto[] }> {
    const items = await this.filmsService.findAll();
    const itemsWithSchedule = items.map((film) => ({
      ...film,
      tags: Array.isArray(film.tags) ? film.tags : [film.tags],
      schedule: (film.schedule ?? []).map((session) => ({
        id: session.id,
        session: session.id,
        daytime: session.daytime,
        hall: session.hall,
        rows: session.rows,
        seats: session.seats,
        price: session.price,
        taken: Array.isArray(session.taken) ? session.taken : (session.taken === '' ? [] : [session.taken]),
      })),
    }));
    return {
      total: itemsWithSchedule.length,
      items: itemsWithSchedule,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const film = await this.filmsService.findFilmWithSchedule(id);

    if (!film) {
      throw new NotFoundException(`Фильм ${id} не найден`);
    }

    const schedule = (film.schedule ?? []).map((session) => ({
      id: session.id,
      session: session.id,
      daytime: session.daytime,
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: Array.isArray(session.taken) ? session.taken : (session.taken === '' ? [] : [session.taken]),
    }));

    return {
      ...film,
      tags: Array.isArray(film.tags) ? film.tags : [film.tags],
      schedule: schedule,
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
      session: session.id,
      daytime: session.daytime,
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: Array.isArray(session.taken) ? session.taken : (session.taken === '' ? [] : [session.taken]),
    }));

    return {
      total: items.length,
      items: items,
    };
  }
}
