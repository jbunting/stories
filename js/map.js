var points = [
	[-86.778229, 36.156740],
	[-86.813327, 36.149666]
];

require([
	"esri/map", "esri/geometry/Point", 
	"esri/symbols/SimpleMarkerSymbol", "esri/graphic",
	"dojo/_base/array", "dojo/dom-style", "dojox/widget/ColorPicker", 
	"dojo/domReady!"
], function(
	Map, Point,
	SimpleMarkerSymbol, Graphic,
	arrayUtils, domStyle, ColorPicker
) {
	var map;

	map = new Map("mapDiv", {
		center: [-86.7833, 36.1667],
		zoom: 12,
		basemap: "streets",
  });

	map.on("load", mapLoaded);

	function mapLoaded(){
	  var initColor = "#22cc22";
	  arrayUtils.forEach(points, function(point) {
	    var graphic = new Graphic(new Point(point), createSymbol(initColor));
	    map.graphics.add(graphic);
	  });
	};

	function createSymbol(color){
	  var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
	  markerSymbol.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
	  markerSymbol.setSize(8);
	  markerSymbol.setOutline(null);
	  markerSymbol.setColor(new dojo.Color(color));
	  return markerSymbol;
	};
});

