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

/* global Rx */

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

// make sure weights total to 1
const sum = Object.values(weights).reduce((agg, val) => (agg += val));
console.assert(sum === 1);

const maxWeight = Math.max(...Object.values(weights));
const scoreObservers = [];
// set up observables
for (const metricRow of $$("tbody tr")) {
  const metricId = metricRow.id;
 
  for (const type of ["value", "score"]) {
    const rangeElem = $(`.metric-${type}.${metricId}`);
    const outputElem = $(`.${type}-output.${metricId}`);

    const rangeValueObsr = Rx.Observable.fromEvent(rangeElem, "input")
      .map(ev => ev.target.value)
      .startWith(rangeElem.value);
    
    if (type === 'score') {
      scoreObservers.push(rangeValueObsr);
    }

    rangeValueObsr.subscribe(x => (outputElem.textContent = x));
  }
} 

const perfScore = weight.combineLatest(...scoreObservers, (w, h) =>
  (w / (h * h * 0.0001)).toFixed(1)
);



// for (const [metricId, weight] of Object.entries(weights)) {
//   const meterElem = $(`meter.${metricId}`);
//   meterElem.style.width = `${(weight / maxWeight) * 100}%`;
// }
