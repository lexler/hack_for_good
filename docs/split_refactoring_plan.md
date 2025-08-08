# Goal

We want to split the project into two pieces: the part where it does the counting and the part after the counting.                                   │
The ultimate goal is to make the second half of this application very customizable. 
And we want to achieve that by splitting the first half and the second half to separate URLs so that you can pass it to a completely new URL and still retain the first half of the functionality.

## Split Points
On Finish Evaluation or skip coding, or when the timer runs out which should be calling finish evaluation we want to go to v2/finish_evaluation.html endpoint.
The data of the counts plus whether they decided to skip coding, needs to be transmitted.
Other than that, the app will function pretty much the same. One key difference will be the background behind the modular window - the page behind can just be blank.
They also need to be able to go back to the counter URL on exit.
All information necessary should be passed in the url to the second endpoint.