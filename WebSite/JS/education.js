function loadInitialEducation() {

    // create a tooltip
    var stacked_bar_graph_tooltip = d3.select("#container3")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")

    
    // Get selected year
    selected_stacked_graph_year = document.getElementById("stacked_graph_year_selection").value;

    // Get the data from the selected year
    stacked_bar_graph_data = stacked_bar_data[selected_stacked_graph_year];

    // set the dimensions and margins of the graph
    margin = 80; 
    width = document.getElementById("container2").offsetWidth - margin - margin - 40;
    height = 400 - margin - margin;

    // append the svg object to the body of the page
    const stacked_bar_svg = d3.select("#stacked_bar_graph")
                    .attr("width", width + margin + margin)
                    .attr("height", height + margin + margin)
                .append("g")
                    .attr("transform",`translate(${margin},${margin})`);


    // List of subgroups 
    var subgroups = ["Masculino", "Feminino"]

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var education_types = d3.map(stacked_bar_graph_data, function(d){return(d.type)})

    // Add X axis
    var xScale = d3.scaleBand()
        .domain(education_types)
        .range([0, width])
        .padding([0.2])
    
    var xAxis = stacked_bar_svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickSizeOuter(0));

    var y_max = d3.max(d3.map(stacked_bar_graph_data, function(d){return(d.total)}))
    // Add Y axis
    var yScale = d3.scaleLinear()
        .domain([0, y_max*1.1])
        .range([ height, 0 ]);

    var yAxis = stacked_bar_svg.append("g")
        .call(d3.axisLeft(yScale));

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(d3.schemeSet2);

    
    // Add event when user changes the selected year
    d3.select('#stacked_graph_year_selection')
        .on('change', function() {
        year = this.value;
        new_data = stacked_bar_data[year];
        updateStackedGraph(new_data, stacked_bar_svg, xScale, yScale, yAxis, stacked_bar_graph_tooltip, subgroups, education_types, color)
    });

    updateStackedGraph(stacked_bar_graph_data, stacked_bar_svg, xScale, yScale, yAxis, stacked_bar_graph_tooltip, subgroups, education_types, color)
    loadTitles(stacked_bar_svg, "Número de Alunos", "Tipo de Ensino", "Número de Alunos por nível de ensino e género", "Fonte: PORDATA, 2021")

    stacked_bar_svg.append("rect")
        .style("fill", color("Masculino"))
        .attr("x", width - 10)
        .attr("y", 40)
        .attr("width", 15)
        .attr("height", 15)
    stacked_bar_svg.append('text')
        .attr('x', width + 10)
        .attr('y', 50)
        .attr('text-anchor', 'start')
        .text("Masculino")

    
    stacked_bar_svg.append("rect")
        .style("fill", color("Feminino"))
        .attr("x", width -10 )
        .attr("y", 70)
        .attr("width", 15)
        .attr("height", 15)
    stacked_bar_svg.append('text')
        .attr('x', width + 10)
        .attr('y', 80)
        .attr('text-anchor', 'start')
        .text("Feminino")
}






function updateStackedGraph(stacked_bar_graph_data, stacked_bar_svg, xScale, yScale, yAxis, stacked_bar_graph_tooltip, subgroups, education_types, color) {


    var y_max = d3.max(d3.map(stacked_bar_graph_data, function(d){return(d.total)}))

    yScale.domain([ 0, y_max*1.1])
    yAxis.transition().duration(1000).call(d3.axisLeft(yScale))

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
        .keys(subgroups)
        (stacked_bar_graph_data)

    stacked_bar_svg.selectAll(".myRect").remove()

    
    // Show the bars
    var bars = stacked_bar_svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function(d) { return color(d.key); })
        .attr("class", function(d){ return "myRect " + d.key }) // Add a class to each subgroup: their name
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function(d) { return d; })
        .enter().append("rect")

            .on("mouseenter", function(mouse, d) {    
                var subgroupName = d3.select(this.parentNode).datum().key; // This was the tricky part                    
                // Reduce opacity of all rect to 0.2
                d3.selectAll(".myRect").style("opacity", 0.2)
                // Highlight all rects of this subgroup with opacity 0.8. It is possible to select them since they have a specific class = their name.
                d3.selectAll("."+subgroupName)
                    .style("opacity", 1)

                stacked_bar_graph_tooltip
                    .style("opacity", 1)
            })

            .on("mousemove", function(mouse, d) {
                var subgroupName = d3.select(this.parentNode).datum().key; // This was the tricky part
                var subgroupValue = d.data[subgroupName];
                stacked_bar_graph_tooltip
                    .html("Género: " + subgroupName +"<br>Ensino: " + d.data.type  + "<br>Valor: " + subgroupValue)
                    .style("left", margin/2 + d3.pointer(mouse)[0] + 60 + "px")
                    .style("top", d3.pointer(mouse)[1] - 480 + "px")
                    .style("color", "black")
            })


            .on("mouseleave", function(d) {
                // Back to normal opacity: 0.8
                d3.selectAll(".myRect")
                    .style("opacity",0.8)

                stacked_bar_graph_tooltip
                    .style("opacity", 0)
                    .style("left", "0px")
                    .style("top", "0px")
            })

    bars
        .transition()
        .duration(1000)
        .attr("x", function(d) { return xScale(d.data.type); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
        .attr("width",xScale.bandwidth())
        .attr("stroke", "grey")

}





// Function to create histogram title, x_axis_title, y_axis_title and source text
function loadTitles(svg, titleY, titleX, title, source) {
    margin = 0
    // Title Y
    svg.append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4 - 65)
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