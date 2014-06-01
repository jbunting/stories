function storyApp() {

    // Get content
    var intake = templator.compileTemplate( 'templates/intake.html', '' );
    $('#intake').html(intake);

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
        });
    });
}

$( document ).ready( function() {
    // start app
    storyApp();
});
