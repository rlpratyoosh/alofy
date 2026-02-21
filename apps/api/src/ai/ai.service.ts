import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { Character, Problem } from '@repo/db';
import {
  AiAuthenticationException,
  AiQuotaExceededException,
  AiRateLimitException,
  AiServiceException,
} from 'src/common/exceptions/ai.exceptions';
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
  private handleAiError(error: unknown): never {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      const errorStr = String(error);

      if (
        message.includes('401') ||
        message.includes('invalid api key') ||
        message.includes('api key not valid') ||
        errorStr.includes('401')
      ) {
        throw new AiAuthenticationException();
      }

      if (
        message.includes('429') ||
        message.includes('rate limit') ||
        message.includes('too many requests') ||
        errorStr.includes('429')
      ) {
        throw new AiRateLimitException();
      }

      if (
        message.includes('quota') ||
        message.includes('resource exhausted') ||
        message.includes('billing') ||
        message.includes('403')
      ) {
        throw new AiQuotaExceededException();
      }
    }

    throw new AiServiceException();
  }

  async genLevels(character: StrippedCharacter, apiKey: string) {
    try {
      const client = new GoogleGenAI({ apiKey });
      const response = await client.models.generateContent({
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
        throw new AiServiceException('AI failed to generate response');
      }
      const levels = JSON.parse(response.text) as string[];
      return levels;
    } catch (error) {
      this.handleAiError(error);
    }
  }

  async genStartStory(
    levels: string[],
    character: StrippedCharacter,
    apiKey: string,
  ) {
    try {
      const client = new GoogleGenAI({ apiKey });
      const response = await client.models.generateContent({
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
        throw new AiServiceException('AI failed to generate response');
      }
      return JSON.parse(response.text) as GenerateStoryType;
    } catch (error) {
      this.handleAiError(error);
    }
  }

  async genQuestion(
    game: { levels: string[]; curLevel: number; curLevelSummary: string },
    problem: StrippedProblem,
    character: StrippedCharacter,
    apiKey: string,
  ) {
    try {
      const client = new GoogleGenAI({ apiKey });
      const response = await client.models.generateContent({
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
        throw new AiServiceException('AI failed to generate response');
      }
      return JSON.parse(response.text) as GeneratedQuestion;
    } catch (error) {
      this.handleAiError(error);
    }
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
    apiKey: string,
  ) {
    try {
      const client = new GoogleGenAI({ apiKey });
      const response = await client.models.generateContent({
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
        throw new AiServiceException('AI failed to generate response');
      }
      return JSON.parse(response.text) as GenerateStoryType;
    } catch (error) {
      this.handleAiError(error);
    }
  }

  async genProgress(
    game: {
      levels: string[];
      curLevel: number;
      curLevelSummary: string;
    },
    character: StrippedCharacter,
    apiKey: string,
  ) {
    try {
      const client = new GoogleGenAI({ apiKey });
      const response = await client.models.generateContent({
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
        throw new AiServiceException('AI failed to generate response');
      }
      return JSON.parse(response.text) as GenerateStoryType;
    } catch (error) {
      this.handleAiError(error);
    }
  }
}
