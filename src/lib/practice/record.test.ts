import { describe, expect, it } from "vitest";

import {
  type PracticeRecord,
  clearKeys,
  problemKey,
  readRecord,
  recordAttempt,
  summarize,
} from "@/lib/practice/record";

/** A stand-in for local storage, so the record can be tested off a browser. */
function fakeStore(initial: string | null = null) {
  let value = initial;
  return {
    getItem: () => value,
    setItem: (_key: string, next: string) => {
      value = next;
    },
    get raw() {
      return value;
    },
  };
}

/** A store that throws, the way a blocked one does in a private window. */
const brokenStore = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
};

describe("problemKey", () => {
  it("names a problem by where it sits", () => {
    expect(problemKey("radicals", "practice", 2)).toBe("radicals/practice/2");
  });
});

describe("keeping a record", () => {
  it("counts the tries and remembers a solve", () => {
    const store = fakeStore();
    recordAttempt("a", false, store, 1);
    recordAttempt("a", true, store, 2);
    const record = readRecord(store);
    expect(record.a).toEqual({ tries: 2, solved: true, at: 2 });
  });

  it("keeps a problem solved once it has been solved", () => {
    const store = fakeStore();
    recordAttempt("a", true, store, 1);
    recordAttempt("a", false, store, 2);
    expect(readRecord(store).a.solved).toBe(true);
    expect(readRecord(store).a.tries).toBe(2);
  });

  it("keeps problems apart", () => {
    const store = fakeStore();
    recordAttempt("a", true, store, 1);
    recordAttempt("b", false, store, 1);
    expect(readRecord(store).a.solved).toBe(true);
    expect(readRecord(store).b.solved).toBe(false);
  });

  it("forgets only what it is asked to", () => {
    const store = fakeStore();
    recordAttempt("a", true, store, 1);
    recordAttempt("b", true, store, 1);
    const left = clearKeys(["a"], store);
    expect(left.a).toBeUndefined();
    expect(left.b).toBeDefined();
    expect(readRecord(store).a).toBeUndefined();
  });
});

describe("reading a record back", () => {
  it("starts empty when there is nothing stored", () => {
    expect(readRecord(fakeStore())).toEqual({});
    expect(readRecord(null)).toEqual({});
  });

  it("survives anything else being in there", () => {
    expect(readRecord(fakeStore("not json"))).toEqual({});
    expect(readRecord(fakeStore("[1,2,3]"))).toEqual({});
    expect(readRecord(fakeStore('{"a": 4}'))).toEqual({});
    expect(readRecord(fakeStore('{"a": {"tries": "two", "solved": true}}'))).toEqual({});
    // A row that is right apart from a missing timestamp is still a row.
    expect(readRecord(fakeStore('{"a": {"tries": 1, "solved": true}}')).a.at).toBe(0);
  });

  it("gives up quietly when storage itself refuses", () => {
    expect(readRecord(brokenStore)).toEqual({});
    expect(() => recordAttempt("a", true, brokenStore, 1)).not.toThrow();
  });
});

describe("summarize", () => {
  const record: PracticeRecord = {
    a: { tries: 1, solved: true, at: 1 },
    b: { tries: 3, solved: true, at: 2 },
    c: { tries: 2, solved: false, at: 3 },
  };

  it("counts what was attempted, solved, and solved first time", () => {
    expect(summarize(record, ["a", "b", "c", "d"])).toEqual({
      attempted: 3,
      solved: 2,
      firstTime: 1,
    });
  });

  it("counts nothing for a set that has not been touched", () => {
    expect(summarize({}, ["a", "b"])).toEqual({ attempted: 0, solved: 0, firstTime: 0 });
  });
});
