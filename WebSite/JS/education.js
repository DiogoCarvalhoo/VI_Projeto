function loadInitialEducation() {

    // create a tooltip
    var stacked_bar_graph_tooltip = d3.select("#container1")
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
    var stacked_bar_xScale = d3.scaleBand()
        .domain(education_types)
        .range([0, width])
        .padding([0.2])
    
    var stacked_bar_xAxis = stacked_bar_svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(stacked_bar_xScale).tickSizeOuter(0));

    var y_max = d3.max(d3.map(stacked_bar_graph_data, function(d){return(d.total)}))
    // Add Y axis
    var stacked_bar_yScale = d3.scaleLinear()
        .domain([0, y_max*1.1])
        .range([ height, 0 ]);

    var stacked_bar_yAxis = stacked_bar_svg.append("g")
        .call(d3.axisLeft(stacked_bar_yScale));

    // color palette = one color per subgroup
    var stacked_bar_color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(d3.schemeSet2);

    
    // Add event when user changes the selected year
    d3.select('#stacked_graph_year_selection')
        .on('change', function() {
        year = this.value;
        new_data = stacked_bar_data[year];
        updateStackedGraph(new_data, stacked_bar_svg, stacked_bar_xScale, stacked_bar_yScale, stacked_bar_yAxis, stacked_bar_graph_tooltip, subgroups, education_types, stacked_bar_color)
    });

    updateStackedGraph(stacked_bar_graph_data, stacked_bar_svg, stacked_bar_xScale, stacked_bar_yScale, stacked_bar_yAxis, stacked_bar_graph_tooltip, subgroups, education_types, stacked_bar_color)
    loadTitles(stacked_bar_svg, "Número de Alunos", "Tipo de Ensino", "Número de Alunos por nível de ensino e género", "Fonte: PORDATA, 2021")

    stacked_bar_svg.append("rect")
        .style("fill", stacked_bar_color("Masculino"))
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
        .style("fill", stacked_bar_color("Feminino"))
        .attr("x", width -10 )
        .attr("y", 70)
        .attr("width", 15)
        .attr("height", 15)
    stacked_bar_svg.append('text')
        .attr('x', width + 10)
        .attr('y', 80)
        .attr('text-anchor', 'start')
        .text("Feminino")


    /*
        Area graph chart
    */

    // Get the data
    area_graph_data = area_line_data;

    // set the dimensions and margins of the graph
    margin = 80; 
    width = document.getElementById("container3").offsetWidth - margin - margin - 150;
    height = 400 - margin - margin;

    // append the svg object to the body of the page
    const area_svg = d3.select("#area_graph")
                                .attr("width", width + margin + margin)
                                .attr("height", height + margin + margin)
                            .append("g")
                                .attr("transform",`translate(${margin},${margin})`);


    // Add X axis --> it is a date format
    const area_graph_xScale = d3.scaleLinear()
        .range([ 0, width ])
        .domain(d3.extent(area_graph_data, d => { return d.year }));
    
    area_svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(area_graph_xScale).tickFormat(d3.format("d")));
        
    // Add Y axis
    const area_graph_yScale = d3.scaleLinear()
        .domain([0, (d3.max(area_graph_data, d => { return +d.Masculino }) * 1.1) ])
        .range([ height, 0 ]);
    
    area_svg.append("g")
        .call(d3.axisLeft(area_graph_yScale));

    create_area_graph(area_graph_data, area_svg, area_graph_xScale, area_graph_yScale)
    loadTitles(area_svg, "Percentagem Abandono", "Ano","Taxa de Abandono Precoce de Educação e Formação" ,"Fonte: PORDATA, 2021")


    area_svg.append("rect")
        .style("fill", "#adcdff")
        .attr("x", width)
        .attr("y", 40)
        .attr("width", 15)
        .attr("height", 15)
    area_svg.append('text')
        .attr('x', width + 20)
        .attr('y', 50)
        .attr('text-anchor', 'start')
        .text("Masculino")

    
    area_svg.append("rect")
        .style("fill", "#bdfcce")
        .attr("x", width )
        .attr("y", 70)
        .attr("width", 15)
        .attr("height", 15)
    area_svg.append('text')
        .attr('x', width + 20)
        .attr('y', 80)
        .attr('text-anchor', 'start')
        .text("Feminino")


    /*
        End of area graph chart
    */


    /*
        Grades chart
    */

    // create a tooltip
    var grades_tooltip = d3.select("#container2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")

    year1 = document.getElementById("grades_year1_selection").value
    year2 = document.getElementById("grades_year2_selection").value
    var data = [grades_data[year2], grades_data[year1]]

    var color = d3.scaleOrdinal()
				.range(["#CC333F", "#00A0B0"]);

    width = document.getElementById("container2").offsetWidth - 80 - 80;
    height = 400 - 80 - 80;
    margin = 80;
    
    var radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 100,
        levels: 2,
        roundStrokes: true,
        color: color
    };

    // Add event when user changes the selected year
    d3.select('#grades_year1_selection')
        .on('change', function() {
        year1 = this.value;
        if (year1 == -1) {     // Nenhum
            data = [grades_data[year2]]
        } else {
            data = [grades_data[year2], grades_data[year1]]
        }
        RadarChart("#container2", data, radarChartOptions, grades_tooltip);
    });

    d3.select('#grades_year2_selection')
        .on('change', function() {
        year2 = this.value;
        if (year1 == -1) {     // Nenhum
            data = [grades_data[year2]]
        } else {
            data = [grades_data[year2], grades_data[year1]]
        }
        RadarChart("#container2", data, radarChartOptions, grades_tooltip);
    });

    //Call function to draw the Radar chart
	RadarChart("#container2", data, radarChartOptions, grades_tooltip);
    /*
        End of Grades chart
    */
}





