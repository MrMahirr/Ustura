export function matchesQuery(query: string, values: string[]) {
  if (!query.trim()) {
    return true;
  }

  const normalizedQuery = query.toLocaleLowerCase('tr-TR');
  return values.some((value) => value.toLocaleLowerCase('tr-TR').includes(normalizedQuery));
}
