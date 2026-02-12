import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { PostOrderDto } from './dto/order.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(order: PostOrderDto) {
    const results = [];

    for (const ticket of order.tickets) {
      let sessionId = ticket.session;

      if (!sessionId) {
        const film = await this.filmsRepository.findById(ticket.film);
        if (!film || !film.schedule || film.schedule.length === 0) {
          throw new HttpException(
            { error: `Фильм ${ticket.film} не найден или нет сеансов` },
            HttpStatus.BAD_REQUEST,
          );
        }
        sessionId = film.schedule[0].id;
      }

      const session = await this.filmsRepository.getSession(
        ticket.film,
        sessionId,
      );

      if (!session) {
        throw new HttpException(
          { error: `Сеанс ${sessionId} не найден` },
          HttpStatus.BAD_REQUEST,
        );
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;

      if (session.taken?.includes(seatKey)) {
        throw new HttpException(
          { error: `Место ${seatKey} уже занято` },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.filmsRepository.addTakenSeats(ticket.film, sessionId, [
        seatKey,
      ]);

      results.push({
        id: randomUUID(),
        film: ticket.film,
        session: sessionId,
        row: ticket.row,
        seat: ticket.seat,
        daytime: session.daytime,
        price: session.price,
      });
    }

    return {
      total: results.length,
      items: results,
    };
  }
}
