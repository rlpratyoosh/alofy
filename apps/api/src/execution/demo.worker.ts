import { Processor, WorkerHost } from '@nestjs/bullmq';
import { prisma } from '@repo/db';
import { Job } from 'bullmq';
import { SubmitDemoCodeDto } from './dto/execution.dto';

type Result = {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    output: string;
    code: string;
    signal: string;
  };
};

type TestCase = {
  input: string;
  output: string;
};

interface JobWCode extends Job {
  data: {
    submitDemoCodeDto: SubmitDemoCodeDto;
  };
}

import { ValidationType } from '@repo/db';
import { EventsGateway } from 'src/events/events.gateway';

function compareOutputs(
  actual: string,
  expected: string,
  type: ValidationType = 'EXACT',
) {
  const cleanActual = actual.trim();
  const cleanExpected = expected.trim();

  if (cleanActual === cleanExpected) return true;
  if (type === 'EXACT') return false;

  const tokenize = (str: string) => str.split(/\s+/).filter((s) => s !== ' ');

  const actualTokenized = tokenize(cleanActual);
  const expectedTokenized = tokenize(cleanExpected);

  if (actualTokenized.length !== expectedTokenized.length) return false;

  const isNumeric = expectedTokenized.every((s) => !isNaN(Number(s)));

  if (isNumeric) {
    actualTokenized.sort((a, b) => Number(a) - Number(b));
    expectedTokenized.sort((a, b) => Number(a) - Number(b));

    return actualTokenized.every(
      (num, i) => Math.abs(Number(num) - Number(expectedTokenized[i])) < 1e-9,
    );
  } else {
    actualTokenized.sort();
    expectedTokenized.sort();
    return actualTokenized.every((val, i) => val === expectedTokenized[i]);
  }
}

@Processor('demoExecutionQueue', { concurrency: 5 })
export class DemoExecutionWorker extends WorkerHost {
  constructor(private readonly events: EventsGateway) {
    super();
  }

  async process(job: JobWCode) {
    const { language, userCode, version, problemSlug, socketId } =
      job.data.submitDemoCodeDto;

    try {
      const problem = await prisma.problem.findUnique({
        where: {
          slug: problemSlug,
        },
      });

      if (!problem) {
        this.events.handleResult(socketId, job.id as string, {
          type: 'FAIL',
          passed: 0,
          total: 0,
          error: 'Problem not found',
          expectedOutput: '',
          yourOutput: '',
        });
        return;
      }

      const drivers = problem.driverCode as Record<string, string>;
      const driverTemplate = drivers[language];

      if (!driverTemplate) {
        this.events.handleResult(socketId, job.id as string, {
          type: 'FAIL',
          passed: 0,
          total: 0,
          error: `Language '${language}' is not supported for this problem`,
          expectedOutput: '',
          yourOutput: '',
        });
        return;
      }

      const main = {
        content: driverTemplate.replace('@@USER_CODE@@', userCode),
      };

      const testCases = problem.testCases as TestCase[];

      let count = 0;
      let pass = true;
      let error = '';
      let failedExpected = '';
      let failedResult = '';
      for (const testCase of testCases) {
        const data = {
          language,
          version,
          files: [main],
          stdin: testCase.input,
        };

        let response;
        try {
          response = await fetch(
            `${process.env.PISTON_URL}/api/v2/execute` ||
              'http://localhost:2000/api/v2/execute',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            },
          );
        } catch (er) {
          this.events.handleResult(socketId, job.id as string, {
            type: 'FAIL',
            passed: count,
            total: testCases.length,
            error: 'Code execution service is unavailable',
            expectedOutput: '',
            yourOutput: '',
          });
          return;
        }

        if (!response.ok) {
          this.events.handleResult(socketId, job.id as string, {
            type: 'FAIL',
            passed: count,
            total: testCases.length,
            error: 'Code execution failed',
            expectedOutput: '',
            yourOutput: '',
          });
          return;
        }

        const result = (await response.json()) as Result;

        if (result.run.stderr) {
          pass = false;
          error = result.run.stderr;
          break;
        }

        if (
          compareOutputs(
            result.run.stdout,
            testCase.output,
            problem.validationType,
          )
        ) {
          count++;
          this.events.handleProgress(socketId, job.id as string, {
            passed: count,
            total: testCases.length,
          });
        } else {
          pass = false;
          failedExpected = testCase.output;
          failedResult = result.run.stdout;
          break;
        }
      }

      if (pass) {
        this.events.handleResult(socketId, job.id as string, {
          type: 'PASS',
          passed: count,
          total: testCases.length,
        });
      } else {
        this.events.handleResult(socketId, job.id as string, {
          type: 'FAIL',
          passed: count,
          total: testCases.length,
          error,
          expectedOutput: failedExpected,
          yourOutput: failedResult,
        });
      }
    } catch {
      this.events.handleResult(socketId, job.id as string, {
        type: 'FAIL',
        passed: 0,
        total: 0,
        error: 'An unexpected error occurred during execution',
        expectedOutput: '',
        yourOutput: '',
      });
    }
  }
}
