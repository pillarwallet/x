import { 
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartData,
  Filler,
  ScriptableContext,
  Scale,
  ChartOptions,
  ChartArea,
  CoreScaleOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

type Scales = {
  [key: string]: Scale<CoreScaleOptions>;
};

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
);

const TokenGraph = () => {
  const getGradient = (ctx: CanvasRenderingContext2D, chartArea: ChartArea, scales: Scales) => {
    const gradientBg = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    const percentage = (scales.y.getPixelForValue(30) - chartArea.top) / chartArea.height;

    // this change the color of line depending on a value threshold
    // TODO change the threshold of 30 to independant token threshold
    gradientBg.addColorStop(0, '#6CFF00');
    gradientBg.addColorStop(percentage, '#6CFF00');
    gradientBg.addColorStop(percentage, '#FF005C');
    gradientBg.addColorStop(1, '#FF005C');

    return gradientBg;
  };

  const createGradient = (context:  ScriptableContext<'line'>): CanvasGradient | undefined => {
    const chart = context.chart;
    const {ctx, chartArea, scales } = chart;

    if (!chartArea) return;

    return getGradient(ctx, chartArea, scales);
  };

  // TODO: change dummy data
  const data: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
        label: 'Token graph',
        data: [40, 70, 3, 76, 56, 30, 32],
        borderColor: (ctx: ScriptableContext<'line'>) => createGradient(ctx),
        tension: 0.4,
        pointRadius: 0,
      }
    ]
  };

  // This draws the threshold dotted line
  const horizontalDottedLine = {
    id: 'horizontalDottedLine',
    beforeDatasetDraw(chart: ChartJS) {
      const { ctx, chartArea: {left, width}, scales: { y }} = chart;
      ctx.save();

      ctx.strokeStyle = 'white';
      ctx.setLineDash([7, 7]);
      ctx.lineWidth = 2;
      ctx.strokeRect(left, y.getPixelForValue(30), width, 0);
      ctx.restore();
    }
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
      filler: {
        drawTime: 'beforeDatasetDraw',
        propagate: true,
      },
      legend: {
        display: false,
      }
    },
    scales: {
      x: {
        border: {
          width: 0,
        },
        grid: {
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          font: {
            weight: 600,
            size: 9,
          },
          color: '#DDDDDD'
        }
      },
      y: {
        border: {
          width: 0,
        },
        grid: {
          drawOnChartArea: false,
          drawTicks: false,
        },
        position: 'right',
        ticks: {
          showLabelBackdrop: true,
          backdropColor: ctx => ctx.tick.value === 30 ? '#6CFF00' : 'rgba(49, 49, 49, 0.5)',
          backdropPadding: 3,
          font: {
            weight: 600,
            size: 9,
          },
          color: ctx => ctx.tick.value === 30 ? '#313131' : '#DDDDDD',
        }
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  
return (
    <div className='flex w-[99%] mb-20 h-full max-h-[400px] mobile:mb-0'>
      <Line data={data} options={options} plugins={[horizontalDottedLine]}/>
    </div>
  );
};

export default TokenGraph;
