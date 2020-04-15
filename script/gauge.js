'use strict';

import {calculateRating} from './util.js';


export function updateGauge(container, score) {
  const wrapper = container.$('.lh-gauge__wrapper');
  wrapper.className = 'lh-gauge__wrapper'; // clear any other labels already set
  wrapper.classList.add(`lh-gauge__wrapper--${calculateRating(score / 100)}`);

  const gaugeArc = container.$('.lh-gauge-arc');
  gaugeArc.style.strokeDasharray = `${(score / 100) * 352} 352`;

  const scoreOutOf100 = Math.round(score);
  const percentageEl = container.$('.lh-gauge__percentage');
  percentageEl.textContent = scoreOutOf100.toString();
}
