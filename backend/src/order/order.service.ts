import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { PostOrderDto, TicketDto } from './dto/order.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(order: PostOrderDto) {
    const results = [];
    const grouped = this.groupTickets(order.tickets);

    for (const [key, tickets] of grouped) {
      const [filmId, sessionId] = key.split('|');
      const session = await this.filmsRepository.getSession(filmId, sessionId);

      if (!session) {
        throw new HttpException(
          { error: `Сеанс ${sessionId} не найден` },
          HttpStatus.BAD_REQUEST,
        );
      }

      const seatsToBook = tickets.map((t) => `${t.row}:${t.seat}`);
      const alreadyTaken = seatsToBook.filter((seat) =>
        session.taken?.includes(seat),
      );

      if (alreadyTaken.length > 0) {
        throw new HttpException(
          { error: `Места уже заняты: ${alreadyTaken.join(', ')}` },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.filmsRepository.addTakenSeats(filmId, sessionId, seatsToBook);

      for (const ticket of tickets) {
        results.push({
          id: randomUUID,
          film: ticket.film,
          session: ticket.session,
          row: ticket.row,
          seat: ticket.seat,
          daytime: session.daytime,
          price: session.price,
        });
      }
    }

    return {
      total: results.length,
      items: results,
    };
  }

  private groupTickets(tickets: TicketDto[]): Map<string, TicketDto[]> {
    const map = new Map<string, TicketDto[]>();

    for (const ticket of tickets) {
      const key = `${ticket.film}|${ticket.session}`;

      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ticket);
    }

    return map;
  }
}
