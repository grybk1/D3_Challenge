// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);




// Load data from hours-of-tv-watched.csv
d3.csv("/assets/data/data.csv").then(function(Data) {

  // Print the tvData
  console.log(Data);
  console.log('test');


    //cast as numbers
  Data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    console.log(data.poverty)

  });

  //scale function
  var xLinearScale = d3.scaleLinear()
  .domain([20, d3.max(Data, d => d.poverty)])
  .range([0, width]);

var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(Data, d => d.healthcare)])
  .range([height, 0]);


//create axis
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

//add to chart
chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
chartGroup.append("g")
      .call(leftAxis);

//plot circles
var circlesGroup = chartGroup.selectAll("circle")
      .data(Data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "pink")
      .attr("opacity", ".5");

// //add tooltips
// var toolTip = d3.tip()
// .attr("class", "tooltip")
// .offset([80, -60])
// .html(function(d) {
//   return (`${d.rockband}<br>Hair length: ${d.poverty}<br>Hits: ${d.healthcare}`);
// });
// chartGroup.call(toolTip);

circlesGroup.on("click", function(data) {
  toolTip.show(data, this);
})
 // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

      chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
 //     .text("Hair Metal Band Hair Length (inches)");
  }).catch(function(error) {
    console.log(error);
});




