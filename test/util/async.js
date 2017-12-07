export const find = async (collection, iteratee) => {
  let found = null;
  await Promise.all(collection.map(item =>
    Promise.resolve(iteratee(item)).then(match => {
      if (!found && match) found = item;
    })));
  return found;
};
