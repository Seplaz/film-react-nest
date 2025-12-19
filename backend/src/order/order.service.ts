import { Injectable, BadRequestException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { PostOrderDto, TicketDto } from './dto/order.dto';

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
        throw new BadRequestException(`Сеанс ${sessionId} не найден`);
      }

      const seatsToBook = tickets.map((t) => `${t.row}:${t.seat}`);
      const alreadyTaken = seatsToBook.filter((seat) =>
        session.taken?.includes(seat),
      );

      if (alreadyTaken.length > 0) {
        throw new BadRequestException(
          `Места уже заняты: ${alreadyTaken.join(', ')}`,
        );
      }

      await this.filmsRepository.addTakenSeats(filmId, sessionId, seatsToBook);
      results.push({ filmId, sessionId, seats: seatsToBook });
    }

    return { success: true, tickets: results };
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
