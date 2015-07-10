// This is a simple game of connect the dots. Whenever a box has all 4 of it's borders
// selected, it becomes filled in with that player's color and that player scores a point.
// Whoever has the most points at the end wins.

// Known issues that will be fixed soon
// 1. Clicking a chosen border still causes it to go to the next player's turn. Should do nothing.
// 2. No form validation on the game setup (they can choose on players, names, and colors)
// 3. Not responsive at all

// Constructor for the game players
function Person(name, color) {
	this.name = name;
	this.color = color;
	this.score = 0;
}

// Keeps track of players, turns, and game status
function Game(players, columns) {
	this.players = players;
	this.whoseTurn = 0;
	this.numOfBoxes = columns * columns;
	this.currentPlayer = this.players[0];
}

// Creates and displays a paragraph with each player's name and score
Game.prototype.createScoreBoard = function () {
	var output = "";
	for (var i = 0; i < this.players.length; i++) {
		output += "<p class='player" + i + "'>" + this.players[i].name + ": <span>0</span></p>";
	}
	output += "<p id='winner'></p>";
	$("#scoreboard").html(output);
	$("#winner").hide();
}

// Updates score, runs functions to see if game is over, if it is, runs function to say who won
Game.prototype.updateScore = function () {
	$(".player" + this.whoseTurn + " span").html(this.players[this.whoseTurn].score);
	if(this.checkGameOver()) {
		this.declareWinner();
	}
}

// Checks to see if game is over by comparing totaled scores again total number of boxes on the board
Game.prototype.checkGameOver = function() {
	console.log("checked!");
	var totalOfScores = 0;
	for (var i = 0; i < this.players.length; i++) {
		totalOfScores += this.players[i].score;
	}
	if(totalOfScores === this.numOfBoxes) {
		return true;
	} else {
		return false;
	}
}

// Figures out who won, turns off the current player indicator (a border around the player's name/score)
Game.prototype.declareWinner = function () {
	var highScore = 0;
	var winnerName;	
	for (var i = 0; i < this.players.length; i++) {
		$(".player" + (this.whoseTurn)).css("border-color", "#fff");
	}
	for (var i = 0; i <this.players.length; i++) {
		if(this.players[i].score > highScore) {
			winnerName = this.players[i].name;
		}
	}
	$("#winner").html(winnerName + " is the winner!")
	$("#winner").fadeIn("slow");	
console.log("winner");	
}

// Sets the current player indicator (a border around the player's name/score)
Game.prototype.setInitialTurnIndicator = function() {
	$(".player" + (this.whoseTurn)).css("border-color", this.currentPlayer.color);
}

// Advances to the next player
Game.prototype.nextTurn = function() {
	$(".player" + (this.whoseTurn)).css("border-color", "#fff");
	if(this.whoseTurn < this.players.length - 1) {
		this.whoseTurn++;
	} else {
		this.whoseTurn = 0;
	}
	this.currentPlayer = this.players[this.whoseTurn];
	$(".player" + (this.whoseTurn)).css("border-color", this.currentPlayer.color);
};

// Constructor for the grid
function Grid(numOfColumns) {
	this.numOfColumns = numOfColumns;
	this.rows = [];
};

// Creates the grid of divs. Gameplay works by hovering near a border. Each grid 
// div contains 'sensor divs' to detect when the mouse is hovering near a border.
// All divs have their own bottom and right borders/sensors. 
// The first row also has top borders/sensors.
// The first child of each row also has left borders/sensors.
// This means the top left div uses all borders/sensors.
// The sensor numbers start with 1 for top, 2 for right, 3 for bottom, and 4 for left.

Grid.prototype.createFirstRow = function() {
	var firstRow;
	// Creates top left div - sensors: all
	firstRow = '<div class="row">';
	firstRow += '<div class="box-top-left">';
	firstRow += '<div class="dot top left"></div>';
	firstRow += '<div class="dot top right"></div>';
	firstRow += '<div class="dot bottom right"></div>';
	firstRow += '<div class="dot bottom left"></div>';
	firstRow += '<div class="sensor1 sensorX"></div>';
	firstRow += '<div class="sensor2 sensorY"></div>';
	firstRow += '<div class="sensor3 sensorX"></div>';
	firstRow += '<div class="sensor4 sensorY"></div>';
	firstRow += '</div>';
	// Creates top row - sensors: top right bottom
	for (var i = 1; i < this.numOfColumns; i++) {
		firstRow +=	'<div class="box-top-row">';
		firstRow +=	'<div class="dot top right"></div>';
		firstRow +=	'<div class="dot bottom right"></div>';
		firstRow +=	'<div class="sensor1 sensorX"></div>';
		firstRow +=	'<div class="sensor2 sensorY"></div>';
		firstRow +=	'<div class="sensor3 sensorX"></div>';
		firstRow +=	'</div>';
	}
	firstRow +=	'</div>';
	this.rows.push(firstRow);
}

