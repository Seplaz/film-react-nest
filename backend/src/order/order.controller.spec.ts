import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
    jest.clearAllMocks();
  });

  it('должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('должен создавать заказ и возвращать результат', async () => {
      const orderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          {
            film: '1',
            session: '123',
            row: 5,
            seat: 10,
          },
        ],
      };

      const mockResult = {
        total: 1,
        items: [{ orderId: 'abc123' }],
      };

      mockOrderService.createOrder.mockResolvedValue(mockResult);

      const result = await controller.create(orderDto);

      expect(service.createOrder).toHaveBeenCalledWith(orderDto);
      expect(result).toEqual(mockResult);
    });

    it('должен передавать все поля DTO в сервис', async () => {
      const orderDto = {
        email: 'user@test.com',
        phone: '+79997654321',
        tickets: [
          {
            film: '2',
            session: '456',
            row: 3,
            seat: 7,
          },
        ],
      };

      mockOrderService.createOrder.mockResolvedValue({ total: 1, items: [] });

      await controller.create(orderDto);

      expect(service.createOrder).toHaveBeenCalledWith(orderDto);
      expect(service.createOrder).toHaveBeenCalledTimes(1);
    });

    it('должен обрабатывать несколько билетов', async () => {
      const orderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          {
            film: '1',
            session: '123',
            row: 5,
            seat: 10,
          },
          {
            film: '1',
            session: '123',
            row: 5,
            seat: 11,
          },
        ],
      };

      const mockResult = {
        total: 2,
        items: [{ orderId: 'abc123' }, { orderId: 'abc124' }],
      };

      mockOrderService.createOrder.mockResolvedValue(mockResult);

      const result = await controller.create(orderDto);

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
    });
  });
});
