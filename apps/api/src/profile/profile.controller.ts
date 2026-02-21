import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { VerifiedUserRequest } from 'src/auth/auth.controller';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('has-api-key')
  hasApiKey(@Req() req: VerifiedUserRequest) {
    return this.profileService.hasApiKey(req.user.userId);
  }

  @Post('update')
  update(
    @Req() req: VerifiedUserRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(req.user.userId, updateProfileDto);
  }
}
