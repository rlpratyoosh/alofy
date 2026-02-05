import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { Character, prisma, Problem } from '@repo/db';
import {
  AiService,
  GeneratedQuestion,
  StrippedCharacter,
} from 'src/ai/ai.service';

// const testCharacter: Character = {
//   id: 'something',
//   name: 'Sinclair',
//   age: 19,
//   class: 'python',
//   race: 'elf',
//   gender: 'male',
//   profileId: 'smth',
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

@Injectable()
export class GameService {
  constructor(private readonly ai: AiService) {}

  // async test() {
  //   await this.ai.genLevels(testCharacter);
  // }

  async new(userId: string, createGameDto: CreateGameDto) {
    try {
      const character = await prisma.character.findUnique({
        where: { id: createGameDto.characterId },
        omit: {
          id: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!character) throw new BadRequestException("Character doesn't exist");

      const levels = await this.ai.genLevels(character);

      const data = {
        ...createGameDto,
        levels,
        profileId: character.profileId,
      };
      const game = await prisma.game.create({
        data,
      });

      return game.id;
    } catch (er) {
      if (er instanceof HttpException) throw er;
      throw new InternalServerErrorException('Failed to create game');
    }
  }

  async continue(id: string) {
    try {
      const game = await prisma.game.findUnique({
        where: { id },
        select: {
          id: true,
          levels: true,
          curLevel: true,
          point: true,
          curLevelSummary: true,
          defeatedCurBoss: true,
          curLevelAttempts: true,
          lives: true,
          character: {
            omit: {
              id: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      if (!game) throw new BadRequestException('No game found');

      if (game.curLevel == 0) {
        const { story, summary } = await this.ai.genStartStory(
          game.levels,
          game.character as Character,
        );
        return await prisma.game.update({
          where: { id },
          data: {
            status: 'IN_PROGRESS',
            curLevelStory: story,
            curLevelSummary: summary,
            point: game.point + 10,
            curLevel: game.curLevel + 1,
          },
        });
      } else if (game.curLevel == 10) {
        return await prisma.game.update({
          where: { id },
          data: {
            status: 'ENDED',
            curLevelStory: undefined,
            curLevelSummary: undefined,
            levels: [],
            point: game.point + 10,
          },
        });
      } else if (game.curLevel % 3 == 2) {
        const problems: Problem[] =
          await prisma.$queryRaw`SELECT * FROM "Problem" ORDER BY RANDOM() LIMIT 1`;

        const result: GeneratedQuestion = await this.ai.genQuestion(
          {
            levels: game.levels,
            curLevel: game.curLevel,
            curLevelSummary: game.curLevelSummary as string,
          },
          problems[0],
          game.character as StrippedCharacter,
        );

        let examples = '';
        result.problem.examples.forEach((example, index) => {
          examples += `Example ${index + 1}:\n\tInput: ${example.input}\n\tOutput: ${example.output}\n\tExplanation: ${example.explanation}\n`;
        });
        let constraints = '';
        result.problem.constraints.forEach((constraint) => {
          constraints += `\t· ${constraint}\n`;
        });

        const story = `${result.problem.description}\n\n${examples}\nConstraints:\n${constraints}\nHint: ${result.problem.hint}`;

        return await prisma.game.update({
          where: { id },
          data: {
            curLevelStory: story,
            curLevelSummary: result.summary,
            curProblemSlug: problems[0].slug,
            curLevel: game.curLevel + 1,
            point: game.point + 10,
          },
        });
      } else if (game.curLevel % 3 == 0) {
        if (!game.defeatedCurBoss)
          throw new BadRequestException('Defeat the current boss first!');

        const { story, summary } = await this.ai.genAftermath(
          {
            levels: game.levels,
            curLevel: game.curLevel,
            curLevelSummary: game.curLevelSummary as string,
            curLevelAttempts: game.curLevelAttempts,
            lives: game.lives,
          },
          game.character as StrippedCharacter,
        );
        const point = game.point + 100 - game.curLevelAttempts * 33;
        return await prisma.game.update({
          where: { id },
          data: {
            curLevelStory: story,
            curLevelSummary: summary,
            curLevel: game.curLevel + 1,
            curProblemSlug: undefined,
            curLevelAttempts: 0,
            point,
            defeatedCurBoss: false,
          },
        });
      } else {
        const { story, summary } = await this.ai.genProgress(
          {
            levels: game.levels,
            curLevel: game.curLevel,
            curLevelSummary: game.curLevelSummary as string,
          },
          game.character as StrippedCharacter,
        );
        return await prisma.game.update({
          where: { id },
          data: {
            curLevelStory: story,
            curLevelSummary: summary,
            curLevel: game.curLevel + 1,
            point: game.point + 10,
          },
        });
      }
    } catch (er) {
      if (er instanceof HttpException) throw er;
      throw new InternalServerErrorException('Failed to continue game');
    }
  }

  async demo() {
    const result = {
      problem: {
        description:
          'You stand before the Gate of Synchronization, the massive firewall blocking your exit from the Null Sector. To breach it, you must harmonize the chaotic data streams around you.\n\nThe Gate demands a precise Target Resonance (target). Your inventory contains a chaotic array of Data Shards (nums), each vibrating with a specific integer frequency.\n\nYour Algorithm: Identify the indices of the two distinct shards in your inventory whose frequencies sum up exactly to the Target Resonance.\n\nThe system guarantees that exactly one pair of shards will satisfy the condition. You may return the indices in any order to execute the breach protocol.',
        examples: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation:
              'The shards at index 0 (Frequency 2) and index 1 (Frequency 7) harmonize to match the Target Resonance of 9. The Gate accepts the key.',
          },
          {
            input: 'nums = [3,2,4], target = 6',
            output: '[1,2]',
            explanation:
              'Shard 1 (Value 2) and Shard 2 (Value 4) combine to form the target sum of 6.',
          },
          {
            input: 'nums = [3,3], target = 6',
            output: '[0,1]',
            explanation:
              'The first two shards possess the exact energy required to stabilize the output.',
          },
        ],
        constraints: [
          'The inventory size (nums.length) ranges from 2 to 10,000 shards.',
          'Shard energy levels (nums[i]) can fluctuate between -10^9 and 10^9.',
          'The Target Resonance is within the standard integer overflow limits.',
          'System Guarantee: Exactly one valid solution exists for every test case.',
        ],
        hint: 'System Insight: Scanning every possible pair would result in O(n^2) latency, causing a timeout. Activate your Hash Map module to cache frequencies you have already observed. This allows you to find the complement in O(n) time.',
      },
    };

    let examples = '';
    result.problem.examples.forEach((example, index) => {
      examples += `\nExample ${index + 1}:\n\tInput: ${example.input}\n\tOutput: ${example.output}\n\tExplanation: ${example.explanation}\n`;
    });
    let constraints = '';
    result.problem.constraints.forEach((constraint) => {
      constraints += `\t· ${constraint}\n`;
    });

    const story = `${result.problem.description}\n${examples}\nConstraints:\n${constraints}\nHint: ${result.problem.hint}`;

    const problem = await prisma.problem.findUnique({
      where: { slug: 'two-sum' },
    });

    if (!problem) throw new BadRequestException('Problem not found');

    const demoGame = {
      story,
      starterCode: problem.starterCode,
    };

    return demoGame;
  }

  async getWithId(userId: string, gameId: string) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
        select: {
          id: true,
        },
      });
      if (!profile)
        throw new BadRequestException(
          'No profile found attatched with the user',
        );
      const game = await prisma.game.findUnique({
        where: { profileId: profile.id, id: gameId },
      });
      if (!game)
        throw new BadRequestException('No game found with the id for the user');
      return game;
    } catch (er) {
      if (er instanceof HttpException) throw er;
      throw new InternalServerErrorException('Failed to get game');
    }
  }

  async getProblem(slug: string) {
    try {
      const problem = await prisma.problem.findUnique({
        where: { slug },
      });
      if (!problem)
        throw new BadRequestException('No problem found with the given slug!');
      return problem.starterCode;
    } catch (er) {
      if (er instanceof HttpException) throw er;
      throw new InternalServerErrorException('Failed to get problem');
    }
  }

  async get(userId: string) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });
      if (!profile)
        throw new BadRequestException(
          'No profile associated with the user found',
        );
      return await prisma.game.findMany({
        where: { profileId: profile.id },
      });
    } catch (er) {
      if (er instanceof HttpException) throw er;
      throw new InternalServerErrorException('Failed to get problem');
    }
  }
}