Grid.prototype.createStandardRows = function() {
	for (var i = 1; i < this.numOfColumns; i++) {
		var standardRow;
		// Creates first child of each row - sensors: right bottom left
		standardRow = '<div class="row">';
		standardRow += '<div class="box-first-child">';
		standardRow += '<div class="dot bottom left"></div>';
		standardRow += '<div class="dot bottom right"></div>';
		standardRow += '<div class="sensor2 sensorY"></div>';
		standardRow += '<div class="sensor3 sensorX"></div>';
		standardRow += '<div class="sensor4 sensorY"></div>';
		standardRow += '</div>';
		// Creates all the standard divs - sensors: right bottom
		for (var j = 1; j < this.numOfColumns; j++) {
			standardRow += '<div class="box-standard">';
			standardRow += '<div class="dot bottom right"></div>';
			standardRow += '<div class="sensor2 sensorY"></div>';
			standardRow += '<div class="sensor3 sensorX"></div>';
			standardRow += '</div>';
		}
		standardRow += '</div>';
		this.rows.push(standardRow);
	}
}

// Displays the grid
Grid.prototype.createOutput = function() {
	this.output = this.rows.join(" ");
	$("#gameboard").html(this.output);
}

// Builds grid
Grid.prototype.createGrid = function () {
	this.createFirstRow();
	this.createStandardRows();
	this.createOutput();
}

// Checks the value of a select input to see how many players
// Then displays player info input
$("#number-of-players").change(function(){
	var numOfPlayers = $(this).val();
	console.log(numOfPlayers);
	var output = "";
	for (var i = 0; i < numOfPlayers; i++) {
		output += "<h2>Player " + (i + 1) + "</h2><label for='player" + (i + 1) + "'>Name:</label>" + "<input class='name" + (i + 1) + "' type='text'>";
		output += createColorPicker("color-picker" + (i + 1));
	}
	$("#player-inputs").html(output).fadeIn("slow");
})

// Creates a select menu of colors for the player to choose from to represent them
function createColorPicker (playerClass) {
	var colors = ["PapayaWhip", "PowderBlue", "SeaGreen", "LightCoral", "DeepPink", "Fuchsia" ];
	var colorPickerOutput = "<select class='" + playerClass + "'>";
		colorPickerOutput +="<option value='nothing'>Choose a color:</option>"

	for (var i = 0; i < colors.length; i++) {
		colorPickerOutput += "<option style='background: " + colors[i] + "' value='" + colors[i] + "'>" + colors[i] + "</option>"
	}
	colorPickerOutput += "</select>";
	return colorPickerOutput;
}

$("#start-button").click(function() {
	var numOfPlayers = $("select").val();
	var players = [];
	var columns = 4;
	for (var i = 0; i < numOfPlayers; i++) {
		players[i] = new Person($(".name" + (i + 1)).val(), $(".color-picker" + (i + 1)).val())
	}
// Left the var keyword off so they're global.
// I know there's a better way to do it than this, but I haven't
// quite figured it out yet.
	grid = new Grid(columns);
	grid.createGrid();
	game = new Game(players, columns);
	game.createScoreBoard();
	game.setInitialTurnIndicator();
	activateSensors();

	$("#game-setup").fadeOut("slow", function(){
		$("#gameboard").fadeIn("slow");	
		$("#scoreboard").fadeIn("slow");	
	});
});


// Put it in a function to call later, since the board
// is dynamically created and there are no sensor divs
// from the start

// See big comment of code above (about the grid) to see
// how the game and sensors work

// checkBox checks the borders of it's own div to see
// if the player is placing the last border to score.
// checkBox also checks relevant adjacent boxes since the
// sensors are shared by divs


