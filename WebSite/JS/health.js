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
        
            createGraph(checked_dict, medics_by_speciality_svg, xScale, yScale, yAxis, color, tooltip)
            
    });

    createGraph(checked_dict, medics_by_speciality_svg,  xScale, yScale, yAxis, color, tooltip)

    
  
}






function createGraph(checked_dict, medics_by_speciality_svg, xScale, yScale, yAxis, color, tooltip) {

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
    while (true) {
        if (2 ** power_value > y_max ) {
            domain_limit = 2 ** power_value
            break;
        }
        power_value += 1
    }

    yScale.domain([ (y_min == 0 ? 1 : y_min), domain_limit])
    yAxis.transition().duration(1000).call(d3.axisLeft(yScale))
    

    for (const key of Object.keys(checked_dict)) {

        if (checked_dict[key]) {

            const circleGroups = medics_by_speciality_svg.selectAll()
                .data(data[key])
                .enter()
                .append('g')

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


            
            // Circles
            circleGroups.append("circle")
                .attr("cx", function(d) { return xScale(d.year); })
                .attr("cy", function(d) { return yScale(d.value); })
                .attr("r", "2.5")
                .style("fill", "#69b3a2")
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
                    console.log("here")
                    console.log(mouse)
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
                    d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 1)
                })




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