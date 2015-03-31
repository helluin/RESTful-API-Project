# RESTful-API-Project
In our Understanding Networks class, we were asked to create a RESTful API for a physical device. 
We first pitched our own APIs and clarified the routes that we were gonna use. 
And then the teacher asked us to switch projects -- we were doing other people's API in the end. 
The idea is to understand 1) how RESTful network works and 2) how to design a better system of routes for the API. 

The project is to build a simple physical device with nine (or less) LEDs. 
Each LED represents a place, a person, a store, or a service that you may wanna call. 
After setting up the API, the user would be able to tell if he can call a certain place/person/service by the on/off state of the LED. 

Here are the routes given by our classmates: 

url/#/
	-addresses 1-9 of zones, this returns “on” or “off” state

url/#/timezone/(0-23)
	-timezone sets offset from Greenwich Mean TIme (12), i.e. New York is (GMT-5) +1 for daylight savings, therefore 8

url/#/on/(0000-2359) 
	-sets time for beginning of “on” state

url/#/off/(0000-2359)
	sets time for beginnin of “on” state
