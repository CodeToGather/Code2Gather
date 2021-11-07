import { Difficulty } from 'types/crud/difficulty';
import { Question } from 'types/crud/question';

export const mockQuestion: Question = {
  id: 'mock-question',
  title: 'FizzBuzz',
  difficulty: Difficulty.EASY,
  text: `Print integers 1 to \`n\`.
But print \`fizz\` if the number is divisible by 3 and print \`buzz\` if the number is divisible by 5.
If the number is divisible by both, print \`fizzbuzz\`.

Input: \`n\`

**Sample Input**

\`\`\`markdown
15
\`\`\`

**Sample Output**

\`\`\`markdown
1
2
fizz
4
buzz
fizz
7
8
fizz
buzz
11
fizz
13
14
fizzbuzz
\`\`\``,
  hints: `- What is an operator that can tell you if a number divides 3 / 5?
- What is the best way to get a range of numbers from 1 to n?`,
};
