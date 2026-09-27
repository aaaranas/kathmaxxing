/**
 * What she has already got right, kept on her own device.
 *
 * The point of a record is the second visit: which problems are done, which
 * were a fight, and which have never been attempted. None of that is worth a
 * database - it is hers, it is small, and it should survive the app being
 * offline - so it lives in local storage and nothing about it leaves the
 * phone.
 *
 * Every read and write is wrapped, because storage throws rather than returns
 * null in a private window, and a study app must not fall over on that.
 */

export type Attempt = {
  /** How many times she has pressed check on this one. */
  tries: number;
  /** Whether it has ever come back right. */
  solved: boolean;
  /** When it was last attempted, as a timestamp. */
  at: number;
};

export type PracticeRecord = Record<string, Attempt>;

/** Small enough to read by hand, and versioned so a later shape can replace it. */
const KEY = "kathmaxxing.practice.v1";

/** A problem is named by where it sits, so the record survives a reword. */
export function problemKey(lesson: string, section: string, index: number): string {
  return `${lesson}/${section}/${index}`;
}

type Store = Pick<Storage, "getItem" | "setItem">;

function browserStore(): Store | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readRecord(store: Store | null = browserStore()): PracticeRecord {
  if (store === null) return {};
  try {
    const raw = store.getItem(KEY);
    if (raw === null) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object") return {};
    // Anything that is not the shape written below is dropped rather than
    // trusted: this came off a disk that other versions have written to.
    const out: PracticeRecord = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (value === null || typeof value !== "object") continue;
      const { tries, solved, at } = value as Partial<Attempt>;
      if (typeof tries !== "number" || typeof solved !== "boolean") continue;
      out[key] = { tries, solved, at: typeof at === "number" ? at : 0 };
    }
    return out;
  } catch {
    return {};
  }
}

function write(record: PracticeRecord, store: Store | null): PracticeRecord {
  try {
    store?.setItem(KEY, JSON.stringify(record));
  } catch {
    // A full or blocked store costs her the record, not the page.
  }
  publish(record);
  return record;
}

/*
 * The record as something React can subscribe to.
 *
 * A component cannot read local storage while it renders - the first render
 * has to match the HTML the server sent, which knows nothing about her device
 * - and reading it in an effect means setting state from an effect. Handing
 * React an external store instead is what `useSyncExternalStore` is for: it
 * renders `emptyRecord` on the server and through hydration, then swaps to the
 * real one. The snapshot has to be the same object until something changes,
 * hence the cache.
 */

let cached: PracticeRecord | null = null;
const listeners = new Set<() => void>();

function publish(record: PracticeRecord): void {
  cached = record;
  for (const listener of listeners) listener();
}

const EMPTY: PracticeRecord = {};

/** The record as it stands, stable between changes. */
export function recordSnapshot(): PracticeRecord {
  if (cached === null) cached = readRecord();
  return cached;
}

/** What the server and the hydrating client both see: nothing yet. */
export function emptyRecord(): PracticeRecord {
  return EMPTY;
}

export function subscribeRecord(listener: () => void): () => void {
  listeners.add(listener);

  // Another tab writing counts as a change here too.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== KEY) return;
    cached = null;
    listener();
  };
  if (typeof window !== "undefined") window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
  };
}

/** Add one attempt, keeping a problem solved once it has ever been solved. */
export function recordAttempt(
  key: string,
  correct: boolean,
  store: Store | null = browserStore(),
  now = Date.now(),
): PracticeRecord {
  const record = readRecord(store);
  const before = record[key];
  return write(
    {
      ...record,
      [key]: {
        tries: (before?.tries ?? 0) + 1,
        solved: (before?.solved ?? false) || correct,
        at: now,
      },
    },
    store,
  );
}

/** Forget one set of problems, for a second run at them from scratch. */
export function clearKeys(keys: string[], store: Store | null = browserStore()): PracticeRecord {
  const record = readRecord(store);
  const gone = new Set(keys);
  return write(Object.fromEntries(Object.entries(record).filter(([key]) => !gone.has(key))), store);
}

export type Summary = { attempted: number; solved: number; firstTime: number };

/** How a set of problems stands, for the line above the list. */
export function summarize(record: PracticeRecord, keys: string[]): Summary {
  let attempted = 0;
  let solved = 0;
  let firstTime = 0;
  for (const key of keys) {
    const attempt = record[key];
    if (attempt === undefined) continue;
    attempted += 1;
    if (attempt.solved) solved += 1;
    if (attempt.solved && attempt.tries === 1) firstTime += 1;
  }
  return { attempted, solved, firstTime };
}
