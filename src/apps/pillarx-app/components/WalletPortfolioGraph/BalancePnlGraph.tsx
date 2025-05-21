import {
  CategoryScale,
  Chart,
  ChartArea,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  ScriptableContext,
  TimeScale,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format, parseISO } from 'date-fns';
import { useCallback, useState } from 'react';
import { Line } from 'react-chartjs-2';

// types
import { PnLEntry, PortfolioData, WalletHistory } from '../../../../types/api';

// utils
import { convertDateToUnixTimestamp } from '../../../../utils/common';
import { limitDigitsNumber } from '../../../../utils/number';
import { PeriodFilterBalance, PeriodFilterPnl } from '../../utils/portfolio';

// reducer
import { useAppSelector } from '../../hooks/useReducerHooks';

// components
import Body from '../Typography/Body';

const crosshairPlugin = {
  id: 'crosshairPlugin',
  afterDraw: (chart: Chart) => {
    if (!chart.tooltip?.getActiveElements()?.length) return;

    const { ctx } = chart;
    const { chartArea: area } = chart;
    const activePoint = chart.tooltip.getActiveElements()[0];
    const { x, y } = chart.getDatasetMeta(activePoint.datasetIndex).data[
      activePoint.index
    ];

    ctx.save();

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(x, area.top);
    ctx.lineTo(x, area.bottom);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.closePath();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(area.left, y);
    ctx.lineTo(area.right, y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  },
};

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Filler,
  Tooltip,
  Legend,
  crosshairPlugin
);

