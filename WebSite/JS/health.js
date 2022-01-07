checked_dict = {
    "Total": true,
    "NE": true,
    "Cirurgia Geral": true,
    "Ginecologia e Obstetrícia": true,
    "Medicina Geral e Familiar": true,
    "Oftalmologia": true,
    "Ortopedia": true,
    "Pediatria": true,
    "Psiquiatria": true,
    "Outras": true
}

function loadInitialHealth() {

    /*
        beds per year graph
    */
   create_beds_per_year_graph()
    /*
        End of beds per year graph
    */




    /*
        Consultas, Internamentos, Urgencias Three Bar chart
    */
    // set the dimensions and margins of the graph
    margin = 80; 
    width = document.getElementById("container2").offsetWidth - margin - margin - 60;
    height = 400 - margin - margin;

    const three_bar_svg = d3.select("#tree_bars_graph")
                    .attr("width", width + margin + margin + 60 )
                    .attr("height", height + margin + margin)
                .append("g")
                    .attr("transform",`translate(${margin},${margin})`);

    // Get selected year
    selected_histogram_year = document.getElementById("three_bars_year_selection").value;
    
    // Get the data from the selected year
    data = three_bar_data[selected_histogram_year];

    subgroups = ["total", "hospitais", "centros_de_saude"]

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const groups = data.map(d => d.group)

    // Add X axis
    const three_bars_xScale = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
    three_bar_svg.append("g")
        .attr("class", "xLabels")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(three_bars_xScale).tickPadding(10).tickSize(0))
        

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
    const three_bars_yScale = d3.scaleLog().base(2)
        .domain([1, domain_limit ])
        .range([ height, 0 ]);
    var three_bars_yAxis = three_bar_svg.append("g")
            .call(d3.axisLeft(three_bars_yScale));

    // Another scale for subgroup position?
    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, three_bars_xScale.bandwidth()])
        .padding([0.05])

    // color palette = one color per subgroup
    const three_bars_color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c','#377eb8','#4daf4a'])
    
    // Add event when user changes the selected year
    d3.select('#three_bars_year_selection')
        .on('change', function() {
        year = this.value;
        new_data = three_bar_data[year];
        update_tree_bar_graph(three_bar_svg, three_bars_xScale, three_bars_yScale, three_bars_yAxis, xSubgroup, three_bars_color, new_data)
    });
    
    update_tree_bar_graph(three_bar_svg, three_bars_xScale, three_bars_yScale, three_bars_yAxis, xSubgroup, three_bars_color, data)
    loadTitles(three_bar_svg, "Número de ocorrências", "", "Consultas, Internamentos e Urgências", "Fonte: PORDATA, 2021")
    /*
        End of Consultas, Internamentos, Urgencias Three Bar chart
    */


    /*
        Medics By Speciality Multi Line Graph
    */
    // create a tooltip
    var tooltip = d3.select("#container3")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")


    // Graphs Dimensions
    margin = 80;
    width = 700 - margin ;
    height = 400 - margin - margin;

    // Get the data from the total medicos (Initial State)
    initial_data = medicsspeciality_data["Total"];

    var medics_by_speciality_svg = d3.select("#medics_by_speciality_graph")
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
        .transition()
        .duration(1000)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))


    // Add Y axis
    const yScale = d3.scaleLog().base(2)
        .range([ height, 0 ])
    
    var yAxis = medics_by_speciality_svg.append("g")
        .attr("class", "eixoy")

    var color = d3.scaleOrdinal()
        .domain("Total",
                "NE",
                "Cirurgia Geral",
                "Ginecologia e Obstetrícia",
                "Medicina Geral e Familiar",
                "Oftalmologia",
                "Ortopedia",
                "Pediatria",
                "Psiquiatria",
                "Outras")
        .range(['#63f5e1','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#053d3f','#999999', 'lightyellow', 'lightpink'])
    

    // Add event when user changes the selected year
    d3.selectAll('.form-check-input')
        .on('change', function(event) {
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
                
                case "estomatologiaSwitch":
                    checked_dict["Estomatologia"] = target_checked
                    break;

                case "ginecologiaObstetriciaSwitch":
                    checked_dict["Ginecologia e Obstetrícia"] = target_checked
                    break;

                case "medicinaGeralFamiliarSwitch":
                    checked_dict["Medicina Geral e Familiar"] = target_checked
                    break;
                
                case "oftalmologiaSwitch":
                    checked_dict["Oftalmologia"] = target_checked
                    break;
                
                case "ortopediaSwitch":
                    checked_dict["Ortopedia"] = target_checked
                    break;
                
                case "pediatriaSwitch":
                    checked_dict["Pediatria"] = target_checked
                    break;

                case "psiquiatriaSwitch":
                    checked_dict["Psiquiatria"] = target_checked
                    break;

                case "outrasSwitch":
                    checked_dict["Outras"] = target_checked
                    break;

                default:
                    break;
            }
        
            createMedicsBySpecialityGraph(checked_dict, medics_by_speciality_svg, xScale, yScale, yAxis, color, tooltip)
            
    });

    createMedicsBySpecialityGraph(checked_dict, medics_by_speciality_svg,  xScale, yScale, yAxis, color, tooltip)
    loadTitles(medics_by_speciality_svg, "Número de Médicos", "Ano", "Número de médicos por especialidade", "Fonte: PORDATA, 2021")

}
    

