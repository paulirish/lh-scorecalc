import {QUANTILE_AT_VALUE, VALUE_AT_QUANTILE} from './math.js';
import { fromEvent, combineLatest, interval } from 'rxjs';
import { map, startWith, debounce } from 'rxjs/operators';

// blingjs
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const NBSP = '\xa0';
const numberFormatter = new Intl.NumberFormat();

// thx Lighthouse's util.js
function arithmeticMean(items) {
  items = items.filter(item => item.weight > 0);
  const results = items.reduce(
    (result, item) => {
      const score = item.score;
      const weight = item.weight;
      return {
        weight: result.weight + weight,
        sum: result.sum + score * weight,
      };
    },
    {weight: 0, sum: 0}
  );
  return results.sum / results.weight || 0;
}
const RATINGS = {
  PASS: {label: 'pass', minScore: 0.9},
  AVERAGE: {label: 'average', minScore: 0.5},
  FAIL: {label: 'fail'},
};
function calculateRating(score) {
  let rating = RATINGS.FAIL.label;
  if (score >= RATINGS.PASS.minScore) {
    rating = RATINGS.PASS.label;
  } else if (score >= RATINGS.AVERAGE.minScore) {
    rating = RATINGS.AVERAGE.label;
  }
  return rating;
}

/**
 * V6 weights
 */

const weights = {
  FCP: 0.25,
  SI: 0.15,
  LCP: 0.2,
  TTI: 0.15,
  TBT: 0.25,
};

/**
 * V5/v6 scoring curves
 */
const scoring = {
  FCP: {median: 4000, falloff: 2000},
  FMP: {median: 4000, falloff: 2000},
  SI: {median: 5800, falloff: 2900},
  TTI: {median: 7300, falloff: 2900},
  TBT: {median: 600, falloff: 200}, // mostly uncalibrated
  LCP: {median: 4000, falloff: 2000}, // these are not chosen yet
  FCPUI: {median: 6500, falloff: 2900},
};

// Nake sure weights total to 1
const weightSum = Object.values(weights).reduce((agg, val) => (agg += val));
console.assert(weightSum === 1);
const maxWeight = Math.max(...Object.values(weights));

// The observables are initiated (via startWith) an element, but after that they get events. This normalizes.
const giveElement = eventOrElem =>
  eventOrElem instanceof Event ? eventOrElem.target : eventOrElem;

// Gotta avoid infinite loop since we dispatchEvent ourselves
const isManuallyDispatched = eventOrElem => eventOrElem instanceof Event && !eventOrElem.isTrusted;

// Set weighting column
$$('.weight-text').forEach(elem => {
  const metricId = elem.closest('tr').id;
  elem.textContent = `${weights[metricId] * 100}%`;
});

// Set up value sliders
const valueObservers = Array.from($$('input.metric-value')).map(elem => {
  const metricId = elem.closest('tr').id;
  const outputElem = $(`.value-output.${metricId}`);
  const scoreElem = $(`input.${metricId}.metric-score`);

  // Calibrate min & max using scoring curve
  const valueAtScore100 = VALUE_AT_QUANTILE(
    scoring[metricId].median,
    scoring[metricId].falloff,
    0.995
  );
  const valueAtScore5 = VALUE_AT_QUANTILE(
    scoring[metricId].median,
    scoring[metricId].falloff,
    0.05
  );

  const min = Math.floor(valueAtScore100 / 1000) * 1000;
  const max = Math.ceil(valueAtScore5 / 1000) * 1000;
  elem.min = min;
  elem.max = max;

  // Restore cached value if available, otherwise generate reasonable random stuff
  if (localStorage.metricValues) {
    const cachedValues = JSON.parse(localStorage.metricValues);
    elem.value = cachedValues[metricId];
  } else {
    elem.value = Math.max((Math.random() * (max - min)) / 2, min);
  }

  const obs = fromEvent(elem, 'input').pipe(startWith(elem));

  obs.subscribe(eventOrElem => {
    const milliseconds = Math.round(giveElement(eventOrElem).value / 10);
    outputElem.textContent = `${numberFormatter.format(milliseconds * 10)}${NBSP}ms`;
  });

  // On value slider change, set score
  obs.subscribe(eventOrElem => {
    if (isManuallyDispatched(eventOrElem)) return;
    const elem = giveElement(eventOrElem);

    const computedScore = Math.round(
      QUANTILE_AT_VALUE(scoring[metricId].median, scoring[metricId].falloff, elem.value) * 100
    );

    scoreElem.value = computedScore;
    scoreElem.dispatchEvent(new Event('input'));
  });

  return obs;
});

// Cache the metric values to localStorage (debounced at 1s)
combineLatest(...valueObservers)
  .pipe(
    map(([...elems]) => {
      return Object.fromEntries(
        elems.map(eventOrElem => {
          const elem = giveElement(eventOrElem);
          const metricId = elem.closest('tr').id;
          return [metricId, elem.value];
        })
      );
    })
  )
  .pipe(debounce(() => interval(500)))
  .subscribe(values => {
    localStorage.metricValues = JSON.stringify(values);
  });

// Setup the score sliders
const scoreObservers = Array.from($$('input.metric-score')).map(elem => {
  const metricId = elem.closest('tr').id;
  const rangeElem = $(`.metric-score.${metricId}`);
  const outputElem = $(`.score-output.${metricId}`);
  const valueElem = $(`input.${metricId}.metric-value`);

  const scaledWidth = weights[metricId] / maxWeight;
  rangeElem.style.width = `${scaledWidth * 100}%`;

  const obs = fromEvent(rangeElem, 'input').pipe(startWith(rangeElem));
  obs.subscribe(eventOrElem => {
    const elem = giveElement(eventOrElem);
    const score = elem.value;
    // Set class for icon
    elem.closest('tr').className = `lh-metric--${calculateRating(score / 100)}`;
    outputElem.textContent = score;
  });

  // On score slider change, update values (backwards direction!)
  obs.subscribe(eventOrElem => {
    if (isManuallyDispatched(eventOrElem)) return;
    const elem = giveElement(eventOrElem);

    let computedValue = Math.round(
      VALUE_AT_QUANTILE(scoring[metricId].median, scoring[metricId].falloff, elem.value / 100)
    );

    // Clamp because we can end up with Infinity
    valueElem.value = Math.min(computedValue, valueElem.max);
    valueElem.dispatchEvent(new Event('input'));
  });

  return obs;
});

// Compute the perf score
combineLatest(...scoreObservers)
  .pipe(
    map(([...elems]) => {
      const items = elems.map(eventOrElem => {
        const elem = giveElement(eventOrElem);
        const metricId = elem.closest('tr').id;
        return {weight: weights[metricId], score: elem.value};
      });
      const weightedMean = arithmeticMean(items);
      return weightedMean;
    })
  )
  .subscribe(score => {
    const wrapper = $('.lh-gauge__wrapper');
    wrapper.className = 'lh-gauge__wrapper'; // clear any other labels already set
    wrapper.classList.add(`lh-gauge__wrapper--${calculateRating(score / 100)}`);

    const gaugeArc = $('.lh-gauge-arc');
    gaugeArc.style.strokeDasharray = `${(score / 100) * 352} 352`;

    const scoreOutOf100 = Math.round(score);
    const percentageEl = $('.lh-gauge__percentage');
    percentageEl.textContent = scoreOutOf100.toString();
  });
