var points = [
	[-86.778229, 36.156740],
	[-86.813327, 36.149667]
];

var setup_intake_map;

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

    setup_intake_map = function() {
        var map_intake = new Map("mapDiv_Intake", {
            center: [-86.7833, 36.1667],
            zoom: 12,
            minZoom: 11,
            basemap: "streets",
        });

        $("#map_content").on("isVisible", function(e) {
            console.log("Map going visible...");
            map_intake.reposition();
            map_intake.graphics.clear();
            var longitude = $("#coords_lon").val();
            var latitude = $("#coords_lat").val();
            if (longitude && latitude) {
                var center = new Point([  longitude, latitude]);
                console.log("Marking point", center);
                var graphic = new Graphic(center, createPictureSymbol());
                map_intake.graphics.add(graphic);
                map_intake.centerAt(center);
            }
        });

        map_intake.on("click", function(e) {
            // clear the graphics, because we can only add one point per story
            map_intake.graphics.clear();
            // add new point
            var center = e.mapPoint;
            $("#coords_lat").val(center.getLatitude());
            $("#coords_lon").val(center.getLongitude());
            var graphic = new Graphic(center, createPictureSymbol());
            map_intake.graphics.add(graphic);
        });


    };

	map.on("load", mapLoaded);

	/**
	 * add a point the map
	 */
  map.on("click", function(e) {
	    if (e.graphic) {
	        show_story(e.graphic.attributes.id);
      } else {
			    var center = e.mapPoint;
          swapView( 'intake', center );
      }
  });

    var ds = new DataSource();
  /**
   * populate map with existing stories
   */
	function mapLoaded(){
      ds.listenForStories(function(story) {
          var point = new Point([parseFloat(story.longitude), parseFloat(story.latitude)]);
          console.log("Adding a new story to map", point, story);
          var graphic = new Graphic(point, createPictureSymbol());
          graphic.setAttributes({'id': story.pk});
          map.graphics.add(graphic);
      });
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

