// calculator.js - Interactive Financial Engine & Dynamic Chart.js
let projectionChart = null;
let revenueDoughnutChart = null;

// Formatters
export const formatUSD = (num) => {
  if (num >= 1000000) {
    return "$" + (num / 1000000).toFixed(2) + "M";
  }
  if (num >= 1000) {
    return "$" + (num / 1000).toFixed(1) + "K";
  }
  return "$" + Math.round(num).toLocaleString();
};

export const formatIDR = (usd) => {
  const rate = 15500; // Rp / USD
  const idr = usd * rate;
  if (idr >= 1000000000) {
    return "Rp " + (idr / 1000000000).toFixed(2) + " Miliar";
  }
  if (idr >= 1000000) {
    return "Rp " + (idr / 1000000).toFixed(1) + " Juta";
  }
  return "Rp " + Math.round(idr).toLocaleString("id-ID");
};

export function calculateMetrics(inputs) {
  const {
    mau,
    paidConversion,
    subPrice,
    serverCostPerUser,
    tourneySpendPerUser
  } = inputs;

  const payingSubs = Math.round(mau * (paidConversion / 100));
  const subRevenueMonthly = payingSubs * subPrice;
  const tourneyFeeMonthly = mau * tourneySpendPerUser * 0.10; // 10% take-rate
  const adRevenueMonthly = mau * 0.12; // Ads & Brand sponsorships

  const grossRevenueMonthly = subRevenueMonthly + tourneyFeeMonthly + adRevenueMonthly;
  const arr = grossRevenueMonthly * 12;

  // Costs
  const cloudCostMonthly = mau * serverCostPerUser;
  const opexMarketingMonthly = 35000 + (mau * 0.14); // Fixed team opex + marginal variable CAC
  const totalCostMonthly = cloudCostMonthly + opexMarketingMonthly;

  const netProfitMonthly = grossRevenueMonthly - totalCostMonthly;
  const grossMargin = grossRevenueMonthly > 0 ? (((grossRevenueMonthly - cloudCostMonthly) / grossRevenueMonthly) * 100) : 0;
  const netMargin = grossRevenueMonthly > 0 ? ((netProfitMonthly / grossRevenueMonthly) * 100) : 0;

  // LTV and CAC calculation
  const churnRate = 0.052; // 5.2% monthly churn
  const ltv = (subPrice * (grossMargin / 100)) / churnRate;
  const blendedCAC = 12.5; // Estimated CAC in SEA via viral loops
  const ltvCacRatio = (ltv / blendedCAC).toFixed(1);
  const cacPaybackMonths = ((blendedCAC / (subPrice * (grossMargin / 100)))).toFixed(1);

  // 5 Years Projection Data
  const growthMultipliers = [1, 2.8, 6.2, 11.5, 18.0];
  const fiveYearYears = ["2026 (Y1)", "2027 (Y2)", "2028 (Y3)", "2029 (Y4)", "2030 (Y5)"];
  const fiveYearRevenue = [];
  const fiveYearCosts = [];
  const fiveYearNet = [];

  growthMultipliers.forEach((mult, idx) => {
    const scaleMau = mau * mult;
    const scalePaying = Math.round(scaleMau * (paidConversion / 100));
    const scaleRev = (scalePaying * subPrice * 12) + (scaleMau * tourneySpendPerUser * 0.10 * 12) + (scaleMau * 0.12 * 12);
    const scaleCloudCost = (scaleMau * serverCostPerUser * 0.85 ** idx) * 12; // Server efficiency of scale
    const scaleOpex = (400000 + (scaleMau * 0.9)) * (1.2 ** idx);
    const scaleTotalCost = scaleCloudCost + scaleOpex;

    fiveYearRevenue.push(Math.round(scaleRev));
    fiveYearCosts.push(Math.round(scaleTotalCost));
    fiveYearNet.push(Math.round(scaleRev - scaleTotalCost));
  });

  return {
    payingSubs,
    subRevenueMonthly,
    tourneyFeeMonthly,
    adRevenueMonthly,
    grossRevenueMonthly,
    arr,
    cloudCostMonthly,
    totalCostMonthly,
    netProfitMonthly,
    grossMargin: grossMargin.toFixed(1),
    netMargin: netMargin.toFixed(1),
    ltv: ltv.toFixed(1),
    ltvCacRatio,
    cacPaybackMonths,
    projections: {
      labels: fiveYearYears,
      revenue: fiveYearRevenue,
      costs: fiveYearCosts,
      net: fiveYearNet
    }
  };
}

