var n,u,i,t,r,o,f,e={},c=[],s=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;function a(n,l){for(var u in l){ n[u]=l[u]; }return n}function v(n){var l=n.parentNode;l&&l.removeChild(n);}function h(n,l,u){var i,t=arguments,r={};for(i in l){ "key"!==i&&"ref"!==i&&(r[i]=l[i]); }if(arguments.length>3){ for(u=[u],i=3;i<arguments.length;i++){ u.push(t[i]); } }if(null!=u&&(r.children=u),"function"==typeof n&&null!=n.defaultProps){ for(i in n.defaultProps){ void 0===r[i]&&(r[i]=n.defaultProps[i]); } }return p(n,r,l&&l.key,l&&l.ref,null)}function p(l,u,i,t,r){var o={type:l,props:u,key:i,ref:t,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:r};return null==r&&(o.__v=o),n.vnode&&n.vnode(o),o}function y(){return {}}function d(n){return n.children}function m(n,l){this.props=n,this.context=l;}function w(n,l){if(null==l){ return n.__?w(n.__,n.__.__k.indexOf(n)+1):null; }for(var u;l<n.__k.length;l++){ if(null!=(u=n.__k[l])&&null!=u.__e){ return u.__e; } }return "function"==typeof n.type?w(n):null}function k(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++){ if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break} }return k(n)}}function g(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!i++||r!==n.debounceRendering)&&((r=n.debounceRendering)||t)(_);}function _(){for(var n;i=u.length;){ n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,i,t,r,o,f;n.__d&&(o=(r=(l=n).__v).__e,(f=l.__P)&&(u=[],(i=a({},r)).__v=i,t=A(f,r,i,l.__n,void 0!==f.ownerSVGElement,null,u,null==o?w(r):o),T(u,r),t!=o&&k(r)));}); }}function b(n,l,u,i,t,r,o,f,s){var a,h,p,y,d,m,k,g=u&&u.__k||c,_=g.length;if(f==e&&(f=null!=r?r[0]:_?w(u,0):null),a=0,l.__k=x(l.__k,function(u){if(null!=u){if(u.__=l,u.__b=l.__b+1,null===(p=g[a])||p&&u.key==p.key&&u.type===p.type){ g[a]=void 0; }else { for(h=0;h<_;h++){if((p=g[h])&&u.key==p.key&&u.type===p.type){g[h]=void 0;break}p=null;} }if(y=A(n,u,p=p||e,i,t,r,o,f,s),(h=u.ref)&&p.ref!=h&&(k||(k=[]),p.ref&&k.push(p.ref,null,u),k.push(h,u.__c||y,u)),null!=y){var c;if(null==m&&(m=y),void 0!==u.__d){ c=u.__d,u.__d=void 0; }else if(r==p||y!=f||null==y.parentNode){n:if(null==f||f.parentNode!==n){ n.appendChild(y),c=null; }else {for(d=f,h=0;(d=d.nextSibling)&&h<_;h+=2){ if(d==y){ break n; } }n.insertBefore(y,f),c=f;}"option"==l.type&&(n.value="");}f=void 0!==c?c:y.nextSibling,"function"==typeof l.type&&(l.__d=f);}else { f&&p.__e==f&&f.parentNode!=n&&(f=w(p)); }}return a++,u}),l.__e=m,null!=r&&"function"!=typeof l.type){ for(a=r.length;a--;){ null!=r[a]&&v(r[a]); } }for(a=_;a--;){ null!=g[a]&&D(g[a],g[a]); }if(k){ for(a=0;a<k.length;a++){ j(k[a],k[++a],k[++a]); } }}function x(n,l,u){if(null==u&&(u=[]),null==n||"boolean"==typeof n){ l&&u.push(l(null)); }else if(Array.isArray(n)){ for(var i=0;i<n.length;i++){ x(n[i],l,u); } }else { u.push(l?l("string"==typeof n||"number"==typeof n?p(null,n,null,null,n):null!=n.__e||null!=n.__c?p(n.type,n.props,n.key,null,n.__v):n):n); }return u}function P(n,l,u,i,t){var r;for(r in u){ "children"===r||"key"===r||r in l||N(n,r,null,u[r],i); }for(r in l){ t&&"function"!=typeof l[r]||"children"===r||"key"===r||"value"===r||"checked"===r||u[r]===l[r]||N(n,r,l[r],u[r],i); }}function C(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===s.test(l)?u+"px":null==u?"":u;}function N(n,l,u,i,t){var r,o,f,e,c;if(t?"className"===l&&(l="class"):"class"===l&&(l="className"),"style"===l){ if(r=n.style,"string"==typeof u){ r.cssText=u; }else {if("string"==typeof i&&(r.cssText="",i=null),i){ for(e in i){ u&&e in u||C(r,e,""); } }if(u){ for(c in u){ i&&u[c]===i[c]||C(r,c,u[c]); } }} }else { "o"===l[0]&&"n"===l[1]?(o=l!==(l=l.replace(/Capture$/,"")),f=l.toLowerCase(),l=(f in n?f:l).slice(2),u?(i||n.addEventListener(l,z,o),(n.l||(n.l={}))[l]=u):n.removeEventListener(l,z,o)):"list"!==l&&"tagName"!==l&&"form"!==l&&"type"!==l&&"size"!==l&&!t&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u&&!/^ar/.test(l)?n.removeAttribute(l):n.setAttribute(l,u)); }}function z(l){this.l[l.type](n.event?n.event(l):l);}function A(l,u,i,t,r,o,f,e,c){var s,v,h,p,y,w,k,g,_,x,P=u.type;if(void 0!==u.constructor){ return null; }(s=n.__b)&&s(u);try{n:if("function"==typeof P){if(g=u.props,_=(s=P.contextType)&&t[s.__c],x=s?_?_.props.value:s.__:t,i.__c?k=(v=u.__c=i.__c).__=v.__E:("prototype"in P&&P.prototype.render?u.__c=v=new P(g,x):(u.__c=v=new m(g,x),v.constructor=P,v.render=E),_&&_.sub(v),v.props=g,v.state||(v.state={}),v.context=x,v.__n=t,h=v.__d=!0,v.__h=[]),null==v.__s&&(v.__s=v.state),null!=P.getDerivedStateFromProps&&(v.__s==v.state&&(v.__s=a({},v.__s)),a(v.__s,P.getDerivedStateFromProps(g,v.__s))),p=v.props,y=v.state,h){ null==P.getDerivedStateFromProps&&null!=v.componentWillMount&&v.componentWillMount(),null!=v.componentDidMount&&v.__h.push(v.componentDidMount); }else {if(null==P.getDerivedStateFromProps&&g!==p&&null!=v.componentWillReceiveProps&&v.componentWillReceiveProps(g,x),!v.__e&&null!=v.shouldComponentUpdate&&!1===v.shouldComponentUpdate(g,v.__s,x)||u.__v===i.__v&&!v.__){for(v.props=g,v.state=v.__s,u.__v!==i.__v&&(v.__d=!1),v.__v=u,u.__e=i.__e,u.__k=i.__k,v.__h.length&&f.push(v),s=0;s<u.__k.length;s++){ u.__k[s]&&(u.__k[s].__=u); }break n}null!=v.componentWillUpdate&&v.componentWillUpdate(g,v.__s,x),null!=v.componentDidUpdate&&v.__h.push(function(){v.componentDidUpdate(p,y,w);});}v.context=x,v.props=g,v.state=v.__s,(s=n.__r)&&s(u),v.__d=!1,v.__v=u,v.__P=l,s=v.render(v.props,v.state,v.context),u.__k=null!=s&&s.type==d&&null==s.key?s.props.children:Array.isArray(s)?s:[s],null!=v.getChildContext&&(t=a(a({},t),v.getChildContext())),h||null==v.getSnapshotBeforeUpdate||(w=v.getSnapshotBeforeUpdate(p,y)),b(l,u,i,t,r,o,f,e,c),v.base=u.__e,v.__h.length&&f.push(v),k&&(v.__E=v.__=null),v.__e=!1;}else { null==o&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=$(i.__e,u,i,t,r,o,f,c); }(s=n.diffed)&&s(u);}catch(l$1){u.__v=null,n.__e(l$1,u,i);}return u.__e}function T(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u);});}catch(l$1){n.__e(l$1,u.__v);}});}function $(n,l,u,i,t,r,o,f){var s,a,v,h,p,y=u.props,d=l.props;if(t="svg"===l.type||t,null!=r){ for(s=0;s<r.length;s++){ if(null!=(a=r[s])&&((null===l.type?3===a.nodeType:a.localName===l.type)||n==a)){n=a,r[s]=null;break} } }if(null==n){if(null===l.type){ return document.createTextNode(d); }n=t?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type,d.is&&{is:d.is}),r=null,f=!1;}if(null===l.type){ y!==d&&n.data!=d&&(n.data=d); }else {if(null!=r&&(r=c.slice.call(n.childNodes)),v=(y=u.props||e).dangerouslySetInnerHTML,h=d.dangerouslySetInnerHTML,!f){if(y===e){ for(y={},p=0;p<n.attributes.length;p++){ y[n.attributes[p].name]=n.attributes[p].value; } }(h||v)&&(h&&v&&h.__html==v.__html||(n.innerHTML=h&&h.__html||""));}P(n,d,y,t,f),h?l.__k=[]:(l.__k=l.props.children,b(n,l,u,i,"foreignObject"!==l.type&&t,r,o,e,f)),f||("value"in d&&void 0!==(s=d.value)&&s!==n.value&&N(n,"value",s,y.value,!1),"checked"in d&&void 0!==(s=d.checked)&&s!==n.checked&&N(n,"checked",s,y.checked,!1));}return n}function j(l,u,i){try{"function"==typeof l?l(u):l.current=u;}catch(l$1){n.__e(l$1,i);}}function D(l,u,i){var t,r,o;if(n.unmount&&n.unmount(l),(t=l.ref)&&(t.current&&t.current!==l.__e||j(t,null,u)),i||"function"==typeof l.type||(i=null!=(r=l.__e)),l.__e=l.__d=void 0,null!=(t=l.__c)){if(t.componentWillUnmount){ try{t.componentWillUnmount();}catch(l$1){n.__e(l$1,u);} }t.base=t.__P=null;}if(t=l.__k){ for(o=0;o<t.length;o++){ t[o]&&D(t[o],u,i); } }null!=r&&v(r);}function E(n,l,u){return this.constructor(n,u)}function H(l,u,i){var t,r,f;n.__&&n.__(l,u),r=(t=i===o)?null:i&&i.__k||u.__k,l=h(d,null,[l]),f=[],A(u,(t?u:i||u).__k=l,r||e,e,void 0!==u.ownerSVGElement,i&&!t?[i]:r?null:c.slice.call(u.childNodes),f,i||e,t),T(f,l);}n={__e:function(n,l){for(var u,i;l=l.__;){ if((u=l.__c)&&!u.__){ try{if(u.constructor&&null!=u.constructor.getDerivedStateFromError&&(i=!0,u.setState(u.constructor.getDerivedStateFromError(n))),null!=u.componentDidCatch&&(i=!0,u.componentDidCatch(n)),i){ return g(u.__E=u) }}catch(l$1){n=l$1;} } }throw n}},m.prototype.setState=function(n,l){var u;u=this.__s!==this.state?this.__s:this.__s=a({},this.state),"function"==typeof n&&(n=n(u,this.props)),n&&a(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),g(this));},m.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),g(this));},m.prototype.render=d,u=[],i=0,t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,o=e,f=0;

