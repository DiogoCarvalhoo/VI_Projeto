checked_dict = {
    "Total": true,
    "NE": false,
    "Cirurgia Geral": false
}

function loadInitialHealth() {

    /*
        Consultas, Internamentos, Urgencias Three Bar chart
    */
    // set the dimensions and margins of the graph
    const margin = 80; 
    width = document.getElementById("container2").offsetWidth - margin - margin - 60;
    height = 400 - margin - margin;

    // append the svg object to the body of the page
    const svg = d3.select("#tree_bars_graph")
                    .attr("width", width + margin + margin + 60 )
                    .attr("height", height + margin + margin)
                .append("g")
                    .attr("transform",`translate(${margin},${margin})`);

    // Parse the Data
    data = three_bar_data[1999]

    // Get selected year
    selected_histogram_year = document.getElementById("three_bars_year_selection").value;
    
    // Get the data from the selected year
    data = three_bar_data[selected_histogram_year];

    subgroups = ["total", "hospitais", "centros_de_saude"]

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const groups = data.map(d => d.group)

    // Add X axis
    const xScale = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
    svg.append("g")
        .attr("class", "xLabels")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickPadding(10).tickSize(0))
        
        

    data_max_value = d3.max(data, function(d) { return +d.total })
    power_value = 0
    while (true) {
        if (2 ** power_value > data_max_value) {
            domain_limit = 2 ** power_value
            break;
        }
        power_value += 1
    }

    // Add Y axis
    const yScale = d3.scaleLog().base(2)
        .domain([1, domain_limit ])
        .range([ height, 0 ]);
    var yAxis = svg.append("g")
            .call(d3.axisLeft(yScale));

    // Another scale for subgroup position?
    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, xScale.bandwidth()])
        .padding([0.05])

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c','#377eb8','#4daf4a'])
    
    // Add event when user changes the selected year
    d3.select('#three_bars_year_selection')
        .on('change', function() {
        year = this.value;
        new_data = three_bar_data[year];
        update_tree_bar_graph(svg, xScale, yScale, yAxis, xSubgroup, color, new_data)
    });
    
    update_tree_bar_graph(svg, xScale, yScale, yAxis, xSubgroup, color, data)
    loadTitles(svg, "Número de ocorrências", "", "Consultas, Internamentos e Urgências", "Fonte: PORDATA, 2021")



    createGraph(checked_dict)

    /*
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
    */
    
}