export function updateCharts(metrics) {
  if (typeof Chart === "undefined") return;

  const ctxLine = document.getElementById("financialProjectionChart");
  const ctxDoughnut = document.getElementById("revenueDoughnutChart");

  if (!ctxLine || !ctxDoughnut) return;

  // 1. Five Year Projection Chart
  if (projectionChart) {
    projectionChart.data.labels = metrics.projections.labels;
    projectionChart.data.datasets[0].data = metrics.projections.revenue;
    projectionChart.data.datasets[1].data = metrics.projections.costs;
    projectionChart.data.datasets[2].data = metrics.projections.net;
    projectionChart.update();
  } else {
    projectionChart = new Chart(ctxLine, {
      type: "bar",
      data: {
        labels: metrics.projections.labels,
        datasets: [
          {
            label: "Gross Revenue ($)",
            data: metrics.projections.revenue,
            backgroundColor: "rgba(0, 240, 255, 0.75)",
            borderColor: "#00f0ff",
            borderWidth: 1.5,
            borderRadius: 6
          },
          {
            label: "Operating Costs ($)",
            data: metrics.projections.costs,
            backgroundColor: "rgba(239, 68, 68, 0.55)",
            borderColor: "#ef4444",
            borderWidth: 1.5,
            borderRadius: 6
          },
          {
            type: "line",
            label: "Net Profit / Loss ($)",
            data: metrics.projections.net,
            borderColor: "#00ff9d",
            backgroundColor: "rgba(0, 255, 157, 0.2)",
            borderWidth: 3,
            tension: 0.35,
            fill: false,
            pointBackgroundColor: "#00ff9d",
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false
        },
        plugins: {
          legend: {
            labels: {
              color: "#94a3b8",
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
            }
          },
          tooltip: {
            backgroundColor: "rgba(10, 15, 26, 0.95)",
            titleColor: "#00f0ff",
            borderColor: "rgba(0, 240, 255, 0.3)",
            borderWidth: 1,
            callbacks: {
              label: (context) => `${context.dataset.label}: ${formatUSD(context.parsed.y)}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#94a3b8", font: { family: "'Plus Jakarta Sans', sans-serif" } }
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#94a3b8",
              callback: (val) => formatUSD(val)
            }
          }
        }
      }
    });
  }

  // 2. Revenue Doughnut Chart
  const doughnutData = [
    Math.round(metrics.subRevenueMonthly),
    Math.round(metrics.tourneyFeeMonthly),
    Math.round(metrics.adRevenueMonthly)
  ];

  if (revenueDoughnutChart) {
    revenueDoughnutChart.data.datasets[0].data = doughnutData;
    revenueDoughnutChart.update();
  } else {
    revenueDoughnutChart = new Chart(ctxDoughnut, {
      type: "doughnut",
      data: {
        labels: ["OmniPass Subscription", "Esports Platform Fee", "Brand & Ads Sponsorship"],
        datasets: [
          {
            data: doughnutData,
            backgroundColor: [
              "rgba(0, 240, 255, 0.85)",
              "rgba(138, 43, 226, 0.85)",
              "rgba(0, 255, 157, 0.85)"
            ],
            borderColor: "#07090e",
            borderWidth: 3,
            hoverOffset: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#94a3b8",
              padding: 12,
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
            }
          },
          tooltip: {
            backgroundColor: "rgba(10, 15, 26, 0.95)",
            borderColor: "rgba(255, 255, 255, 0.15)",
            borderWidth: 1,
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const pct = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                return ` ${context.label}: ${formatUSD(context.parsed)}/bln (${pct}%)`;
              }
            }
          }
        },
        cutout: "68%"
      }
    });
  }
}
