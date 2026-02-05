import { GoogleGenAI } from '@google/genai';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Character, Problem } from '@repo/db';
import {
  genAftermathPrompt,
  genLevelsPrompt,
  genProgressPrompt,
  genQuestionPrompt,
  genStartStoryPrompt,
} from './ai.prompts';
import { safetySettings } from './ai.settings';

type StrippedProblem = Omit<
  Problem,
  | 'id'
  | 'slug'
  | 'validationType'
  | 'difficulty'
  | 'starterCode'
  | 'driverCode'
  | 'testCases'
  | 'updatedAt'
  | 'createdAt'
>;

export type GenerateStoryType = {
  story: string;
  summary: string;
};

export type GeneratedQuestion = {
  problem: {
    description: string;
    examples: [
      {
        input: string;
        output: string;
        explanation: string;
      },
    ];
    constraints: string[];
    hint: string;
  };
  summary: string;
};

export type StrippedCharacter = Omit<
  Character,
  'id' | 'profileId' | 'createdAt' | 'updatedAt'
>;

@Injectable()
export class AiService {
  private readonly client: GoogleGenAI;
  constructor() {
    this.client = new GoogleGenAI({ apiKey: process.env.AI_API });
  }

  async genLevels(character: StrippedCharacter) {
    console.log('Generating Levels...');
    const response = await this.client.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        responseMimeType: 'application/json',
        safetySettings,
        systemInstruction: genLevelsPrompt,
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Character: ${JSON.stringify(character)}`,
            },
          ],
        },
      ],
    });
    if (!response.text) {
      console.log('AI Failed');
      throw new InternalServerErrorException('AI Failed to respond');
    }
    const levels = JSON.parse(response.text) as string[];
    return levels;
  }

  async genStartStory(levels: string[], character: StrippedCharacter) {
    const response = await this.client.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        responseMimeType: 'application/json',
        safetySettings,
        systemInstruction: genStartStoryPrompt,
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Chapter Title: ${levels[0]}\nCharacter: ${JSON.stringify(character)}`,
            },
          ],
        },
      ],
    });
    if (!response.text) {
      console.log('AI Failed');
      throw new InternalServerErrorException('AI Failed to respond');
    }
    return JSON.parse(response.text) as GenerateStoryType;
  }

  async genQuestion(
    game: { levels: string[]; curLevel: number; curLevelSummary: string },
    problem: StrippedProblem,
    character: StrippedCharacter,
  ) {
    const response = await this.client.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        responseMimeType: 'application/json',
        safetySettings,
        systemInstruction: genQuestionPrompt,
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Current Chapter: ${game.levels[game.curLevel + 1]}\nPrevious Summary:${game.curLevelSummary}\nProblem: ${JSON.stringify(problem)} \nCharacter: ${JSON.stringify(character)}`,
            },
          ],
        },
      ],
    });
    if (!response.text) {
      console.log('AI Failed');
      throw new InternalServerErrorException('AI Failed to respond');
    }
    return JSON.parse(response.text) as GeneratedQuestion;
  }

  async genAftermath(
    game: {
      levels: string[];
      curLevel: number;
      curLevelSummary: string;
      curLevelAttempts: number;
      lives: number;
    },
    character: StrippedCharacter,
  ) {
    const response = await this.client.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        responseMimeType: 'application/json',
        safetySettings,
        systemInstruction: genAftermathPrompt,
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Current Chapter: ${game.levels[game.curLevel + 1]}\nPrevious Summary:${game.curLevelSummary}\nNext Chapter: ${game.levels[game.curLevel + 2]}\nCharacter: ${JSON.stringify(character)}\nAttemps: ${game.curLevelAttempts}\nLives: ${game.lives}`,
            },
          ],
        },
      ],
    });
    if (!response.text) {
      console.log('AI Failed');
      throw new InternalServerErrorException('AI Failed to respond');
    }
    return JSON.parse(response.text) as GenerateStoryType;
  }

  async genProgress(
    game: {
      levels: string[];
      curLevel: number;
      curLevelSummary: string;
    },
    character: StrippedCharacter,
  ) {
    const response = await this.client.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        responseMimeType: 'application/json',
        safetySettings,
        systemInstruction: genProgressPrompt,
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Current Chapter: ${game.levels[game.curLevel + 1]}\nPrevious Summary:${game.curLevelSummary}\nNext Chapter: ${game.levels[game.curLevel + 2]}\nCharacter: ${JSON.stringify(character)}`,
            },
          ],
        },
      ],
    });
    if (!response.text) {
      console.log('AI Failed');
      throw new InternalServerErrorException('AI Failed to respond');
    }
    return JSON.parse(response.text) as GenerateStoryType;
  }
}
