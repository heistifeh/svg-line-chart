import { describe, expect, it } from "vitest";
import {
  buildAreaPath,
  buildLinePath,
  nearestIndex,
  niceTicks,
  scaleLinear,
} from "./chart";

describe("scaleLinear", () => {
  it("maps domain ends to range ends", () => {
    const s = scaleLinear([0, 100], [0, 500]);
    expect(s(0)).toBe(0);
    expect(s(100)).toBe(500);
    expect(s(50)).toBe(250);
  });

  it("supports inverted ranges (SVG y axis)", () => {
    const s = scaleLinear([0, 10], [200, 0]);
    expect(s(0)).toBe(200);
    expect(s(10)).toBe(0);
    expect(s(2.5)).toBe(150);
  });

  it("returns range start for a zero-width domain", () => {
    expect(scaleLinear([5, 5], [10, 90])(5)).toBe(10);
  });
});

describe("buildLinePath", () => {
  it("returns an empty string for no points", () => {
    expect(buildLinePath([])).toBe("");
  });

  it("builds M then L commands with rounded coordinates", () => {
    expect(
      buildLinePath([
        [0, 100],
        [50.126, 40],
        [100, 0],
      ]),
    ).toBe("M0 100 L50.13 40 L100 0");
  });
});

describe("buildAreaPath", () => {
  it("closes the shape down to the baseline", () => {
    expect(
      buildAreaPath(
        [
          [10, 20],
          [30, 10],
        ],
        100,
      ),
    ).toBe("M10 20 L30 10 L30 100 L10 100 Z");
  });
});

describe("niceTicks", () => {
  it("produces round ticks covering the range", () => {
    expect(niceTicks(0, 100, 5)).toEqual([0, 50, 100]);
  });

  it("expands to nice bounds", () => {
    const t = niceTicks(3, 97, 5);
    expect(t[0]).toBeLessThanOrEqual(3);
    expect(t[t.length - 1]).toBeGreaterThanOrEqual(97);
  });

  it("handles a flat range", () => {
    expect(niceTicks(7, 7)).toEqual([7]);
  });
});

describe("nearestIndex", () => {
  const xs = [0, 100, 200, 300];
  it("picks the closest x", () => {
    expect(nearestIndex(xs, 40)).toBe(0);
    expect(nearestIndex(xs, 60)).toBe(1);
    expect(nearestIndex(xs, 999)).toBe(3);
  });
  it("returns -1 when empty", () => {
    expect(nearestIndex([], 10)).toBe(-1);
  });
});
