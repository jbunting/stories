/**
 * Accordion Maker
 * This class converts a div object into an interactive accordion
 * where different sections will hide when new sections show
 * based off an element click.
 *
 * Requires a master object to listen to, one that is the clicker, and one that is the show hide.
 */

function accordion_maker() {
    
    var activeObj; // stores the current opened div
    var activeClick; // stores the current opened div
    var accordion; // the main object
    var clickElement; // the element that will receive clicks, a class name
    var contentElement; // the element to show and hide, a class name

    this.start = function( accordion, clickElement, contentElement ) {
        var self = this;

        self.accordion = accordion;
        self.clickElement = clickElement;
        self.contentElement = contentElement;

        // setup click register
        $( '.' + clickElement ).on(
            'click',
            { 'scope' : self },
            this.swapAccordion
        );
    }

    this.swapAccordion = function( args ) {
        var self = args.data.scope;
        var clicked = this;
        // check if there is a current and if so
        // start the hiding of it
        if ( self.activeObj ) {
            $( self.activeObj ).hide( 400 );
        }
        // now let's show the new clicked by finding the
        // sibling content
        var sibling = $( clicked ).siblings( '.' + self.contentElement );
        $( sibling ).show( 400, function() {
            $(this).trigger("isVisible");
        });
        // try to set focus
        $( sibling ).children( 'input' ).focus();
        // update actives
        self.activeObj = sibling;
        self.activeClick = $( clicked );
    }
}

var accordion = new accordion_maker();
