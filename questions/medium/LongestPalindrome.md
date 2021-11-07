---
title: Longest Palindrome Substring
difficulty: Medium
---

## Text

Find the longest substring which is a palindrome from a string input.

**Sample Input**

```markdown
abbaabcba
```

**Sample Output**

```markdown
abcba
```

## Hints

- The optimal solution has a time complexity of O(n^2). To do so, simply iterate and treat each character as the center of a palindrome.
- The naive solution has a time complexity of O(n^3). This is also the brute force solution.
