'use strict';

/* Most of the impressive code here authored by Ana Tudor, Nov 2019 */

import {calculateRating} from './util.js';

const delay = delay => new Promise(resolve => setTimeout(resolve, delay));

export function updateGauge(wrapper, category) {
  _setPerfGaugeExplodey(wrapper, category);
}

function _determineTrig(sizeSVG, percent, strokeWidth) {
  strokeWidth = strokeWidth || sizeSVG / 32;

  const radiusInner = sizeSVG / strokeWidth;
  const strokeGap = 0.5 * strokeWidth;
  const radiusOuter = radiusInner + strokeGap + strokeWidth;

  const circumferenceInner = 2 * Math.PI * radiusInner;
  // arc length we need to subtract
  // for very small strokeWidth:radius ratios this is ≈ strokeWidth
  // angle = acute angle of isosceles △ with 2 edges equal to radius & 3rd equal to strokeWidth
  // angle formula given by law of cosines
  const endDiffInner = Math.acos(1 - 0.5 * Math.pow((0.5 * strokeWidth) / radiusInner, 2)) * radiusInner;

  const circumferenceOuter = 2 * Math.PI * radiusOuter;
  const endDiffOuter = Math.acos(1 - 0.5 * Math.pow((0.5 * strokeWidth) / radiusOuter, 2)) * radiusOuter;

  return {
    radiusInner,
    radiusOuter,
    circumferenceInner,
    circumferenceOuter,
    getArcLength: _ => Math.max(0, +(percent * circumferenceInner - 2 * endDiffInner).toFixed(4)),
    // isButt case is for metricArcHoverTarget
    getMetricArcLength: (weightingPct, isButt) => {
      // TODO: this math isn't perfect butt it's very close.
      const linecapFactor = isButt ? 0 : 2 * endDiffOuter;
      return Math.max(0, +(weightingPct * circumferenceOuter - strokeGap - linecapFactor).toFixed(4));
    },
    endDiffInner,
    endDiffOuter,
    strokeWidth,
    strokeGap,
  };
}

/**
 * @param {HTMLAnchorElement} wrapper
 * @param {LH.ReportResult.Category} category
 */
