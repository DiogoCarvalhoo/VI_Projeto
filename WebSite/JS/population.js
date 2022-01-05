function loadInitialPopulation() {


    // Graphs Dimensions
    margin = 80;
    width = 700 - 2 * margin;
    height = 400 - 2 * margin;


    /*
        Histogram Creation Section
    */

    // Get selected year
    selected_histogram_year = document.getElementById("age_population_year_selection").value;
    
    // Get the data from the selected year
    histogram_data = age_population_data[selected_histogram_year];

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




    /*
        Dot Graph Creation Section
    */

    // Get the data
    dot_graph_data = esperanca_media_vida_data;

    // Dot Graph Construction
    svg_dot_graph = d3.select("#esperanca_media_vida_graph")
            .attr("width", width + margin + margin)
            .attr("height", height + margin + margin);
    
    var chart = svg_dot_graph.append('g').attr("transform",
            "translate(" + margin + "," + margin + ")");

    // X axis
    const dot_graph_xScale = d3.scaleBand()
        .range([ 0, width ])
        .domain(dot_graph_data.map(function(d) { return d.year; }))
        .padding(0.5);
    
    // Y axis
    const dot_graph_yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([ height, 0]);

    // Initialize Dot_Graph
    initialize_dot_graph(dot_graph_data, svg_dot_graph, chart, dot_graph_xScale, dot_graph_yScale)

    // Create Tiles 
    loadTitles(svg_dot_graph, 'Esperança Média de Vida', 'Anos', 'Esperança Média de Vida', 'Source: INE, 2020')


    /*
        End of Dot Graph Creation Section
    */





    /*
        Portugal Map
    */
    portugal_map()

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



/*
    Histogram Related Functions
*/

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
    End of Histogram Related Functions
*/



/*
    Dot Graph Related Functions
*/

// Function to initialize dot graph
function initialize_dot_graph(dot_graph_data, svg, chart, dot_graph_xScale, dot_graph_yScale) {

    // create a tooltip
    var Tooltip = d3.select("#container2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
    
    chart.append("g")
        .call(d3.axisLeft(dot_graph_yScale));
        
    chart.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(dot_graph_xScale))
        .selectAll("text")
            .attr("opacity", function(d) { return d % 2 == 0 ? 1 : 0 })
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
            
    // Lines
    chart.selectAll("myline")
        .data(dot_graph_data)
        .enter()
        .append("line")
            .attr("x1", function(d) { return dot_graph_xScale(d.year); })
            .attr("x2", function(d) { return dot_graph_xScale(d.year); })
            .attr("y1", dot_graph_yScale(0))
            .attr("y2", dot_graph_yScale(0))
            .attr("stroke", "")
            .attr("opacity", function(d) { return d.year % 2 == 0 ? 1 : 0 })


    const circleGroups = chart.selectAll()
        .data(dot_graph_data)
        .enter()
        .append('g')
            
    // Circles
    circleGroups.append("circle")
        .attr("cx", function(d) { return dot_graph_xScale(d.year); })
        .attr("cy", dot_graph_yScale(0))
        .attr("r", "4")
        .style("fill", "#69b3a2")
        .attr("stroke", "none")

        .on('mouseenter', function (actual, i) {
            d3.select(this)
                .attr('opacity', 0)
                
            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 1)
            
            // Show line
            line = chart.append('line')
                .attr('id', 'limit')
                .attr('x1', 0)
                .attr('y1', dot_graph_yScale(i.value))
                .attr('x2', width)
                .attr('y2', dot_graph_yScale(i.value))
            
            Tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        
            })

        .on('mousemove', function(mouse, d) {
            Tooltip
                .html("Ano: " + d.year + "<br>Valor: " + d.value)
                .style("left", (d3.pointer(mouse)[0]+285) + "px")
                .style("top", (d3.pointer(mouse)[1]+410) + "px")
                .style("color", "black")
            })
        
        // On mouse leave, remove the line and the bar value
        .on('mouseleave', function () {
            d3.select(this)

            svg_dot_graph.selectAll('#limit').remove()
            svg_dot_graph.selectAll('.value').remove()

            Tooltip
            .style("opacity", 0)
            d3.select(this)
            .style("stroke", "none")
            .style("opacity", 1)
        })

            
    // Change the X coordinates of line and circle
    chart.selectAll("circle")
        .transition("initialCircles")
        .duration(2000)
        .attr("cy", function(d) { return dot_graph_yScale(d.value); })


    chart.selectAll("line")
        .transition("initialLines")
        .duration(2000)
        .attr("y1", function(d) { return dot_graph_yScale(d.value); })

}

