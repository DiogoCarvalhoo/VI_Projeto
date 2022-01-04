// Esperança media de vida ao longo dos anos
let dataset2 =  {
    1970: 67.1,
    1971: 66.8,
    1972: 68.5,
    1973: 67.6,
    1974: 68.2,
    1975: 68.4,
    1976: 69.0,
    1977: 70.1,
    1978: 70.5,
    1979: 71.0,
    1980: 71.1,
    1981: 71.7,
    1982: 72.5,
    1983: 72.4,
    1984: 72.6,
    1985: 72.9,
    1986: 73.4,
    1987: 73.8,
    1988: 73.8,
    1989: 74.4,
    1990: 74.1,
    1991: 74.1,
    1992: 74.4,
    1993: 74.6,
    1994: 75.0,
    1995: 75.4,
    1996: 75.3,
    1997: 75.5,
    1998: 75.8,
    1999: 76.0,
    2000: 76.4,
    2001: 76.7,
    2002: 77.0,
    2003: 77.4,
    2004: 77.7,
    2005: 78.2,
    2006: 78.5,
    2007: 78.7,
    2008: 78.9,
    2009: 79.3,
    2010: 79.6,
    2011: 79.8,
    2012: 80.0,
    2013: 80.2,
    2014: 80.4,
    2015: 80.6,
    2016: 80.8,
    2017: 80.8,
    2018: 80.9,
    2019: 81.1
}


// Populaçao por genero [masculino, feminino]
let dataset3 = {
    1960: [4254416, 4634976],
    1970: [4109360, 4553892],
    1981: [4737715, 5095299],
    1991: [4756775, 5110372],
    2001: [5000141, 5355976],
    2011: [5046600, 5515578],
    2021: [4917794, 5430098]
}








/*
    Histogram
*/
// Get selected year
selected_histogram_year = document.getElementById("age_population_year_selection").value;
// Get the data from the selected year
histogram_data = age_population_data[selected_histogram_year];

// Add event when user changes the selected year
d3.select('#age_population_year_selection')
    .on('change', function() {
    year = this.value;
    new_histogram_data = age_population_data[year];
    update(new_histogram_data);
});

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
const xScale = d3.scaleBand()
    .range([0, width])
    .padding(0.1)
var xAxis = histogram.append("g")
    .attr("transform", "translate(0," + height + ")")

// Y axis
const yScale = d3.scaleLinear()
    .range([ height, 0]);
var yAxis = histogram.append("g")
    .attr("class", "myYaxis")


// Title Y
svg_histogram.append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4 - 15)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Número de pessoas')

// Title X
svg_histogram.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', 360)
    .attr('text-anchor', 'middle')
    .text('Faixa etária')

// Title
svg_histogram.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('População por faixa etária')

// Source
svg_histogram.append('text')
    .attr('class', 'source')
    .attr('x', width - margin / 2)
    .attr('y', 380)
    .attr('text-anchor', 'start')
    .text('Source: INE, 2020')

// Function to update histogram
function update(data) {
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

// Initialize graph
update(histogram_data)






/*
    Scatter Plot
*/





/*
    Pie chart
*/


