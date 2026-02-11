import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { FilmsRepository } from '../repository/films.repository';
import { HttpException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let repository: FilmsRepository;

  const mockSession = {
    id: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
    daytime: '2023-05-29T10:30:00.001Z',
    hall: 2,
    rows: 5,
    seats: 10,
    price: 350,
    taken: [],
    filmId: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
  };

  const mockFilm = {
    id: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
    rating: 2.9,
    director: 'Итан Райт',
    tags: 'Документальный',
    title: 'Архитекторы общества',
    about: 'Документальный фильм...',
    description: 'Документальный фильм Итана Райта...',
    image: '/bg1s.jpg',
    cover: '/bg1c.jpg',
    schedule: [mockSession],
  };

  const mockFilmsRepository = {
    findById: jest.fn().mockResolvedValue(mockFilm),
    getSession: jest.fn().mockResolvedValue(mockSession),
    addTakenSeats: jest.fn().mockResolvedValue(true),
    findAll: jest.fn(),
    findScheduleByFilmId: jest.fn(),
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    const orderDto = {
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

    it('should create order successfully', async () => {
      const result = await service.createOrder(orderDto);

      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('items');
      expect(result.total).toBe(1);
      expect(result.items[0]).toHaveProperty('id');
      expect(result.items[0].film).toBe(orderDto.tickets[0].film);
      expect(repository.getSession).toHaveBeenCalled();
      expect(repository.addTakenSeats).toHaveBeenCalled();
    });

    it('should throw error if session not found', async () => {
      mockFilmsRepository.getSession.mockResolvedValueOnce(null);

      await expect(service.createOrder(orderDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw error if seat already taken', async () => {
      mockFilmsRepository.getSession.mockResolvedValueOnce({
        ...mockSession,
        taken: ['1:5'],
      });

      await expect(service.createOrder(orderDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should use first session if session not provided', async () => {
      const orderWithoutSession = {
        ...orderDto,
        tickets: [
          {
            film: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
            session: undefined,
            row: 1,
            seat: 5,
          },
        ],
      };

      const result = await service.createOrder(orderWithoutSession);

      expect(result.items[0].session).toBe(mockSession.id);
      expect(repository.findById).toHaveBeenCalled();
    });
  });
});
