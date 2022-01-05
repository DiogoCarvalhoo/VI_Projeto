function loadInitialHealth() {


    // Graphs Dimensions
    margin = 80;
    width = 700 - margin - margin;
    height = 400 - margin - margin;


    // Get the data from the selected year
    medics_by_speciality_data = medicsspeciality_data['Total'];


    // append the svg object to the body of the page
    const medics_by_speciality_svg = d3.select("#medics_by_speciality_graph")
        .attr("width", width + margin + margin)
        .attr("height", height + margin + margin)
        .append("g")
        .attr("transform", `translate(${margin},${margin})`);

    // Add X axis --> it is a date format
    const xScale = d3.scaleTime()
        .domain(d3.extent(medics_by_speciality_data, function(d) {  return d.year; }))
        .range([ 0, width ]);

    var xAxis = medics_by_speciality_svg.append("g")
        .attr("transform", "translate(0," + height + ")")
    xAxis.call(d3.axisBottom(xScale))

    console.log(xAxis)


    medics_by_speciality_svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    // Add Y axis
    const yScale = d3.scaleLinear()
        .domain([   
                0, 
                d3.max(medics_by_speciality_data, function(d) {  return +d.value  }) + 5000
                ])
        .range([ height, 0 ]);
    medics_by_speciality_svg.append("g")
        .call(d3.axisLeft(yScale));


    // This allows to find the closest X index of the mouse:
    var bisect = d3.bisector(function(d) { return d.year; }).left;

    // Create the circle that travels along the curve of chart
    var focus = medics_by_speciality_svg
    .append('g')
    .append('circle')
        .style("fill", "none")
        .attr("stroke", "black")
        .attr('r', 8.5)
        .style("opacity", 0)

    // Create the text that travels along the curve of chart
    var focusText = medics_by_speciality_svg
    .append('g')
    .append('text')
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")

    // Add the line
    medics_by_speciality_svg.append("path")
        .datum(medics_by_speciality_data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { return xScale(d.year) })
        .y(function(d) { return yScale(d.value) })
        )


    // Create a rect on top of the svg area: this rectangle recovers mouse position
    medics_by_speciality_svg
        .append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);


    
    // What happens when the mouse move -> show the annotations at the right positions.
    function mouseover() {
        focus.style("opacity", 1)
        focusText.style("opacity",1)
    }

    function mousemove(mouse) {
        // recover coordinate we need
        var x0 = xScale.invert(d3.pointer(mouse)[0]);
        var i = bisect(medics_by_speciality_data, x0, 1);
        selectedData = medics_by_speciality_data[i]
        focus
        .attr("cx", xScale(selectedData.year))
        .attr("cy", yScale(selectedData.value))
        focusText
        .html(selectedData.year + "  -  " + selectedData.value)
        .attr("x", xScale(selectedData.year)+15 )
        .attr("y", yScale(selectedData.value))
        }
    function mouseout() {
        focus.style("opacity", 0)
        focusText.style("opacity", 0)
    }
    
    loadTitles(medics_by_speciality_svg, "Número de Médicos", "Ano", "Número de médicos por especialidade", "Fonte: PORDATA, 2021")
}




// Function to create histogram title, x_axis_title, y_axis_title and source text
function loadTitles(svg, titleY, titleX, title, source) {
    margin = 0
    // Title Y
    svg.append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4 - 60)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(titleY)

    // Title X
    svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', 280)
        .attr('text-anchor', 'middle')
        .text(titleX)

    // Title
    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .text(title)

    // Source
    svg.append('text')
        .attr('class', 'source')
        .attr('x', width - margin / 2 - 150)
        .attr('y', 300)
        .attr('text-anchor', 'start')
        .text(source)

}