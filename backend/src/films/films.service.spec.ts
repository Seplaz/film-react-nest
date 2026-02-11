import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: FilmsRepository;

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
    schedule: [],
  };

  const mockFilmsRepository = {
    findAll: jest.fn().mockResolvedValue([mockFilm]),
    findById: jest.fn().mockResolvedValue(mockFilm),
    findScheduleByFilmId: jest.fn().mockResolvedValue([]),
    getSession: jest.fn(),
    addTakenSeats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmsRepository,
          useValue: mockFilmsRepository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    repository = module.get<FilmsRepository>(FilmsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of films', async () => {
      const result = await service.findAll();

      expect(result).toEqual([mockFilm]);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findFilmWithSchedule', () => {
    it('should return film with schedule', async () => {
      const result = await service.findFilmWithSchedule(mockFilm.id);

      expect(result).toEqual(mockFilm);
      expect(repository.findById).toHaveBeenCalledWith(mockFilm.id);
    });
  });

  describe('findScheduleByFilmId', () => {
    it('should return schedule for a film', async () => {
      const result = await service.findScheduleByFilmId(mockFilm.id);

      expect(result).toEqual([]);
      expect(repository.findScheduleByFilmId).toHaveBeenCalledWith(mockFilm.id);
    });
  });
});
