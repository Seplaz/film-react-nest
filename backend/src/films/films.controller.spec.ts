import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { NotFoundException } from '@nestjs/common';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilmsService = {
    findAll: jest.fn(),
    findFilmWithSchedule: jest.fn(),
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
    jest.clearAllMocks();
  });

  it('должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('должен возвращать все фильмы с правильной структурой', async () => {
      const mockFilms = [
        {
          id: '1',
          name: 'Тестовый фильм',
          tags: ['драма', 'комедия'],
          schedule: [
            {
              id: 1,
              daytime: '2024-01-01T10:00:00',
              hall: 1,
              rows: 10,
              seats: 10,
              price: 500,
              taken: ['1:1', '1:2'],
            },
          ],
        },
      ];

      mockFilmsService.findAll.mockResolvedValue(mockFilms);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('items');
      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].schedule[0]).toHaveProperty('session');
    });

    it('должен преобразовывать tags в массив если это не массив', async () => {
      const mockFilms = [
        {
          id: '1',
          name: 'Фильм',
          tags: 'драма',
          schedule: [],
        },
      ];

      mockFilmsService.findAll.mockResolvedValue(mockFilms);

      const result = await controller.findAll();

      expect(result.items[0].tags).toEqual(['драма']);
    });

    it('должен преобразовывать taken в пустой массив если это пустая строка', async () => {
      const mockFilms = [
        {
          id: '1',
          name: 'Фильм',
          tags: [],
          schedule: [
            {
              id: 1,
              daytime: '2024-01-01T10:00:00',
              hall: 1,
              rows: 10,
              seats: 10,
              price: 500,
              taken: '',
            },
          ],
        },
      ];

      mockFilmsService.findAll.mockResolvedValue(mockFilms);

      const result = await controller.findAll();

      expect(result.items[0].schedule[0].taken).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('должен возвращать один фильм по id', async () => {
      const mockFilm = {
        id: '1',
        name: 'Тестовый фильм',
        tags: ['драма'],
        schedule: [
          {
            id: 1,
            daytime: '2024-01-01T10:00:00',
            hall: 1,
            rows: 10,
            seats: 10,
            price: 500,
            taken: [],
          },
        ],
      };

      mockFilmsService.findFilmWithSchedule.mockResolvedValue(mockFilm);

      const result = await controller.findOne('1');

      expect(service.findFilmWithSchedule).toHaveBeenCalledWith('1');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('schedule');
      expect(result.id).toBe('1');
    });

    it('должен выбросить NotFoundException если фильм не найден', async () => {
      mockFilmsService.findFilmWithSchedule.mockResolvedValue(null);

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('должен преобразовывать tags в массив', async () => {
      const mockFilm = {
        id: '1',
        name: 'Фильм',
        tags: 'драма',
        schedule: [],
      };

      mockFilmsService.findFilmWithSchedule.mockResolvedValue(mockFilm);

      const result = await controller.findOne('1');

      expect(result.tags).toEqual(['драма']);
    });
  });

  describe('findSchedule', () => {
    it('должен возвращать расписание фильма', async () => {
      const mockFilm = {
        id: '1',
        name: 'Фильм',
        tags: [],
        schedule: [
          {
            id: 1,
            daytime: '2024-01-01T10:00:00',
            hall: 1,
            rows: 10,
            seats: 10,
            price: 500,
            taken: [],
          },
          {
            id: 2,
            daytime: '2024-01-01T14:00:00',
            hall: 2,
            rows: 8,
            seats: 12,
            price: 600,
            taken: ['1:1'],
          },
        ],
      };

      mockFilmsService.findFilmWithSchedule.mockResolvedValue(mockFilm);

      const result = await controller.findSchedule('1');

      expect(service.findFilmWithSchedule).toHaveBeenCalledWith('1');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('items');
      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
    });

    it('должен выбросить NotFoundException если фильм не найден', async () => {
      mockFilmsService.findFilmWithSchedule.mockResolvedValue(null);

      await expect(controller.findSchedule('999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('должен добавлять поле session равное id', async () => {
      const mockFilm = {
        id: '1',
        name: 'Фильм',
        tags: [],
        schedule: [
          {
            id: 123,
            daytime: '2024-01-01T10:00:00',
            hall: 1,
            rows: 10,
            seats: 10,
            price: 500,
            taken: [],
          },
        ],
      };

      mockFilmsService.findFilmWithSchedule.mockResolvedValue(mockFilm);

      const result = await controller.findSchedule('1');

      expect(result.items[0].session).toBe(123);
      expect(result.items[0].id).toBe(123);
    });
  });
});
