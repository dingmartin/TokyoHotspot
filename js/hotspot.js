/*

	Global variables

*/
var hotspot = {};

//bus stop location array
var dayarray = [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
var datalayer = null;
var grades = [0, 18, 58, 182, 513]
var e = document.getElementById("dropdown");
var dist = 100;
// map markers
 
/*

	Run this when the html document is loaded
	Source: https://learn.jquery.com/using-jquery-core/document-ready/

*/
$( document ).ready(function() {
	hotspot.init();
});

/*

	The initialize function is the first thing this application does

*/

hotspot.init = function()
{
	//console.log("hello world")
	hotspot.map = L.map('map').setView([35.682832, 139.739478], 12);

	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(hotspot.map);
     
	// var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	// 	maxZoom: 11,
	// 	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	// }).addTo(hotspot.map);

 //    var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}{r}.{ext}', {
	// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	// 	subdomains: 'abcd',
	// 	minZoom: 0,
	// 	maxZoom: 20,
	// 	ext: 'png'
	// }).addTo(hotspot.map);

	//hotspot.loadPolygon();
	 
	//hotspot.mapPolygon(4); 

	var legend = L.control({position: 'bottomright'});
	legend.onAdd = function () 
	{

		var div = L.DomUtil.create('div', 'info legend'),
		    labels = [];

		// loop through our density intervals and generate a label with a colored square for each interval
		for (var i = 0; i < grades.length; i++) 
		{
		    div.innerHTML += '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
		        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		}

		return div;
	};

	legend.addTo(hotspot.map);

	hotspot.getDay(dayarray)
    dist = document.getElementById("dropdown").value;
    console.log(dist)
}

function clearContent() {
   hotspot.removeLayer();
   $.each(dayarray, function(i,item)
	{
		document.getElementById("dayDiv"+item+"").style.backgroundColor = "#F0F0F0";

	});

}
// window.onclick = function(event) {
//   if (!event.target.matches('.dropbtn')) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     var i;
//     console.log(dropdowns[1].value)
//     for (i = 0; i < dropdowns.length; i++) {
      
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// }

function getColor(d) 
{
    return d > grades[4]  ? '#FB0201' :
           d > grades[3]   ? '#FEC909' :
           d > grades[2]    ? '#B4FD92' :
           d > grades[1]   ? '#3ABEFF' :
                      '#0003F9';
}


// 
hotspot.getDay = function(dayarray)
{
	 

	//loop through each item
	$.each(dayarray, function(i,item)
	{
		
		var weekday= hotspot.getWeekday(item);
		//add days to the side panel
		//$('#stoplist').append('<div class="well well-sm">' + item.display_name + '</div>');
		$('#stoplist').append('<div id="dayDiv'+item+'" class="well well-sm" onclick="hotspot.mapPolygon('+item+')">March '+item+' ('+weekday+'), 2011</div>');

	});


	 
}

hotspot.getWeekday = function(day)
{
   var dt = new Date("March " + day + ", 2011 00:10:00");
   var num = dt.getDay(); 
   switch(num)
	{
		case 0:
		  return "Sunday"
		  break;
		case 1:
		  return "Monday"
		  break;
		case 2:
		  return "Tuesday"
		  break;
		case 3:
		  return "Wednesday"
		  break; 
		case 4:
		  return "Thursday"
		  break;
		case 5:
		  return "Friday"
		  break;
		case 6:
		  return "Saturday"
		  break;
	}

}

 function style(feature) {
    return {
        fillColor: getColor(feature.properties.Join_Count),
        weight: 2,
        opacity: 1,
        color: getColor(feature.properties.Join_Count),
        dashArray: '3',
        fillOpacity: 0.9
    };
}


hotspot.mapPolygon = function(day)
{
	 
	 
	hotspot.removeLayer();
	
	dist = document.getElementById("dropdown").value;
	 
	$.getJSON('data/' + dist + 'm/' + day + '.geojson',function(data){
		//console.log(data)
	// add GeoJSON layer to the map once the file is loaded

	//     datalayer = L.geoJson(data ,{
	// 	onEachFeature: function(feature, featureLayer) 
	// 	{
	// 		//console.log(feature.properties.Join_Count)
			 
	// 		//L.geoJson(data, {style: style}).addTo(hotspot.map);	
	// 		//featureLayer.bindPopup(feature.properties.Join_Count);
	// 	}
	// }).addTo(hotspot.map);

	  datalayer = L.geoJson(data ,{
		 
			style: style
		 
	}).addTo(hotspot.map);   
		//hotspot.map.fitBounds(datalayer.getBounds());
	});

	$.each(dayarray, function(i,item)
	{
		document.getElementById("dayDiv"+item+"").style.backgroundColor = "#F0F0F0";

	});

    document.getElementById("dayDiv"+day+"").style.backgroundColor = "lightblue";
	// let's also get the location of live buses
	//hotspot.getLiveBus(day);

}

//remove layer
hotspot.removeLayer = function()
{
	//console.log(datalayer)
    
    if (datalayer) 
    {
		 

        datalayer.clearLayers();
     	 
       
    }

     

}

 

