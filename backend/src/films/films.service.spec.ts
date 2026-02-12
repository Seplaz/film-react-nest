import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: FilmsRepository;

  const mockFilmsRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findScheduleByFilmId: jest.fn(),
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
    jest.clearAllMocks();
  });

  it('должен быть определен', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('должен вызывать repository.findAll', async () => {
      const mockFilms = [{ id: '1', name: 'Фильм' }];
      mockFilmsRepository.findAll.mockResolvedValue(mockFilms);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockFilms);
    });
  });

  describe('findFilmWithSchedule', () => {
    it('должен вызывать repository.findById с правильным id', async () => {
      const mockFilm = { id: '1', name: 'Фильм', schedule: [] };
      mockFilmsRepository.findById.mockResolvedValue(mockFilm);

      const result = await service.findFilmWithSchedule('1');

      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockFilm);
    });
  });

  describe('findScheduleByFilmId', () => {
    it('должен вызывать repository.findScheduleByFilmId с правильным id', async () => {
      const mockSchedule = [{ id: 1, daytime: '2024-01-01T10:00:00' }];
      mockFilmsRepository.findScheduleByFilmId.mockResolvedValue(mockSchedule);

      const result = await service.findScheduleByFilmId('1');

      expect(repository.findScheduleByFilmId).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockSchedule);
    });
  });
});
