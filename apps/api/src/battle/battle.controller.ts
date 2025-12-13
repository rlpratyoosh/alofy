import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { BattleStatus } from '@prisma/client';
import { SetPublic } from 'src/common/decorators/public.decorator';
import { AllowedRole } from 'src/common/decorators/roles.decorator';
import { BattleService } from './battle.service';
import { CreateBattleDto } from './dto/create-battle.dto';
import { UpdateBattleDto } from './dto/update-battle.dto';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Post()
  create(@Body() createBattleDto: CreateBattleDto) {
    return this.battleService.create(createBattleDto);
  }

  @AllowedRole('ADMIN')
  @Get('all')
  findAll(@Query('status') status?: BattleStatus) {
    return this.battleService.findAll(status);
  }

  @Get('my')
  findMyBattles(@Req() req, @Query('status') status?: BattleStatus) {
    return this.battleService.findMyBattles(req.user.profileId, status);
  }

  @SetPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.battleService.findOne(id);
  }

  @AllowedRole('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBattleDto: UpdateBattleDto) {
    return this.battleService.update(id, updateBattleDto);
  }

  @Post(':id/start')
  startBattle(@Param('id') id: string) {
    return this.battleService.startBattle(id);
  }

  @Post(':id/complete')
  completeBattle(
    @Param('id') id: string,
    @Body()
    body: { winnerId: string; player1TimeMs: number; player2TimeMs: number },
  ) {
    return this.battleService.completeBattle(id, body);
  }

  @Post(':id/abort')
  abortBattle(@Param('id') id: string, @Req() req) {
    return this.battleService.abortBattle(id, req.user.profileId);
  }

  @AllowedRole('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.battleService.remove(id);
  }
}
