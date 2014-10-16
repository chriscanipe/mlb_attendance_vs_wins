d3.json("data/debt_raw.json", function(data) {

	$.each(data, function(i, item) {


		theData[item.name] = {
			"id" : item.id,
			"region" : item.region,
			"type" : item.type
		};

		var years = {};

		for (i = 2000; i < 2013; i++) {

			years["yr"+i] = {
				"gdp" : item["gdp"+i], 
				"pub" : item["pub"+i], 
				"pri" : item["pri"+i], 
			}

		}

		theData[item.name]["years"] = years;

	});

	console.log(JSON.stringify(theData));


});