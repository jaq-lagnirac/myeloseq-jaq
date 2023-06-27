import { PropTypes } from 'prop-types';
import { ResponsiveLine } from '@nivo/line';

const JsonPlot = ({ order }) => {
  console.log('JsonPlot()');

  const parseVafs = () => {
    const tier13 = order['VARIANTS']['TIER1-3'];
    console.log(tier13);
    if (!('data' in tier13)) {
      return;
    } else {
      const vafs = {};
      const seenDates = {};
      for (const variant of tier13.data) {
        const name = `${variant[7]} (${variant[11]})`;
        console.log(name);
        vafs[name] = {};
        const priorCases = variant[20].split(',');
        for (const priorCase of priorCases) {
          const priorData = priorCase.split('|');
          console.log(priorData);
          const date = Date.parse(priorData[1].split('_')[0]);
          //const date = priorData[1];
          const vaf = priorData[3].replace('%', '');
          vafs[name][date] = parseFloat(vaf);
          seenDates[date] = true;
        }
        const currentDate = Date.parse(order.CASEINFO.date.split('_')[0]);
        const currentVaf = variant[17];
        vafs[name][currentDate] = parseFloat(currentVaf.replace('%', ''));
      }

      for (const name in vafs) {
        for (const date in seenDates) {
          if (!(date in vafs[name])) {
            vafs[name][date] = -1;
          }
        }
      }

      return vafs;
    }
  };

  const vafs = parseVafs(order);
  console.log(vafs);

  const plotData = [];
  for (const variantName in vafs) {
    const variantData = {
      id: variantName,
      color: 'hsl(134, 70%, 50%)',
      data: []
    };
    for (const date in vafs[variantName]) {
      variantData.data.push({ x: date, y: vafs[variantName][date] });      
    }
    plotData.push(variantData);
  }

  const MyResponsiveLine = ({ data }) => (
    <ResponsiveLine
      data={data}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'count',
        legendOffset: -40,
        legendPosition: 'middle'
      }}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'transportation',
        legendOffset: 36,
        legendPosition: 'middle'
      }}
    />
  );

  /*
  const MyResponsiveLine = ({ data }) => (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'transportation',
        legendOffset: 36,
        legendPosition: 'middle'
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'count',
        legendOffset: -40,
        legendPosition: 'middle'
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
    />
  );
  */

  MyResponsiveLine.propTypes = {
    data: PropTypes.array.isRequired
  };

  return <MyResponsiveLine
    data={plotData}
  />;
};

JsonPlot.propTypes = {
  order: PropTypes.object.isRequired
};

export default JsonPlot;