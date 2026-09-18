export const FAVORITES_KEY = 'catti.favorites';

export function readFavorites(storage = localStorage) {
  try {
    const value = JSON.parse(storage.getItem(FAVORITES_KEY) || '[]');
    return Array.isArray(value) ? [...new Set(value.filter(item => typeof item === 'string'))] : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(favorites, phrase, storage = localStorage) {
  const next = favorites.includes(phrase)
    ? favorites.filter(item => item !== phrase)
    : [...favorites, phrase];
  storage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return next;
}

export function filterPhrases(items, { query = '', direction = 'all', favoritesOnly = false, favorites = [] }) {
  const search = query.trim().toLocaleLowerCase();
  return items.filter(item =>
    (direction === 'all' || item.direction === direction) &&
    (!favoritesOnly || favorites.includes(item.expression)) &&
    [item.expression, item.meaning, item.example, item.topic].some(text => text.toLocaleLowerCase().includes(search))
  );
}
