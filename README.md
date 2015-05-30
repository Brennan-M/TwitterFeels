# Overview

TwitterFeels is a web application where users can query on a specific word or phrase in order to see how the United States currently feels about those topics based on tweets. The map of the United States shows how each state feels about the topic based on color (light is positive, dark is negative) and the right column shows top tweets containing the queried word or phrase. 

# Run Locally

### To run website:
1. Make sure line 153 in TFstream.js is listening to port 3001
2. $ nodemon (Download nodemon using npm if you don't already have it)
3. View localhost:3000

### To gather tweets streaming in:
 1. Change line 153 in TFstream.js to listen to port 3000 instead of 3001
 2. run $ Node TFstream.js
 3. localhost:3000/auth/twitter
 4. Sign in
 5. localhost:3000/amiauthed
 6. MongoDB should be gathering tweets now
 7. Verify this by doing...
 
```
Mongo
use TFeels
db.tweets.count() --> See if this is rising
```
		