function create_beds_per_year_graph() {
    // create a tooltip
    var beds_year_tooltip = d3.select("#container1")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")

    margin = 80; 
    width = document.getElementById("container1").offsetWidth - margin - margin - 60;
    height = 400 - margin - margin;

    const beds_year_svg = d3.select("#beds_per_year_graph")
                    .attr("width", width + margin + margin + 60 )
                    .attr("height", height + margin + margin)
                .append("g")
                    .attr("transform",`translate(${margin},${margin})`);

    data = beds_per_year_data["Hospitais Gerais"]

    // Add X axis 
    const beds_year_xScale = d3.scaleLinear()
        .range([ 0, width ])
        .domain([1990, 2020])

    var beds_year_xAxis = beds_year_svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(beds_year_xScale).tickFormat(d3.format("d")))


    // Add Y axis
    const beds_year_yScale = d3.scaleLinear()
        .domain([0, 25000])
        .range([ height, 0 ])
    
    var beds_year_yAxis = beds_year_svg.append("g")
        .call(d3.axisLeft(beds_year_yScale));

    var beds_year_color = d3.scaleOrdinal()
        .domain("Hospitais Gerais",
                "Hospitais Especializados",
                "Centros de saúde")
        .range(['#63f5e1','#377eb8','#4daf4a'])
    
    types_of_institutes = ["Hospitais Gerais", "Hospitais Especializados", "Centros de Saúde"]

    for (index = 0; index < types_of_institutes.length; index++) {
        // Add the line
        beds_year_svg.append("path")
            .datum(beds_per_year_data[types_of_institutes[index]])
            .transition()
            .duration(1500)
            .attr("class", "graphLine")
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return beds_year_xScale(d.year) })
                .y(function(d) { return beds_year_yScale(d.value) })
            )
            .attr("stroke", beds_year_color(types_of_institutes[index]))

        const beds_year_circle_groups = beds_year_svg.selectAll()
                .data(beds_per_year_data[types_of_institutes[index]])
                .enter()
                .append('g')

        // Circles
        beds_year_circle_groups.append("circle")
        .attr("cx", function(d) { return beds_year_xScale(d.year); })
        .attr("cy", function(d) { return beds_year_yScale(d.value); })
        .attr("r", "3.5")
        .style("fill", beds_year_color(types_of_institutes[index]))
        .attr("stroke", "none")

        .on('mouseenter', function (actual, i) {
            d3.select(this)
                .attr('opacity', 0)
                
            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 1)
            
            beds_year_tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        
            })

        .on('mousemove', function(mouse, d) {
            beds_year_tooltip
                .html("Ano: " + d.year + "<br>Valor: " + d.value)
                .style("left", margin/2 + d3.pointer(mouse)[0] + 40 + "px")
                .style("top", d3.pointer(mouse)[1] + 50 + "px")
                .style("color", "black")
            })
        
        // On mouse leave, remove the line and the bar value
        .on('mouseleave', function () {
            beds_year_tooltip
                .style("opacity", 0)
                .style("left", "0px")
                .style("top", "0px")
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 1)
        })
    }
    
    beds_year_svg.append("rect")
        .style("fill", beds_year_color("Hospitais Gerais"))
        .attr("x", width + 20 )
        .attr("y", 10)
        .attr("width", 15)
        .attr("height", 15)
    beds_year_svg.append('text')
        .attr('x', width + 40)
        .attr('y', 20)
        .attr('text-anchor', 'start')
        .text("Hospitais Gerais")

    beds_year_svg.append("rect")
        .style("fill", beds_year_color("Hospitais Especializados"))
        .attr("x", width + 20 )
        .attr("y", 40)
        .attr("width", 15)
        .attr("height", 15)
    beds_year_svg.append('text')
        .attr('x', width + 40)
        .attr('y', 45)
        .attr('text-anchor', 'start')
        .text("Hospitais")
    beds_year_svg.append("text")
        .attr('x', width + 40)
        .attr('y', 45)
        .attr("dy", "1.5em")
        .attr('text-anchor', 'start')
        .text("Especializados")

    beds_year_svg.append("rect")
        .style("fill", beds_year_color("Centros de Saúde"))
        .attr("x", width + 20 )
        .attr("y", 70)
        .attr("width", 15)
        .attr("height", 15)
    beds_year_svg.append('text')
        .attr('x', width + 40)
        .attr('y', 80)
        .attr('text-anchor', 'start')
        .text("Centros de Saúde")

    loadTitles(beds_year_svg, "Número de camas", "Ano", "Número de camas por estabelecimento", "Fonte: PORDATA, 2021")
}



