var currentView = 'mapDiv'; // the current view

function storyApp() {

    // Get content
    var intake = templator.compileTemplate( 'templates/intake.html', '' );
    $('#intake').html(intake);
    var about = templator.compileTemplate( 'templates/about.html', '' );
    $('#about').html(about);

    // Setup accordian
    accordion.start( $('#intake_wrapper'), 'step_header', 'step_content' );

    // Link the intake form to the data
    var ds = new DataSource();

    $("#intake_form").submit(function (event) {
        event.preventDefault();
        var storyObject = $(event.currentTarget).serializeObject();
        console.log("Submitting a new story.", storyObject);
        ds.addStory(storyObject, function (key) {
            console.log("Added new story " + key);
            swapView('mapDiv')
        });
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

$( document ).ready( function() {
    // start app
    storyApp();

    $( '.navBut' ).on( 'click', function() {
        var tar = $( this ).data( 'key' );
        swapView( tar );
    });

    $( '.close_button' ).on( 'click', function() {
        swapView( 'mapDiv' );
    });
});
