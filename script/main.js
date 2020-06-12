import { h, render, createRef, Component } from 'preact';
import { QUANTILE_AT_VALUE, VALUE_AT_QUANTILE } from './math.js';
import { $, NBSP, numberFormatter, calculateRating, arithmeticMean } from './util.js';
import { metrics, scoringGuides } from './metrics.js';
import { updateGauge } from './gauge.js';

const params = new URLSearchParams(location.hash.substr(1));

function determineMinMax(metricScoring) {
  const valueAtScore100 = VALUE_AT_QUANTILE(metricScoring, 0.995);
  const valueAtScore5 = VALUE_AT_QUANTILE(metricScoring, 0.05);

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

/**
 * @param {string} version
 */
function getMajorVersion(version) {
  return version.split('.')[0];
}

class Metric extends Component {
  onValueChange(e) {
    const {id} = this.props;

    this.props.app.setState({
      metricValues: {
        ...this.props.app.state.metricValues,
        [id]: e.target.valueAsNumber,
      },
    });
  }

  onScoreChange(e) {
    const {id, metricScoring} = this.props;

    const score = e.target.valueAsNumber;
    let computedValue = VALUE_AT_QUANTILE(metricScoring, score / 100);

    // Clamp because we can end up with Infinity
    const { min, max } = determineMinMax(metricScoring);
    computedValue = Math.max(Math.min(computedValue, max), min);

    if (metricScoring.units !== 'unitless') {
      computedValue = Math.round(computedValue);
    }

    this.props.app.setState({
      metricValues: {
        ...this.props.app.state.metricValues,
        [id]: computedValue,
      },
    });
  }

  render({ id, value, score, weightMax, metricScoring }) {
    const { min, max, step } = determineMinMax(metricScoring, id);
    const weight = metricScoring.weight;
    const valueFormatted = metricScoring.units === 'unitless' ?
      value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) :
      // TODO: Use https://github.com/tc39/proposal-unified-intl-numberformat#i-units when Safari/FF support it
      `${numberFormatter.format(value)}${NBSP}ms`;
    const weightFormatted = (weight * 100).toLocaleString(undefined, {maximumFractionDigits: 1});

    return <tr class={`lh-metric--${calculateRating(score / 100)}`}>
      <td>
        <span class="lh-metric__score-icon"></span>
      </td>
      <td>{`${id} (${metricScoring.name})`}</td>
      <td>
        <input type="range" min={min} value={value} max={max} step={step} class={`${id} metric-value`} onInput={(e) => this.onValueChange(e)} />
        <output class="${id} value-output">{valueFormatted}</output>
      </td>
      <td></td>

      <td>
        <input type="range" class={`${id} metric-score`} style={`width: ${weight / weightMax * 100}%`} value={score} onInput={(e) => this.onScoreChange(e)} />
        <output class={`${id} score-output`}>{score}</output>
      </td>

      <td>
        <span class={`${id} weight-text`}>{weightFormatted}%</span>
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
          <svg class='lh-gauge state--expanded'>
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
  render({ app, name, values, scoring }) {
    // Make sure weights total to 1
    const weights = Object.values(scoring).map(metricScoring => metricScoring.weight);
    const weightSum = weights.reduce((agg, val) => (agg += val));
    const weightMax = Math.max(...Object.values(weights));
    console.assert(weightSum > 0.999 && weightSum < 1.0001); // lol rounding is hard.

    const metricsData = Object.keys(scoring).map(id => {
      const metricScoring = scoring[id];
      return {
        id,
        metricScoring,
        value: values[id],
        score: Math.round(QUANTILE_AT_VALUE(metricScoring, values[id]) * 100),
      };
    });

    const auditRefs = metricsData.map(metric => {
      return {
        id: metric.id,
        weight: metric.metricScoring.weight,
        group: 'metrics',
        result: {
          score: metric.score / 100,
        },
      };
    });

    const score = arithmeticMean(auditRefs);

    let title = <h2>{name}</h2>;
    if (name === 'v6') {
      title = <h2><a href="https://github.com/GoogleChrome/lighthouse/releases/tag/v6.0.0" target="_blank">v6</a></h2>;
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
          {metricsData.map(metric => {
            return <Metric app={app} weightMax={weightMax} metricScoring={metric.metricScoring} {...metric}></Metric>
          })}
        </tbody>
      </table>

      <div class="perfscore">
        <Gauge score={score} auditRefs={auditRefs}></Gauge>
      </div>
    </form>
  }
}

const debounce = (callback, time = 250, interval) =>
  ((...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => callback(...args), time);
  });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();
    this.onDeviceChange = this.onDeviceChange.bind(this);
    this.onVersionsChange = this.onVersionsChange.bind(this);
  }

  componentDidUpdate() {
    const {versions, device, metricValues} = this.state;

    // debounce just a tad, as its noisy
    debounce(_ => {
      const url = new URL(location.href);
      const auditIdValuePairs = Object.entries(metricValues).map(([id, value]) => {
        return [id, value];
      });
      const params = new URLSearchParams(auditIdValuePairs);
      params.set('device', device);
      for (const version of versions) params.append('version', version);
      url.hash = params.toString();
      history.replaceState(this.state, '', url.toString());
    })();
  }

  onDeviceChange(e) {
    this.setState({device: e.target.value});
  }

  onVersionsChange(e) {
    this.setState({versions: e.target.value.split(',')});
  }

  render() {
    const {versions, device, metricValues} = this.state;

    const scoringGuideEls = versions.map(version => {
      const key = `v${version}`;
      return <ScoringGuide app={this} name={key} values={metricValues} scoring={scoringGuides[key][device]}></ScoringGuide>;
    });
    return <div class="app">
      <div class="controls wrapper">
        <label>Device type:
          <select name="device" value={device} onChange={this.onDeviceChange} >
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
          </select>
        </label>
        <label>Versions:
          <select name="versions" value={versions.sort().reverse().join(',')} onChange={this.onVersionsChange} >
            <option value="6,5">show all</option>
            <option value="6">v6</option>
            <option value="5">v5</option>
          </select>
        </label>
      </div>
      {scoringGuideEls}
    </div>
  }
}

function getInitialState() {
  // Default to 6 and 5.
  const versions = params.has('version') ?
    params.getAll('version').map(getMajorVersion) :
    ['6', '5'];

  // Default to mobile if it's not matching our known emulatedFormFactors. https://github.com/GoogleChrome/lighthouse/blob/master/types/externs.d.ts#:~:text=emulatedFormFactor
  let device = params.get('device');
  if (device && device !== 'mobile' && device !== 'desktop') {
    console.warn(`Invalid emulatedFormFactors value: ${device}. Fallback to mobile scoring.`);
    device = 'mobile';
  } else if (!device) {
    // Device not expressed in the params
    device = 'mobile';
  }

  // Set defaults as median.
  const metricValues = {};
  const metricScorings = {...scoringGuides.v6.desktop, ...scoringGuides.v5.desktop};
  for (const id in metricScorings) {
    metricValues[id] = metricScorings[id].median;
  }

  // Load from query string.
  for (const [id, metric] of Object.entries(metrics)) {
    const value = params.get(id) || params.get(metric.auditId);
    if (value === undefined) continue;
    metricValues[id] = Number(value);
  }

  return {
    versions,
    device,
    metricValues,
  };;
}

function main() {
  render(<App></App>, $('#container'));
}

// just one call to main because i'm basic like that
main();
