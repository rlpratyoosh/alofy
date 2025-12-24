import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AllowedRole } from 'src/common/decorators/roles.decorator';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import type { ValidatedRequest } from 'src/auth/auth.controller';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @AllowedRole('ADMIN')
  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @AllowedRole('ADMIN')
  @Get('all')
  findAll() {
    return this.profileService.findAll();
  }

  @Get()
  findOne(@Req() req: ValidatedRequest) {
    return this.profileService.findOne(req.user.userId);
  }

  @AllowedRole('ADMIN')
  @Get('admin/:id')
  findOneAdmin(@Param('id') id: string) {
    return this.profileService.findOneAdmin(id);
  }

  @AllowedRole('ADMIN')
  @Patch('admin/:id')
  updateAdmin(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateAdmin(id, updateProfileDto);
  }

  @Patch()
  update(@Req() req: ValidatedRequest, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(req.user.userId, updateProfileDto);
  }

  @AllowedRole('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }
}
