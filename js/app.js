var currentView = 'mapDiv'; // the current view
var ds = new DataSource();

function storyApp() {

    // Get content
    var about = templator.compileTemplate( 'templates/about.html', '' );
    $('#about').html(about);


    function loadIntakeTemplate(event, point) {
        console.log("Loading the intake template...", point);
        var intake = templator.compileTemplate( 'templates/intake.html', '' );
        $('#intake').html(intake);
        if (point) {
            $("#intake").find('#coords_lat').val(point.getLatitude());
            $("#intake").find('#coords_lon').val(point.getLongitude());
        }
        setup_intake_map();
        // Setup accordian
        new accordion_maker().start( $('#intake_wrapper'), 'step_header', 'step_content' );

        // Link the intake form to the data

        $("#intake_form").submit(function (event) {
            event.preventDefault();
            var form = $(event.currentTarget);
            var storyObject = form.serializeObject();
            console.log("Submitting a new story.", storyObject);

            function save() {
                ds.addStory(storyObject, function (key) {
                    console.log("Added new story " + key);
                    // upload images here

                    swapView('mapDiv');
                });
            }

            var imgInput = form.find("#images");
            var files = imgInput[0].files;
            if (files.length > 0) {
                var file = files[0];
                console.log("Image file", file);
                var reader = new FileReader();
                reader.onload = function(event) {
                    var data = event.target.result;
                    console.log("Loaded image", data);
                    storyObject.img_uri = data;
//                ds.addImage(key, data);
                    save();
                };
                reader.readAsDataURL(file);
            } else {
                save();
            }
        });
    }

    $("#intake").on("swapIn", loadIntakeTemplate);
}

function swapView( target, data ) {
    if ( currentView == target ) {
        return false;
    }
    // hide the current view
    if (currentView) {
        $( '#' + currentView ).hide( 200, function() {
            $(this).trigger("swapOut");
        } );
    }
    // how show current
    $( '#' + target ).show( 200, function() {
        console.log("Swapping to visible...");
        $(this).trigger("swapIn", data);
    } );
    // update active
    currentView = target;
}

function show_story(tar) {
    // build values
    ds.getStoryDetails(tar, function(story) {
        // map values
        var data = {
            "story_title" : story.title,
            "story_date" : story.story_date,
            "story_location" : story.latitude + " : " + story.longitude,
            "story_details" : story.text,
            "img_uri": story.img_uri
        };
        // build template
        var story_details = templator.compileTemplate( 'templates/story_details.html', data );
        // add to document and swap
        $('#story_details').html(story_details);
        if (data.img_uri == undefined) {
            $('#story_img').hide();
        } else {
            $('#story_img').show();
        }
        $("#story_details").on("notVisible", function() {
            $(this).html("");
        });
        swapView('story_details');
    });
}

$( document ).ready( function() {
    // start app
    storyApp();

    $( '.navBut' ).on( 'click', function() {
        var tar = $( this ).data( 'key' );
        swapView( tar );
    });

    $( document ).on( 'click', '.close_button', function() {
        swapView( 'mapDiv' );
    });
});
