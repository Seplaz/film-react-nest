import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderDto = {
    email: 'test@example.com',
    phone: '+7 (999) 123-45-67',
    tickets: [
      {
        film: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
        session: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
        row: 1,
        seat: 5,
      },
    ],
  };

  const mockOrderResult = {
    total: 1,
    items: [
      {
        id: 'ticket-123',
        film: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
        session: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
        row: 1,
        seat: 5,
        daytime: '2023-05-29T10:30:00.001Z',
        price: 350,
      },
    ],
  };

  const mockOrderService = {
    createOrder: jest.fn().mockResolvedValue(mockOrderResult),
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order and return tickets', async () => {
      const result = await controller.create(mockOrderDto);

      expect(result).toEqual(mockOrderResult);
      expect(service.createOrder).toHaveBeenCalledWith(mockOrderDto);
      expect(service.createOrder).toHaveBeenCalledTimes(1);
    });
  });
});
