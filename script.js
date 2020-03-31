import {QUANTILE_AT_VALUE, VALUE_AT_QUANTILE} from './math.js';
import { fromEvent, combineLatest, interval } from 'rxjs';
import { map, startWith, debounce } from 'rxjs/operators';
import {$, $$, calculateRating, arithmeticMean, NBSP, numberFormatter} from './util.js';

/**
 * V6 weights
 */

const weights = {
  v5: {
    FCP: 0.20,
    SI: 0.26666,
    FMP: 0.066666,
    TTI: 0.33333,
    FCI: 0.133333,
  },
  v6: {
    FCP: 0.25,
    SI: 0.15,
    LCP: 0.2,
    TTI: 0.15,
    TBT: 0.25,
  }
};

/**
 * V5/v6 scoring curves
 */
const scoring = {
  FCP: {median: 4000, falloff: 2000, name: 'First Contentful Paint'},
  FMP: {median: 4000, falloff: 2000, name: 'First Meaningful Paint'},
  SI:  {median: 5800, falloff: 2900, name: 'Speed Index'},
  TTI: {median: 7300, falloff: 2900, name: 'Time to Interactive'},
  FCI: {median: 6500, falloff: 2900, name: 'First CPU Idle'},
  TBT: {median: 600, falloff: 200, name: 'Total Blocking Time'}, // mostly uncalibrated
  LCP: {median: 4000, falloff: 2000, name: 'Largest Contentful Paint'}, // these are not chosen yet
};



// Nake sure weights total to 1
const weightSum = Object.values(weights.v6).reduce((agg, val) => (agg += val));
console.assert(weightSum === 1);
const maxWeight = Math.max(...Object.values(weights.v6));

// The observables are initiated (via startWith) an element, but after that they get events. This normalizes.
const giveElement = eventOrElem =>
  eventOrElem instanceof Event ? eventOrElem.target : eventOrElem;

// Gotta avoid infinite loop since we dispatchEvent ourselves
const isManuallyDispatched = eventOrElem => eventOrElem instanceof Event && !eventOrElem.isTrusted;



const html = Object.keys(weights.v6).map(id => {
  const name = scoring[id].name;
  return createRow(id, name);
}).join('');

$('tbody').innerHTML = html;

function createRow(id, name) {
  return `
<tr id="${id}">
  <td>
    <span class="lh-metric__score-icon"></span>
  </td>
  <td>${id} (${name})</td>
  <td>
    <input type="range" class="${id} metric-value" />
  </td>
  <td>
    <output class="${id} value-output"></output>
  </td>
  <td>
    <span class="${id} weight-text"></span>
  </td>

  <td>
    <input type="range" class="${id} metric-score" />
  </td>
  <td>
    <output class="${id} score-output"></output>
  </td>
</tr>`;
}



// Set weighting column
$$('.weight-text').forEach(elem => {
  const metricId = elem.closest('tr').id;
  elem.textContent = `${weights.v6[metricId] * 100}%`;
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

    // const hmm =  (weights[metricId] * 100) - (weights[metricId] * computedScore)
    // console.log(metricId, computedScore, 'points costed', hmm);
    // const soutputElem = $(`.score-output.${metricId}`);
    // setTimeout(_ => {
    //   soutputElem.textContent += ` oportunity: ${hmm.toLocaleString()} pts`
    // })
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

  const scaledWidth = weights.v6[metricId] / maxWeight;
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
        return {weight: weights.v6[metricId], score: elem.value};
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
