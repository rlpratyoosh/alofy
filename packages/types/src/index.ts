export type Progress = {
  passed: number;
  total: number;
};

type Pass = {
  type: "PASS";
  passed: number;
  total: number;
};

type Fail = {
  type: "FAIL";
  error?: string;
  passed: number;
  total: number;
  expectedOutput?: string;
  yourOutput?: string;
};

export type Result = Pass | Fail;

