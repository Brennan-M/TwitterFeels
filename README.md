Useful knowledge:

To run website:
	1.) Make sure line 153 in TFstream.js is listening to port 3001
	2.) $ nodemon
	3.) Then view localhost:3000

To gather tweets streaming in:
	1.) Change line 153 in TFstream.js to listen to port 3000 instead of 3001
	2.) run $ Node TFstream.js
	3.) localhost:3000/auth/twitter
			Sign in
	4.) localhost:3000/amiauthed
	5.) MongoDB should be gathering tweets now
	6.) Verify this by doing
			Mongo
			use TFeels
			db.tweets.count() --> See if this is rising
		