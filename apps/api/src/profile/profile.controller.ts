import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AllowedRole } from 'src/common/decorators/roles.decorator';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @AllowedRole("ADMIN")
  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @AllowedRole("ADMIN")
  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get()
  findOne(@Req() req) {
    return this.profileService.findOne(req.user.userId);
  }

  @AllowedRole("ADMIN")
  @Get('admin')
  findOneAdmin(@Body() body: {id: string}) {
    return this.profileService.findOneAdmin(body.id)
  }

  @AllowedRole("ADMIN")
  @Get('admin')
  updateAdmin(@Body() body: {id: string, updateProfileDto: UpdateProfileDto}) {
    return this.profileService.updateAdmin(body.id, body.updateProfileDto)
  }

  @Patch()
  update(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(req.user.userId, updateProfileDto);
  }

  @AllowedRole("ADMIN")
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }
}
