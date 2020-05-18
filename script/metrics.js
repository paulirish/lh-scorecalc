export const metrics = {
  FCP: {auditId: 'first-contentful-paint', name: 'First Contentful Paint'},
  SI: {auditId: 'speed-index', name: 'Speed Index'},
  LCP: {auditId: 'largest-contentful-paint', name: 'Largest Contentful Paint'},
  TTI: {auditId: 'interactive', name: 'Time to Interactive'},
  TBT: {auditId: 'total-blocking-time', name: 'Total Blocking Time'},
  CLS: {auditId: 'cumulative-layout-shift', name: 'Cumulative Layout Shift', units: 'unitless'},
  FMP: {auditId: 'first-meaningful-paint', name: 'First Meaningful Paint'},
  FCI: {auditId: 'first-cpu-idle', name: 'First CPU Idle'},
};

export const curves = {
  v6: {
    mobile: {
      FCP: {weight: 0.15, median: 4000, p10: 2336},
      SI: {weight: 0.15, median: 5800, p10: 3387},
      LCP: {weight: 0.25, median: 4000, p10: 2500},
      TTI: {weight: 0.15, median: 7300, p10: 3785},
      TBT: {weight: 0.25, median: 600, p10: 287},
      CLS: {weight: 0.05, median: 0.25, p10: 0.1},
    },
    desktop: {
      FCP: {weight: 0.15, median: 1600, p10: 934},
      SI: {weight: 0.15, median: 2300, p10: 1311},
      LCP: {weight: 0.25, median: 2400, p10: 1200},
      TTI: {weight: 0.15, median: 4500, p10: 2468},
      TBT: {weight: 0.25, median: 350, p10: 150},
      CLS: {weight: 0.05, median: 0, p10: 0.1},
    },
  },
  v5: {
    FCP: {weight: 0.2, median: 4000, podr: 2000},
    SI: {weight: 0.26666, median: 5800, podr: 2900},
    FMP: {weight: 0.066666, median: 4000, podr: 2000},
    TTI: {weight: 0.33333, median: 7300, podr: 2900},
    FCI: {weight: 0.133333, median: 6500, podr: 2900},
  },
};

/**
 * @param {Record<string, {weight: number, median: number, podr: number}>} curves
 */
function makeScoringGuide(curves) {
  const scoringGuide = {};
  for (const [key, curve] of Object.entries(curves)) {
    scoringGuide[key] = {...metrics[key], ...curve};
  }
  return scoringGuide;
}

export const scoringGuides = {
  v6: {
    mobile: makeScoringGuide(curves.v6.mobile),
    desktop: makeScoringGuide(curves.v6.desktop),
  },
  v5: {
    mobile: makeScoringGuide(curves.v5),
    desktop: makeScoringGuide(curves.v5),
  },
};
