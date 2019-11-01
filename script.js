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


// BMI Calculator
const weightSliderElem = $("#weight-slider");
const heightSliderElem = $("#height-slider");

const weightTextElem = $("#weight-text");
const heightTextElem = $("#height-text");

const bmiTextElem = $("#bmi-text");

const weight = Rx.Observable.fromEvent(weightSliderElem, "input")
  .map(ev => ev.target.value)
  .startWith(weightSliderElem.value);

const height = Rx.Observable.fromEvent(heightSliderElem, "input")
  .map(ev => ev.target.value)
  .startWith(heightSliderElem.value);

const bmi = weight.combineLatest(height, (w, h) =>
  (w / (h * h * 0.0001)).toFixed(1)
);

// Observers
const weightObserver = x => (weightTextElem.textContent = x);
const heightObserver = x => (heightTextElem.textContent = x);
const bmiObserver = x => (bmiTextElem.textContent = x);

// Subscriptions
weight.subscribe(weightObserver);
height.subscribe(heightObserver);
bmi.subscribe(bmiObserver);



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

// hook up observables
for (const [metricId, weight] of Object.entries(weights)) {
  
  const rangeElem = $(`.metric-value.${metricId}`);
  const outputElem = $(`.value-output.${metricId}`);
  
   const metricValue = Rx.Observable.fromEvent(rangeElem, "input")
  .map(ev => ev.target.value)
  .startWith(rangeElem.value);
  
  const observer = x => (outputElem.textContent = x);
  
  metricValue.subscribe(observer);
}

for (const [metricId, weight] of Object.entries(weights)) {
  const meterElem = $(`meter.${metricId}`);
  meterElem.style.width = `${(weight / maxWeight) * 100}%`;
  
  
 

  
}

function calculate(baseline, newvalue) {
  const difference = Math.abs(newvalue - baseline);

  return {
    fasterPct: (difference / newvalue) * 100,
    fasterX: difference / newvalue + 1,
    lessTimePct: (difference / baseline) * 100,

    // speedOfPct: newvalue / newvalue * 100,
    // speedOfX:   newvalue / newvalue,
    //factorFaster,

    baseline,
    newvalue
  };
}
function interpolate(values) {
  // round decimal places
  Object.keys(values).forEach(key => {
    values[key] = values[key].toLocaleString(undefined, {
      maximumFractionDigits: 2
    });
  });
  const val = values;

  let str = `
        You're now <strong id="faster">${val.fasterPct}% faster</strong> .
        You're now <strong id="fasterX">${val.fasterX}✕ faster</strong>.
        You now spend <strong id="lessTime">${val.lessTimePct}% less time </strong> than before.
      `;
  // The new duration is <strong id="speedOfX">${val.speedOfX} times faster</strong>  before.
  // The new duration (<b>${val.newvalue}</b>) is <strong id="speedOf">${val.speedOfPct}%</strong> of the baseline (<b>${val.baseline}</b>).a
  // The new speed (<b>${val.newvalue}</b>) is greater than the baseline (<b>${val.baseline}</b>) by a factor of <strong id="factor">${val.factorFaster}</strong>.
  str = "<p>" + str.split(/\n/).join("<p>");
  return str;
}
var listeneraddedtobaseline = false;
function run() {
  const baseline = $("#baseline").value;
  const newvalue = $("#newvalue").value;

  const values = calculate(baseline, newvalue);
  const str = interpolate(values);
  $("#calculatorResults").innerHTML = str;

  $("#results").classList.add("open");
  $("#calculatorContainer").classList.add("submitted");
  if (!listeneraddedtobaseline) {
    listeneraddedtobaseline = true;
    $("#baseline").addEventListener("keyup", run);
  }
}
$("#newvalue").addEventListener("keyup", run);
$("form").addEventListener("submit", e => {
  e.preventDefault();
  run();
});
