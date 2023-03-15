import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Grid } from '@material-ui/core';

const chartTypes = ['pie', 'line', 'column', 'bar'];

const getOptions = (type, chartData, valueTitles, chartInfo) => ({
  title: {
    text: '',
  },
  chart: {
    type,
  },
  xAxis: {
    categories: chartData.map(data => data.category),
  },
  yAxis: {
    title: {
      text: '',
    },
  },
  series: valueTitles.map((title, index) => ({
    name: title,
    data: chartData.map(data => data[`value${index + 1}`]),
  })),
  legend: {
    enabled: chartInfo.showLegend,
  },
});

const AddChart = ({ onAddChart }) => {
  const [jsonInput, setJsonInput] = useState('');

  const handleAddChart = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      onAddChart(parsedJson);
      setJsonInput('');
    } catch (error) {
      console.error('Invalid JSON input');
    }
  };

  return (
    <div>
      <textarea
        value={jsonInput}
        onChange={e => setJsonInput(e.target.value)}
        placeholder="Insert JSON here"
      />
      <button onClick={handleAddChart}>+</button>
    </div>
  );
};

const Chart = ({ chartData, chartInfo, valueTitles, onTypeChange }) => {
  const [chartType, setChartType] = useState('line');

  const handleTypeChange = e => {
    const newType = e.target.value;
    setChartType(newType);
    onTypeChange(newType);
  };

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={getOptions(chartType, chartData, valueTitles, chartInfo)}
      />
      <select value={chartType} onChange={handleTypeChange}>
        {chartTypes.map(type => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};

const App = () => {
  const [charts, setCharts] = useState([]);

  const handleAddChart = chart => {
    setCharts([...charts, chart]);
  };

  return (
    <div>
      <AddChart onAddChart={handleAddChart} />
      <Grid container spacing={3}>
        {charts.map((chart, index) => (
          <Grid key={index} item xs={12} md={6} lg={3}>
            <Chart
              chartData={chart.currentData.chartData}
              chartInfo={chart.currentData.chartInfo}
              valueTitles={chart.currentData.chartInfo.valueTitles}
              onTypeChange={type => console.log(`Chart ${index + 1} changed to ${type}`)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default App;
