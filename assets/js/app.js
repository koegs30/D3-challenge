var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Retrieve data from the CSV and execute below
d3.csv("assets/data/healthData.csv").then(function(healthData, err) {
  if (err) throw err;
  console.log(healthData);

  //parse data and make numbers
  healthData.forEach(function(d) {
    d.healthcare = +d.healthcare;
    d.poverty = +d.poverty;
    d.abbr = d.abbr;
  });
  // Create scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d.poverty)-1, d3.max(healthData, d => d.poverty)])
    .range([0,width]);

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d.healthcare)-1, d3.max(healthData, d => d.healthcare)])
    .range([height,0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append axes to chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  //Create circles
  chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill","navy")
    .attr("opacity", ".7")
    .attr("stroke","blue");
  
  // Add text to circles
  chartGroup.selectAll("text circles-text")
    .data(healthData)
    .enter()
    .append("text")
    .classed("circles-text",true)
    .text(d => d.abbr)
    .attr("x",d => xLinearScale(d.poverty))
    .attr("y",d => yLinearScale(d.healthcare))
    .attr("dy",5)
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill","white");

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left +30)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
    
}).catch(function(error) {
  console.log(error);
});