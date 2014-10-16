var margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = $(".chart").width() - margin.left - margin.right,
    height = $(".chart").height() - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var z = d3.scale.category10();

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};

d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

function dotSize(val) {
    //return (2 * Math.sqrt(val / 1000) / Math.PI) * 20;
   
	val = (val/100000) * 3;

    var radius = Math.sqrt(val/Math.PI);

    return radius;

    //r = √(Area of circle / π)
}

function commaSeparateNumber(val){
	while (/(\d+)(\d{3})/.test(val.toString())){
	val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
}
	return val;
}







var theData;

var currYear = 2014;

var teamData = [{"teamKey":"Anaheim Angels","short":"Angels","primary":"red","secondary":"blue"},
{"teamKey":"Arizona Diamondbacks","short":"Diamondbacks","primary":"red","secondary":"black"},
{"teamKey":"Atlanta Braves","short":"Braves","primary":"red","secondary":"darkblue"},
{"teamKey":"Baltimore Orioles","short":"Orioles","primary":"orange","secondary":"black"},
{"teamKey":"Boston Red Sox","short":"Red Sox","primary":"red","secondary":"darkblue"},
{"teamKey":"California Angels","short":"Angels","primary":"red","secondary":"blue"},
{"teamKey":"Chicago Cubs","short":"Cubs","primary":"lightblue","secondary":"red"},
{"teamKey":"Chicago White Sox","short":"White Sox","primary":"black","secondary":"white"},
{"teamKey":"Cincinnati Reds","short":"Reds","primary":"red","secondary":"white"},
{"teamKey":"Cleveland Indians","short":"Indians","primary":"red","secondary":"darkblue"},
{"teamKey":"Colorado Rockies","short":"Rockies","primary":"purple","secondary":"black"},
{"teamKey":"Detroit Tigers","short":"Tigers","primary":"darkblue","secondary":"white"},
{"teamKey":"Florida Marlins","short":"Marlins","primary":"orange","secondary":"lightblue"},
{"teamKey":"Houston Astros","short":"Astros","primary":"red","secondary":"black"},
{"teamKey":"Kansas City Royals","short":"Royals","primary":"blue","secondary":"gold"},
{"teamKey":"Los Angeles Angels of Anaheim","short":"Angels","primary":"red","secondary":"gold"},
{"teamKey":"Los Angeles Dodgers","short":"Dodgers","primary":"blue","secondary":"white"},
{"teamKey":"Miami Marlins","short":"Marlins","primary":"orange","secondary":"lightblue"},
{"teamKey":"Milwaukee Brewers","short":"Brewers","primary":"darkblue","secondary":"gold"},
{"teamKey":"Minnesota Twins","short":"Twins","primary":"blue","secondary":"red"},
{"teamKey":"Montreal Expos","short":"Expos","primary":"blue","secondary":"red"},
{"teamKey":"New York Mets","short":"Mets","primary":"orange","secondary":"darkblue"},
{"teamKey":"New York Yankees","short":"Yankees","primary":"darkblue","secondary":"white"},
{"teamKey":"Oakland Athletics","short":"Athletics","primary":"green","secondary":"yellow"},
{"teamKey":"Philadelphia Phillies","short":"Phillies","primary":"red","secondary":"white"},
{"teamKey":"Pittsburgh Pirates","short":"Pirates","primary":"yellow","secondary":"black"},
{"teamKey":"San Diego Padres","short":"Padres","primary":"darkblue","secondary":"orange"},
{"teamKey":"San Francisco Giants","short":"Giants","primary":"orange","secondary":"darkblue"},
{"teamKey":"Seattle Mariners","short":"Mariners","primary":"green","secondary":"darkblue"},
{"teamKey":"St. Louis Cardinals","short":"Cardinals","primary":"red","secondary":"darkblue"},
{"teamKey":"Tampa Bay Devil Rays","short":"Rays","primary":"blue","secondary":"yellow"},
{"teamKey":"Tampa Bay Rays","short":"Rays","primary":"blue","secondary":"yellow"},
{"teamKey":"Texas Rangers","short":"Rangers","primary":"blue","secondary":"red"},
{"teamKey":"Toronto Blue Jays","short":"Jays","primary":"blue","secondary":"white"},
{"teamKey":"Washington Nationals","short":"Nationals","primary":"red","secondary":"blue"}];

var colors = {
	"red" : "#cc3333",
	"blue" : "#3366cc",
	"orange" : "#ff9933",
	"black" : "#999999",
	"white" : "#ffffff",
	"yellow" : "#ffcc33",
	"gold" : "#cc9900",
	"purple" : "#6633cc",
	"green" : "#669966",
	"darkblue" : "#003399",
	"lightblue" : "#6699cc" 
};

var theTeams;





d3.csv("data/mlb_payrolls.csv", function(data) {

	var since85 = data.filter(function(d) {
		return parseInt(d.Year) >= 1985; 
	});

	// Compute the scales’ domains.
	var attendRange = d3.extent(since85, function(d) { return +d.Attendance });
	var winsRange = d3.extent(since85, function(d) { return +d.W });

	x.domain(winsRange);
	y.domain(attendRange);


	theTeams = d3.nest()
		.key(function(d) {
			return d.teamKey
		})
		.map(teamData)
;



	theData = d3.nest()
	  .key(function(d) {return d.Year; })
	  //.key(function(d) { return d.Tm; })
	  .map(since85);
	  drawChart();
	  setNav();

	  $(".year-text").html(currYear);

});