/*
    End of Dot Graph Related Functions
*/



/*
    Portugal Map Related Functions
*/
function portugal_map() {

    // create a tooltip
    var Tooltip = d3.select("#container4")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("color", "black")
        

    var mouseover = function(d) {
        Tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", "2px")
    }
    var mousemove = function(event, i) {
        pos = d3.select("#container4").node().getBoundingClientRect();
        pos["x"] += d3.pointer(event)[0]
        pos["y"] += d3.pointer(event)[1]
        
        Tooltip.html("Distrito: " + i.properties.name + "<br>Densidade: " + population_density[i.properties.name])
            .style("left", pos["x"] - 60 + "px")
            .style(
                "top",
                window.pageYOffset + pos["y"] - 80 + "px"
            );

        }
    var mouseleave = function(d) {
        Tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
    }

    const svg = d3.select("#portugal_map")

    // Map and projection
    const projection = d3.geoMercator()
    .center([-10, 42])                // GPS of location to zoom on
    .scale(5000)                       // This is like the zoom
    .translate([ width/2, height/2 ])

    // Load external data and boot
    d3.json("Data/portugal_map_coords.json").then( function(data){

        // Update coords to move azores closer to Portugal and reduce its size
        azores_coords = data.features[1].geometry.coordinates
        data.features[1].geometry.coordinates = azores_coords.map(elem => {
            line = elem.map(element => {
                coords = element.map(values => {
                    return [ parseFloat(values[0]) / 3 - 2 , parseFloat(values[1]) / 3 + 28 ]
                })
                return coords
            })
            return line
        })

        // Update coords to move madeira closer to Portugal
        madeira_coords = data.features[2].geometry.coordinates
        data.features[2].geometry.coordinates = madeira_coords.map(elem => {
            line = elem.map(element => {
                coords = element.map(values => {
                    return [ parseFloat(values[0]) + 5.5 , parseFloat(values[1]) + 6.2]
                })
                return coords
            })
            return line
        })

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .join("path")
            .attr("fill", function (value, i) {
                density = population_density[value.properties.name]
                if (density >= 500) {
                    return "#4d4d4d";
                }
                if ( 300 <= density && density < 500) {
                    return "#737373"
                }
                if ( 150 <= density && density < 300) {
                    return "#999999"
                }
                if ( 75 <= density && density < 150) {
                    return "#bfbfbf"
                }
                if ( 75 > density ) {
                    return "#d9d9d9"
                }
            })
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "none")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

            
    })

    // Rectangle over Azores
    svg.append("rect")
        .style("fill", "none")
        .style("stroke", "grey")
        .attr("x", 40)
        .attr("y", 185)
        .attr("width", 220)
        .attr("height", 150)
    
    // Rectangle over Madeira
    svg.append("rect")
        .style("fill", "none")
        .style("stroke", "grey")
        .attr("x", 70)
        .attr("y", 400)
        .attr("width", 180)
        .attr("height", 120)

    // Legend
    svg.append("rect")
        .style("fill", "#d9d9d9")
        .attr("x", 80)
        .attr("y", 570)
        .attr("width", 15)
        .attr("height", 15)
    svg.append('text')
        .attr('x', 100)
        .attr('y', 580)
        .attr('text-anchor', 'start')
        .text("[0, 75]")

    svg.append("rect")
        .style("fill", "#bfbfbf")
        .attr("x", 80)
        .attr("y", 590)
        .attr("width", 15)
        .attr("height", 15)
    svg.append('text')
        .attr('x', 100)
        .attr('y', 600)
        .attr('text-anchor', 'start')
        .text("[75, 150[")

    svg.append("rect")
        .style("fill", "#999999")
        .attr("x", 80)
        .attr("y", 610)
        .attr("width", 15)
        .attr("height", 15)
    svg.append('text')
        .attr('x', 100)
        .attr('y', 620)
        .attr('text-anchor', 'start')
        .text("[150, 300[")

    svg.append("rect")
        .style("fill", "#737373")
        .attr("x", 80)
        .attr("y", 630)
        .attr("width", 15)
        .attr("height", 15)
    svg.append('text')
        .attr('x', 100)
        .attr('y', 640)
        .attr('text-anchor', 'start')
        .text("[300, 500[")

    svg.append("rect")
        .style("fill", "#4d4d4d")
        .attr("x", 80)
        .attr("y", 650)
        .attr("width", 15)
        .attr("height", 15)
    svg.append('text')
        .attr('x', 100)
        .attr('y', 660)
        .attr('text-anchor', 'start')
        .text("> 500")
    
}
/*
    End of Portugal Map Related Functions
*/