export class TicketDto {
  film: string;
  session: string;
  row: number;
  seat: number;
}

export class PostOrderDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}
