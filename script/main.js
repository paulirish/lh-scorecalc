import { h, render, createRef, Component } from 'preact';
import { QUANTILE_AT_VALUE, VALUE_AT_QUANTILE } from './math.js';
import { $, calculateRating, arithmeticMean } from './util.js';
import { weights as WEIGHTS, scoring, weights } from './metrics.js';
import { updateGauge } from './gauge.js';

function determineMinMax(metricId) {
  const metricScoring = scoring[metricId];

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

  let min = Math.floor(valueAtScore100 / 1000) * 1000;
  let max = Math.ceil(valueAtScore5 / 1000) * 1000;
  let step = 10;

  // Special handling for CLS
  if (metricScoring.units === 'unitless') {
    min = 0;
    max = Math.ceil(valueAtScore5 * 100) / 100;
    step = 0.01;
  }

  return {
    min,
    max,
    step,
  };
}

class Metric extends Component {
  onValueChange(e, id) {
    this.props.app.setState({
      [id]: e.target.valueAsNumber,
    });
  }

  onScoreChange(e, id) {
    const score = e.target.valueAsNumber;
    const metricScoring = scoring[id];
    let computedValue = VALUE_AT_QUANTILE(metricScoring.median, metricScoring.falloff, score / 100);

    // Clamp because we can end up with Infinity
    const { min, max } = determineMinMax(id);
    computedValue = Math.max(Math.min(computedValue, max), min);

    this.props.app.setState({
      [id]: Math.round(computedValue),
    });
  }

  render({ id, value, weight, maxWeight, score }) {
    const { min, max, step } = determineMinMax(id);
    const name = scoring[id].name;

    return <tr class={`lh-metric--${calculateRating(score / 100)}`}>
      <td>
        <span class="lh-metric__score-icon"></span>
      </td>
      <td>{`${id} (${name})`}</td>
      <td>
        <input type="range" min={min} value={value} max={max} step={step} class={`${id} metric-value`} onInput={(e) => this.onValueChange(e, id)} />
        <output class="${id} value-output">{value}</output>
      </td>
      <td></td>

      <td>
        <input type="range" class={`${id} metric-score`} style={`width: ${weight / maxWeight * 100}%`} value={score} onInput={(e) => this.onScoreChange(e, id)} />
        <output class={`${id} score-output`}>{score}</output>
      </td>

      <td>
        <span class={`${id} weight-text`}>{Math.round(weight * 10000) / 100}%</span>
      </td>
    </tr>
  }
}

class Gauge extends Component {
  constructor(props) {
    super(props);
    this.ref = createRef();
  }

  refreshGauge() {
    updateGauge(this.ref.current, {
      title: 'Performance',
      auditRefs: this.props.auditRefs,
      id: 'performance',
      score: this.props.score,
    });
  }

  componentDidMount() {
    this.refreshGauge();
  }

  componentDidUpdate() {
    this.refreshGauge();
  }

  render({ score }) {
    return (
      <div ref={this.ref} class={`lh-gauge__wrapper lh-gauge__wrapper--${calculateRating(score)}`}>
        <div class='lh-gauge__svg-wrapper'>
          <svg class='lh-gauge'>
            <g class='lh-gauge__inner'>
              <circle class='lh-gauge__bg' />
              <circle class='lh-gauge__base lh-gauge--faded' />
              <circle class='lh-gauge__arc' />
              <text class='lh-gauge__percentage'></text>
            </g>
            <g class='lh-gauge__outer'>
              <circle class='cover' />
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

class ScoringGuide extends Component {
  render({ app, name, values, weights }) {
    // Make sure weights total to 1
    const weightSum = Object.values(weights).reduce((agg, val) => (agg += val));
    console.assert(weightSum > 0.999 && weightSum < 1.0001); // lol rounding is hard.

    const metrics = Object.keys(weights).map(id => {
      const metricScoring = scoring[id];
      return {
        id,
        weight: weights[id],
        value: values[id],
        score: Math.round(QUANTILE_AT_VALUE(metricScoring.median, metricScoring.falloff, values[id]) * 100),
      };
    });

    const auditRefs = metrics.map(metric => {
      return {
        id: metric.id,
        weight: metric.weight,
        group: 'metrics',
        result: {
          score: metric.score / 100,
        },
      };
    });

    const score = arithmeticMean(auditRefs);
    const maxWeight = Math.max(...Object.values(weights));

    let title = <h2>{name}</h2>;
    if (name === 'v6') {
      title = <h2>v6<i><a href="https://github.com/GoogleChrome/lighthouse/releases/tag/v6.0.0-beta.0">beta.0</a></i></h2>;
    }

    return <form class="wrapper">
      {title}

      <table>
        <thead>
          <tr>
            <th class="th--metric" colspan="2"></th>
            <th class="th--value">Value</th>
            <th class="th--spacer"></th>
            <th class="th--score">Metric Score</th>
            <th class="th--weight">Weighting</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map(metric => {
            return <Metric app={app} maxWeight={maxWeight} {...metric}></Metric>
          })}
        </tbody>
      </table>

      <div class="perfscore">
        <Gauge score={score} auditRefs={auditRefs}></Gauge>
      </div>
    </form>
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    for (const id in scoring) {
      this.state[id] = scoring[id].median;
    }
  }

  render() {
    return <div>
      <ScoringGuide app={this} name="v6" values={this.state} weights={WEIGHTS.v6}></ScoringGuide>
      <ScoringGuide app={this} name="v5" values={this.state} weights={WEIGHTS.v5}></ScoringGuide>
    </div>
  }
}

function main2() {
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
  render(<App></App>, $('#container'));
}

// just one call to main because i'm basic like that
main2();
