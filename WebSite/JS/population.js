function loadInitialPopulation() {

    /*
        Histogram Creation Section
    */

    // Get selected year
    selected_histogram_year = document.getElementById("age_population_year_selection").value;
    
    // Get the data from the selected year
    histogram_data = age_population_data[selected_histogram_year];

    // Dimensions
    margin = 80;
    width = 700 - 2 * margin;
    height = 400 - 2 * margin;

    // Histogram construction
    svg_histogram = d3.select('#age_population_year_graph');

    histogram = svg_histogram.append("svg")
                .attr("width", width + 2 * margin)
                .attr("height", height + 2 * margin)
                .append("g")
                .attr("transform", "translate(" + margin + "," + margin + ")");

    // X axis
    const histogram_xScale = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
    var histogram_xAxis = histogram.append("g")
        .attr("transform", "translate(0," + height + ")")

    // Y axis
    const histogram_yScale = d3.scaleLinear()
        .range([ height, 0]);
    var histogram_yAxis = histogram.append("g")
        .attr("class", "myYaxis")

    // Add event when user changes the selected year
    d3.select('#age_population_year_selection')
        .on('change', function() {
        year = this.value;
        new_histogram_data = age_population_data[year];
        updateHistogram(new_histogram_data,  histogram_xScale, histogram_xAxis, histogram_yScale, histogram_yAxis);
    });

    // Create Tiles 
    loadTitles( svg_histogram, "Número de Pessoas", "Faixa Etária", "População por Faixa Etária", "Source: INE, 2020")
    
    // Initialize Histogram
    updateHistogram(histogram_data, histogram_xScale, histogram_xAxis, histogram_yScale, histogram_yAxis)

    /*
        End of Histogram Creation Section
    */
}


// Function to create histogram title, x_axis_title, y_axis_title and source text
function loadTitles(svg, titleY, titleX, title, source) {

    // Title Y
    svg.append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4 - 15)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(titleY)

    // Title X
    svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', 360)
        .attr('text-anchor', 'middle')
        .text(titleX)

    // Title
    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text(title)

    // Source
    svg.append('text')
        .attr('class', 'source')
        .attr('x', width - margin / 2)
        .attr('y', 380)
        .attr('text-anchor', 'start')
        .text(source)

}


// Function to update histogram
function updateHistogram(data,  xScale, xAxis, yScale, yAxis) {
    // X axis
    xScale.domain(data.map(function(d) { return d.type; }))
    xAxis.transition().duration(1000).call(d3.axisBottom(xScale))

    // Add Y axis
    yScale.domain([0, d3.max(data, function(d) { return +d.value }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(yScale));
    
    // Remove old bars and grid
    histogram.selectAll("g > .grid").remove()
    histogram.selectAll("g > .bar").remove()
    
    // Create new grid
    makeYLines = () => d3.axisLeft().scale(yScale)
    histogram.append('g')
    .attr('class', 'grid')
    .style('opacity', 0.5)
    .transition()
    .duration(1000)
    .call(makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat(''))

    // variable u: map data to existing bars
    var u = histogram.selectAll()
                .data(data)
                .enter()
                .append("g")

    // update bars
    u.append('rect')
        .merge(u)
        .attr('class', 'bar')
        .attr('x', (g) => xScale(g.type))
        .attr('y', (g) => yScale(g.value))
        .transition()
        .duration(1000)
        .attr('height', (g) => height - yScale(g.value))
        .attr('width', xScale.bandwidth())

    u.on('mouseenter', function (actual, i) {
        // Bar selection animation
        d3.select(this)
            .attr('opacity', 0)
        d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 1)
        
        // Get bar height
        const y = yScale(i.value)

        // Show line
        histogram.append('line')
            .attr('id', 'limit')
            .attr('x1', 0)
            .attr('y1', y)
            .attr('x2', width)
            .attr('y2', y)
        
        // Show bar value
        u.append('text')
            .attr('class', 'value')
            .style('fill', 'white')
            .attr('x', (a) => xScale(a.type) + xScale.bandwidth() / 2 )
            .attr('y', (a) => yScale(a.value) - 8)
            .attr('text-anchor', 'middle')
            .text((a, idx) => {
                return a.type === i.type ? `${a.value}` : '';
            })
    })

    u.on('mouseleave', function () {
        // Remove line and value
        svg_histogram.selectAll('#limit').remove()
        svg_histogram.selectAll('.value').remove()
    })
}

/*
    End of Histogram Section
*/