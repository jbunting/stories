//
// The data is essentially a table full of stories. Each story has a series of fields:
//
// 0. pk
// 1. title
// 2. longitude
// 3. latitude
// 4. submit_date
// 5. story_date
// 6. text
// 7. video_ref
// 8. approved
// 9. submitter_name
// 10. submitter_phone
// 11. submitter_email
//
// A secondary table contains "media". A record in this table has a foreign key to a story and a media reference.
//
// 0. pk
// 1. story-fk
// 2. imgref
//

function DataSource() {

	var myRootRef = new Firebase('https://nashstories.firebaseio.com/');

	var storiesRef = myRootRef.child("stories");
	var imagesRef = myRootRef.child("images");

    function today() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        }

        if(mm<10) {
            mm='0'+mm
        }

        return yyyy + "-" + mm + "-" + dd;
    }

	// An object containing all of the fields required for a story.
	//  -- the callback will be called with the PK of the new story once it is added
	this.addStory = function(story, callback) {
		var newRef = storiesRef.push();
		story.approved = false;
        story.submit_date = today();
		newRef.set(story);
		if (callback) {
			callback(newRef.name());
		}
	};

	// Get a list of all stories. This returns an array of objects, where each object contains "title" and "pk" of the story.
	// -- the callback will be called once for each story -- even if they are added later - passing the story as a single param.
	this.listenForStories = function(callback) {
		storiesRef.on('child_added', function(snapshot) {
			var pk = snapshot.name();
			var story = snapshot.val();
			if (story.approved) {
				story.pk = pk;
				callback(story);
			} else {
				var storyRef = storiesRef.child(pk);
				var approvedCallback = function (snapshot)
				{
					if (snapshot.name() === "approved")
					{
						story.pk = pk;
						callback(story);
						storyRef.off("child_changed", approvedCallback);
					}
				};
				storyRef.on("child_changed", approvedCallback)
			}
		});
	};

	// Gets a specific story's detail and invokes the callback with the story as the parameter
	this.getStoryDetails = function(key, callback) {
		storiesRef.child(key).once("value", function(snapshot) {
			var pk = snapshot.name();
			var story = snapshot.val();
			story.pk = pk;
			callback(story);
		});
	};

	// Adds an image to the story specified by the key -- once added, invokes the callback with the new image's key
	this.addImage = function(key, imageData, callback) {
		var newImage = imagesRef.child(key).push();
		newImage.set(imageData);
		if (callback) {
			callback(newImage.name());
		}
	};

	// Get a list of all images for a given story. The callback will be called once for each image -- even if they are added
	// later - passing the image data (base64 encoded) as a single param
	this.listenForStoryImages = function(storyKey, callback) {
		imagesRef.child(storyKey).on('child_added', function(snapshot) {
			var imgkey = snapshot.name();
			callback(imgkey);
		});
	};

	this.getImageData = function(storyKey, imageKey, callback) {
		imagesRef.child(storyKey).child(imageKey).once('value', function(snapshot) {
			callback(snapshot.val());
		});
	};

}

function SimpleDataSource() {

	var ObservableArray = function() {
		this.listeners = [];
		this.listen = function(listener) {
			this.listeners.push(listener);
		};
	};
	ObservableArray.prototype = [];
	ObservableArray.prototype.push = function()
	{
		console.log('push now!');
		var story = arguments[0];
		for (var i = 0; i < this.listeners.length; i++) {
			this.listeners[i](story)
		}
		Array.prototype.push.call(this, story);
	};

	var pk_seq = 0;
	var stories = new ObservableArray();

	// An object containing all of the fields required for a story.
	//  -- the callback will be called with the PK of the new story once it is added
	this.addStory = function(story, callback) {
		story.pk = pk_seq++;
		stories.push(story);
		console.log("Added a story.", story.pk, story);
		if (callback) {
			callback(story.pk);
		}
	};

	// Get a list of all stories. This returns an array of objects, where each object contains "title" and "pk" of the story.
	// -- the callback will be called once for each story -- even if they are added later - passing the story as a single param.
	this.listenForStories = function(callback) {
		var length = stories.length;
		stories.listen(callback);
		for (var i = 0; i < length; i++) {
			callback(stories[i]);
		}
	};

	// Gets a specific story's detail and invokes the callback with the story as the parameter
	this.getStoryDetails = function(key, callback) {
		callback(stories[key]);
	};
}


(function($){
    $.fn.serializeObject = function(){

        var self = this,
                json = {},
                push_counters = {},
                patterns = {
                    "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                    "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
                    "push":     /^$/,
                    "fixed":    /^\d+$/,
                    "named":    /^[a-zA-Z0-9_]+$/
                };


        this.build = function(base, key, value){
            base[key] = value;
            return base;
        };

        this.push_counter = function(key){
            if(push_counters[key] === undefined){
                push_counters[key] = 0;
            }
            return push_counters[key]++;
        };

        $.each($(this).serializeArray(), function(){

            // skip invalid keys
            if(!patterns.validate.test(this.name)){
                return;
            }

            var k,
                    keys = this.name.match(patterns.key),
                    merge = this.value,
                    reverse_key = this.name;

            while((k = keys.pop()) !== undefined){

                // adjust reverse_key
                reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

                // push
                if(k.match(patterns.push)){
                    merge = self.build([], self.push_counter(reverse_key), merge);
                }

                // fixed
                else if(k.match(patterns.fixed)){
                    merge = self.build([], k, merge);
                }

                // named
                else if(k.match(patterns.named)){
                    merge = self.build({}, k, merge);
                }
            }

            json = $.extend(true, json, merge);
        });

        return json;
    };
})(jQuery);
