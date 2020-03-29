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
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(function(stateData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function(data) {
       data.poverty = +data.poverty;
       data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => d.poverty)])
//      .domain([0, 40])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "cornflowerblue")
    .attr("opacity", ".5")
//  .text(d=> d.abbr);    
   .html(function(d) {
      return (`<text class="abbr">${d.abbr}</text>`);
    });
//    .attr("text", d => d.state);
     
// circlesGroup.append("html")
//       .data(stateData)
//       .enter()
//       .append("text")
//       .attr("cx", d => xLinearScale(d.poverty))
//       .attr("cy", d => yLinearScale(d.healthcare))
//       .text(d=> d.abbr)    
//       .html(function(d) {
//       return (`<text class="abbr">${d.abbr}</text>`);
//      });
      
      

// Add Text to circle
 /* Create the text for each block */
  // chartGroup.append("text")
  // .attr("dx", function(d){return -20})
  // .text(function(d){return 'TT'})


 //  .attr({
//    "text-anchor": "middle",
//    "font-size": function(d) {
//      d='TT'
//      return d.r / ((d.r * 10) / 100);
//    },
//    "dy": function(d) {
//      return d.r / ((d.r * 25) / 100);
//    }
//  });

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty Rate: ${d.poverty}<br>Uninsured Rate: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
//    circlesGroup.on("click", function(data) {
  circlesGroup.on("mouseover", function(data) {
     toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% of Persons Without Health Care ");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty Rate");
  }).catch(function(error) {
    console.log(error);
  });
