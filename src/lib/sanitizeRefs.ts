/** Optional ObjectId ref fields commonly sent as "" from admin forms. */
export const MUSIC_REF_FIELDS = [
  'genre',
  'category',
  'language',
  'artistId',
  'albumId',
] as const;

export function extractObjectId(value: unknown): string | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }
  if (typeof value === 'object') {
    const obj = value as { id?: unknown; _id?: unknown };
    const id = obj.id ?? obj._id;
    if (id == null || id === '') return undefined;
    return typeof id === 'string' ? id : String(id);
  }
  return undefined;
}

/**
 * Converts empty / invalid ObjectId refs so Mongoose does not CastError on "".
 * Empty values are removed from $set and added to $unset (for updates).
 */
export function sanitizeRefFields(
  body: Record<string, any>,
  fields: readonly string[] = MUSIC_REF_FIELDS
): { set: Record<string, any>; unset: Record<string, 1> } {
  const set = { ...body };
  const unset: Record<string, 1> = {};

  for (const field of fields) {
    if (!(field in set)) continue;
    const id = extractObjectId(set[field]);
    if (id) {
      set[field] = id;
    } else {
      delete set[field];
      unset[field] = 1;
    }
  }

  return { set, unset };
}

export function buildRefUpdate(body: Record<string, any>, fields?: readonly string[]) {
  const { set, unset } = sanitizeRefFields(body, fields);
  const update: Record<string, any> = {};
  if (Object.keys(set).length > 0) update.$set = set;
  if (Object.keys(unset).length > 0) update.$unset = unset;
  return update;
}
