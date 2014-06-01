var points = [
	[-86.778229, 36.156740],
	[-86.813327, 36.149667]
];

require([
	"esri/map", "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", 
	"esri/graphic", "dojo/_base/array", "dojo/dom-style", 
	"dojox/widget/ColorPicker", "dojo/domReady!"
], function(
	Map, Point, SimpleMarkerSymbol, Graphic,
	arrayUtils, ColorPicker
) {
	var map;
	var initColor = "#22cc22";

	map = new Map("mapDiv", {
		center: [-86.7833, 36.1667],
		zoom: 12,
		basemap: "streets",
  });

	map.on("load", mapLoaded);

	/**
	 * add a point the map
	 */
  map.on("click", function(e) {
  	if ($("#mapDiv").hasClass("mapIntake")) {
  		// clear the graphics, because we can only add one point per story
	  	map.graphics.clear();
	  	// add new point
	    var center = e.mapPoint;
			$("#coords").html(center.getLatitude() + ", " + center.getLongitude());
	    var graphic = new Graphic(center, createSymbol(initColor));
		  map.graphics.add(graphic);
		} else {
			if (e.graphic) {
				$("#coords").html("Clicked on " + e.graphic.geometry.x + ", " + e.graphic.geometry.y);
			} else {
				$("#coords").html("Did not click a point");
			}
		}
  });

  /**
   * populate map with existing stories
   */
	function mapLoaded(){
  	if ($("#mapDiv").hasClass("mapDisplay")) {
		  arrayUtils.forEach(points, function(point) {
		    var graphic = new Graphic(new Point(point), createSymbol(initColor));
		    map.graphics.add(graphic);
		  });
		}
	};

	function createSymbol(color){
	  var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
	  markerSymbol.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
	  markerSymbol.setSize(12);
	  markerSymbol.setOutline(null);
	  markerSymbol.setColor(new dojo.Color(color));
	  return markerSymbol;
	};
});
