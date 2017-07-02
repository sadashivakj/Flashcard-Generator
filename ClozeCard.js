//ClozeCard Constructor
function ClozeCard(fullText, cloze){
	// Check to see if cloze sentence is fullText
	//if it does not have it display error messafe and return from the constructor 
	if(fullText.toLowerCase().indexOf(cloze.toLowerCase()) === -1){
		console.log("ERROR: fullText - "+fullText+ " does not contain cloze-deletion sentence - " +cloze);
		return;
	}
	
	this.text = "";
	//cloze should have "George Washington"
	this.cloze = cloze;
	//full text should have "George Washington was the first president of the United States."
	this.fullText = fullText;
	//Display Cloze data For ex: cloze should have "George Washington"
	this.displayCloze = function() {
        console.log(this.cloze);
    }
	//Display fullText data
	//For ex: fullText should have "George Washington was the first president of the United States."
	this.displayfullText = function() {
        console.log(this.fullText);
    }
	
	//retrun the partial text question to user prompt by replacing the cloze data with '---' within the bracket
	this.partialText = this.fullText.replace(this.cloze, "---");
	
	this.displayPartial = function(){
		this.partialText = this.fullText.replace(this.cloze, "---");
		console.log(this.partialText);
	}

	//print the right answer if user entered the wrong one
	this.printRightAnswer = function() {
    	console.log("Sorry, the correct answer is : \n" + this.fullText);
	}
}

//export the java script file
module.exports = ClozeCard;