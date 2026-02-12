import { IsArray, IsNumber, IsString } from 'class-validator';

export class GetFilmsDto {
  @IsString()
  id: string;
  @IsNumber()
  rating: number;
  @IsString()
  director: string;
  @IsArray()
  @IsString({ each: true })
  tags: string[];
  @IsString()
  title: string;
  @IsString()
  about: string;
  @IsString()
  description: string;
  @IsString()
  image: string;
  @IsString()
  cover: string;
  schedule: GetScheduleDto[];
}

export class GetScheduleDto {
  @IsString()
  id: string;
  @IsString()
  daytime: string;
  @IsString()
  hall: string;
  @IsNumber()
  rows: number;
  @IsNumber()
  seats: number;
  @IsNumber()
  price: number;
  taken: string[];
}
