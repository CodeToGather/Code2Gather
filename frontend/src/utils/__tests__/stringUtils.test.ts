import { toKebabCase, toSnakeCase, toTitleCase } from '../stringUtils';

describe('toTitleCase', () => {
  it('should capitalise the first character of a single word', () => {
    expect(toTitleCase('string')).toBe('String');
  });

  it('should capitalise the first character of multiple single-space-separated words', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
    expect(toTitleCase('hello there general kenobi')).toBe(
      'Hello There General Kenobi',
    );
  });

  it('should decapitalise the non-first characters', () => {
    expect(toTitleCase('hEllO')).toBe('Hello');
    expect(toTitleCase('hEllO tHERE')).toBe('Hello There');
  });

  it('should handle multiple-space-separated words correctly', () => {
    expect(toTitleCase('hello      world')).toBe('Hello      World');
    expect(toTitleCase('   hello   world')).toBe('   Hello   World');
  });

  it('should handle other punctuation correctly', () => {
    expect(toTitleCase('hello! how have you been?')).toBe(
      'Hello! How Have You Been?',
    );
  });
});

describe('toSnakeCase', () => {
  it('should return the same string if it is already snake cased', () => {
    expect(toSnakeCase('snake_string')).toBe('snake_string');
  });

  it('should return a snake case if input single word title cased', () => {
    expect(toSnakeCase('Snake')).toBe('snake');
  });

  it('should return a snake case if input is camel cased', () => {
    expect(toSnakeCase('snakeString')).toBe('snake_string');
    expect(toSnakeCase('thisIsMySnakeString')).toBe('this_is_my_snake_string');
  });

  it('should return a snake case if input is multi-word title cased', () => {
    expect(toSnakeCase('SnakeString')).toBe('snake_string');
  });

  it('should return a snake case if input contains alphanumeric', () => {
    expect(toSnakeCase('Snake123')).toBe('snake123');
    expect(toSnakeCase('snakeString123')).toBe('snake_string123');
  });

  it('should return a snake case if input is space separated', () => {
    expect(toSnakeCase('snake string')).toBe('snake_string');
    expect(toSnakeCase('Snake String')).toBe('snake_string');
  });

  it('should return a snake case if input has mixed separator', () => {
    expect(toSnakeCase('snake-string')).toBe('snake_string');
    expect(toSnakeCase('snake_string')).toBe('snake_string');
    expect(toSnakeCase('snake/string')).toBe('snake_string');
    expect(toSnakeCase('snake\nstring')).toBe('snake_string');
    expect(toSnakeCase('snake\tstring')).toBe('snake_string');
  });

  it('should remove punctuation from the input', () => {
    expect(toSnakeCase('snakeString!')).toBe('snake_string');
    expect(toSnakeCase('snake.String')).toBe('snake_string');
    expect(toSnakeCase('snake?string')).toBe('snake_string');
  });
});

describe('toKebabCase', () => {
  it('should return the same string if it is already kebab cased', () => {
    expect(toKebabCase('kebab-string')).toBe('kebab-string');
  });

  it('should return a kebab case if input single word title cased', () => {
    expect(toKebabCase('Kebab')).toBe('kebab');
  });

  it('should return a kebab case if input is camel cased', () => {
    expect(toKebabCase('kebabString')).toBe('kebab-string');
    expect(toKebabCase('thisIsMyKebabString')).toBe('this-is-my-kebab-string');
  });

  it('should return a kebab case if input is multi-word title cased', () => {
    expect(toKebabCase('KebabString')).toBe('kebab-string');
  });

  it('should return a kebab case if input contains alphanumeric', () => {
    expect(toKebabCase('Kebab123')).toBe('kebab123');
    expect(toKebabCase('kebabString123')).toBe('kebab-string123');
  });

  it('should return a kebab case if input is space separated', () => {
    expect(toKebabCase('kebab string')).toBe('kebab-string');
    expect(toKebabCase('Kebab String')).toBe('kebab-string');
  });

  it('should return a kebab case if input has mixed separator', () => {
    expect(toKebabCase('kebab-string')).toBe('kebab-string');
    expect(toKebabCase('kebab_string')).toBe('kebab-string');
    expect(toKebabCase('kebab/string')).toBe('kebab-string');
    expect(toKebabCase('kebab\nstring')).toBe('kebab-string');
    expect(toKebabCase('kebab\tstring')).toBe('kebab-string');
  });

  it('should remove punctuation from the input', () => {
    expect(toKebabCase('kebabString!')).toBe('kebab-string');
    expect(toKebabCase('kebab.String')).toBe('kebab-string');
    expect(toKebabCase('kebab?string')).toBe('kebab-string');
  });
});
