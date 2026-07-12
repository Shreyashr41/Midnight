/**
 * mockPriceFeed.ts
 * Generates a fake price series using a sine wave plus Gaussian noise.
 * Returns basis-points returns for mock trades.
 */

const TWO_PI = 2 * Math.PI;

export interface PriceFeedConfig {
  /** Sine wave period in ticks */
  period?: number;
  /** Amplitude of the sine wave in bps (default 500 = ±5%) */
  amplitude?: number;
  /** Gaussian noise standard deviation in bps (default 200) */
  noiseSigma?: number;
  /** Drift per tick in bps (default 10 = tiny upward trend) */
  drift?: number;
}

export class MockPriceFeed {
  private tick = 0;
  private readonly period: number;
  private readonly amplitude: number;
  private readonly noiseSigma: number;
  private readonly drift: number;

  constructor(config: PriceFeedConfig = {}) {
    this.period = config.period ?? 100;
    this.amplitude = config.amplitude ?? 500;
    this.noiseSigma = config.noiseSigma ?? 200;
    this.drift = config.drift ?? 10;
  }

  /** Returns the next return in basis points (can be negative) */
  next(): number {
    const sine = this.amplitude * Math.sin((TWO_PI * this.tick) / this.period);
    const noise = gaussianNoise(this.noiseSigma);
    const returnBps = Math.round(sine + noise + this.drift);
    this.tick++;
    return returnBps;
  }

  /** Returns the current tick */
  currentTick(): number {
    return this.tick;
  }
}

/** Box-Muller transform for Gaussian random noise */
function gaussianNoise(sigma: number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(TWO_PI * v);
  return sigma * z;
}
