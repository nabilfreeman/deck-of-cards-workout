NodeList.prototype.forEach = Array.prototype.forEach;

var stopwatch_el = document.querySelector("header");
var stopwatch_interval;
var start_time = 0;
var timer = 0;

function start_timer() {
  stop_timer();

  start_time = Date.now();
  stopwatch_interval = setInterval(function() {
    
    timer = Date.now() - start_time;
    
    var time_object = new Date(timer);
    
    var minutes = "0" + time_object.getMinutes();
    minutes = minutes.substr(minutes.length - 2);
    
    var seconds = "0" + time_object.getSeconds();
    seconds = seconds.substr(seconds.length - 2);
    
    var milliseconds = "00" + time_object.getMilliseconds();
    milliseconds = milliseconds.substr(milliseconds.length - 3);
    milliseconds = milliseconds.slice(0, -1);
    
    stopwatch_el.innerHTML = "Total time: " + minutes + ":" + seconds + ":" + milliseconds;
    
  }, 50);
}

function stop_timer() {
  clearInterval(stopwatch_interval);
}

//shuffle function
var shuffle = function(array){
	var currentIndex = array.length, temporaryValue, randomIndex ;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

//END UTILITY STUFF

var intro = document.querySelector("#intro");
var deck = document.querySelector("#deck");
var footer = document.querySelector("footer");
var message = document.querySelector("#message");

//make a dummy card to give the appearance of a deck of cards.
var dummy_card = document.createElement("div");
dummy_card.classList.add("card_wrapper", "dummy");
dummy_card.innerHTML = '<div class="card"><div class="back"></div></div>';

deck.appendChild(dummy_card);

var messages = [
	"LET'S GO!",
	"KEEP GOING!",
	"YOU GOT THIS!",
	"WORK IT BABY!",
	"FEEL THE BURN!",
	"BUENO!",
	"GOD IT HURTS",
	"HALF WAY THERE!",
	"WOW!",
	"DOUBLE KILL!",
	"HOME STRETCH!",
	"NEARLY",
	"YES...",
	"YOU DID IT!!!"
];

var message_timeout;

var epicMessage = function(stay){
	clearTimeout(message_timeout);

	message.style.display = "block";
	message.querySelector(".wrapper div").innerHTML = messages.pop();

	if(!stay){
		message_timeout = setTimeout(function(){
			message.style.display = "none";
		}, 1000);
	} else {
		message.classList.add("no_animation");

		message.querySelector(".wrapper div").appendChild(document.createElement("br"));

		var button = document.createElement("button");
		button.innerHTML = "Play again";

		button.addEventListener("click", function(){
			window.location.reload();
		});

		message.querySelector(".wrapper div").appendChild(button);
	}
};

var generateCard = function(suit, number){

	var thrown = document.querySelector(".card_wrapper.thrown");
	if(thrown !== null){
		thrown.parentNode.removeChild(thrown);
	}

	var drawn = document.querySelector(".card_wrapper.drawn");
	if(drawn !== null){
		drawn.classList.remove("drawn");
		drawn.classList.add("thrown");
	}

	var card = document.createElement("div");
	card.classList.add("card_wrapper", "drawn");

	var writing = '<span class="number">' + number + "</span> rep";

	if(number > 1) writing += "s";

	switch(suit){
		case 1:
			card.classList.add("hearts");
		break;
		case 2:
			card.classList.add("clubs");
		break;
		case 3:
			card.classList.add("diamonds");
		break;
		case 4:
			card.classList.add("spades");
		break;
	}

	card.innerHTML = '<div class="card">'
		+ '<div class="front">'
			+ '<div class="writing">' + writing + '</div>'
			+ '<div class="writing flipped">' + writing + '</div>'
			+ '<div class="animation"></div>'
		+ '</div>'
		+ '<div class="back"></div>'
	+ '</div>';

	deck.appendChild(card);
}

var createDeck = function(workout){
	
	// intro.classList.add("thrown");
	document.body.removeChild(intro);

	document.body.classList.remove("intro");
	footer.innerHTML = "DRAW A CARD!";

	var cards = [];

	//generate our deck of cards. 13 if fast, 52 if epic.
	switch(workout){
		case "fast":
			messages.splice(4, messages.length - 5);

			for(var i = 1; i < 5; i++) {
				for(var j = 1; j < 14; j+=4) {
					
					//if the current index is a picture card i.e. more than 10, set reps to a 5.
					// var reps = j > 10 ? 5 : j;
					var reps = j;

					cards.push({
						suit: i,
						number: reps
					});
				}
			}
		break;
		case "epic":
			for(var i = 1; i < 5; i++) {
				for(var j = 1; j < 14; j++) {
					
					//if the current index is a picture card i.e. more than 10, set reps to a 5.
					// var reps = j > 10 ? 5 : j;
					var reps = j;

					cards.push({
						suit: i,
						number: reps
					});
				}
			}
		break;
	}

	//reverse epic messages so we can pop them off the array.
	messages.reverse();

	var workout_length = cards.length;

	// cards = [{
	// 	suit: 1,
	// 	number: 5
	// }];

	var drawCard = function(e){
		e.preventDefault();

		if(cards.length === 0){
			var drawn = document.querySelector(".card_wrapper.drawn");
			if(drawn !== null){
				document.removeEventListener("touchstart", drawCard);
				document.removeEventListener("click", drawCard);

				drawn.classList.remove("drawn");
				drawn.classList.add("thrown");
				
				epicMessage(true);
				stop_timer();

				initFireworks();
			}
			return;
		}

		if(cards.length % 4 === 0){
			epicMessage();
		}

		if(stopwatch_interval === undefined){
			start_timer();
		}

		shuffle(cards);
		var card = cards.pop();

		if(cards.length === 0){
			dummy_card.parentNode.removeChild(dummy_card);
		}

		generateCard(card.suit, card.number);
		footer.innerHTML = (workout_length - cards.length) + " / " + workout_length;

		if(window.ga !== undefined){
			ga('send', 'event', 'screen', 'tapped screen');
		}

		return false;
	};

	document.addEventListener("touchstart", drawCard);
	document.addEventListener("click", drawCard);

};

intro.querySelectorAll("button").forEach(function(choice){

	choice.addEventListener("click", function(e){
		e.stopPropagation();
		createDeck(choice.getAttribute("data-workout"));
	});

});