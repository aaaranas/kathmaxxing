/**
 * Exact rational arithmetic over BigInt.
 *
 * The algebra lessons are about exact answers - 6/5, 216/1331, 16807 - so a
 * calculator that could only offer 1.2000000000000002 would quietly undercut
 * them. Everything that can be done exactly is, and the floating-point path is
 * a fallback for the genuinely irrational (roots that do not come out, logs,
 * trigonometry) rather than the default.
 */

export type Rational = {
  /** Carries the sign. */
  n: bigint;
  /** Always positive, and coprime with n. */
  d: bigint;
};

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x;
}

/** Build a rational in lowest terms with the sign on the numerator. */
export function rational(n: bigint, d: bigint = 1n): Rational {
  if (d === 0n) throw new RangeError("A rational cannot have a zero denominator.");
  let num = n;
  let den = d;
  if (den < 0n) {
    num = -num;
    den = -den;
  }
  if (num === 0n) return { n: 0n, d: 1n };
  const divisor = gcd(num, den);
  return { n: num / divisor, d: den / divisor };
}

/**
 * Read a decimal literal exactly: "0.1" is one tenth here, not the nearest
 * double to one tenth.
 */
export function fromDecimalString(literal: string): Rational {
  const [whole, fraction = ""] = literal.split(".");
  const digits = (whole === "" ? "0" : whole) + fraction;
  return rational(BigInt(digits), 10n ** BigInt(fraction.length));
}

export const ZERO: Rational = { n: 0n, d: 1n };
export const ONE: Rational = { n: 1n, d: 1n };

export function isZero(value: Rational): boolean {
  return value.n === 0n;
}

export function isInteger(value: Rational): boolean {
  return value.d === 1n;
}

export function isNegative(value: Rational): boolean {
  return value.n < 0n;
}

export function add(a: Rational, b: Rational): Rational {
  return rational(a.n * b.d + b.n * a.d, a.d * b.d);
}

export function subtract(a: Rational, b: Rational): Rational {
  return rational(a.n * b.d - b.n * a.d, a.d * b.d);
}

export function multiply(a: Rational, b: Rational): Rational {
  return rational(a.n * b.n, a.d * b.d);
}

/** Null rather than a throw, so the caller can report division by zero. */
export function divide(a: Rational, b: Rational): Rational | null {
  if (isZero(b)) return null;
  return rational(a.n * b.d, a.d * b.n);
}

export function negate(value: Rational): Rational {
  return { n: -value.n, d: value.d };
}

/** How many bits the pair occupies, used to refuse absurd exact powers. */
export function bitLength(value: Rational): number {
  const magnitude = value.n < 0n ? -value.n : value.n;
  return magnitude.toString(2).length + value.d.toString(2).length;
}

export function integerPower(base: Rational, exponent: bigint): Rational | null {
  if (exponent === 0n) return ONE;
  const magnitude = exponent < 0n ? -exponent : exponent;
  if (exponent < 0n && isZero(base)) return null;

  const n = base.n ** magnitude;
  const d = base.d ** magnitude;
  return exponent < 0n ? rational(d, n) : rational(n, d);
}

/**
 * The exact integer `index`-th root of a non-negative value, or null when the
 * value is not a perfect power. Newton's method from above the answer, so the
 * sequence descends and the loop has an obvious end.
 */
export function integerRoot(value: bigint, index: number): bigint | null {
  if (index <= 0 || !Number.isInteger(index)) return null;
  if (value < 0n) return null;
  if (value <= 1n) return value;
  if (index === 1) return value;
  // Past this the guess itself would be the expensive part, and a root that
  // large is never going to come out whole anyway.
  if (index > 1024) return null;

  const power = BigInt(index);
  let guess = 1n << BigInt(Math.ceil(value.toString(2).length / index) + 1);

  for (;;) {
    const next = ((power - 1n) * guess + value / guess ** (power - 1n)) / power;
    if (next >= guess) break;
    guess = next;
  }

  return guess ** power === value ? guess : null;
}

/**
 * The exact `index`-th root of a rational, or null when it is not one. A
 * negative value has a root only for an odd index, and the sign passes through.
 */
export function exactRoot(value: Rational, index: number): Rational | null {
  const negative = isNegative(value);
  if (negative && index % 2 === 0) return null;

  const magnitude = negative ? -value.n : value.n;
  const rootN = integerRoot(magnitude, index);
  if (rootN === null) return null;
  const rootD = integerRoot(value.d, index);
  if (rootD === null) return null;

  return rational(negative ? -rootN : rootN, rootD);
}

/** Nearest double. Stays accurate when the pair is far outside Number's range. */
export function toNumber(value: Rational): number {
  const direct = Number(value.n) / Number(value.d);
  if (Number.isFinite(direct)) return direct;

  // Both ends overflowed Number, so divide first and scale after.
  const scale = 10n ** 40n;
  const scaled = (value.n * scale) / value.d;
  const asNumber = Number(scaled) / 1e40;
  if (Number.isFinite(asNumber)) return asNumber;

  return value.n < 0n ? -Infinity : Infinity;
}

function digitCount(value: bigint): number {
  const magnitude = value < 0n ? -value : value;
  return magnitude.toString(10).length;
}

/**
 * A decimal reading with `significant` digits, falling back to exponent form
 * for values Number cannot hold. Trailing zeros are trimmed so an exact 2 shows
 * as "2" rather than "2.000000000".
 */
export function toDecimalString(value: Rational, significant = 12): string {
  if (isZero(value)) return "0";

  const asNumber = toNumber(value);
  if (Number.isFinite(asNumber) && asNumber !== 0) {
    const magnitude = Math.abs(asNumber);
    if (magnitude >= 1e-7 && magnitude < 1e15) {
      return trimZeros(asNumber.toPrecision(significant));
    }
    return asNumber.toExponential(Math.max(significant - 1, 0)).replace(/\.?0+e/, "e");
  }

  // Too big for a double, so the leading digits come from an integer division.
  const negative = value.n < 0n;
  const n = negative ? -value.n : value.n;

  // Only an estimate - comparing digit counts is out by one whenever the
  // leading digits fall the wrong way - so it is used to pick the shift, and
  // the exponent is then read back off the digits that actually came out.
  const estimate = digitCount(n) - digitCount(value.d);
  const shift = BigInt(significant + 2 - estimate);
  const scaled =
    shift >= 0n ? (n * 10n ** shift) / value.d : n / (value.d * 10n ** -shift);

  const digits = scaled.toString();
  const exponent = digits.length - Number(shift) - 1;
  const mantissa = trimZeros(digits[0] + "." + digits.slice(1, significant));
  const sign = exponent < 0 ? "-" : "+";
  return (negative ? "-" : "") + mantissa + "e" + sign + Math.abs(exponent);
}

function trimZeros(text: string): string {
  if (!text.includes(".")) return text;
  return text.replace(/\.?0+$/, "");
}
