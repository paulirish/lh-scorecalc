console.clear();

// blingjs
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
Node.prototype.on = window.on = function(name, fn) {
  this.addEventListener(name, fn);
};
NodeList.prototype.__proto__ = Array.prototype;
NodeList.prototype.on = NodeList.prototype.addEventListener = function(
  name,
  fn
) {
  this.forEach(function(elem, i) {
    elem.on(name, fn);
  });
};

const NBSP = '\xa0';
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

/* global rxjs */

// BMI Calculator
// const weight = Rx.Observable.fromEvent(weightSliderElem, "input")
//   .map(ev => ev.target.value)
//   .startWith(weightSliderElem.value);

// const height = Rx.Observable.fromEvent(heightSliderElem, "input")
//   .map(ev => ev.target.value)
//   .startWith(heightSliderElem.value);

// const bmi = weight.combineLatest(height, (w, h) =>
//   (w / (h * h * 0.0001)).toFixed(1)
// );

// // set meter defaults
// $$('meter table').forEach(elem => {
//   elem.min = 0;
//   elem.max = 1;
//   elem.low = .5;
//   elem.high = .9;
//   elem.optimum = 0.9
// })

$$("span.meter").forEach(elem => {
  const inner = document.createElement("span");
  inner.classList.add("meter__inner");
  elem.append(inner);
});

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
const sum = Object.values(weights).reduce((agg, val) => (agg += val));
console.assert(sum === 1);

// The observables are initiated (via startWith) an element, but after that they get events. This normalizes.
const giveElement = eventOrElem =>
  eventOrElem instanceof Event ? eventOrElem.target : eventOrElem;

const maxWeight = Math.max(...Object.values(weights));

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
  console.log({ valueAtScore100, min, valueAtScoreZero, max });

  elem.min = min;
  elem.max = max;
  elem.value = Math.random() * (max - min) + min;
  
  
  const outputElem = $(`.value-output.${metricId}`);
  const obs = rxjs
    .fromEvent(elem, "input")
    .pipe(rxjs.operators.startWith(elem));

  valueObservers.push(obs);

  obs.subscribe(x => {
    outputElem.textContent = `${numberFormatter.format(giveElement(x).value)}${NBSP}ms`;
  });
});



// Calibrate value slider scales
$$("input.metric-score").forEach(elem => {
  const metricId = elem.closest("tr").id;
  
  const rangeElem = $(`.metric-score.${metricId}`);
  const outputElem = $(`.score-output.${metricId}`);

  const obs = rxjs
    .fromEvent(rangeElem, "input")
    .pipe(rxjs.operators.startWith(rangeElem));

  scoreObsevers.push(obs);

  obs.subscribe(x => (outputElem.textContent = giveElement(x).value));
});


// On value change, set score value
for (const obs of valueObservers) {
  obs.subscribe(eventOrElem => {
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

// Compute the perf score
const perfScore = rxjs.combineLatest(...scoreObsevers).pipe(
  map(([...elems]) => {
    const items = elems.map(eventOrElem => {
      const elem = giveElement(eventOrElem);
      const metricId = elem.closest("tr").id;
      return { weight: weights[metricId], score: elem.value };
    });
    const weightedMean = arithmeticMean(items);
    return Math.round(weightedMean);
  })
);

perfScore.subscribe(x => ($("h3 output").textContent = x));
perfScore.subscribe(x => ($(".perf-score").value = x));

// for (const [metricId, weight] of Object.entries(weights)) {
//   const meterElem = $(`meter.${metricId}`);
//   meterElem.style.width = `${(weight / maxWeight) * 100}%`;
// }