function setNav() {

	$(".change-year .btn").on("click", function() {
		if ($(this).hasClass("next")) {
			currYear ++
		} else {
			currYear --
		}

		$(".change-year .btn.next").removeClass("disabled");

		if (currYear >= 2014) {
			$(".change-year .btn.next").addClass("disabled");
		} else if (currYear <= 1985) {
			$(".change-year .btn.back").addClass("disabled");
		}

		updateChart();

	});

}



function drawChart() {

	// Add the x-axis.
	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.svg.axis().scale(x).orient("bottom"))
	      .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", -6)
	      .style("text-anchor", "end")
	      .text("Number of wins");

	  // Add the y-axis.
	  svg.append("g")
	      .attr("class", "y axis")
	      .call(d3.svg.axis().scale(y).orient("left"))
	      .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Season attendance");


	  var dots = svg.selectAll(".dot")
		      .data(theData[currYear], function (d) {
			        return d.Tm;
			    })
		    .enter()
		    .append("g")
		    .attr("class", "team-node")
		    .attr("opacity", .5);


		dots.append("circle")
		      .each(function(d) {
		      	var pay = d["Est. Payroll"].replace("$", "");
		      	d.pay = +pay;
		      })
		      .attr("class", function (d, i) {
	            return "dot " + d.Tm.replace(" ", "-");
	          })
		      .attr("r", function(d) {
		      	return dotSize(+d.pay);
		      })
		      .attr("cx", function(d) {
		      	return x(+d.W);
		      })
		      .attr("cy", function(d) {
		      	return y(+d.Attendance);
		      })
		      .style("fill", function(d) {
				return colors[theTeams[d.Tm][0].primary];
		      })
		      .style("stroke", function(d) {
		      	return "#FFF";
		      	//return colors[theTeams[d.Tm][0].secondary];
		      })
		      .style("stroke-width", 1);

		
	  	dots.append("text")
	  	  .attr("class", "label")
	      .attr("x", function(d) {
	      	return x(+d.W);
	      })
	      .attr("y", function(d) {
	      	return y(+d.Attendance);
	      })
	      .text(function(d) { return theTeams[d.Tm][0].short; })
	      .attr("text-anchor", "middle");



	    dots.on("mouseover", function(d) {
		    	var sel = d3.select(this);
		    	sel.moveToFront();
		    	sel.transition().duration(200).attr("opacity", 1);

		    	tooltip(d);
		    })
		    .on("mousemove", function() {
		    	var pos = d3.mouse(this);
	            var top = pos[1];
	            var left = pos[0];

		    	$(".tt").css({
		    		"top" : top - $(".tt").height() - 20 + margin.top +"px",
		    		"left" : left - ($(".tt").width()/2) + margin.left +"px"
		    	});

		    })
		    .on("mouseout", function(d) {
		    	var sel = d3.select(this);
		    	sel.moveToBack();
		    	sel.transition().duration(200).attr("opacity", .5);
		    	$(".tt").hide();
		    });
		
}



function updateChart() {

	$(".year-text").html(currYear);

	var dots = svg.selectAll(".dot")
	        .data(theData[currYear], function (d) {
		        return d.Tm;
		    });

    dots.enter().append("circle")
        .attr("class", function (d, i) {

            return "dot " + d.Tm.replace(" ", "-");
        })
        .attr("cx", function (d) {
            return x(+d.W);
        })
        .attr("cy", function (d) {
            return y(+d.Attendance);
        })
        .style("fill", function(d) {
			return colors[theTeams[d.Tm][0].primary];
	    })
	    .attr("opacity", .5)
        .attr("r", 0);

    dots.exit()
        .transition()
        .duration(200)
        .attr("r", 0)
        .remove();

    dots.each(function(d) {
	      	var pay = d["Est. Payroll"].replace("$", "");
	      	d.pay = +pay;
	    })
    	.transition()
        .duration(1000)
        .attr("r", function (d) {
        	return dotSize(+d.pay);
        })
        .attr("cx", function (d) {
            return x(+d.W);
        })
        .attr("cy", function (d) {
            return y(+d.Attendance);
        });

    var labels = svg.selectAll(".label")
    	.data(theData[currYear], function (d) {
	        return d.Tm;
	    });


    labels.enter().append("text")
        .attr("class", "label")
		.attr("x", function(d) {
			return x(+d.W);
		})
		.attr("y", function(d) {
			return y(+d.Attendance);
		})
		.text(function(d) { return theTeams[d.Tm][0].short; })
		.attr("text-anchor", "middle")


    labels.exit().remove();

    labels.transition()
          .duration(1000)
	      .attr("x", function(d) {
	      	return x(+d.W);
	      })
	      .attr("y", function(d) {
	      	return y(+d.Attendance);
	      });

	

}





function tooltip(d) {

	var payroll = commaSeparateNumber(d.pay);
	var millions = parseFloat(d.pay/1000000).toFixed(1);

	$(".tt").html(
		"<span class='team'>"+d.Tm+"</span><br/>"+
		"<span class='payroll'>"+currYear+" Payroll: <b>$"+millions+" Million</b></span>"
	).show();
}





