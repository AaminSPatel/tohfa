/** Mongo lean docs -> plain JSON-safe objects with `id` instead of `_id`. */
export function toPlain(doc) {
  if (!doc) return null;
  const obj = JSON.parse(JSON.stringify(doc));
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  delete obj.passwordHash;
  return obj;
}
export const toPlainList = (docs) => docs.map(toPlain);
