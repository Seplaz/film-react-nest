import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { NotFoundException } from '@nestjs/common';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

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
    schedule: [
      {
        id: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
        daytime: '2023-05-29T10:30:00.001Z',
        hall: 2,
        rows: 5,
        seats: 10,
        price: 350,
        taken: '1:2',
      },
    ],
  };

  const mockFilmsService = {
    findAll: jest.fn().mockResolvedValue([mockFilm]),
    findFilmWithSchedule: jest.fn().mockResolvedValue(mockFilm),
    findScheduleByFilmId: jest.fn().mockResolvedValue(mockFilm.schedule),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of films with total count', async () => {
      const result = await controller.findAll();

      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('items');
      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single film with schedule', async () => {
      const result = await controller.findOne(mockFilm.id);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('schedule');
      expect(service.findFilmWithSchedule).toHaveBeenCalledWith(mockFilm.id);
    });

    it('should throw NotFoundException if film not found', async () => {
      mockFilmsService.findFilmWithSchedule.mockResolvedValueOnce(null);

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findSchedule', () => {
    it('should return schedule for a film', async () => {
      const result = await controller.findSchedule(mockFilm.id);

      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('items');
      expect(result.items).toHaveLength(1);
      expect(service.findFilmWithSchedule).toHaveBeenCalledWith(mockFilm.id);
    });

    it('should throw NotFoundException if film not found', async () => {
      mockFilmsService.findFilmWithSchedule.mockResolvedValueOnce(null);

      await expect(controller.findSchedule('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
