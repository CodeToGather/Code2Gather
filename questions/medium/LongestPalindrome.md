---
title: Longest Palindrome substring
difficulty: Medium
---

## Text

Find the longest substring which is a palindrome from a string input

Sample input

```markdown
abbaabcba
```

Sample output

```markdown
abcba
```

## Hints

- Optimal solution is O(n^2)
  - iterate and treat each string as center of palindrome
- Naive solution is O(n^3)
  - Brute force
