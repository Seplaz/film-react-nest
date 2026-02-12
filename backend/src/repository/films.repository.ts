import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmRepository.find({
      select: [
        'id',
        'rating',
        'director',
        'tags',
        'title',
        'about',
        'description',
        'image',
        'cover',
      ],
      relations: ['schedule'],
    });
  }

  async findScheduleByFilmId(id: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { filmId: id },
    });
  }

  async addTakenSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: sessionId, filmId: filmId },
    });

    if (!schedule) {
      return false;
    }

    const updatedTaken = [...new Set([...schedule.taken, ...seats])];
    schedule.taken = updatedTaken;

    await this.scheduleRepository.save(schedule);
    return true;
  }

  async getSession(
    filmId: string,
    sessionId: string,
  ): Promise<Schedule | null> {
    return this.scheduleRepository.findOne({
      where: { id: sessionId, filmId: filmId },
    });
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });
  }
}