// Sensor1 is the "top" sensor
function activateSensors() {
	$(".sensor1").mouseenter(function(){
		$(this).parent().addClass("hover-border-top"); // when player hovers over possible choice
	}).mouseleave(function(){
		$(this).parent().removeClass("hover-border-top");
	}).click(function(){
		$(this).parent().addClass("choose-border-top"); // chooses the border
	}).click(function(){
		var scored = false;	
		if(checkBox($(this))) { // check to see if it's the last border being placed
			$(this).parent().css("background", game.currentPlayer.color); // colors the div as occupied with player's color
			game.currentPlayer.score++; // gives the current player one point
			game.updateScore(); // displays the new score
			scored = true; // makes it so they get another turn
		}
		if (!scored) { // if they didn't score it goes to the next player
			game.nextTurn();
		}
	});

///////////////////////////////////////////////
//
//	See sensor1 for documentation of how the sensors work
//
///////////////////////////////////////////////


	// Sensor 2 is the "right" sensor
	$(".sensor2").mouseenter(function(){
		$(this).parent().addClass("hover-border-right");
	}).mouseleave(function(){
		$(this).parent().removeClass("hover-border-right");
	}).click(function(){
		$(this).parent().addClass("choose-border-right");
	}).click(function(){
		var scored = false;
		if (checkBox($(this))) {
			$(this).parent().css("background", game.currentPlayer.color);
			game.currentPlayer.score++;
			game.updateScore();
			scored = true;
		}
		// Checks the next sibling box too, since they share a sensor
		// It's disabled for the last child of a row, since there is no next sibling box
		if ($(this).parent().index() < $(this).parent().parent().children().length - 1) {
			if(checkBox($(this).parent().next().children(".sensor2"))) {
				$(this).parent().next().css("background", game.currentPlayer.color);
				game.currentPlayer.score++;
				game.updateScore();
				scored = true;
			}
		}
		if (!scored) { 
			game.nextTurn();
		}
	});

	// Sensor 3 is the "bottom" sensor
	$(".sensor3").mouseenter(function(){
		$(this).parent().addClass("hover-border-bottom");
	}).mouseleave(function(){
		$(this).parent().removeClass("hover-border-bottom");
	}).click(function(){
		$(this).parent().addClass("choose-border-bottom");
	}).click(function(){
		var scored = false;	
		if (checkBox($(this))) {
			$(this).parent().css("background", game.currentPlayer.color);
			game.currentPlayer.score++;
			game.updateScore();
			scored = true;
		}
		// Checks the box below it, since they share a sensor
		// Doesn't check if the original box is in the last row
		// since there wouldn't be a box below.
		if ($(this).parent().parent().parent().children().length > $(this).parent().parent().index() + 1) {
			var boxLocation = $(this).parent().index();
			var boxBelow = $(this).parent().parent().next().children('[class*="box"]').slice(boxLocation, boxLocation + 1);
			if(checkBox($(this).parent().parent().next().children('[class*="box"]').slice(boxLocation, boxLocation + 1).children(".sensor2"))) {
				boxBelow.css("background", game.currentPlayer.color);
				game.currentPlayer.score++;
				game.updateScore();
				scored = true;
			}
		}
		if (!scored) { 
			game.nextTurn();
		}
	});

	// Sensor 4 is the "left" sensor
	$(".sensor4").mouseenter(function(){
		$(this).parent().addClass("hover-border-left");
	}).mouseleave(function(){
		$(this).parent().removeClass("hover-border-left");
	}).click(function(){
		$(this).parent().addClass("choose-border-left");
	}).click(function(){
		var scored = false;	
		if(checkBox($(this))) {
			$(this).parent().css("background", game.currentPlayer.color);
			game.currentPlayer.score++;
			game.updateScore();
			scored = true;
		}
		if (!scored) { 
			game.nextTurn();
		}
	});
}

// Checks the borders of a box to see if this turn completes a box
function checkBox(thisBox) {
	// If it has a background color other than white, it means it's taken
	if(thisBox.parent().css("background-color") !== "rgba(0, 0, 0, 0)") {
		return false;
	}
	var borderTop = false;
	var borderRight = false;
	var borderBottom = false;
	var borderLeft = false;
	var boxType = thisBox.parent().attr("class").split(' ')[0];

	if (boxType === "box-standard") {
		var boxPosition = thisBox.parent().index();
		var boxAbove = thisBox.parent().parent().prev().children('[class*="box"]').slice(boxPosition, boxPosition + 1);
		var boxLeft = thisBox.parent().prev();

		if (boxAbove.hasClass("choose-border-bottom")) {
			borderTop = true;
		}

		if (thisBox.parent().hasClass("choose-border-right")) {
			borderRight = true;
		}

		if (thisBox.parent().hasClass("choose-border-bottom")) {
			borderBottom = true;
		}

		if (boxLeft.hasClass("choose-border-right")) {
			borderLeft = true;
		}

		if (borderTop && borderRight && borderBottom && borderLeft) {
			return true;
		}
	} else if (boxType === "box-top-row") {
		var boxLeft = thisBox.parent().prev();

		if (thisBox.parent().hasClass("choose-border-top")) {
			borderTop = true;
		}

		if (thisBox.parent().hasClass("choose-border-right")) {
			borderRight = true;
		}

		if (thisBox.parent().hasClass("choose-border-bottom")) {
			borderBottom = true;
		}

		if (boxLeft.hasClass("choose-border-right")) {
			borderLeft = true;
		}

		if (borderTop && borderRight && borderBottom && borderLeft) {
			return true;
		}
	} else if (boxType === "box-first-child") {
		var boxPosition = thisBox.parent().index();
		var boxAbove = thisBox.parent().parent().prev().children('[class*="box"]').slice(boxPosition, boxPosition + 1);

		if (boxAbove.hasClass("choose-border-bottom")) {
			borderTop = true;
		}

		if (thisBox.parent().hasClass("choose-border-right")) {
			borderRight = true;
		}

		if (thisBox.parent().hasClass("choose-border-bottom")) {
			borderBottom = true;
		}

		if (thisBox.parent().hasClass("choose-border-left")) {
			borderLeft = true;
		}

		if (borderTop && borderRight && borderBottom && borderLeft) {
			return true;
		}
	} else if (boxType === "box-top-left") {
		if (thisBox.parent().hasClass("choose-border-top")) {
			 borderTop = true;
		}

		if (thisBox.parent().hasClass("choose-border-right")) {
			borderRight = true;
		}

		if (thisBox.parent().hasClass("choose-border-bottom")) {
			borderBottom = true;
		}

		if (thisBox.parent().hasClass("choose-border-left")) {
			borderLeft = true;
		}

		if (borderTop && borderRight && borderBottom && borderLeft) {
			return true;
		}		
	}
}