const BalancePnlGraph = () => {
  const [hoverValue, setHoverValue] = useState<number | undefined>();

  const walletHistoryGraph = useAppSelector(
    (state) =>
      state.walletPortfolio.walletHistoryGraph as WalletHistory | undefined
  );
  const walletPortfolioWithPnl = useAppSelector(
    (state) =>
      state.walletPortfolio.walletPortfolioWithPnl as PortfolioData | undefined
  );
  const isWalletPortfolioWithPnlLoading = useAppSelector(
    (state) => state.walletPortfolio.isWalletPortfolioWithPnlLoading as boolean
  );
  const isWalletPortfolioWithPnlErroring = useAppSelector(
    (state) => state.walletPortfolio.isWalletPortfolioWithPnlErroring as boolean
  );
  const isWalletHistoryGraphLoading = useAppSelector(
    (state) => state.walletPortfolio.isWalletHistoryGraphLoading as boolean
  );
  const isWalletHistoryGraphErroring = useAppSelector(
    (state) => state.walletPortfolio.isWalletHistoryGraphErroring as boolean
  );
  const periodFilter = useAppSelector(
    (state) => state.walletPortfolio.periodFilter as PeriodFilterBalance
  );
  const periodFilterPnl = useAppSelector(
    (state) => state.walletPortfolio.periodFilterPnl as PeriodFilterPnl
  );
  const selectedBalanceOrPnl = useAppSelector(
    (state) => state.walletPortfolio.selectedBalanceOrPnl as 'balance' | 'pnl'
  );

  const isBalanceGraph = selectedBalanceOrPnl === 'balance';

  // This gets the right color depending on the price value threshold, a callback is used
  // to make sure this only gets called if tokenDataInfo.price changes, otherwise the graph crashes
  const getGradient = useCallback(
    (ctx: CanvasRenderingContext2D, chartArea: ChartArea) => {
      const gradientBg = ctx.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom
      );

      // this changes the color of the line depending on a value threshold
      gradientBg.addColorStop(0, '#8A77FF');
      gradientBg.addColorStop(1, '#1E1D24');

      return gradientBg;
    },
    []
  );

  // This gets the right graph time scale (x) depending on the periodFilter selected. A callback is used
  // to make sure this only gets called if tokenDataGraph?.result.data changes, otherwise the graph crashes
  const graphXScale = useCallback(() => {
    if (isBalanceGraph) {
      if (walletHistoryGraph?.balance_history.length) {
        if (periodFilter === PeriodFilterBalance.HOUR) {
          return 'minute';
        }

        if (periodFilter === PeriodFilterBalance.DAY) {
          return 'hour';
        }

        if (periodFilter === PeriodFilterBalance.WEEK) {
          return 'day';
        }

        if (periodFilter === PeriodFilterBalance.MONTH) {
          return 'day';
        }

        if (periodFilter === PeriodFilterBalance.HALF_YEAR) {
          return 'month';
        }

        return 'hour';
      }

      return 'hour';
    }

    if (walletPortfolioWithPnl?.total_pnl_history) {
      if (periodFilterPnl === PeriodFilterPnl.DAY) {
        return 'hour';
      }

      if (periodFilterPnl === PeriodFilterPnl.WEEK) {
        return 'day';
      }

      if (periodFilterPnl === PeriodFilterPnl.MONTH) {
        return 'day';
      }

      if (periodFilterPnl === PeriodFilterPnl.YEAR) {
        return 'month';
      }

      return 'hour';
    }

    return 'hour';
  }, [
    isBalanceGraph,
    periodFilter,
    periodFilterPnl,
    walletHistoryGraph?.balance_history?.length,
    walletPortfolioWithPnl?.total_pnl_history,
  ]);

  const getPnlDataLabels = () => {
    const pnlHistory = walletPortfolioWithPnl?.pnl_history;

    if (!pnlHistory) return [];

    let entries: PnLEntry[] = [];

    switch (periodFilterPnl) {
      case PeriodFilterPnl.DAY:
        entries = pnlHistory['24h'];
        break;
      case PeriodFilterPnl.WEEK:
        entries = pnlHistory['7d'];
        break;
      case PeriodFilterPnl.MONTH:
        entries = pnlHistory['30d'];
        break;
      case PeriodFilterPnl.YEAR:
        entries = pnlHistory['1y'];
        break;
      default:
        entries = pnlHistory['24h'];
    }

    return entries.map(
      (entry) => convertDateToUnixTimestamp(parseISO(entry[0])) * 1000
    );
  };

  const getPnlDataSet = () => {
    const pnlHistory = walletPortfolioWithPnl?.pnl_history;

    if (!pnlHistory) return [];

    switch (periodFilterPnl) {
      case PeriodFilterPnl.DAY:
        return pnlHistory['24h'].map((entry) => entry[1].unrealized);
      case PeriodFilterPnl.WEEK:
        return pnlHistory['7d'].map((entry) => entry[1].unrealized);
      case PeriodFilterPnl.MONTH:
        return pnlHistory['30d'].map((entry) => entry[1].unrealized);
      case PeriodFilterPnl.YEAR:
        return pnlHistory['1y'].map((entry) => entry[1].unrealized);
      default:
        return [];
    }
  };

  const getGraphStepSize = () => {
    if (isBalanceGraph) {
      switch (periodFilter) {
        case PeriodFilterBalance.HOUR:
          return 10;
        case PeriodFilterBalance.DAY:
        case PeriodFilterBalance.MONTH:
          return 3;
        case PeriodFilterBalance.WEEK:
        case PeriodFilterBalance.HALF_YEAR:
          return 1;
        default:
          return 3;
      }
    }

    // PnL case
    switch (periodFilterPnl) {
      case PeriodFilterPnl.DAY:
      case PeriodFilterPnl.MONTH:
      case PeriodFilterPnl.YEAR:
        return 3;
      case PeriodFilterPnl.WEEK:
        return 1;
      default:
        return 3;
    }
  };

  const createGradient = (
    context: ScriptableContext<'line'>
  ): CanvasGradient | undefined => {
    const { chart } = context;
    const { ctx, chartArea } = chart;

    if (!chartArea) return undefined;

    return getGradient(ctx, chartArea);
  };

  const flatLineData: ChartData<'line'> = {
    labels: [Date.now() - 1000 * 60 * 60, Date.now()], // 1 hour apart
    datasets: [
      {
        label: 'Flat line',
        data: [
          { x: Date.now() - 1000 * 60 * 60, y: 1 },
          { x: Date.now(), y: 1 },
        ],
        borderColor: '#B8B4FF',
        borderWidth: 2,
        backgroundColor: (ctx: ScriptableContext<'line'>) =>
          createGradient(ctx),
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const hasBalanceData =
    isBalanceGraph && walletHistoryGraph?.balance_history.length;
  const hasPnlData = !isBalanceGraph && getPnlDataSet().length > 0;

  // This gives us the right dataset for the graph
  const data: ChartData<'line'> =
    hasBalanceData || hasPnlData
      ? {
          labels: isBalanceGraph
            ? walletHistoryGraph?.balance_history.map((x) => x[0])
            : getPnlDataLabels(),
          datasets: [
            {
              label: 'Token price',
              data: isBalanceGraph
                ? walletHistoryGraph?.balance_history.map(
                    (price) => price[1]
                  ) || []
                : getPnlDataSet(),
              borderColor: '#B8B4FF',
              borderWidth: 2,
              backgroundColor: (ctx: ScriptableContext<'line'>) =>
                createGradient(ctx),
              fill: true,
              tension: 0.4,
              pointRadius: 0,
            },
          ],
        }
      : flatLineData;

  // The options used to customize the UI of the graph
  const options: ChartOptions<'line'> = {
    onHover: (event, chartElements) => {
      if (chartElements.length > 0 && (hasBalanceData || hasPnlData)) {
        const { datasetIndex, index } = chartElements[0];
        const dataset = data.datasets[datasetIndex];
        const value = dataset.data[index] as number;
        setHoverValue(value);
      } else {
        setHoverValue(undefined);
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'xy',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'Token price history',
      },
      filler: {
        drawTime: 'beforeDatasetDraw',
        propagate: true,
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const timestampValue = tooltipItems[0].parsed.x;
            return format(new Date(timestampValue), 'HH:mm, MMM d');
          },
          label: () => '',
        },
        backgroundColor: 'transparent',
        titleFont: {
          size: 10,
          weight: 'normal',
        },
        titleColor: 'rgba(255, 255, 255, 0.7)',
      },
    },
    scales: {
      x: {
        offset: false,
        type: 'time',
        time: {
          unit: graphXScale() || 'day',
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm',
            day: 'dd MMM',
            month: 'MMM y',
          },
        },
        border: {
          width: 0,
        },
        grid: {
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          z: 1,
          padding: -20,
          font: {
            weight: 400,
            size: 10,
          },
          stepSize: getGraphStepSize(),
          color: '#DDDDDD',
        },
      },
      y: { display: false },
    },
  };

  if (selectedBalanceOrPnl === 'balance' && isWalletHistoryGraphLoading) {
    return (
      <div className="flex w-full rounded-[10px] animate-pulse desktop:h-full tablet:h-[150px] mobile:h-[150px] bg-white/[.5]" />
    );
  }

  if (selectedBalanceOrPnl === 'pnl' && isWalletPortfolioWithPnlLoading) {
    return (
      <div className="flex w-full rounded-[10px] animate-pulse desktop:h-full tablet:h-[150px] mobile:h-[150px] bg-white/[.5]" />
    );
  }

  if (selectedBalanceOrPnl === 'balance' && isWalletHistoryGraphErroring) {
    return (
      <div className="flex items-center justify-center w-full h-[300px]">
        <Body className="italic text-percentage_red font-normal">
          Failed to load your wallet balance history.
        </Body>
      </div>
    );
  }

  if (selectedBalanceOrPnl === 'pnl' && isWalletPortfolioWithPnlErroring) {
    return (
      <div className="flex items-center justify-center w-full h-[300px]">
        <Body className="italic text-percentage_red font-normal">
          Failed to load your wallet PnL history.
        </Body>
      </div>
    );
  }

  return (
    <>
      <Body>
        <span className="font-normal text-white/[.5] pl-3.5">
          Total Value:{' '}
        </span>
        <span
          className={`font-normal ${hoverValue ? 'text-white' : 'text-white/[.5]'}`}
        >
          {hoverValue ? `$${limitDigitsNumber(hoverValue)}` : '$0.00'}
        </span>
      </Body>
      <div
        id="wallet-portfolio-tile-balance-graph"
        className="flex w-[99%] h-full rounded-b-xl mobile:mb-0"
      >
        <Line data={data} options={options} data-testid="price-graph" />
      </div>
    </>
  );
};

export default BalancePnlGraph;