function update_tree_bar_graph(svg, xScale, yScale, yAxis, xSubgroup, color, data) {
    
    var t = textures.lines()
    .orientation("3/8")
    .stroke("lightgrey");


    svg.call(t);
    total_data_max_value = d3.max(data, function(d) { console.log(d); return +d.total })
    hospitals_data_max_value = d3.max(data, function(d) { console.log(d); return +d.hospitais })
    centros_data_max_value = d3.max(data, function(d) { console.log(d); return +d.centros_de_saude })
    data_max_value = Math.max(total_data_max_value, hospitals_data_max_value, centros_data_max_value)
    power_value = 0
    while (true) {
        if (2 ** power_value > data_max_value && power_value % 2 == 0) {
            domain_limit = 2 ** power_value
            break;
        }
        power_value += 1
    }

    // Add Y axis
    yScale.domain([1, domain_limit ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(yScale));

    svg.selectAll("g.bars").remove()

    // Show the bars
    svg.append("g")
        .attr("class", "bars")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${xScale(d.group)}, 0)`) 
        .selectAll("rect")
        .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key], group: d.group}; }); })
        .join("rect")
        .on('mouseenter', function (actual, i) {
            // Bar selection animation
            d3.select(this)
                .attr('opacity', 0)
            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 1)
            
            if (i.value !== -1) {
                // Get bar height
                const y = yScale(i.value)

                // Show line
                svg.append('line')
                    .attr('id', 'limit')
                    .attr('x1', 0)
                    .attr('y1', y)
                    .attr('x2', width - 140 - margin)
                    .attr('y2', y)
                
                // Show bar value
                svg.append('text')
                    .attr('class', 'value')
                    .style('fill', 'white')
                    .attr('x', (a) => {return xScale(i.group) + xSubgroup(i.key) + xSubgroup.bandwidth() / 2 })
                    .attr('y', (a) => y - 8)
                    .attr('text-anchor', 'middle')
                    .text((a, idx) => {
                        return i.value;
                    })
            } else {
                // Show bar value
                svg.append('text')
                    .attr('class', 'value')
                    .style('fill', 'white')
                    .attr('x', (a) => {return xScale(i.group) + xSubgroup(i.key) + xSubgroup.bandwidth() / 2 })
                    .attr('y', (a) => -8 )
                    .attr('text-anchor', 'middle')
                    .text((a, idx) => {
                        return "Não disponivel";
                    })
            }
        })
        .on('mouseleave', function () {
            // Remove line and value
            svg.selectAll('#limit').remove()
            svg.selectAll('.value').remove()
        })
        .attr("x", d => xSubgroup(d.key))
        .attr("y", d => { 
            if (d.value === 0 || d.value === -1) {
                return 0
            } else {
                console.log(yScale.domain())
                console.log(yScale(d.value))
                console.log(d.value)
                return yScale(d.value)
            }
        })
        .transition()
        .duration(1000)
        .attr("width", xSubgroup.bandwidth())
        .attr("height", d => { 
            if (d.value === 0) {
                return 0
            } else if (d.value === -1) {
                return height
            } else {
                return height - yScale(d.value) 
            }
        })
        .attr("fill", d => {
            if (d.value === -1) {
                return t.url()
            }
            return color(d.key)
        })
        .style("opacity", d => { 
            if (d.value === -1) {
                return "0.5";
            } else {
                return "1";
            }
        })
        
    svg.append("rect")
        .style("fill", "#e41a1c")
        .attr("x", width + 20 )
        .attr("y", 10)
        .attr("width", 15)
        .attr("height", 15)
    svg.append('text')
        .attr('x', width + 40)
        .attr('y', 20)
        .attr('text-anchor', 'start')
        .text("Total")

    svg.append("rect")
        .style("fill", "#377eb8")
        .attr("x", width + 20 )
        .attr("y", 40)
        .attr("width", 15)
        .attr("height", 15)
    svg.append('text')
        .attr('x', width + 40)
        .attr('y', 50)
        .attr('text-anchor', 'start')
        .text("Hospitais")

    svg.append("rect")
        .style("fill", "#4daf4a")
        .attr("x", width + 20 )
        .attr("y", 70)
        .attr("width", 15)
        .attr("height", 15)
    svg.append('text')
        .attr('x', width + 40)
        .attr('y', 80)
        .attr('text-anchor', 'start')
        .text("Centros de Saúde")

    svg.append("rect")
        .style("fill", t.url())
        .style("opacity", "0.5")
        .style("stroke", "lightgrey")
        .attr("x", width + 20 )
        .attr("y", 100)
        .attr("width", 15)
        .attr("height", 15)
    svg.append('text')
        .attr('x', width + 40)
        .attr('y', 110)
        .attr('text-anchor', 'start')
        .text("Não disponível")

}








function handleChangedSwitch(event) {

    target_id = event.currentTarget.id
    target_checked = event.currentTarget.checked

    switch (target_id) {
        case "totalMedicosSwitch":
            checked_dict["Total"] = target_checked
            break;
    
        case "naoEspecialistasSwitch":
            checked_dict["NE"] = target_checked
            break;

        case "cirurgiaGeralSwitch":
            checked_dict["Cirurgia Geral"] = target_checked
            break;

        default:
            break;
    }

    createGraph(checked_dict)
}



function createGraph(checked_dict) {

    // Graphs Dimensions
    margin = 80;
    width = 700 - margin - margin;
    height = 400 - margin - margin;

    data = {}
    y_min = undefined
    y_max = undefined

    for (const key of Object.keys(checked_dict)) {

        if (checked_dict[key]) {
            // Get the data from the total medicos (Initial State)
            data[key] = medicsspeciality_data[key];

            range = d3.extent(data[key], function(d) {  return +d.value  })

            if (y_min == undefined || y_min > range[0] ) 
                y_min = range[0]

            if (y_max == undefined || y_max < range[1] )  
                y_max = range[1]
        }
    
    }
    
    var medics_by_speciality_svg = d3.select("#medics_by_speciality_graph")

    medics_by_speciality_svg.selectAll("g").remove()

    // append the svg object to the body of the page
    medics_by_speciality_svg = d3.select("#medics_by_speciality_graph")
        .attr("width", width + margin + margin)
        .attr("height", height + margin + margin)
        .append("g")
        .attr("transform", `translate(${margin},${margin})`);

    // Add X axis 
    const xScale = d3.scaleLinear()
        .range([ 0, width ])
        .domain([1990, 2020])

    var xAxis = medics_by_speciality_svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))


    // Add Y axis
    const yScale = d3.scaleLinear()
        .domain([   
                0, 
                y_max
                ])
        .range([ height, 0 ]);
    
    var yAxis = medics_by_speciality_svg.append("g")
        .call(d3.axisLeft(yScale));

    //medics_by_speciality_svg.selectAll(".graphLine").remove()

    for (const key of Object.keys(checked_dict)) {

        if (checked_dict[key]) {

            // Add the line
            medics_by_speciality_svg.append("path")
                .datum(data[key])
                .attr("class", "graphLine")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function(d) { return xScale(d.year) })
                    .y(function(d) { return yScale(d.value) })
                    )
        }
    
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
        .attr('y', margin / 2.4 - 55)
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
        .attr('y', -40)
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