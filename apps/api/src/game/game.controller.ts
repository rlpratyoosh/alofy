import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import type { VerifiedUserRequest } from 'src/auth/auth.controller';
import type { CreateGameDto } from './dto/create-game.dto';
import { GameService } from './game.service';
import { SetPublic } from 'src/common/decorators/public.decorator';
// import { SetPublic } from 'src/common/decorators/public.decorator';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  // @Post('test')
  // @SetPublic()
  // test() {
  //   return this.gameService.test();
  // }

  @Get()
  get(@Req() req: VerifiedUserRequest) {
    return this.gameService.get(req.user.userId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  new(@Body() createGameDto: CreateGameDto) {
    if (!createGameDto.characterId)
      throw new BadRequestException('No characterId was provided');
    return this.gameService.new(createGameDto);
  }

  @Get('demo')
  @SetPublic()
  demo() {
    return this.gameService.demo();
  }

  @Get(':id')
  getWithId(@Req() req: VerifiedUserRequest, @Param('id') id: string) {
    if (!id) throw new BadRequestException('Id not provided!');
    return this.gameService.getWithId(req.user.userId, id);
  }

  @Post('continue')
  @HttpCode(HttpStatus.OK)
  continue(@Body() body: { gameId: string }) {
    if (!body.gameId) throw new BadRequestException('Game ID is required');
    return this.gameService.continue(body.gameId);
  }

  @Get('problem/:slug')
  getProblem(@Param('slug') slug: string) {
    if (!slug) throw new BadRequestException('Game ID not provided');
    return this.gameService.getProblem(slug);
  }
}
