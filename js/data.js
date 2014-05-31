//
// The data is essentially a table full of stories. Each story has a series of fields:
//
// 0. pk
// 1. title
// 2. longitude
// 3. latitude
// 4. date of submission
// 5. date of story
// 6. story text
// 7. story video reference
// 8. approved?
// 9. submitter name
// 10. submitter phone
// 11. submitter email
//
// A secondary table contains "media". A record in this table has a foreign key to a story and a media reference.
//
// 0. pk
// 1. story-fk
// 2. imgref
//

function dataSource() {

	var stories = [];

	// An object containing all of the fields required for a story.
	this.addStory = function(story) {
		stories.push(story);
	};

	// Get a list of all stories. This returns an array of objects, where each object contains "title" and "pk" of the story.
	this.listStories = function() {
		return stories;
	};

	this.getStoryDetails = function(key) {

	};
}



