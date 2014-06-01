var currentView = 'mapDiv'; // the current view
var ds;

function storyApp() {

    // Get content
    var intake = templator.compileTemplate( 'templates/intake.html', '' );
    $('#intake').html(intake);
    var about = templator.compileTemplate( 'templates/about.html', '' );
    $('#about').html(about);

    // Setup accordian
    accordion.start( $('#intake_wrapper'), 'step_header', 'step_content' );

    // Link the intake form to the data
    ds = new DataSource();

    $("#intake_form").submit(function (event) {
        event.preventDefault();
        var form = $(event.currentTarget);
        var storyObject = form.serializeObject();
        console.log("Submitting a new story.", storyObject);

        function save() {
            ds.addStory(storyObject, function (key) {
                console.log("Added new story " + key);
                // upload images here

                swapView('mapDiv')
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

function swapView( target ) {
    if ( currentView == target ) {
        return false;
    }
    // hide the current view
    if (currentView) {
        $( '#' + currentView ).hide( 200 );
    }
    // how show current
    $( '#' + target ).show( 200 );
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
