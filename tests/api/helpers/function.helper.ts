/**
 * Converts RS amount to USD based on fetched exchange rate
 *
 * @param rsAmount - Value representing price in RS
 * @param usdRate - Middle USD exchange rate
 * @returns Rounded USD value
 */
export default function convertRsToUsd(rsAmount: number, usdRate: number): number {
  if (typeof rsAmount !== 'number' || typeof usdRate !== 'number') {
    throw new Error('ERROR: Values should be type number!');
  }

  const result = rsAmount / usdRate;

  return Number(result.toFixed(2));
}
