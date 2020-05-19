/**
 * Approximates the Gauss error function, the probability that a random variable
 * from the standard normal distribution lies within [-x, x]. Moved from
 * traceviewer.b.math.erf, based on Abramowitz and Stegun, formula 7.1.26.
 * @param {number} x
 * @return {number}
 */
function internalErf_(x) {
  // erf(-x) = -erf(x);
  var sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  var a1 = 0.254829592;
  var a2 = -0.284496736;
  var a3 = 1.421413741;
  var a4 = -1.453152027;
  var a5 = 1.061405429;
  var p = 0.3275911;
  var t = 1 / (1 + p * x);
  var y = t * (a1 + t * (a2 + t * (a3 + t * (a4 + t * a5))));
  return sign * (1 - y * Math.exp(-x * x));
}

/**
 * Creates a log-normal distribution and finds the complementary
 * quantile (1-percentile) of that distribution at value. All
 * arguments should be in the same units (e.g. milliseconds).
 *
 * @param {{median: number, podr?: number, p10?: number}} curve
 * @param {number} value
 * @return The complement of the quantile at value.
 * @customfunction
 */
export function QUANTILE_AT_VALUE({median, podr, p10}, value) {
  if (!podr) {
    podr = derivePodrFromP10(median, p10);
  }

  var location = Math.log(median);

  // The "podr" value specified the location of the smaller of the positive
  // roots of the third derivative of the log-normal CDF. Calculate the shape
  // parameter in terms of that value and the median.
  // See https://www.desmos.com/calculator/2t1ugwykrl
  var logRatio = Math.log(podr / median);
  var shape = Math.sqrt(1 - 3 * logRatio - Math.sqrt((logRatio - 3) * (logRatio - 3) - 8)) / 2;

  var standardizedX = (Math.log(value) - location) / (Math.SQRT2 * shape);
  return (1 - internalErf_(standardizedX)) / 2;
}

/**
 * Approximates the inverse error function. Based on Winitzki, "A handy
 * approximation for the error function and its inverse"
 * @param {number} x
 * @return {number}
 */
function internalErfInv_(x) {
  // erfinv(-x) = -erfinv(x);
  var sign = x < 0 ? -1 : 1;
  var a = 0.147;

  var log1x = Math.log(1 - x*x);
  var p1 = 2 / (Math.PI * a) + log1x / 2;
  var sqrtP1Log = Math.sqrt(p1 * p1 - (log1x / a));
  return sign * Math.sqrt(sqrtP1Log - p1);
}

/**
 * Calculates the value at the given quantile. Median, podr, and
 * expected value should all be in the same units (e.g. milliseconds).
 * quantile should be within [0,1].
 *
 * @param {{median: number, podr?: number, p10?: number}} curve
 * @return The value at this quantile.
 * @customfunction
 */
export function VALUE_AT_QUANTILE({median, podr, p10}, quantile) {
  if (!podr) {
    podr = derivePodrFromP10(median, p10);
  }

  var location = Math.log(median);
  var logRatio = Math.log(podr / median);
  var shape = Math.sqrt(1 - 3 * logRatio - Math.sqrt((logRatio - 3) * (logRatio - 3) - 8)) / 2;

  return Math.exp(location + shape * Math.SQRT2 * internalErfInv_(1 - 2 * quantile));
}

// https://www.desmos.com/calculator/oqlvmezbze
function derivePodrFromP10(median, p10) {
  const u = Math.log(median);
  const shape = Math.abs(Math.log(p10) - u) / Math.sqrt(20.9061938024368232);
  const inner1 = -3 * u - Math.sqrt(4 + u * u);
  const podr = Math.exp(u + shape/2 * inner1)
  return podr;
}