/**
 * Approximates the Gauss error function, the probability that a random variable
 * from the standard normal distribution lies within [-x, x]. Moved from
 * traceviewer.b.math.erf, based on Abramowitz and Stegun, formula 7.1.26.
 * @param {number} x
 * @return {number}
 */
function internalErf_(x) {
  // erf(-x) = -erf(x);
  var sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  var a1 = 0.254829592;
  var a2 = -0.284496736;
  var a3 = 1.421413741;
  var a4 = -1.453152027;
  var a5 = 1.061405429;
  var p = 0.3275911;
  var t = 1 / (1 + p * x);
  var y = t * (a1 + t * (a2 + t * (a3 + t * (a4 + t * a5))));
  return sign * (1 - y * Math.exp(-x * x));
}

/**
 * Creates a log-normal distribution and finds the complementary
 * quantile (1-percentile) of that distribution at value. All
 * arguments should be in the same units (e.g. milliseconds).
 *
 * @param {number} median
 * @param {number} falloff
 * @param {number} value
 * @return The complement of the quantile at value.
 * @customfunction
 */
function QUANTILE_AT_VALUE(median, falloff, value) {
  var location = Math.log(median);

  // The "falloff" value specified the location of the smaller of the positive
  // roots of the third derivative of the log-normal CDF. Calculate the shape
  // parameter in terms of that value and the median.
  var logRatio = Math.log(falloff / median);
  var shape = Math.sqrt(1 - 3 * logRatio - Math.sqrt((logRatio - 3) * (logRatio - 3) - 8)) / 2;

  var standardizedX = (Math.log(value) - location) / (Math.SQRT2 * shape);
  return (1 - internalErf_(standardizedX)) / 2;
}

