/**
 * Template Engine Class
 * This class allows to load an HTML file with predefined variables in a format
 * that is similar to Mustache, but only 1-dimensional.
 *
 * Variable format: {{variableName}}
 *
 */

function templator() {

    // build request object
    var request = new XMLHttpRequest();
    var requestType = 'GET';

    this.compileTemplate = function( templateLoc, options ) {
        // make request for template
        var html = this.makeRequest( templateLoc );
        // replace all the options in the template with their values
        for ( var pos in options ) {
            var tempPatt = new RegExp( '{{' + pos + '}}', 'g' );
            html = html.replace(tempPatt, options[ pos ] );
        }
        return html;
    }

    // create make a request method
    this.makeRequest = function( path ) {
        request.open( requestType, path, false );
        request.send( null );
        return request.responseText;
    }
}

var templator = new templator();