function _setPerfGaugeExplodey(wrapper, category) {
  const sizeSVG = 128;
  const offsetSVG = -0.5 * sizeSVG;

  const percent = Number(category.score);
  const {
    radiusInner,
    radiusOuter,
    circumferenceInner,
    circumferenceOuter,
    getArcLength,
    getMetricArcLength,
    endDiffInner,
    endDiffOuter,
    strokeWidth,
    strokeGap,
  } = _determineTrig(sizeSVG, percent);

  const SVG = wrapper.querySelector('.lh-gauge');
  const NS_URI = 'http://www.w3.org/2000/svg';

  SVG.setAttribute('viewBox', [offsetSVG, offsetSVG, sizeSVG, sizeSVG].join(' '));
  SVG.style.setProperty('--stroke-width', `${strokeWidth}px`);
  SVG.style.setProperty('--circle-meas', 2 * Math.PI.toFixed(4));

  const groupOuter = wrapper.querySelector('.lh-gauge__outer');
  const groupInner = wrapper.querySelector('.lh-gauge__inner');
  const cover = groupOuter.querySelector('.cover');
  const gaugeArc = groupInner.querySelector('.lh-gauge__arc');
  const gaugePerc = groupInner.querySelector('.lh-gauge__percentage');

  groupOuter.style.setProperty('--scale-initial', radiusInner / radiusOuter);
  groupOuter.style.setProperty('--radius', `${radiusOuter}px`);
  cover.style.setProperty('--radius', `${0.5 * (radiusInner + radiusOuter)}px`);
  cover.setAttribute('stroke-width', strokeGap);
  SVG.style.setProperty('--radius', `${radiusInner}px`);

  gaugeArc.setAttribute('stroke-dasharray', `${getArcLength()} ${(circumferenceInner - getArcLength()).toFixed(4)}`);
  gaugeArc.setAttribute('stroke-dashoffset', 0.25 * circumferenceInner - endDiffInner);

  gaugePerc.textContent = Math.round(percent * 100);

  const radiusTextOuter = radiusOuter + strokeWidth;
  const radiusTextInner = radiusOuter - strokeWidth;

  const metrics = category.auditRefs.filter(r => r.group === 'metrics' && r.weight);
  const totalWeight = metrics.reduce((sum, each) => (sum += each.weight), 0);
  let offsetAdder = 0.25 * circumferenceOuter - endDiffOuter - 0.5 * strokeGap;
  let angleAdder = -0.5 * Math.PI;

  // Extra hack on top of the HACK for element reuse below. Delete any metric elems that aren't needed anymore (happens when the same gauge goes from v5 to v6)
  groupOuter.querySelectorAll('.metric').forEach(metricElem => {
    const classNamesToRetain = metrics.map(metric => `metric--${metric.id}`);
    const match = classNamesToRetain.find(selector => metricElem.classList.contains(selector));
    if (!match) metricElem.remove();
  });

  metrics.forEach((metric, i) => {
    // TODO(porting to real LHR..): in scorecalc we dont use the real audit ID just the acronym.
    const alias = metric.id;

    // Hack
    const needsDomPopulation = !groupOuter.querySelector(`.metric--${alias}`);

    // HACK:This isn't ideal but it was quick. Create element during initialization or reuse existing during updates
    const metricGroup = groupOuter.querySelector(`.metric--${alias}`) || document.createElementNS(NS_URI, 'g');
    const metricArcMax = groupOuter.querySelector(`.metric--${alias} .lh-gauge--faded`) || document.createElementNS(NS_URI, 'circle');
    const metricArc = groupOuter.querySelector(`.metric--${alias} .lh-gauge--miniarc`) || document.createElementNS(NS_URI, 'circle');
    const metricArcHoverTarget = groupOuter.querySelector(`.metric--${alias} .lh-gauge-hovertarget`) || document.createElementNS(NS_URI, 'circle');
    const metricLabel = groupOuter.querySelector(`.metric--${alias} .metric__label`) || document.createElementNS(NS_URI, 'text');
    const metricValue = groupOuter.querySelector(`.metric--${alias} .metric__value`) || document.createElementNS(NS_URI, 'text');

    metricGroup.classList.add('metric', `metric--${alias}`);
    metricArcMax.classList.add('lh-gauge__arc', 'lh-gauge__arc--metric', 'lh-gauge--faded');
    metricArc.classList.add('lh-gauge__arc', 'lh-gauge__arc--metric', 'lh-gauge--miniarc');
    metricArcHoverTarget.classList.add('lh-gauge__arc', 'lh-gauge__arc--metric', 'lh-gauge-hovertarget');

    const weightingPct = metric.weight / totalWeight;
    const metricLengthMax = getMetricArcLength(weightingPct);
    const metricPercent = metric.result.score * weightingPct;
    const metricLength = getMetricArcLength(metricPercent);
    const metricOffset = weightingPct * circumferenceOuter;
    const metricHoverLength = getMetricArcLength(weightingPct, true);

    metricGroup.style.setProperty('--metric-color', `var(--palette-${i})`);
    metricGroup.style.setProperty('--metric-offset', `${offsetAdder}`);
    metricGroup.style.setProperty('--i', i);

    metricArcMax.setAttribute('stroke-dasharray', `${metricLengthMax} ${circumferenceOuter - metricLengthMax}`);
    metricArc.style.setProperty('--metric-array', `${metricLength} ${circumferenceOuter - metricLength}`);
    metricArcHoverTarget.setAttribute('stroke-dasharray', `${metricHoverLength} ${circumferenceOuter - metricHoverLength - endDiffOuter}`);

    metricLabel.classList.add('metric__label');
    metricValue.classList.add('metric__value');
    metricLabel.textContent = alias;
    metricValue.textContent = `+${Math.round(metricPercent * 100)}`;

    const midAngle = angleAdder + weightingPct * Math.PI;
    const cos = Math.cos(midAngle);
    const sin = Math.sin(midAngle);

    // only set non-default alignments
    switch (true) {
      case cos > 0:
        metricValue.setAttribute('text-anchor', 'end');
        break;
      case cos < 0:
        metricLabel.setAttribute('text-anchor', 'end');
        break;
      case cos === 0:
        metricLabel.setAttribute('text-anchor', 'middle');
        metricValue.setAttribute('text-anchor', 'middle');
        break;
    }

    switch (true) {
      case sin > 0:
        metricLabel.setAttribute('dominant-baseline', 'hanging');
        break;
      case sin < 0:
        metricValue.setAttribute('dominant-baseline', 'hanging');
        break;
      case sin === 0:
        metricLabel.setAttribute('dominant-baseline', 'middle');
        metricValue.setAttribute('dominant-baseline', 'middle');
        break;
    }

    metricLabel.setAttribute('x', (radiusTextOuter * cos).toFixed(2));
    metricLabel.setAttribute('y', (radiusTextOuter * sin).toFixed(2));
    metricValue.setAttribute('x', (radiusTextInner * cos).toFixed(2));
    metricValue.setAttribute('y', (radiusTextInner * sin).toFixed(2));

    if (needsDomPopulation) {
      metricGroup.appendChild(metricArcMax);
      metricGroup.appendChild(metricArc);
      metricGroup.appendChild(metricArcHoverTarget);
      metricGroup.appendChild(metricLabel);
      metricGroup.appendChild(metricValue);
      groupOuter.appendChild(metricGroup);
    }

    offsetAdder -= metricOffset;
    angleAdder += weightingPct * 2 * Math.PI;
  });

  // Catch pointerover movement between the hovertarget arcs. Without this the metric-highlights can clear when moving between.
  const underHoverTarget = groupOuter.querySelector(`.lh-gauge-underhovertarget`) || document.createElementNS(NS_URI, 'circle');
  underHoverTarget.classList.add('lh-gauge__arc', 'lh-gauge__arc--metric', 'lh-gauge-hovertarget', 'lh-gauge-underhovertarget');
  const underHoverLength = getMetricArcLength(1, true);
  underHoverTarget.setAttribute('stroke-dasharray', `${underHoverLength} ${circumferenceOuter - underHoverLength - endDiffOuter}`);
  if (!underHoverTarget.isConnected) {
    groupOuter.prepend(underHoverTarget);
  }

  // Hack. Not ideal.
  if (SVG.dataset.listenersSetup) return;
  SVG.dataset.listenersSetup = true;

  peekGauge(SVG);

  /*
    wrapper.state-expanded: gauge is exploded
    wrapper.state-highlight: gauge is exploded and one of the metrics is being highlighted
    metric.metric-highlight: highlight this particular metric
  */
  SVG.addEventListener('pointerover', e => {
    console.log(e.target);

    // If hovering outside of the arcs, reset back to unexploded state
    if (e.target === SVG && SVG.classList.contains('state--expanded')) {
      SVG.classList.remove('state--expanded');

      if (SVG.classList.contains('state--highlight')) {
        SVG.classList.remove('state--highlight');
        SVG.querySelector('.metric--highlight').classList.remove('metric--highlight');
      }
      return;
    }

    const parent = e.target.parentNode;

    // if hovering on the primary (inner) part, then explode it but dont highlight
    if (parent && parent === groupInner) {
      if (!SVG.classList.contains('state--expanded')) SVG.classList.add('state--expanded');
      else if (SVG.classList.contains('state--highlight')) {
        SVG.classList.remove('state--highlight');
        SVG.querySelector('.metric--highlight').classList.remove('metric--highlight');
      }
      return;
    }

    // if hovering on a metric, highlight that one.
    // TODO: The hover target is a little small. ideally it's thicker.
    if (parent && parent.classList && parent.classList.contains('metric')) {
      // match the bg color of the gauge during a metric highlight
      wrapper.style.setProperty('--color-highlight', `var(--palette-${parent.style.getPropertyValue('--i')})`);

      if (!SVG.classList.contains('state--highlight')) {
        SVG.classList.add('state--highlight');
        parent.classList.add('metric--highlight');
      } else {
        const highlighted = SVG.querySelector('.metric--highlight');

        if (parent !== highlighted) {
          highlighted.classList.remove('metric--highlight');
          parent.classList.add('metric--highlight');
          console.log({highlighted, parent});
        }
      }
    }
  });

  // clear on mouselave even if mousemove didn't catch it.
  SVG.addEventListener('mouseleave', e => {
    // SVG.classList.remove('state--expanded');
    SVG.classList.remove('state--highlight');
    const mh = SVG.querySelector('.metric--highlight');
    mh && mh.classList.remove('metric--highlight');
  });

  // On the first run, tease with a little peek reveal
  async function peekGauge(SVG) {
    // Delay just a tad to let the user aclimatize beforehand.
    await delay(1000);

    // Early exit if it's already engaged
    if (SVG.classList.contains('state--expanded')) return;

    // To visually get the outer ring to peek on the edge, we need the inner ring on top. This is SVG's equivalent to `innerElem.zIndex = 100`
    const inner = SVG.querySelector('.lh-gauge__inner');
    let id = `uniq-${Math.random()}`;
    inner.setAttribute('id', id);
    const useElem = document.createElementNS(NS_URI, 'use');
    useElem.setAttribute('href', `#${id}`);
    // for paint order this must come _after_ the outer.
    SVG.appendChild(useElem);

    const peekDurationSec = 2.5;
    SVG.style.setProperty('--peek-dur', `${peekDurationSec}s`);
    SVG.classList.add('state--peek', 'state--expanded');

    // Fancy double cleanup
    const cleanup = _ => SVG.classList.remove('state--peek', 'state--expanded') || useElem.remove();
    const tId = setTimeout(_ => {
      SVG.removeEventListener('mouseenter', handleEarlyInteraction);
      cleanup();
    }, peekDurationSec * 1000 * 1.5); // lil extra time just cuz
    function handleEarlyInteraction() {
      clearTimeout(tId);
      cleanup();
    }
    SVG.addEventListener('mouseenter', handleEarlyInteraction, {once: true});
  }
}