function update_tree_bar_graph(svg, xScale, yScale, yAxis, xSubgroup, color, data) {
    
    var t = textures.lines()
        .orientation("3/8")
        .stroke("lightgrey");


    svg.call(t);
    total_data_max_value = d3.max(data, function(d) { return +d.total })
    hospitals_data_max_value = d3.max(data, function(d) { return +d.hospitais })
    centros_data_max_value = d3.max(data, function(d) { return +d.centros_de_saude })
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
                return yScale(d.value)
            }
        })
        .transition("initial_bars")
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





function createMedicsBySpecialityGraph(checked_dict, medics_by_speciality_svg, xScale, yScale, yAxis, color, tooltip) {

    medics_by_speciality_svg.selectAll(".graphLine").remove()
    medics_by_speciality_svg.selectAll("circle").remove()

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

    power_value = 0

    if (y_max == undefined) {
        domain_limit = 1
    } else {
        while (true) {
            if (2 ** power_value > y_max ) {
                domain_limit = 2 ** power_value
                break;
            }
            power_value += 1
        }
    }

    yScale.domain([ (y_min == 0 ? 1 : y_min), domain_limit])
    yAxis.transition().duration(1000).call(d3.axisLeft(yScale))
    

    for (const key of Object.keys(checked_dict)) {

        if (checked_dict[key]) {

            // Add the line
            medics_by_speciality_svg.append("path")
            .datum(data[key])
            .transition()
            .duration(1500)
            .attr("class", "graphLine")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return xScale(d.year) })
                .y(function(d) { return yScale(d.value) })
                
                )
            
            .attr("stroke", color(key))


            const circleGroups = medics_by_speciality_svg.selectAll()
                .data(data[key])
                .enter()
                .append('g')

            
            // Circles
            circleGroups.append("circle")
                .attr("cx", function(d) { return xScale(d.year); })
                .attr("cy", function(d) { return yScale(d.value); })
                .attr("r", "3")
                .style("fill", color(key))
                .attr("stroke", "none")

                .on('mouseenter', function (actual, i) {
                    d3.select(this)
                        .attr('opacity', 0)
                        
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .attr('opacity', 1)

                    
                    tooltip
                        .style("opacity", 1)

                    d3.select(this)
                        .style("stroke", "black")
                        .style("opacity", 1)
                
                    })

                .on('mousemove', function(mouse, d) {
                    tooltip
                        .html("Especialidade: " + key + "<br>Ano: " + d.year + "<br>Valor: " + d.value)
                        .style("left", margin/2 + d3.pointer(mouse)[0] + 80 + "px")
                        .style("top", d3.pointer(mouse)[1] - 10 + "px")
                        .style("color", "black")
                    })
                
                // On mouse leave, remove the line and the bar value
                .on('mouseleave', function () {
                    d3.select(this)

                    medics_by_speciality_svg.selectAll('#limit').remove()
                    medics_by_speciality_svg.selectAll('.value').remove()

                    tooltip
                        .style("opacity", 0)
                        .style("left", "0px")
                        .style("top", "0px")
                    d3.select(this)
                        .style("stroke", "none")
                        .style("opacity", 1)
                })


                



        }
    
    }
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


