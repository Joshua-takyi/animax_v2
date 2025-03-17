// Updated removeDuplicates function to accept a key for uniqueness
export function removeDuplicates<T>(array: T[], key: keyof T): T[] {
  const uniqueItems = new Map();
  array.forEach((item) => {
    uniqueItems.set(item[key], item);
  });
  return Array.from(uniqueItems.values());
}
