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

const maxWeight = Math.max(...Object.values(weights));
const scoreObservers = {};
const valueObservers = {};
const map = rxjs.operators.map;

// set up observables
for (const metricRow of $$("tbody tr")) {
  const metricId = metricRow.id;

  for (const type of ["value", "score"]) {
    const rangeElem = $(`.metric-${type}.${metricId}`);
    const outputElem = $(`.${type}-output.${metricId}`);

    const rangeValueObsr = rxjs
      .fromEvent(rangeElem, "input")
      .pipe(map(ev => ev.target.value))
      .pipe(rxjs.operators.startWith(rangeElem));

    if (type === "score") {
      scoreObservers[`${metricId}score`] = rangeValueObsr;
    } else if (type === "value") {
      valueObservers[`${metricId}val`] = rangeValueObsr;

    }

    rangeValueObsr.subscribe(x => (outputElem.textContent = x));
  }
}

// this is so lame and there's gotta be a better way.
const { FCPscore, SIscore, LCPscore, TTIscore, TBTscore  } = scoreObservers;
const perfScore = rxjs
  .combineLatest(FCPscore, SIscore, LCPscore, TTIscore, TBTscore )
  .pipe(
    map(([FCP, SI, LCP, TTI, TBT]) => {
      const weightedMean = arithmeticMean([
        { weight: weights["FCP"], score: FCP },
        { weight: weights["SI"], score: SI },
        { weight: weights["LCP"], score: LCP },
        { weight: weights["TTI"], score: TTI },
        { weight: weights["TBT"], score: TBT }
      ]);
      return Math.round(weightedMean);
    })
  );

perfScore.subscribe(x => ($("h3 output").textContent = x));
perfScore.subscribe(x => ($(".perf-score").value = x));

// for (const [metricId, weight] of Object.entries(weights)) {
//   const meterElem = $(`meter.${metricId}`);
//   meterElem.style.width = `${(weight / maxWeight) * 100}%`;
// }