/**
 * Approximates the inverse error function. Based on Winitzki, "A handy
 * approximation for the error function and its inverse"
 * @param {number} x
 * @return {number}
 */
function internalErfInv_(x) {
  // erfinv(-x) = -erfinv(x);
  var sign = x < 0 ? -1 : 1;
  var a = 0.147;

  var log1x = Math.log(1 - x*x);
  var p1 = 2 / (Math.PI * a) + log1x / 2;
  var sqrtP1Log = Math.sqrt(p1 * p1 - (log1x / a));
  return sign * Math.sqrt(sqrtP1Log - p1);
}

/**
 * Calculates the value at the given quantile. Median, falloff, and
 * expected value should all be in the same units (e.g. milliseconds).
 * quantile should be within [0,1].
 *
 * @param {number} median
 * @param {number} falloff
 * @param {number} quantile
 * @return The value at this quantile.
 * @customfunction
 */
function VALUE_AT_QUANTILE(median, falloff, quantile) {
  var location = Math.log(median);
  var logRatio = Math.log(falloff / median);
  var shape = Math.sqrt(1 - 3 * logRatio - Math.sqrt((logRatio - 3) * (logRatio - 3) - 8)) / 2;

  return Math.exp(location + shape * Math.SQRT2 * internalErfInv_(1 - 2 * quantile));
}

