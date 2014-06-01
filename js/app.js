function storyApp() {

    // Get content
    var intake = templator.compileTemplate( 'templates/intake.html', '' );
    $('#intake').html(intake);

    // Setup accordian
    accordion.start( $('#intake_wrapper'), 'step_header', 'step_content' );

}

$( document ).ready( function() {
    // start app
    storyApp();
});
