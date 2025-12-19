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
}
