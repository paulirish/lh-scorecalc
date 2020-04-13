import {QUANTILE_AT_VALUE, VALUE_AT_QUANTILE} from './math.js';
import {fromEvent, combineLatest, interval} from 'rxjs';
import {map, startWith, debounce} from 'rxjs/operators';
import {$, $$, calculateRating, arithmeticMean, NBSP, numberFormatter} from './util.js';
import {weights, scoring} from './metrics.js';


function main(weights, container) {
  // Nake sure weights total to 1
  const weightSum = Object.values(weights).reduce((agg, val) => (agg += val));
  console.assert(weightSum > 0.999 && weightSum < 1.0001); // lol rounding is hard.
  const maxWeight = Math.max(...Object.values(weights));

  // The observables are initiated (via startWith) an element, but after that they get events. This normalizes.
  const giveElement = eventOrElem =>
    eventOrElem instanceof Event ? eventOrElem.target : eventOrElem;

  // Gotta avoid infinite loop since we dispatchEvent ourselves
  const isManuallyDispatched = eventOrElem =>
    eventOrElem instanceof Event && !eventOrElem.isTrusted;

  const html = Object.keys(weights)
    .map(id => {
      const name = scoring[id].name;
      return createRow(id, name);
    })
    .join('');

  container.$('tbody').innerHTML = html;

  function createRow(id, name) {
    return `
  <tr id="${id}">
    <td>
      <span class="lh-metric__score-icon"></span>
    </td>
    <td>${id} (${name})</td>
    <td>
      <input type="range" step=10 class="${id} metric-value" />
      <output class="${id} value-output"></output>
    </td>
    <td></td>

    <td>
      <input type="range" class="${id} metric-score"/>
      <output class="${id} score-output"></output>
    </td>

    <td>
      <span class="${id} weight-text"></span>
    </td>
  </tr>`;
  }

  // Set weighting column
  container.$$('.weight-text').forEach(elem => {
    const metricId = elem.closest('tr').id;
    const weightStr = (weights[metricId] * 100).toLocaleString(undefined, {maximumFractionDigits: 1});
    elem.textContent = `${weightStr}%`;
  });

  // Set up value sliders
  const valueObservers = Array.from(container.$$('input.metric-value')).map(elem => {
    const metricId = elem.closest('tr').id;
    const metricScoring = scoring[metricId];
    const outputElem = container.$(`.value-output.${metricId}`);
    const scoreElem = container.$(`input.${metricId}.metric-score`);

    // Calibrate min & max using scoring curve
    const valueAtScore100 = VALUE_AT_QUANTILE(
      metricScoring.median,
      metricScoring.falloff,
      0.995
    );
    const valueAtScore5 = VALUE_AT_QUANTILE(
      metricScoring.median,
      metricScoring.falloff,
      0.05
    );

    const min = Math.floor(valueAtScore100 / 1000) * 1000;
    const max = Math.ceil(valueAtScore5 / 1000) * 1000;
    elem.min = min;
    elem.max = max;

    // Special handling for CLS
    if (metricScoring.units === 'unitless') {
      elem.min = 0;
      elem.max = Math.ceil(valueAtScore5 * 100) / 100;
      elem.step = 0.01;
    }

    // Restore cached value if available, otherwise generate reasonable random stuff
    if (localStorage[`metricValues.${container.id}`]) {
      const cachedValues = JSON.parse(localStorage[`metricValues.${container.id}`]);
      elem.value = cachedValues[metricId];
    } else {
      elem.value = Math.max((Math.random() * (elem.max - elem.min)) / 2, min);
    }

    const obs = fromEvent(elem, 'input').pipe(startWith(elem));
    // On value slider change, set text
    obs.subscribe(eventOrElem => {
      if (metricScoring.units === 'unitless') {
        // We always want 2 fractional digits
        outputElem.textContent = giveElement(eventOrElem).valueAsNumber.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
      } else {
        // Rounded to nearest ten
        const milliseconds = giveElement(eventOrElem).valueAsNumber;
        outputElem.textContent = `${numberFormatter.format(milliseconds)}${NBSP}ms`;
      }
    });

    // On value slider change, set score
    obs.subscribe(eventOrElem => {
      if (isManuallyDispatched(eventOrElem)) return;
      const elem = giveElement(eventOrElem);

      const computedScore = (
        QUANTILE_AT_VALUE(metricScoring.median, metricScoring.falloff, elem.value) * 100
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
    .pipe(debounce(() => interval(200)))
    .subscribe(values => {
      localStorage[`metricValues.${container.id}`] = JSON.stringify(values);
    });

  // Setup the score sliders
  const scoreObservers = Array.from(container.$$('input.metric-score')).map(elem => {
    const metricId = elem.closest('tr').id;
    const metricScoring = scoring[metricId];
    const rangeElem = container.$(`.metric-score.${metricId}`);
    const outputElem = container.$(`.score-output.${metricId}`);
    const valueElem = container.$(`input.${metricId}.metric-value`);

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

      const currentScore = elem.valueAsNumber;
      let computedValue = VALUE_AT_QUANTILE(metricScoring.median, metricScoring.falloff, currentScore / 100);

      // // if the new potential value's score is the same as it already is.. don't touch, otherwise the a TTI might be tweaked a few ms.
      // const computedScore = QUANTILE_AT_VALUE(metricScoring.median, metricScoring.falloff, computedValue) * 100;
      // if (Math.round(computedScore) === currentScore) return;

      if (metricScoring.units !== 'unitless') {
        computedValue = (computedValue);
      }

      // Clamp because we can end up with Infinity
      valueElem.valueAsNumber = Math.min(computedValue, valueElem.max);
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
      const wrapper = container.$('.lh-gauge__wrapper');
      wrapper.className = 'lh-gauge__wrapper'; // clear any other labels already set
      wrapper.classList.add(`lh-gauge__wrapper--${calculateRating(score / 100)}`);

      const gaugeArc = container.$('.lh-gauge-arc');
      gaugeArc.style.strokeDasharray = `${(score / 100) * 352} 352`;

      const scoreOutOf100 = Math.round(score);
      const percentageEl = container.$('.lh-gauge__percentage');
      percentageEl.textContent = scoreOutOf100.toString();
    });
}

if (new URLSearchParams(location.search).has('v6')) {
  $('#v5').hidden = true;
  $('footer').hidden = true;
  $('h1').hidden = true;
}
else if (new URLSearchParams(location.search).has('v5')) {
  $('#v6').hidden = true;
  $('footer').hidden = true;
  $('h1').hidden = true;
}

main(weights.v6, $('#v6'));
main(weights.v5, $('#v5'));
