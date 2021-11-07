/*
  Converts a string to title case, where the first letter is capitalised
  and the remainder are not.

  Example: 'this sentence' => 'This Sentence'.
*/
export const toTitleCase = (words: string): string => {
  return words
    .split(' ')
    .map(
      (word: string) =>
        `${word.charAt(0).toUpperCase()}${word.substring(1).toLowerCase()}`,
    )
    .join(' ');
};

/*
  Converts string to snake case, e.g. 'hello_world'.
  
  Removes all non-alphanumeric characters in the process.
*/
export const toSnakeCase = (str: string): string => {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\W]+/g, ' ')
    .trim()
    .replace(/\s+/g, '_')
    .toLowerCase();
};

/*
  Converts string to kebab case, e.g. 'hello-world'.
  
  Removes all non-alphanumeric characters in the process.
*/
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\W_]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
};
