var currentView = 'mapDiv'; // the current view

function storyApp() {

    // Get content
    var intake = templator.compileTemplate( 'templates/intake.html', '' );
    $('#intake').html(intake);

    // Setup accordian
    accordion.start( $('#intake_wrapper'), 'step_header', 'step_content' );
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
});