function create_area_graph(area_graph_data, area_svg, area_graph_xScale, area_graph_yScale) {
    // Add the area
    area_svg.append("path")
        .datum(area_graph_data)
        .attr("fill", "#adcdff")
        .attr("d", d3.area()
            .x(d => area_graph_xScale(d.year))
            .y0(area_graph_yScale(0))
            .y1(d => area_graph_yScale(d.Masculino))
            ) 

    // Add the area
    area_svg.append("path")
        .datum(area_graph_data)
        .attr("fill", "#bdfcce")
        .attr("d", d3.area()
            .x(d => area_graph_xScale(d.year))
            .y0(area_graph_yScale(0))
            .y1(d => area_graph_yScale(d.Feminino))
            ) 
    
    // Add Total Line
    area_svg.append("path")
        .datum(area_graph_data)
        .transition()
        .duration(1500)
        .attr("class", "graphLine")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return area_graph_xScale(d.year) })
            .y(function(d) { return area_graph_yScale(d.Total) })
            
            )
    
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
                    .style("left", margin/2 + d3.pointer(mouse)[0] + 40 + "px")
                    .style("top", d3.pointer(mouse)[1] + "px")
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



	
function RadarChart(id, data, options, grades_tooltip) {
	var cfg = {
	 w: options.w,		    //Width of the circle
	 h: options.h,			//Height of the circle
	 margin: options.margin, //The margins of the SVG
	 levels: 1,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.2, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 130, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
	};
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if
	
	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		
	var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format(''),			 	    //Percentage formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);
		
	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////

	//Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();
	
	//Initiate the radar chart SVG
	var svg = d3.select(id).append("svg")
			.attr("width",  cfg.w + cfg.margin + cfg.margin)
			.attr("height", cfg.h + cfg.margin + cfg.margin)
			.attr("class", "radar"+id);
	//Append a g element		
	var g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin) + "," + (cfg.h/2 + cfg.margin) + ")");
	
	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////
	
	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/cfg.levels*d;})
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", function(d){return -d*radius/cfg.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "#737373")
	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////
	
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ 
            if (i == 1 || i == 4 || i == 6 || i == 9) {
                return rScale(maxValue * (cfg.labelFactor + 0.4)) * Math.cos(angleSlice*i - Math.PI/2); 
            }
            if (i == 2 || i == 3 || i == 7 || i == 8) {
                return rScale(maxValue * (cfg.labelFactor + 0.22)) * Math.cos(angleSlice*i - Math.PI/2); 
            }
            return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); 
        })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(wrap, cfg.wrapWidth);

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////
	
	//The radial line function
	var radarLine = d3.lineRadial()
        .curve(d3.curveLinearClosed)
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; });
		
	if(cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed);
	}
				
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
			
	//Append the backgrounds	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { return cfg.color(i); })
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1); 
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.8);	
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});
		
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { return cfg.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d.map(function (circle_data) { return {year: i, ...circle_data} }) })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", function(d,i,j) { return cfg.color(d.year); })
		.style("fill-opacity", 0.8);

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
		
	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d.map(function (circle_data) { return {year: i, ...circle_data} }) })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius*1.5)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(mouse,i) {
			year_to_tooltip = year2
            if (i.year == 1) year_to_tooltip = year1
            
            grades_tooltip
                .style("opacity", 1)

            grades_tooltip
                .html("Ano: " + year_to_tooltip + "<br>Nota: " + i.value)
                .style("left", width/2 + d3.pointer(mouse)[0] + margin/2 + "px")
                .style("top", d3.pointer(mouse)[1] + 2*margin + 10  + "px")
                .style("color", "black")

		})
		.on("mouseout", function(){
            grades_tooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
		});
    
    if (data.length > 1) {
        svg.append("rect")
            .style("fill", cfg.color(1))
            .attr("x", width + 2/3 * cfg.margin)
            .attr("y", height/3)
            .attr("width", 15)
            .attr("height", 15)
        svg.append('text')
            .attr('x', width + 2/3 * cfg.margin + 21)
            .attr('y', height/3 + 11)
            .attr('text-anchor', 'start')
            .text(year1)
    }

    svg.append("rect")
        .style("fill", cfg.color(0))
        .attr("x", width + 2/3 * cfg.margin)
        .attr("y", height/3 + 30)
        .attr("width", 15)
        .attr("height", 15)
    svg.append('text')
        .attr('x', width + 2/3 * cfg.margin + 21)
        .attr('y', height/3 + 41)
        .attr('text-anchor', 'start')
        .text(year2)

    // Title
    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text("Média das notas dos exames de secundário")

    // Source
    svg.append('text')
        .attr('class', 'source')
        .attr('x', width - margin / 2)
        .attr('y', height + 2 * margin - 20)
        .attr('text-anchor', 'start')
        .text("Fonte: PORDATA, 2021")
	
	/////////////////////////////////////////////////////////
	/////////////////// Helper Function /////////////////////
	/////////////////////////////////////////////////////////

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text	
	function wrap(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}//wrap	
	
}//RadarChart





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