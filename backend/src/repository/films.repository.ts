import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, Schedule } from 'src/films/films.schema';

@Injectable()
export class FilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().exec();
  }

  async findScheduleByFilmId(id: string): Promise<Schedule[]> {
    const film = await this.filmModel.findOne({ id }).exec();
    return film?.schedule ?? [];
  }

  async addTakenSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    const result = await this.filmModel
      .updateOne(
        { id: filmId, 'schedule.id': sessionId },
        { $addToSet: { 'schedule.$.taken': { $each: seats } } },
      )
      .exec();
    return result.modifiedCount > 0;
  }

  async getSession(
    filmId: string,
    sessionId: string,
  ): Promise<Schedule | null> {
    const film = await this.filmModel
      .findOne({ id: filmId }, { schedule: { $elemMatch: { id: sessionId } } })
      .exec();
    return film?.schedule?.[0] ?? null;
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmModel.findOne({ id }).exec();
  }
}
