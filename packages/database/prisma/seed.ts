import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

type ProblemCreateDto = Prisma.ProblemCreateInput;

const data: ProblemCreateDto[] = [
  {
    title: "Two Sum",
    slug: "two-sum",
    validationType: "UNORDERED",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    difficulty: "EASY",
    starterCode: {
      cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};",
      python:
        "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        ",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}",
    },
    driverCode: {
      cpp: '\n#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n@@USER_CODE@@\n\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for(int i=0; i<n; i++) cin >> nums[i];\n    int target; cin >> target;\n\n    Solution sol;\n    vector<int> res = sol.twoSum(nums, target);\n    if (res.size() == 2) cout << res[0] << " " << res[1] << endl;\n    else cout << "" << endl;\n    return 0;\n}',
      python:
        '\nimport sys\nfrom typing import List\n\n@@USER_CODE@@\n\nif __name__ == "__main__":\n    input_data = sys.stdin.read().split()\n    if not input_data: exit()\n    iterator = iter(input_data)\n\n    try:\n        n = int(next(iterator))\n        nums = [int(next(iterator)) for _ in range(n)]\n        target = int(next(iterator))\n\n        sol = Solution()\n        res = sol.twoSum(nums, target)\n        print(f"{res[0]} {res[1]}")\n    except StopIteration:\n        pass',
      java: '\nimport java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (!scanner.hasNext()) return;\n\n        int n = scanner.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = scanner.nextInt();\n        int target = scanner.nextInt();\n        Solution sol = new Solution();\n        int[] result = sol.twoSum(nums, target);\n\n        System.out.println(result[0] + " " + result[1]);\n        scanner.close();\n    }\n} \n@@USER_CODE@@\n',
    },
    testCases: [
      { input: "4\n2 7 11 15\n9", output: "0 1" },
      { input: "3\n3 2 4\n6", output: "1 2" },
      { input: "2\n3 3\n6", output: "0 1" },
      { input: "5\n-1 -2 -3 -4 -5\n-8", output: "2 4" },
      { input: "4\n0 4 3 0\n0", output: "0 3" },
      { input: "6\n1 5 5 9 7 2\n10", output: "1 2" },
      { input: "4\n-10 7 19 15\n9", output: "0 2" },
      { input: "3\n1000000000 5000 1000000000\n2000000000", output: "0 2" },
      { input: "5\n1 2 3 4 5\n9", output: "3 4" },
      { input: "7\n10 15 20 25 30 35 40\n75", output: "5 6" },
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    hint: "A brute force approach would be to check every pair of numbers, which takes O(n^2) time. Can you do this in O(n) time by using a Hash Map to store numbers you've already seen?",
  },
  {
    title: "Palindrome Number",
    slug: "palindrome-number",
    validationType: "EXACT",
    description:
      "Given an integer x, return true if x is a palindrome, and false otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.\n\nFor example, 121 is a palindrome while 123 is not.",
    difficulty: "EASY",
    starterCode: {
      cpp: "class Solution {\npublic:\n    bool isPalindrome(int x) {\n        \n    }\n};",
      python:
        "class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        ",
      java: "class Solution {\n    public boolean isPalindrome(int x) {\n        \n    }\n}",
    },
    driverCode: {
      cpp: '\n#include <iostream>\n#include <string>\nusing namespace std;\n\n@@USER_CODE@@\n\nint main() {\n    int x; \n    if (!(cin >> x)) return 0;\n    \n    Solution sol;\n    bool res = sol.isPalindrome(x);\n    cout << (res ? "true" : "false") << endl;\n    return 0;\n}',
      python:
        '\nimport sys\n\n@@USER_CODE@@\n\nif __name__ == "__main__":\n    input_data = sys.stdin.read().split()\n    if not input_data: exit()\n    \n    x = int(input_data[0])\n    \n    sol = Solution()\n    res = sol.isPalindrome(x)\n    print("true" if res else "false")',
      java: '\nimport java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (!scanner.hasNext()) return;\n\n        int x = scanner.nextInt();\n        Solution sol = new Solution();\n        boolean result = sol.isPalindrome(x);\n\n        System.out.println(result ? "true" : "false");\n        scanner.close();\n    }\n\n@@USER_CODE@@\n}',
    },
    testCases: [
      { input: "121", output: "true" },
      { input: "-121", output: "false" },
      { input: "10", output: "false" },
      { input: "-101", output: "false" },
      { input: "0", output: "true" },
      { input: "1234321", output: "true" },
      { input: "123456", output: "false" },
      { input: "11", output: "true" },
      { input: "2147483647", output: "false" },
      { input: "1000000001", output: "true" },
    ],
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation:
          "121 reads as 121 from left to right and from right to left.",
      },
      {
        input: "x = -121",
        output: "false",
        explanation:
          "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.",
      },
      {
        input: "x = 10",
        output: "false",
        explanation:
          "Reads 01 from right to left. Therefore it is not a palindrome.",
      },
    ],
    constraints: [
      "-2^31 <= x <= 2^31 - 1",
      "Could you solve it without converting the integer to a string?",
    ],
    hint: "Beware of integer overflow when reversing the number. Also, think about what happens to negative numbers—can they ever be palindromes?",
  },
  {
    title: "Reverse String",
    slug: "reverse-string",
    validationType: "EXACT",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
    difficulty: "EASY",
    starterCode: {
      cpp: "class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        \n    }\n};",
      python:
        'class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        """\n        Do not return anything, modify s in-place instead.\n        """\n        pass',
      java: "class Solution {\n    public void reverseString(char[] s) {\n        \n    }\n}",
    },
    driverCode: {
      cpp: '\n#include <iostream>\n#include <vector>\nusing namespace std;\n\n@@USER_CODE@@\n\nint main() {\n    int n; \n    if (!(cin >> n)) return 0;\n    vector<char> s(n);\n    for(int i=0; i<n; i++) cin >> s[i];\n    \n    Solution sol;\n    sol.reverseString(s);\n    \n    for(int i=0; i<n; i++) {\n        cout << s[i] << (i==n-1 ? "" : " ");\n    }\n    cout << endl;\n    return 0;\n}',
      python:
        '\nimport sys\nfrom typing import List\n\n@@USER_CODE@@\n\nif __name__ == "__main__":\n    input_data = sys.stdin.read().split()\n    if not input_data: exit()\n    iterator = iter(input_data)\n\n    try:\n        n = int(next(iterator))\n        s = [next(iterator) for _ in range(n)]\n\n        sol = Solution()\n        sol.reverseString(s)\n        print(" ".join(s))\n    except StopIteration:\n        pass',
      java: '\nimport java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (!scanner.hasNext()) return;\n\n        int n = scanner.nextInt();\n        char[] s = new char[n];\n        for (int i = 0; i < n; i++) {\n            String token = scanner.next();\n            s[i] = token.charAt(0);\n        }\n        \n        Solution sol = new Solution();\n        sol.reverseString(s);\n\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) {\n            sb.append(s[i]);\n            if (i < n - 1) sb.append(" ");\n        }\n        System.out.println(sb.toString());\n        scanner.close();\n    }\n\n@@USER_CODE@@\n}',
    },
    testCases: [
      { input: "5\nh e l l o", output: "o l l e h" },
      { input: "6\nH a n n a h", output: "h a n n a H" },
      { input: "1\nA", output: "A" },
      { input: "2\na b", output: "b a" },
      { input: "4\nA B C D", output: "D C B A" },
      { input: "3\n1 2 3", output: "3 2 1" },
      { input: "5\n! @ # $ %", output: "% $ # @ !" },
      { input: "4\nm o o n", output: "n o o m" },
      { input: "7\nr a c e c a r", output: "r a c e c a r" },
      { input: "6\nC o d i n g", output: "g n i d o C" },
    ],
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
        explanation: "",
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
        explanation: "",
      },
    ],
    constraints: [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ASCII character.",
    ],
    hint: "The entire logic for reversing a string is based on swapping the first character with the last, the second with the second last, and so on.",
  },
  {
    title: "Factorial of N",
    slug: "factorial-of-n",
    validationType: "EXACT",
    description:
      "Given a non-negative integer n, return the factorial of n.\n\nThe factorial of n (denoted by n!) is the product of all positive integers less than or equal to n. \n\nNote: 0! is defined as 1.",
    difficulty: "EASY",
    starterCode: {
      cpp: "class Solution {\npublic:\n    long long factorial(int n) {\n        \n    }\n};",
      python:
        "class Solution:\n    def factorial(self, n: int) -> int:\n        ",
      java: "class Solution {\n    public long factorial(int n) {\n        \n    }\n}",
    },
    driverCode: {
      cpp: "\n#include <iostream>\nusing namespace std;\n\n@@USER_CODE@@\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    \n    Solution sol;\n    cout << sol.factorial(n) << endl;\n    return 0;\n}",
      python:
        '\nimport sys\n\n@@USER_CODE@@\n\nif __name__ == "__main__":\n    input_data = sys.stdin.read().split()\n    if not input_data: exit()\n    \n    n = int(input_data[0])\n    \n    sol = Solution()\n    print(sol.factorial(n))',
      java: "\nimport java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (!scanner.hasNext()) return;\n\n        int n = scanner.nextInt();\n        Solution sol = new Solution();\n        System.out.println(sol.factorial(n));\n        scanner.close();\n    }\n\n@@USER_CODE@@\n}",
    },
    testCases: [
      { input: "0", output: "1" },
      { input: "1", output: "1" },
      { input: "2", output: "2" },
      { input: "5", output: "120" },
      { input: "10", output: "3628800" },
      { input: "3", output: "6" },
      { input: "7", output: "5040" },
      { input: "12", output: "479001600" },
      { input: "15", output: "1307674368000" },
      { input: "20", output: "2432902008176640000" },
    ],
    examples: [
      {
        input: "n = 5",
        output: "120",
        explanation: "5! = 5 * 4 * 3 * 2 * 1 = 120",
      },
      {
        input: "n = 0",
        output: "1",
        explanation: "By definition, the factorial of 0 is 1.",
      },
    ],
    constraints: [
      "0 <= n <= 20",
      "The result will fit in a 64-bit signed integer (long long in C++, long in Java).",
    ],
    hint: "You can solve this iteratively (using a loop) or recursively (calling the function itself). Remember to handle the base case where n is 0.",
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    validationType: "EXACT",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    difficulty: "EASY",
    starterCode: {
      cpp: "class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};",
      python:
        "class Solution:\n    def isValid(self, s: str) -> bool:\n        ",
      java: "class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}",
    },
    driverCode: {
      cpp: '\n#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\n@@USER_CODE@@\n\nint main() {\n    string s;\n    if (!(cin >> s)) return 0;\n    \n    Solution sol;\n    bool res = sol.isValid(s);\n    cout << (res ? "true" : "false") << endl;\n    return 0;\n}',
      python:
        '\nimport sys\n\n@@USER_CODE@@\n\nif __name__ == "__main__":\n    input_data = sys.stdin.read().split()\n    if not input_data: exit()\n    \n    s = input_data[0]\n    \n    sol = Solution()\n    res = sol.isValid(s)\n    print("true" if res else "false")',
      java: '\nimport java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (!scanner.hasNext()) return;\n\n        String s = scanner.next();\n        Solution sol = new Solution();\n        boolean result = sol.isValid(s);\n\n        System.out.println(result ? "true" : "false");\n        scanner.close();\n    }\n\n@@USER_CODE@@\n}',
    },
    testCases: [
      { input: "()", output: "true" },
      { input: "()[]{}", output: "true" },
      { input: "(]", output: "false" },
      { input: "([)]", output: "false" },
      { input: "{[]}", output: "true" },
      { input: "]", output: "false" },
      { input: "((", output: "false" },
      { input: "({[()]})", output: "true" },
      { input: "(([]){})", output: "true" },
      { input: "(((((((()", output: "false" },
    ],
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "",
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation: "",
      },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    hint: "Use a stack to keep track of opening brackets. When you encounter a closing bracket, check if it matches the top of the stack.",
  },
  {
    title: "Fibonacci Number",
    slug: "fibonacci-number",
    validationType: "EXACT",
    description:
      "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is:\n\nF(0) = 0, F(1) = 1\nF(n) = F(n - 1) + F(n - 2), for n > 1.\n\nGiven n, calculate F(n).",
    difficulty: "EASY",
    starterCode: {
      cpp: "class Solution {\npublic:\n    int fib(int n) {\n        \n    }\n};",
      python: "class Solution:\n    def fib(self, n: int) -> int:\n        ",
      java: "class Solution {\n    public int fib(int n) {\n        \n    }\n}",
    },
    driverCode: {
      cpp: "\n#include <iostream>\n#include <vector>\nusing namespace std;\n\n@@USER_CODE@@\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    \n    Solution sol;\n    cout << sol.fib(n) << endl;\n    return 0;\n}",
      python:
        '\nimport sys\n\n@@USER_CODE@@\n\nif __name__ == "__main__":\n    input_data = sys.stdin.read().split()\n    if not input_data: exit()\n    \n    n = int(input_data[0])\n    \n    sol = Solution()\n    print(sol.fib(n))',
      java: "\nimport java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (!scanner.hasNext()) return;\n\n        int n = scanner.nextInt();\n        Solution sol = new Solution();\n        System.out.println(sol.fib(n));\n        scanner.close();\n    }\n\n@@USER_CODE@@\n}",
    },
    testCases: [
      { input: "0", output: "0" },
      { input: "1", output: "1" },
      { input: "2", output: "1" },
      { input: "3", output: "2" },
      { input: "4", output: "3" },
      { input: "5", output: "5" },
      { input: "10", output: "55" },
      { input: "20", output: "6765" },
      { input: "30", output: "832040" },
      { input: "15", output: "610" },
    ],
    examples: [
      {
        input: "n = 2",
        output: "1",
        explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1.",
      },
      {
        input: "n = 3",
        output: "2",
        explanation: "F(3) = F(2) + F(1) = 1 + 1 = 2.",
      },
      {
        input: "n = 4",
        output: "3",
        explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3.",
      },
    ],
    constraints: ["0 <= n <= 30"],
    hint: "A simple recursive solution will repeat calculations. Can you store the results of previous calculations (memoization) or build the answer from the bottom up to make it faster?",
  },
  {
    title: "Find the Duplicate Number",
    slug: "find-the-duplicate-number",
    validationType: "EXACT",
    description:
      "Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive.\n\nThere is only one repeated number in nums, return this repeated number.\n\nYou must solve the problem without modifying the array nums and uses only constant extra space.",
    difficulty: "MEDIUM",
    starterCode: {
      cpp: "class Solution {\npublic:\n    int findDuplicate(vector<int>& nums) {\n        \n    }\n};",
      python:
        "class Solution:\n    def findDuplicate(self, nums: List[int]) -> int:\n        ",
      java: "class Solution {\n    public int findDuplicate(int[] nums) {\n        \n    }\n}",
    },
    driverCode: {
      cpp: "\n#include <iostream>\n#include <vector>\nusing namespace std;\n\n@@USER_CODE@@\n\nint main() {\n    int n; \n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for(int i=0; i<n; i++) cin >> nums[i];\n    \n    Solution sol;\n    cout << sol.findDuplicate(nums) << endl;\n    return 0;\n}",
      python:
        '\nimport sys\nfrom typing import List\n\nif __name__ == "__main__":\n    input_data = sys.stdin.read().split()\n    if not input_data: exit()\n    iterator = iter(input_data)\n\n    try:\n        n = int(next(iterator))\n        nums = [int(next(iterator)) for _ in range(n)]\n\n        sol = Solution()\n        print(sol.findDuplicate(nums))\n    except StopIteration:\n        pass',
      java: "\nimport java.util.*;\nimport java.io.*;\n\n@@USER_CODE@@\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (!scanner.hasNext()) return;\n\n        int n = scanner.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = scanner.nextInt();\n        \n        Solution sol = new Solution();\n        System.out.println(sol.findDuplicate(nums));\n        scanner.close();\n    }\n\n@@USER_CODE@@\n}",
    },
    testCases: [
      { input: "5\n1 3 4 2 2", output: "2" },
      { input: "5\n3 1 3 4 2", output: "3" },
      { input: "2\n1 1", output: "1" },
      { input: "3\n1 1 2", output: "1" },
      { input: "10\n1 2 3 4 5 6 7 8 9 5", output: "5" },
      { input: "5\n2 2 2 2 2", output: "2" },
      { input: "6\n5 4 3 2 1 5", output: "5" },
      { input: "4\n1 3 1 2", output: "1" },
      { input: "7\n6 5 4 3 2 1 2", output: "2" },
      { input: "9\n8 7 6 5 4 3 2 1 4", output: "4" },
    ],
    examples: [
      {
        input: "nums = [1,3,4,2,2]",
        output: "2",
        explanation: "",
      },
      {
        input: "nums = [3,1,3,4,2]",
        output: "3",
        explanation: "",
      },
      {
        input: "nums = [3,3,3,3,3]",
        output: "3",
        explanation: "",
      },
    ],
    constraints: [
      "1 <= n <= 10^5",
      "nums.length == n + 1",
      "1 <= nums[i] <= n",
      "All the integers in nums appear only once except for precisely one integer which appears two or more times.",
    ],
    hint: "If you sort the array, the duplicate numbers will be adjacent to each other. Alternatively, can you use a HashSet to track numbers you've already seen?",
  },
  {
    title: "Power of Two",
    slug: "power-of-two",
    validationType: "EXACT",
    description:
      "Given an integer n, return true if it is a power of two. Otherwise, return false.\n\nAn integer n is a power of two, if there exists an integer x such that n == 2^x.",
    difficulty: "EASY",
    starterCode: {
      cpp: "class Solution {\npublic:\n    bool isPowerOfTwo(int n) {\n        \n    }\n};",
      python:
        "class Solution:\n    def isPowerOfTwo(self, n: int) -> bool:\n        ",
      java: "class Solution {\n    public boolean isPowerOfTwo(int n) {\n        \n    }\n}",
    },
    driverCode: {
      cpp: '\n#include <iostream>\nusing namespace std;\n\n@@USER_CODE@@\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    \n    Solution sol;\n    bool res = sol.isPowerOfTwo(n);\n    cout << (res ? "true" : "false") << endl;\n    return 0;\n}',
      python:
        '\nimport sys\n\n@@USER_CODE@@\n\nif __name__ == "__main__":\n    input_data = sys.stdin.read().split()\n    if not input_data: exit()\n    \n    n = int(input_data[0])\n    \n    sol = Solution()\n    res = sol.isPowerOfTwo(n)\n    print("true" if res else "false")',
      java: '\nimport java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (!scanner.hasNext()) return;\n\n        int n = scanner.nextInt();\n        Solution sol = new Solution();\n        boolean result = sol.isPowerOfTwo(n);\n\n        System.out.println(result ? "true" : "false");\n        scanner.close();\n    }\n\n@@USER_CODE@@\n}',
    },
    testCases: [
      { input: "1", output: "true" },
      { input: "16", output: "true" },
      { input: "3", output: "false" },
      { input: "0", output: "false" },
      { input: "-16", output: "false" },
      { input: "1024", output: "true" },
      { input: "2147483647", output: "false" },
      { input: "1073741824", output: "true" },
      { input: "6", output: "false" },
      { input: "8", output: "true" },
    ],
    examples: [
      {
        input: "n = 1",
        output: "true",
        explanation: "2^0 = 1",
      },
      {
        input: "n = 16",
        output: "true",
        explanation: "2^4 = 16",
      },
      {
        input: "n = 3",
        output: "false",
        explanation: "",
      },
    ],
    constraints: ["-2^31 <= n <= 2^31 - 1"],
    hint: "Powers of two have exactly one bit set in their binary representation. Can you use bitwise AND (&) to check this property?",
  },
  {
    title: "Missing Number",
    slug: "missing-number",
    validationType: "EXACT",
    description:
      "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
    difficulty: "EASY",
    starterCode: {
      cpp: "class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        \n    }\n};",
      python:
        "class Solution:\n    def missingNumber(self, nums: List[int]) -> int:\n        ",
      java: "class Solution {\n    public int missingNumber(int[] nums) {\n        \n    }\n}",
    },
    driverCode: {
      cpp: "\n#include <iostream>\n#include <vector>\nusing namespace std;\n\n@@USER_CODE@@\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for(int i=0; i<n; i++) cin >> nums[i];\n    \n    Solution sol;\n    cout << sol.missingNumber(nums) << endl;\n    return 0;\n}",
      python:
        '\nimport sys\nfrom typing import List\n\n@@USER_CODE@@\n\nif __name__ == "__main__":\n    input_data = sys.stdin.read().split()\n    if not input_data: exit()\n    iterator = iter(input_data)\n\n    try:\n        n = int(next(iterator))\n        nums = [int(next(iterator)) for _ in range(n)]\n\n        sol = Solution()\n        print(sol.missingNumber(nums))\n    except StopIteration:\n        pass',
      java: "\nimport java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (!scanner.hasNext()) return;\n\n        int n = scanner.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = scanner.nextInt();\n        \n        Solution sol = new Solution();\n        System.out.println(sol.missingNumber(nums));\n        scanner.close();\n    }\n\n@@USER_CODE@@\n}",
    },
    testCases: [
      { input: "3\n3 0 1", output: "2" },
      { input: "2\n0 1", output: "2" },
      { input: "9\n9 6 4 2 3 5 7 0 1", output: "8" },
      { input: "1\n0", output: "1" },
      { input: "1\n1", output: "0" },
      { input: "4\n4 2 3 1", output: "0" },
      { input: "5\n0 1 2 3 4", output: "5" },
      { input: "6\n5 0 4 3 2 1", output: "6" },
      { input: "2\n2 0", output: "1" },
      { input: "3\n1 2 3", output: "0" },
    ],
    examples: [
      {
        input: "nums = [3,0,1]",
        output: "2",
        explanation:
          "n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number in the range since it does not appear in nums.",
      },
      {
        input: "nums = [0,1]",
        output: "2",
        explanation:
          "n = 2 since there are 2 numbers, so all numbers are in the range [0,2]. 2 is the missing number in the range since it does not appear in nums.",
      },
      {
        input: "nums = [9,6,4,2,3,5,7,0,1]",
        output: "8",
        explanation:
          "n = 9 since there are 9 numbers, so all numbers are in the range [0,9]. 8 is the missing number in the range since it does not appear in nums.",
      },
    ],
    constraints: [
      "n == nums.length",
      "1 <= n <= 10^4",
      "0 <= nums[i] <= n",
      "All the numbers of nums are unique.",
    ],
    hint: "The expected sum of numbers from 0 to n is n*(n+1)/2. Can you calculate the actual sum of the array and find the difference?",
  },
  {
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    validationType: "EXACT",
    description:
      "You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "EASY",
    starterCode: {
      cpp: "class Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};",
      python:
        "class Solution:\n    def climbStairs(self, n: int) -> int:\n        ",
      java: "class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}",
    },
    driverCode: {
      cpp: "\n#include <iostream>\nusing namespace std;\n\n@@USER_CODE@@\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    \n    Solution sol;\n    cout << sol.climbStairs(n) << endl;\n    return 0;\n}",
      python:
        '\nimport sys\n\n@@USER_CODE@@\n\nif __name__ == "__main__":\n    input_data = sys.stdin.read().split()\n    if not input_data: exit()\n    \n    n = int(input_data[0])\n    \n    sol = Solution()\n    print(sol.climbStairs(n))',
      java: "\nimport java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (!scanner.hasNext()) return;\n\n        int n = scanner.nextInt();\n        Solution sol = new Solution();\n        System.out.println(sol.climbStairs(n));\n        scanner.close();\n    }\n}\n@@USER_CODE@@\n",
    },
    testCases: [
      { input: "2", output: "2" },
      { input: "3", output: "3" },
      { input: "1", output: "1" },
      { input: "4", output: "5" },
      { input: "5", output: "8" },
      { input: "6", output: "13" },
      { input: "8", output: "34" },
      { input: "10", output: "89" },
      { input: "20", output: "10946" },
      { input: "45", output: "1836311903" },
    ],
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation:
          "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
      },
      {
        input: "n = 3",
        output: "3",
        explanation:
          "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
      },
    ],
    constraints: ["1 <= n <= 45"],
    hint: "To reach step n, you must have come from step n-1 or step n-2. This means distinct ways(n) = distinct ways(n-1) + distinct ways(n-2). Does this look like a famous sequence?",
  },
];

async function main() {
  console.log("Seeding...");

  await prisma.problem.deleteMany();
  await prisma.problem.createMany({
    data,
  });

  console.log("Seeding Completed");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
