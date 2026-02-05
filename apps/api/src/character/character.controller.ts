import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Req,
} from '@nestjs/common';
import type { VerifiedUserRequest } from 'src/auth/auth.controller';
import { CreateCharacterDto } from './dto/create-character.dto';
import { Post } from '@nestjs/common';
import { CharacterService } from './character.service';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  new(
    @Req() req: VerifiedUserRequest,
    @Body() createCharacterDto: CreateCharacterDto,
  ) {
    return this.characterService.new(req.user.userId, createCharacterDto);
  }

  @Delete(':id')
  delete(@Req() req: VerifiedUserRequest, @Param('id') id: string) {
    return this.characterService.delete(req.user.userId, id);
  }

  @Get()
  get(@Req() req: VerifiedUserRequest) {
    return this.characterService.get(req.user.userId);
  }

  @Get(':id')
  getWithId(@Req() req: VerifiedUserRequest, @Param('id') id: string) {
    if (!id) throw new BadRequestException('Id Required');
    return this.characterService.getWithId(req.user.userId, id);
  }
}
