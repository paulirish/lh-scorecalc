/* global rxjs */

console.clear();

// blingjs
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const NBSP = "\xa0";
const numberFormatter = new Intl.NumberFormat();

function arithmeticMean(items) {
  // Filter down to just the items with a weight as they have no effect on score
  items = items.filter(item => item.weight > 0);
  // If there is 1 null score, return a null average
  if (items.some(item => item.score === null)) return null;

  const results = items.reduce(
    (result, item) => {
      const score = item.score;
      const weight = item.weight;

      return {
        weight: result.weight + weight,
        sum: result.sum + /** @type {number} */ (score) * weight
      };
    },
    { weight: 0, sum: 0 }
  );

  return results.sum / results.weight || 0;
}

const RATINGS = {
  PASS: { label: "pass", minScore: 0.9 },
  AVERAGE: { label: "average", minScore: 0.5 },
  FAIL: { label: "fail" }
};

function calculateRating(score) {
  // At this point, we're rating a standard binary/numeric audit
  let rating = RATINGS.FAIL.label;
  if (score >= RATINGS.PASS.minScore) {
    rating = RATINGS.PASS.label;
  } else if (score >= RATINGS.AVERAGE.minScore) {
    rating = RATINGS.AVERAGE.label;
  }
  return rating;
}



const weights = {
  FCP: 0.25,
  SI: 0.15,
  LCP: 0.2,
  TTI: 0.15,
  TBT: 0.25
};

const scoring = {
  FCP: { median: 4000, falloff: 2000 },
  FMP: { median: 4000, falloff: 2000 },
  SI: { median: 5800, falloff: 2900 },
  TTI: { median: 7300, falloff: 2900 },
  TBT: { median: 600, falloff: 200 }, // mostly uncalibrated
  LCP: { median: 4000, falloff: 2000 }, // these are not chosen yet
  FCPUI: { median: 6500, falloff: 2900 }
};

// make sure weights total to 1
const weightSum = Object.values(weights).reduce((agg, val) => (agg += val));
console.assert(weightSum === 1);
const maxWeight = Math.max(...Object.values(weights));

// The observables are initiated (via startWith) an element, but after that they get events. This normalizes.
const giveElement = eventOrElem =>
  eventOrElem instanceof Event ? eventOrElem.target : eventOrElem;

const isManuallyDispatched = eventOrElem => eventOrElem instanceof Event && !eventOrElem.isTrusted;


const map = rxjs.operators.map;
const scoreObsevers = [];
const valueObservers = [];

// Calibrate value slider scales
$$("input.metric-value").forEach(elem => {
  const metricId = elem.closest("tr").id;

  const valueAtScore100 = VALUE_AT_QUANTILE(
    scoring[metricId].median,
    scoring[metricId].falloff,
    0.995
  );
  const valueAtScoreZero = VALUE_AT_QUANTILE(
    scoring[metricId].median,
    scoring[metricId].falloff,
    0.004
  );

  const min = Math.floor(valueAtScore100 / 1000) * 1000;
  const max = Math.ceil(valueAtScoreZero / 1000) * 1000;

  elem.min = min;
  elem.max = max;
  
  // initialize with randomish values
  elem.value = Math.max(Math.random() * (max - min) / 2, min);  
  // TODO save values to localstorage
         

  const outputElem = $(`.value-output.${metricId}`);
  const obs = rxjs
    .fromEvent(elem, "input")
    .pipe(rxjs.operators.startWith(elem));

  valueObservers.push(obs);

  obs.subscribe(x => {
    outputElem.textContent = `${numberFormatter.format(
      Math.round(giveElement(x).value / 10) * 10
    )}${NBSP}ms`;
  });
});

// On value change, set score
for (const obs of valueObservers) {
  obs.subscribe(eventOrElem => {
    if (isManuallyDispatched(eventOrElem)) return;
    const elem = giveElement(eventOrElem);
    
    const metricId = elem.closest("tr").id;
    const computedScore = Math.round(
      QUANTILE_AT_VALUE(
        scoring[metricId].median,
        scoring[metricId].falloff,
        elem.value
      ) * 100
    );

    const scoreElem = $(`input.${metricId}.metric-score`);
    scoreElem.value = computedScore; // Math.random() * 100;
    scoreElem.dispatchEvent(new Event("input"));
  });
}



// Decorate score sliders
$$("input.metric-score").forEach(elem => {
  const metricId = elem.closest("tr").id;

  const rangeElem = $(`.metric-score.${metricId}`);
  const outputElem = $(`.score-output.${metricId}`);
   
  const scaledWidth = weights[metricId] / maxWeight;
  rangeElem.style.width = `${scaledWidth * 100}%`;
  
  const obs = rxjs
    .fromEvent(rangeElem, "input")
    .pipe(rxjs.operators.startWith(rangeElem));

  scoreObsevers.push(obs);

  obs.subscribe(x => (outputElem.textContent = giveElement(x).value));
});

// On score slider change, update values (backwards direction!)
for (const obs of scoreObsevers) {
  obs.subscribe(eventOrElem => {
    if (isManuallyDispatched(eventOrElem)) return;
    const elem = giveElement(eventOrElem);
    
    const metricId = elem.closest("tr").id;
    let computedValue = Math.round(
      VALUE_AT_QUANTILE(
        scoring[metricId].median,
        scoring[metricId].falloff,
        elem.value / 100
      )
    );

    const valueElem = $(`input.${metricId}.metric-value`);
    if (computedValue === Infinity)
      valueElem.value = valueElem.max; 
    else 
      valueElem.value = computedValue; 
    valueElem.dispatchEvent(new Event("input"));
  });
}

// Compute the perf score
const perfScore = rxjs.combineLatest(...scoreObsevers).pipe(
  map(([...elems]) => {
    const items = elems.map(eventOrElem => {
      const elem = giveElement(eventOrElem);
      const metricId = elem.closest("tr").id;
      return { weight: weights[metricId], score: elem.value };
    });
    const weightedMean = arithmeticMean(items);
    return weightedMean;
  })
);

perfScore.subscribe(score => {
  const wrapper = $(".lh-gauge__wrapper");
  wrapper.className = "lh-gauge__wrapper"; // clear any other labels already set
  wrapper.classList.add(`lh-gauge__wrapper--${calculateRating(score / 100)}`);

  const gaugeArc = $(".lh-gauge-arc");
  gaugeArc.style.strokeDasharray = `${(score / 100) * 352} 352`;

  const scoreOutOf100 = Math.round(score);
  const percentageEl = $(".lh-gauge__percentage");
  percentageEl.textContent = scoreOutOf100.toString();
});
