var points = [
	[-86.778229, 36.156740],
	[-86.813327, 36.149667]
];

require([
	"esri/map", "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", 
	"esri/graphic", "dojo/_base/array", "dojox/widget/ColorPicker", 
	"dojo/dom-style", "dojo/domReady!"
], function(
	Map, Point, SimpleMarkerSymbol, Graphic,
	arrayUtils, ColorPicker
) {
	var map;
	var initColor = "#22cc22";

	map = new Map("mapDiv", {
		center: [-86.7833, 36.1667],
		zoom: 12,
		minZoom: 11,
		basemap: "streets",
  });

	map.on("load", mapLoaded);

	/**
	 * add a point the map
	 */
  map.on("click", function(e) {
    var center = e.mapPoint;
    $("#coords").html(center.getLatitude() + ", " + center.getLongitude());
  	if ($("#mapDiv").hasClass("mapIntake")) {
  		// clear the graphics, because we can only add one point per story
	  	map.graphics.clear();
	  	// add new point
	    var graphic = new Graphic(center, createSymbol(initColor));
		map.graphics.add(graphic);
    } else {
        if (e.graphic) {
            show_story(e.graphic.attributes.id);
        } else {
            console.log('x: ', center.getLatitude());
            console.log('y: ', center.getLongitude());
        }
    }
  });

    var ds = new DataSource();
  /**
   * populate map with existing stories
   */
	function mapLoaded(){
  	if ($("#mapDiv").hasClass("mapDisplay")) {
          ds.listenForStories(function(story) {
              var point = new Point([parseFloat(story.longitude), parseFloat(story.latitude)]);
              console.log("Adding a new story to map", point, story);
              var graphic = new Graphic(point, createPictureSymbol());
              graphic.setAttributes({'id': story.pk});
              map.graphics.add(graphic);
          });
		}
	};

	function createPictureSymbol(){
	  var markerSymbol = new esri.symbol.PictureMarkerSymbol({
		  "url":"templates/images/flag.png",
    	"height":20,
    	"width":20,
 	  });
	  return markerSymbol;
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

