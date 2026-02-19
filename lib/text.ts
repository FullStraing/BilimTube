export function toTitleCase(value: string) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) =>
      word
        .split('-')
        .map((part) => {
          if (!part) return part;
          const [first, ...rest] = Array.from(part);
          return `${first.toLocaleUpperCase('ru-RU')}${rest.join('').toLocaleLowerCase('ru-RU')}`;
        })
        .join('-'),
    )
    .join(' ');
}
