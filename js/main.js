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

//generate our deck of cards.
var cards = [];
for(var i = 1; i < 5; i++) {
	for(var j = 1; j < 14; j++) {
		
		//if the current index is a picture card i.e. more than 10, set reps to a 5.
		var reps = j > 10 ? 5 : j;

		cards.push({
			suit: i,
			number: reps
		});
	}
}

//shuffle the deck!
shuffle(cards);

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
	"TOUCH DOWN!!!"
];
messages.reverse();

var epicMessage = function(stay){
	message.style.display = "block";
	message.querySelector("div").innerHTML = messages.pop();

	if(!stay){
		setTimeout(function(){
			message.style.display = "none";
		}, 2000);
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

var drawCard = function(e){
	e.preventDefault();

	var intro = document.querySelector("#intro");

	if(intro !== null){
		document.body.classList.remove("intro");
		document.body.removeChild(intro);
		footer.innerHTML = "DRAW A CARD!";

		return;
	}

	if(cards.length === 0){
		var drawn = document.querySelector(".card_wrapper.drawn");
		if(drawn !== null){
			document.removeEventListener("touchstart", drawCard);
			document.removeEventListener("click", drawCard);

			drawn.classList.remove("drawn");
			drawn.classList.add("thrown");
			
			epicMessage(true);
			stop_timer();
			
			footer.innerHTML = '<a href="http://github.com/nabilfreeman/deck-of-cards-workout" target="_blank">View source code</a>';
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
	footer.innerHTML = (52 - cards.length) + " / 52";

	if(window.ga !== undefined){
		ga('send', 'event', 'screen', 'tapped screen');
	}

	return false;
};

document.addEventListener("touchstart", drawCard);
document.addEventListener("click", drawCard);