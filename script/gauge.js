'use strict';

import {calculateRating} from './util.js';

export function updateGauge(container, category) {
  const wrapper = container.$('.lh-gauge__wrapper');
  wrapper.className = 'lh-gauge__wrapper'; // clear any other labels already set
  wrapper.classList.add(`lh-gauge__wrapper--${calculateRating(category.score)}`);

  _setPerfGaugeExplodey(wrapper, category);
}

/* NOTE IT consumes the basic score (which is 0-100) snot the category */
function _setPerfGaugeBasic(wrapper, score) {
  const gaugeArc = wrapper.$('.lh-gauge-arc');
  gaugeArc.style.strokeDasharray = `${(score / 100) * 352} 352`;

  const scoreOutOf100 = Math.round(score);
  const percentageEl = wrapper.$('.lh-gauge__percentage');
  percentageEl.textContent = scoreOutOf100.toString();
}


function determineTrig(sizeSVG, percent, strokeWidth) {
  strokeWidth = strokeWidth || (sizeSVG / 32);

  const radiusInner = 0.25 * sizeSVG;
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
    getGaugeArcLength:  _ => {
      return Math.max(0, +(percent * circumferenceInner - 2 * endDiffInner).toFixed(4));
    },
    endDiffInner,
    endDiffOuter,
    strokeWidth,
    strokeGap,
  }
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
    getGaugeArcLength,
    endDiffInner,
    endDiffOuter,
    strokeWidth,
    strokeGap,
  } = determineTrig(sizeSVG, percent);

  const SVG = wrapper.querySelector('.lh-gauge');
  const NS_URI = 'http://www.w3.org/2000/svg';

  SVG.setAttribute('viewBox', [offsetSVG, offsetSVG, sizeSVG, sizeSVG].join(' '));
  SVG.style.setProperty('--stroke-width', strokeWidth);
  SVG.style.setProperty('--circle-meas', 2 * Math.PI.toFixed(4));

  // build the mask
  const mask = wrapper.querySelector('#lh-gauge__mask');
  const maskVisible = document.createElementNS(NS_URI, 'path');
  const maskHidden = document.createElementNS(NS_URI, 'circle');

  // a path is the most compact way to cover the SVG area with a rectangle
  maskVisible.setAttribute('d', `M${offsetSVG}${offsetSVG}H${-offsetSVG}V${-offsetSVG}H${offsetSVG}`);
  // SVG masks are luninance masks => white = fully opaque, black = transparent
  maskVisible.setAttribute('fill', `#fff`);
  // default fill is black, no need to set it exlicitly on circle
  // any strok applied doesn't matter
  maskHidden.setAttribute('r', radiusInner + 0.5 * strokeWidth);
  maskHidden.classList.add('lh-gauge__cutout');

  mask.appendChild(maskVisible);
  mask.appendChild(maskHidden);

  const groupOuter = wrapper.querySelector('.lh-gauge__outer');
  const groupInner = wrapper.querySelector('.lh-gauge__inner');
  const cover = groupOuter.querySelector('.cover');
  const gaugeArc = groupInner.querySelector('.lh-gauge__arc');
  const gaugePerc = groupInner.querySelector('.lh-gauge__percentage');


  groupOuter.style.setProperty('--scale-initial', radiusInner / radiusOuter);
  groupOuter.style.setProperty('--radius', radiusOuter);
  cover.style.setProperty('--radius', 0.5 * (radiusInner + radiusOuter));
  cover.setAttribute('stroke-width', strokeGap);
  SVG.style.setProperty('--radius', radiusInner);

  gaugeArc.setAttribute('stroke-dasharray', `${getGaugeArcLength()} ${(circumferenceInner - getGaugeArcLength()).toFixed(4)}`);
  gaugeArc.setAttribute('stroke-dashoffset', 0.25 * circumferenceInner - endDiffInner);

  gaugePerc.textContent = Math.round(percent * 100);

  const radiusTextOuter = radiusOuter + strokeWidth;
  const radiusTextInner = radiusOuter - strokeWidth;

  const metrics = category.auditRefs.filter((r) => r.group === 'metrics' && r.weight);
  const totalWeight = metrics.reduce((sum, each) => (sum += each.weight), 0);
  let offsetAdder = 0.25 * circumferenceOuter - endDiffOuter - 0.5 * strokeGap;
  let angleAdder = -0.5 * Math.PI;

  metrics.forEach((metric, i) => {
    const metricGroup = document.createElementNS(NS_URI, 'g');
    const metricArcMax = document.createElementNS(NS_URI, 'circle');
    const metricArc = document.createElementNS(NS_URI, 'circle');
    const metricArcHoverTarget = document.createElementNS(NS_URI, 'circle');
    const metricLabel = document.createElementNS(NS_URI, 'text');
    const metricValue = document.createElementNS(NS_URI, 'text');

    // TODO: in scorecalc we dont use the real audit ID just the acronym.
    const alias = metric.id;

    metricGroup.classList.add('metric', `metric--${alias}`);
    metricArcMax.classList.add('lh-gauge__arc', 'lh-gauge__arc--metric', 'lh-gauge--faded');
    metricArc.classList.add('lh-gauge__arc', 'lh-gauge__arc--metric');
    metricArcHoverTarget.classList.add('lh-gauge__arc', 'lh-gauge__arc--metric', 'lh-gauge-hover');

    const weightingPct = metric.weight / totalWeight;
    const metricLengthMax = Math.max(0, +(weightingPct * circumferenceOuter - 2 * endDiffOuter - strokeGap).toFixed(4));
    const metricPercent = metric.result.score * weightingPct;
    const metricLength = Math.max(0, +(metricPercent * circumferenceOuter - 2 * endDiffOuter - strokeGap).toFixed(4));
    const metricOffset = weightingPct * circumferenceOuter;
    const metricHoverLength = Math.max(0, +(weightingPct * circumferenceOuter - 2 * endDiffOuter - strokeGap).toFixed(4));

    metricGroup.style.setProperty('--metric-color', `var(--palette-${i})`);
    metricGroup.style.setProperty('--metric-offset', `${offsetAdder}`);
    metricGroup.style.setProperty('--i', i);

    metricArcMax.setAttribute('stroke-dasharray', `${metricLengthMax} ${circumferenceOuter - metricLengthMax}`);
    metricArc.style.setProperty('--metric-array', `${metricLength} ${circumferenceOuter - metricLength}`);
    metricArcHoverTarget.style.setProperty('--metric-array', `${metricLength} ${circumferenceOuter - metricLength}`);

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

    metricGroup.appendChild(metricArcHoverTarget);
    metricGroup.appendChild(metricArcMax);
    metricGroup.appendChild(metricArc);
    metricGroup.appendChild(metricLabel);
    metricGroup.appendChild(metricValue);
    groupOuter.appendChild(metricGroup);

    offsetAdder -= metricOffset;
    angleAdder += weightingPct * 2 * Math.PI;
  });

  /*
    wrapper.state-expanded: gauge is exploded
    wrapper.state-highlight: gauge is exploded and one of the metrics is being highlighted
    metric.metric-highlight: highlight this particular metric

  */
  wrapper.addEventListener('mouseover', (e) => {

    // if hovering on the SVG and its expanded, get rid of everything
    if (e.target === SVG && wrapper.classList.contains('state--expanded')) {
      // paul: not sure why we want to remove this.. seems like we want to keep it expanded...
      wrapper.classList.remove('state--expanded');

      if (wrapper.classList.contains('state--highlight')) {
        wrapper.classList.remove('state--highlight');
        wrapper.querySelector('.metric--highlight').classList.remove('metric--highlight');
      }
      return;
    }

    const parent = e.target.parentNode;

    // if hovering on the primary (inner) part, then explode it but dont highlight
    if (parent && parent === groupInner) {
      if (!wrapper.classList.contains('state--expanded')) wrapper.classList.add('state--expanded');
      else if (wrapper.classList.contains('state--highlight')) {
        wrapper.classList.remove('state--highlight');
        wrapper.querySelector('.metric--highlight').classList.remove('metric--highlight');
      }
      return;
    }

    // if hovering on a metric, highlight that one.
    // TODO: The hover target is a little small. ideally it's thicker.
    if (parent && parent.classList && parent.classList.contains('metric')) {
      // match the bg color of the gauge during a metric highlight
      wrapper.style.setProperty('--color-highlight', `var(--palette-${parent.style.getPropertyValue('--i')})`);

      if (!wrapper.classList.contains('state--highlight')) {
        wrapper.classList.add('state--highlight');
        parent.classList.add('metric--highlight');
      } else {
        const highlighted = SVG.querySelector('.metric--highlight');

        if (parent !== highlighted) {
          highlighted.classList.remove('metric--highlight');
          parent.classList.add('metric--highlight');
        }
      }
    }
  });
}
