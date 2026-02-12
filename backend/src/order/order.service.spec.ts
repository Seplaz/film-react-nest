import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { FilmsRepository } from '../repository/films.repository';
import { HttpException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let repository: FilmsRepository;

  const mockFilmsRepository = {
    findById: jest.fn(),
    getSession: jest.fn(),
    addTakenSeats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: FilmsRepository,
          useValue: mockFilmsRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<FilmsRepository>(FilmsRepository);
    jest.clearAllMocks();
  });

  it('должен быть определен', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('должен создать заказ для одного билета', async () => {
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

      const mockSession = {
        id: '123',
        daytime: '2024-01-01T10:00:00',
        price: 500,
        taken: [],
      };

      mockFilmsRepository.getSession.mockResolvedValue(mockSession);
      mockFilmsRepository.addTakenSeats.mockResolvedValue(undefined);

      const result = await service.createOrder(orderDto);

      expect(repository.getSession).toHaveBeenCalledWith('1', '123');
      expect(repository.addTakenSeats).toHaveBeenCalledWith('1', '123', [
        '5:10',
      ]);
      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toHaveProperty('id');
      expect(result.items[0].film).toBe('1');
    });

    it('должен выбросить исключение если место уже занято', async () => {
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

      const mockSession = {
        id: '123',
        daytime: '2024-01-01T10:00:00',
        price: 500,
        taken: ['5:10'],
      };

      mockFilmsRepository.getSession.mockResolvedValue(mockSession);

      await expect(service.createOrder(orderDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('должен выбросить исключение если сеанс не найден', async () => {
      const orderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          {
            film: '1',
            session: '999',
            row: 5,
            seat: 10,
          },
        ],
      };

      mockFilmsRepository.getSession.mockResolvedValue(null);

      await expect(service.createOrder(orderDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('должен создать заказ для нескольких билетов', async () => {
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

      const mockSession = {
        id: '123',
        daytime: '2024-01-01T10:00:00',
        price: 500,
        taken: [],
      };

      mockFilmsRepository.getSession.mockResolvedValue(mockSession);
      mockFilmsRepository.addTakenSeats.mockResolvedValue(undefined);

      const result = await service.createOrder(orderDto);

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
    });
  });
});
