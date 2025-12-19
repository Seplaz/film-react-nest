import { Body, Controller, Post } from '@nestjs/common';
import { PostOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() body: PostOrderDto): string {
    return 'Заказ создан';
  }
}
