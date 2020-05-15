/**
 * Scoring curves
 */
export const scoringGuides = {
  v6: {
    FCP: {weight: 0.15, median: 4000, falloff: 2000, auditId: 'first-contentful-paint', name: 'First Contentful Paint'},
    SI: {weight: 0.15, median: 5800, falloff: 2900, auditId: 'speed-index', name: 'Speed Index'},
    LCP: {weight: 0.25, median: 4000, falloff: 2000, auditId: 'largest-contentful-paint', name: 'Largest Contentful Paint'},
    TTI: {weight: 0.15, median: 7300, falloff: 2900, auditId: 'interactive', name: 'Time to Interactive'},
    TBT: {weight: 0.25, median: 600, falloff: 200, auditId: 'total-blocking-time', name: 'Total Blocking Time'},
    CLS: {weight: 0.05, median: 0.25, falloff: 0.054, auditId: 'cumulative-layout-shift', name: 'Cumulative Layout Shift', units: 'unitless'},
  },
  v5: {
    FCP: {weight: 0.2, median: 4000, falloff: 2000, auditId: 'first-contentful-paint', name: 'First Contentful Paint'},
    SI: {weight: 0.26666, median: 5800, falloff: 2900, auditId: 'speed-index', name: 'Speed Index'},
    FMP: {weight: 0.066666, median: 4000, falloff: 2000, auditId: 'first-meaningful-paint', name: 'First Meaningful Paint'},
    TTI: {weight: 0.33333, median: 7300, falloff: 2900, auditId: 'interactive', name: 'Time to Interactive'},
    FCI: {weight: 0.133333, median: 6500, falloff: 2900, auditId: 'first-cpu-idle', name: 'First CPU Idle'},
  },
};

// TODO need to support defining curves with p10 and podr.

const scoringGuides_WIP_mobile = {
  v6: {
    FCP: {weight: 0.15, median: 4000, p10: 2336, auditId: 'first-contentful-paint', name: 'First Contentful Paint'},
    SI: {weight: 0.15, median: 5800, p10: 3387, auditId: 'speed-index', name: 'Speed Index'},
    LCP: {weight: 0.25, median: 4000, p10: 2500, auditId: 'largest-contentful-paint', name: 'Largest Contentful Paint'},
    TTI: {weight: 0.15, median: 7300, p10: 3785, auditId: 'interactive', name: 'Time to Interactive'},
    TBT: {weight: 0.25, median: 600, p10: 287, auditId: 'total-blocking-time', name: 'Total Blocking Time'},
    CLS: {weight: 0.05, median: 0.25, p10: 0.1, auditId: 'cumulative-layout-shift', name: 'Cumulative Layout Shift', units: 'unitless'},
  },
  // same as above
  // v5: {
  //   FCP: {weight: 0.2, median: 4000, falloff: 2000, auditId: 'first-contentful-paint', name: 'First Contentful Paint'},
  //   SI: {weight: 0.26666, median: 5800, falloff: 2900, auditId: 'speed-index', name: 'Speed Index'},
  //   FMP: {weight: 0.066666, median: 4000, falloff: 2000, auditId: 'first-meaningful-paint', name: 'First Meaningful Paint'},
  //   TTI: {weight: 0.33333, median: 7300, falloff: 2900, auditId: 'interactive', name: 'Time to Interactive'},
  //   FCI: {weight: 0.133333, median: 6500, falloff: 2900, auditId: 'first-cpu-idle', name: 'First CPU Idle'},
  // },
};

const scoringGuides_WIP_desktop = {
  v6: {
    FCP: {weight: 0.15, median: 1600, p10: 934, auditId: 'first-contentful-paint', name: 'First Contentful Paint'},
    SI: {weight: 0.15, median: 2300, p10: 1311, auditId: 'speed-index', name: 'Speed Index'},
    LCP: {weight: 0.25, median: 2400, p10: 1200, auditId: 'largest-contentful-paint', name: 'Largest Contentful Paint'},
    TTI: {weight: 0.15, median: 4500, p10: 2468, auditId: 'interactive', name: 'Time to Interactive'},
    TBT: {weight: 0.25, median: 350, p10: 150, auditId: 'total-blocking-time', name: 'Total Blocking Time'},
    CLS: {weight: 0.05, median: 0, p10: 0.1, auditId: 'cumulative-layout-shift', name: 'Cumulative Layout Shift', units: 'unitless'},
  },
  // same as above
  // v5: {
  //   FCP: {weight: 0.2, median: 4000, falloff: 2000, auditId: 'first-contentful-paint', name: 'First Contentful Paint'},
  //   SI: {weight: 0.26666, median: 5800, falloff: 2900, auditId: 'speed-index', name: 'Speed Index'},
  //   FMP: {weight: 0.066666, median: 4000, falloff: 2000, auditId: 'first-meaningful-paint', name: 'First Meaningful Paint'},
  //   TTI: {weight: 0.33333, median: 7300, falloff: 2900, auditId: 'interactive', name: 'Time to Interactive'},
  //   FCI: {weight: 0.133333, median: 6500, falloff: 2900, auditId: 'first-cpu-idle', name: 'First CPU Idle'},
  // },
};
