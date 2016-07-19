function addAxesAndLegend (svg, xAxis, yAxis, margin, chartWidth, chartHeight, labels) {
  var legendWidth  = chartWidth,
      legendHeight = 200;

  // clipping to make sure nothing appears behind legend
  svg.append('clipPath')
    .attr('id', 'axes-clip')
    .append('polygon')
      .attr('points', (-margin.left)                 + ',' + (-margin.top)                 + ' ' +
                      (chartWidth - legendWidth - 1) + ',' + (-margin.top)                 + ' ' +
                      (chartWidth - legendWidth - 1) + ',' + legendHeight                  + ' ' +
                      (chartWidth + margin.right)    + ',' + legendHeight                  + ' ' +
                      (chartWidth + margin.right)    + ',' + (chartHeight + margin.bottom) + ' ' +
                      (-margin.left)                 + ',' + (chartHeight + margin.bottom));

  var axes = svg.append('g')
    .attr('clip-path', 'url(#axes-clip)');

  axes.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + chartHeight + ')')
    .call(xAxis);

  axes.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 5)
      .attr('dy', '1em')
      .attr('dx', '-0.5em')
      .style('text-anchor', 'end')
      .text('Count');

  var legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(0, ' + (chartHeight + margin.bottom - legendHeight) + ')');

  legend.append('rect')
    .attr('class', 'legend-bg')
    .attr('width',  legendWidth)
    .attr('height', legendHeight);

  var initX = 10;
  var initY = 15;
  var incrementX = 230;
  var incrementY = 25;
  var lineWidth = 75;
  var x = initX;
  var y = initY;
  var overflow = false;

  d3.selectAll(labels).each(function(d, i) {
    var label = labels[i];
    if (overflow) {
        console.log('label for "' + label + '" was not drawn.');
    }else{
      legend.append('path')
        .attr('class', 'c-' + label.replace(/ /g, "_"))
        .attr('d', 'M'+x+','+y+'L'+(parseInt(x,10)+parseInt(lineWidth,10))+','+y);
      legend.append('text')
        .attr('x', (x + lineWidth + 25))
        .attr('y', y)
        .attr('alignment-baseline', 'middle')
        .text(label);

        if (y > legendHeight - incrementY){
          x += incrementX;
          y = initY;
          if (x > legendWidth - incrementX) { overflow = true; }
        }else{
          y += incrementY;
        }
    }
  });
}

function drawPaths (svg, data, x, y, labels) {

  svg.datum(data);

  d3.selectAll(labels).each(function(d, i) {
    var label = labels[i];

    var line = d3.svg.line()
      .interpolate('basis')
      .x(function (d) { return x(d.date); })
      .y(function (d) { return y(d[label]); });

    svg.append('path')
      .attr('class', 'c-' + label.replace(/ /g, "_"))
      .attr('d', line)
      .attr('clip-path', 'url(#rect-clip)');
  })

}

function startTransitions (svg, chartWidth, chartHeight, rectClip) {
  rectClip.transition()
    .duration(900)
    .attr('width', chartWidth);
}

function makeChart (data, min, max, labels) {
  var svgWidth  = 800,
      svgHeight = 500,
      margin = { top: 20, right: 25, bottom: 240, left: 40 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var x = d3.time.scale().range([0, chartWidth])
            .domain(d3.extent(data, function (d) { return d.date; })),
      y = d3.scale.linear().range([chartHeight, 0])
            .domain([min, max]);

  var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
      yAxis = d3.svg.axis().scale(y).orient('left')
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

  var svg = d3.select('body').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // clipping to start chart hidden and slide it in later
  var rectClip = svg.append('clipPath')
    .attr('id', 'rect-clip')
    .append('rect')
      .attr('width', 0)
      .attr('height', chartHeight);

  addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight, labels);
  drawPaths(svg, data, x, y, labels);
  startTransitions(svg, chartWidth, chartHeight, rectClip);
}

var parseDate  = d3.time.format('%Y/%m/%d').parse;

d3.json('data1.shtm?year=2016', function (error, rawData) {

  if (error) {
    console.error(error);
    return;
  }

  var labels = [];
  var min =0 , max = 0, dpos = 0;

  var data = rawData.map(function (d, i) {

    d.date = parseDate(d.date);

    if (i === 0) {
      labels = d3.keys(d);
      dpos = labels.indexOf('date');
      labels.splice(dpos, 1);
    }

    var values = d3.values(d);
    values.splice(dpos, 1);

    var _min = d3.min(values);
    min = _min < min ? _min : min;
    var _max = d3.max(values);
    max = _max > max ? _max : max;

    return d;
  });

  makeChart(data, min, max, labels);

 });
