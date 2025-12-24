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
import { SetPublic } from 'src/common/decorators/public.decorator';
import { AllowedRole } from 'src/common/decorators/roles.decorator';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @Req() req) {
    return this.groupService.create(createGroupDto, req.user.profileId);
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get('my')
  getMyGroups(@Req() req) {
    return this.groupService.getMyGroups(req.user.profileId);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.groupService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Get(':id/leaderboard')
  getLeaderboard(@Param('id') id: string) {
    return this.groupService.getLeaderboard(id);
  }

  @Post(':id/join')
  joinGroup(@Param('id') id: string, @Req() req) {
    return this.groupService.joinGroup(id, req.user.profileId);
  }

  @Post(':id/leave')
  leaveGroup(@Param('id') id: string, @Req() req) {
    return this.groupService.leaveGroup(id, req.user.profileId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @Req() req,
  ) {
    // Group admins or system admins can update
    return this.groupService.update(id, updateGroupDto);
  }

  @Patch(':id/member/:profileId/role')
  updateMemberRole(
    @Param('id') id: string,
    @Param('profileId') profileId: string,
    @Body() body: { role: string },
    @Req() req,
  ) {
    return this.groupService.updateMemberRole(
      id,
      profileId,
      body,
      req.user.profileId,
    );
  }

  @Delete(':id/member/:profileId')
  removeMember(
    @Param('id') id: string,
    @Param('profileId') profileId: string,
    @Req() req,
  ) {
    return this.groupService.removeMember(id, profileId, req.user.profileId);
  }

  @AllowedRole('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }
}
