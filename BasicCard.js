//BasicCard Constructor
function BasicCard(front, back){
	//front should have question like "Who was the first president of the United States?"
	this.front = front;
	//back should have the answer for the question like "George Washington"
	this.back = back;
}

//using prototype keyword, overloading the constructor with additional function for displaying front side of the card
BasicCard.prototype.frontCard = function() {
    console.log("Front: " +this.front);
}

//using prototype keyword, overloading the constructor with additional function for displaying back side of the card
BasicCard.prototype.backCard = function() {
    console.log("Back: " +this.back);
}

//another sample for overloading the constructor
BasicCard.prototype.bothCard = function() {
    console.log("Front: " +this.front+", "+"Back: "+this.back);
}

//print the right answer if user entered the wrong one
BasicCard.prototype.printRightAnswer = function() {
    console.log("Sorry, the correct answer is " + this.back + ".");
}

//export the java script file
module.exports = BasicCard;