// blingjs
var $$1 = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

Element.prototype.$ = Element.prototype.querySelector;
Element.prototype.$$ = Element.prototype.querySelectorAll;

// thx Lighthouse's util.js
function arithmeticMean(items) {
  items = items.filter(function (item) { return item.weight > 0; });
  var results = items.reduce(
    function (result, item) {
      var score = item.result.score;
      var weight = item.weight;
      return {
        weight: result.weight + weight,
        sum: result.sum + score * weight,
      };
    },
    {weight: 0, sum: 0}
  );
  return results.sum / results.weight || 0;
}

function calculateRating(score) {
	var RATINGS = {
		PASS: {label: 'pass', minScore: 0.9},
		AVERAGE: {label: 'average', minScore: 0.5},
		FAIL: {label: 'fail'},
	};

  var rating = RATINGS.FAIL.label;
  if (score >= RATINGS.PASS.minScore) {
    rating = RATINGS.PASS.label;
  } else if (score >= RATINGS.AVERAGE.minScore) {
    rating = RATINGS.AVERAGE.label;
  }
  return rating;
}

/**
 * V6 weights
 */

var weights = {
  v5: {
    FCP: 0.2,
    SI: 0.26666,
    FMP: 0.066666,
    TTI: 0.33333,
    FCI: 0.133333,
  },
  v6: {
    FCP: 0.15,
    SI:  0.15,
    LCP: 0.25,
    TTI: 0.15,
    TBT: 0.25,
    CLS: 0.05
  },
};

/**
 * V5/v6 scoring curves
 */
var scoring = {
  FCP: {median: 4000, falloff: 2000, name: 'First Contentful Paint'},
  FMP: {median: 4000, falloff: 2000, name: 'First Meaningful Paint'},
  SI: {median: 5800, falloff: 2900, name: 'Speed Index'},
  TTI: {median: 7300, falloff: 2900, name: 'Time to Interactive'},
  FCI: {median: 6500, falloff: 2900, name: 'First CPU Idle'},
  TBT: {median: 600, falloff: 200, name: 'Total Blocking Time'},
  LCP: {median: 4000, falloff: 2000, name: 'Largest Contentful Paint'},
  CLS: {median: 0.25, falloff: 0.054, name: 'Cumulative Layout Shift', units: 'unitless'},
};

function updateGauge(wrapper, category) {
  _setPerfGaugeExplodey(wrapper, category);
}

function _determineTrig(sizeSVG, percent, strokeWidth) {
  strokeWidth = strokeWidth || sizeSVG / 32;

  var radiusInner = sizeSVG / strokeWidth;
  var strokeGap = 0.5 * strokeWidth;
  var radiusOuter = radiusInner + strokeGap + strokeWidth;

  var circumferenceInner = 2 * Math.PI * radiusInner;
  // arc length we need to subtract
  // for very small strokeWidth:radius ratios this is ≈ strokeWidth
  // angle = acute angle of isosceles △ with 2 edges equal to radius & 3rd equal to strokeWidth
  // angle formula given by law of cosines
  var endDiffInner = Math.acos(1 - 0.5 * Math.pow((0.5 * strokeWidth) / radiusInner, 2)) * radiusInner;

  var circumferenceOuter = 2 * Math.PI * radiusOuter;
  var endDiffOuter = Math.acos(1 - 0.5 * Math.pow((0.5 * strokeWidth) / radiusOuter, 2)) * radiusOuter;

  return {
    radiusInner: radiusInner,
    radiusOuter: radiusOuter,
    circumferenceInner: circumferenceInner,
    circumferenceOuter: circumferenceOuter,
    getArcLength: function (_) { return Math.max(0, +(percent * circumferenceInner - 2 * endDiffInner).toFixed(4)); },
    // isButt case is for metricArcHoverTarget
    getMetricArcLength: function (weightingPct, isButt) {
      // TODO: this math isn't perfect butt it's very close.
      var linecapFactor = isButt ? 0 : 2 * endDiffOuter;
      return Math.max(0, +(weightingPct * circumferenceOuter - strokeGap - linecapFactor).toFixed(4));
    },
    endDiffInner: endDiffInner,
    endDiffOuter: endDiffOuter,
    strokeWidth: strokeWidth,
    strokeGap: strokeGap,
  };
}

/**
 * @param {HTMLAnchorElement} wrapper
 * @param {LH.ReportResult.Category} category
 */
function _setPerfGaugeExplodey(wrapper, category) {
  var sizeSVG = 128;
  var offsetSVG = -0.5 * sizeSVG;

  var percent = Number(category.score);
  var ref = _determineTrig(sizeSVG, percent);
  var radiusInner = ref.radiusInner;
  var radiusOuter = ref.radiusOuter;
  var circumferenceInner = ref.circumferenceInner;
  var circumferenceOuter = ref.circumferenceOuter;
  var getArcLength = ref.getArcLength;
  var getMetricArcLength = ref.getMetricArcLength;
  var endDiffInner = ref.endDiffInner;
  var endDiffOuter = ref.endDiffOuter;
  var strokeWidth = ref.strokeWidth;
  var strokeGap = ref.strokeGap;

  var SVG = wrapper.querySelector('.lh-gauge');
  var NS_URI = 'http://www.w3.org/2000/svg';

  SVG.setAttribute('viewBox', [offsetSVG, offsetSVG, sizeSVG, sizeSVG].join(' '));
  SVG.style.setProperty('--stroke-width', strokeWidth);
  SVG.style.setProperty('--circle-meas', 2 * Math.PI.toFixed(4));

  // build the mask. Note this mask isn't within the wrapper, it's global.
  var mask = wrapper.ownerDocument.querySelector('#lh-gauge__mask');
  var maskVisible = mask.querySelector('path');
  var maskHidden = mask.querySelector('circle');

  // a path is the most compact way to cover the SVG area with a rectangle
  maskVisible.setAttribute('d', ("M" + offsetSVG + offsetSVG + "H" + (-offsetSVG) + "V" + (-offsetSVG) + "H" + offsetSVG));
  // SVG masks are luninance masks => white = fully opaque, black = transparent
  maskVisible.setAttribute('fill', "#fff");
  // default fill is black, no need to set it exlicitly on circle
  // any strok applied doesn't matter
  maskHidden.setAttribute('r', radiusInner + 0.5 * strokeWidth);

  var groupOuter = wrapper.querySelector('.lh-gauge__outer');
  var groupInner = wrapper.querySelector('.lh-gauge__inner');
  var cover = groupOuter.querySelector('.cover');
  var gaugeArc = groupInner.querySelector('.lh-gauge__arc');
  var gaugePerc = groupInner.querySelector('.lh-gauge__percentage');

  groupOuter.style.setProperty('--scale-initial', radiusInner / radiusOuter);
  groupOuter.style.setProperty('--radius', radiusOuter);
  cover.style.setProperty('--radius', 0.5 * (radiusInner + radiusOuter));
  cover.setAttribute('stroke-width', strokeGap);
  SVG.style.setProperty('--radius', radiusInner);

  gaugeArc.setAttribute('stroke-dasharray', ((getArcLength()) + " " + ((circumferenceInner - getArcLength()).toFixed(4))));
  gaugeArc.setAttribute('stroke-dashoffset', 0.25 * circumferenceInner - endDiffInner);

  gaugePerc.textContent = Math.round(percent * 100);

  var radiusTextOuter = radiusOuter + strokeWidth;
  var radiusTextInner = radiusOuter - strokeWidth;

  var metrics = category.auditRefs.filter(function (r) { return r.group === 'metrics' && r.weight; });
  var totalWeight = metrics.reduce(function (sum, each) { return (sum += each.weight); }, 0);
  var offsetAdder = 0.25 * circumferenceOuter - endDiffOuter - 0.5 * strokeGap;
  var angleAdder = -0.5 * Math.PI;

  metrics.forEach(function (metric, i) {
    // TODO(porting to real LHR..): in scorecalc we dont use the real audit ID just the acronym.
    var alias = metric.id;

    // Hack
    var needsDomPopulation = !groupOuter.querySelector((".metric--" + alias));

    // HACK:This isn't ideal but it was quick. Handles both initialization and updates
    var metricGroup = groupOuter.querySelector((".metric--" + alias)) || document.createElementNS(NS_URI, 'g');
    var metricArcMax = groupOuter.querySelector((".metric--" + alias + " .lh-gauge--faded")) || document.createElementNS(NS_URI, 'circle');
    var metricArc = groupOuter.querySelector((".metric--" + alias + " .lh-gauge--miniarc")) || document.createElementNS(NS_URI, 'circle');
    var metricArcHoverTarget = groupOuter.querySelector((".metric--" + alias + " .lh-gauge-hover")) || document.createElementNS(NS_URI, 'circle');
    var metricLabel = groupOuter.querySelector((".metric--" + alias + " .metric__label")) || document.createElementNS(NS_URI, 'text');
    var metricValue = groupOuter.querySelector((".metric--" + alias + " .metric__value")) || document.createElementNS(NS_URI, 'text');

    metricGroup.classList.add('metric', ("metric--" + alias));
    metricArcMax.classList.add('lh-gauge__arc', 'lh-gauge__arc--metric', 'lh-gauge--faded');
    metricArc.classList.add('lh-gauge__arc', 'lh-gauge__arc--metric', 'lh-gauge--miniarc');
    metricArcHoverTarget.classList.add('lh-gauge__arc', 'lh-gauge__arc--metric', 'lh-gauge--faded', 'lh-gauge-hover');

    var weightingPct = metric.weight / totalWeight;
    var metricLengthMax = getMetricArcLength(weightingPct);
    var metricPercent = metric.result.score * weightingPct;
    var metricLength = getMetricArcLength(metricPercent);
    var metricOffset = weightingPct * circumferenceOuter;
    var metricHoverLength = getMetricArcLength(weightingPct, true);

    metricGroup.style.setProperty('--metric-color', ("var(--palette-" + i + ")"));
    metricGroup.style.setProperty('--metric-offset', ("" + offsetAdder));
    metricGroup.style.setProperty('--i', i);

    metricArcMax.setAttribute('stroke-dasharray', (metricLengthMax + " " + (circumferenceOuter - metricLengthMax)));
    metricArc.style.setProperty('--metric-array', (metricLength + " " + (circumferenceOuter - metricLength)));
    metricArcHoverTarget.setAttribute('stroke-dasharray', (metricHoverLength + " " + (circumferenceOuter - metricHoverLength - endDiffOuter)));

    metricLabel.classList.add('metric__label');
    metricValue.classList.add('metric__value');
    metricLabel.textContent = alias;
    metricValue.textContent = "+" + (Math.round(metricPercent * 100));

    var midAngle = angleAdder + weightingPct * Math.PI;
    var cos = Math.cos(midAngle);
    var sin = Math.sin(midAngle);

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

  // Hack. Not ideal.
  if (SVG.dataset.listenersSetup) { return; }
  SVG.dataset.listenersSetup = true;

  // peekGauge(SVG);

  /*
    wrapper.state-expanded: gauge is exploded
    wrapper.state-highlight: gauge is exploded and one of the metrics is being highlighted
    metric.metric-highlight: highlight this particular metric
  */
  SVG.addEventListener('mouseover', function (e) {
    // if hovering on the SVG and its expanded, get rid of everything
    if (e.target === SVG && wrapper.classList.contains('state--expanded')) {
      // paul: not sure why we want to remove this.. seems like we want to keep it expanded...
      SVG.classList.remove('state--expanded');

      if (SVG.classList.contains('state--highlight')) {
        SVG.classList.remove('state--highlight');
        SVG.querySelector('.metric--highlight').classList.remove('metric--highlight');
      }
      return;
    }

    var parent = e.target.parentNode;

    // if hovering on a metric, highlight that one.
    // TODO: The hover target is a little small. ideally it's thicker.
    if (parent && parent.classList && parent.classList.contains('metric')) {
      // match the bg color of the gauge during a metric highlight
      wrapper.style.setProperty('--color-highlight', ("var(--palette-" + (parent.style.getPropertyValue('--i')) + ")"));

      if (!SVG.classList.contains('state--highlight')) {
        SVG.classList.add('state--highlight');
        parent.classList.add('metric--highlight');
      } else {
        var highlighted = SVG.querySelector('.metric--highlight');

        if (highlighted && parent !== highlighted) {
          highlighted.classList.remove('metric--highlight');
          parent.classList.add('metric--highlight');
        }
      }
    }
  });

  // clear on mouselave even if mousemove didn't catch it.
  SVG.addEventListener('mouseleave', function (e) {
    SVG.classList.remove('state--highlight');
    var mh = SVG.querySelector('.metric--highlight');
    mh && mh.classList.remove('metric--highlight');
  });
}

function determineMinMax(metricId) {
  var metricScoring = scoring[metricId];

  var valueAtScore100 = VALUE_AT_QUANTILE(
    metricScoring.median,
    metricScoring.falloff,
    0.995
  );
  var valueAtScore5 = VALUE_AT_QUANTILE(
    metricScoring.median,
    metricScoring.falloff,
    0.05
  );

  var min = Math.floor(valueAtScore100 / 1000) * 1000;
  var max = Math.ceil(valueAtScore5 / 1000) * 1000;
  var step = 10;

  // Special handling for CLS
  if (metricScoring.units === 'unitless') {
    min = 0;
    max = Math.ceil(valueAtScore5 * 100) / 100;
    step = 0.01;
  }

  return {
    min: min,
    max: max,
    step: step,
  };
}

var Metric = /*@__PURE__*/(function (Component) {
  function Metric () {
    Component.apply(this, arguments);
  }

  if ( Component ) Metric.__proto__ = Component;
  Metric.prototype = Object.create( Component && Component.prototype );
  Metric.prototype.constructor = Metric;

  Metric.prototype.onValueChange = function onValueChange (e, id) {
    var obj;

    this.props.app.setState(( obj = {}, obj[id] = e.target.valueAsNumber, obj ));
  };

  Metric.prototype.onScoreChange = function onScoreChange (e, id) {
    var obj;

    var score = e.target.valueAsNumber;
    var metricScoring = scoring[id];
    var computedValue = VALUE_AT_QUANTILE(metricScoring.median, metricScoring.falloff, score / 100);

    // Clamp because we can end up with Infinity
    var ref = determineMinMax(id);
    var min = ref.min;
    var max = ref.max;
    computedValue = Math.max(Math.min(computedValue, max), min);

    this.props.app.setState(( obj = {}, obj[id] = Math.round(computedValue), obj ));
  };

  Metric.prototype.render = function render (ref) {
    var this$1 = this;
    var id = ref.id;
    var value = ref.value;
    var weight = ref.weight;
    var maxWeight = ref.maxWeight;
    var score = ref.score;

    var ref$1 = determineMinMax(id);
    var min = ref$1.min;
    var max = ref$1.max;
    var step = ref$1.step;
    var name = scoring[id].name;

    return h( 'tr', { class: ("lh-metric--" + (calculateRating(score / 100))) },
      h( 'td', null,
        h( 'span', { class: "lh-metric__score-icon" })
      ),
      h( 'td', null, (id + " (" + name + ")") ),
      h( 'td', null,
        h( 'input', { type: "range", min: min, value: value, max: max, step: step, class: (id + " metric-value"), onInput: function (e) { return this$1.onValueChange(e, id); } }),
        h( 'output', { class: "${id} value-output" }, value)
      ),
      h( 'td', null ),

      h( 'td', null,
        h( 'input', { type: "range", class: (id + " metric-score"), style: ("width: " + (weight / maxWeight * 100) + "%"), value: score, onInput: function (e) { return this$1.onScoreChange(e, id); } }),
        h( 'output', { class: (id + " score-output") }, score)
      ),

      h( 'td', null,
        h( 'span', { class: (id + " weight-text") }, Math.round(weight * 10000) / 100, "%")
      )
    )
  };

  return Metric;
}(m));

var Gauge = /*@__PURE__*/(function (Component) {
  function Gauge(props) {
    Component.call(this, props);
    this.ref = y();
  }

  if ( Component ) Gauge.__proto__ = Component;
  Gauge.prototype = Object.create( Component && Component.prototype );
  Gauge.prototype.constructor = Gauge;

  Gauge.prototype.refreshGauge = function refreshGauge () {
    updateGauge(this.ref.current, {
      title: 'Performance',
      auditRefs: this.props.auditRefs,
      id: 'performance',
      score: this.props.score,
    });
  };

  Gauge.prototype.componentDidMount = function componentDidMount () {
    this.refreshGauge();
  };

  Gauge.prototype.componentDidUpdate = function componentDidUpdate () {
    this.refreshGauge();
  };

  Gauge.prototype.render = function render (ref) {
    var score = ref.score;

    return (
      h( 'div', { ref: this.ref, class: ("lh-gauge__wrapper lh-gauge__wrapper--" + (calculateRating(score))) },
        h( 'div', { class: 'lh-gauge__svg-wrapper' },
          h( 'svg', { class: 'lh-gauge state--expanded' },
            h( 'g', { class: 'lh-gauge__inner' },
              h( 'circle', { class: 'lh-gauge__bg' }),
              h( 'circle', { class: 'lh-gauge__base lh-gauge--faded' }),
              h( 'circle', { class: 'lh-gauge__arc' }),
              h( 'text', { class: 'lh-gauge__percentage' })
            ),
            h( 'g', { class: 'lh-gauge__outer' },
              h( 'circle', { class: 'cover' })
            )
          )
        )
      )
    );
  };

  return Gauge;
}(m));

var ScoringGuide = /*@__PURE__*/(function (Component) {
  function ScoringGuide () {
    Component.apply(this, arguments);
  }

  if ( Component ) ScoringGuide.__proto__ = Component;
  ScoringGuide.prototype = Object.create( Component && Component.prototype );
  ScoringGuide.prototype.constructor = ScoringGuide;

  ScoringGuide.prototype.render = function render (ref) {
    var app = ref.app;
    var name = ref.name;
    var values = ref.values;
    var weights = ref.weights;

    // Make sure weights total to 1
    var weightSum = Object.values(weights).reduce(function (agg, val) { return (agg += val); });
    console.assert(weightSum > 0.999 && weightSum < 1.0001); // lol rounding is hard.

    var metrics = Object.keys(weights).map(function (id) {
      var metricScoring = scoring[id];
      return {
        id: id,
        weight: weights[id],
        value: values[id],
        score: Math.round(QUANTILE_AT_VALUE(metricScoring.median, metricScoring.falloff, values[id]) * 100),
      };
    });

    var auditRefs = metrics.map(function (metric) {
      return {
        id: metric.id,
        weight: metric.weight,
        group: 'metrics',
        result: {
          score: metric.score / 100,
        },
      };
    });

    var score = arithmeticMean(auditRefs);
    var maxWeight = Math.max.apply(Math, Object.values(weights));

    var title = h( 'h2', null, name );
    if (name === 'v6') {
      title = h( 'h2', null, "v6", h( 'i', null, " ", h( 'a', { href: "https://github.com/GoogleChrome/lighthouse/releases/tag/v6.0.0-beta.0" }, "beta.0") ) );
    }

    return h( 'form', { class: "wrapper" },
      title,

      h( 'table', null,
        h( 'thead', null,
          h( 'tr', null,
            h( 'th', { class: "th--metric", colspan: "2" }),
            h( 'th', { class: "th--value" }, "Value"),
            h( 'th', { class: "th--spacer" }),
            h( 'th', { class: "th--score" }, "Metric Score"),
            h( 'th', { class: "th--weight" }, "Weighting")
          )
        ),
        h( 'tbody', null,
          metrics.map(function (metric) {
            return h( Metric, Object.assign({}, { app: app, maxWeight: maxWeight }, metric))
          })
        )
      ),

      h( 'div', { class: "perfscore" },
        h( Gauge, { score: score, auditRefs: auditRefs })
      )
    )
  };

  return ScoringGuide;
}(m));

var App = /*@__PURE__*/(function (Component) {
  function App(props) {
    Component.call(this, props);
    this.state = {};
    for (var id in scoring) {
      this.state[id] = scoring[id].median;
    }
  }

  if ( Component ) App.__proto__ = Component;
  App.prototype = Object.create( Component && Component.prototype );
  App.prototype.constructor = App;

  App.prototype.render = function render () {
    return h( 'div', null,
      h( ScoringGuide, { app: this, name: "v6", values: this.state, weights: weights.v6 }),
      h( ScoringGuide, { app: this, name: "v5", values: this.state, weights: weights.v5 })
    )
  };

  return App;
}(m));

function main2() {
  if (new URLSearchParams(location.search).has('v6')) {
    $$1('#v5').hidden = true;
    $$1('footer').hidden = true;
    $$1('h1').hidden = true;
  }
  else if (new URLSearchParams(location.search).has('v5')) {
    $$1('#v6').hidden = true;
    $$1('footer').hidden = true;
    $$1('h1').hidden = true;
  }
  H(h( App, null ), $$1('#container'));
}

// just one call to main because i'm basic like that
main2();
//# sourceMappingURL=calc.js.map
