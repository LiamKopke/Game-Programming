import UserInterfaceElement from "../UserInterfaceElement.js";
import Colour from "../../enums/Colour.js";
import { roundedRectangle } from "../../../lib/DrawingHelpers.js";
import { context } from "../../globals.js";
import Panel from "./Panel.js";
import Vector from "../../../lib/Vector.js";

export default class ProgressBar extends UserInterfaceElement {
    constructor(x, y, options = {}){
        super(x, y, 6, 0.4);

        this.borderColour = options.borderColour ?? Colour.Black;
        this.isXp = options.isXp ?? false;
        if(this.isXp){
            this.progressColour = Colour.Blue;
        }
        else{
            this.progressColour =  Colour.Green;
        }
        this.percentage = options.percentage ?? 100;
        this.whiteRect = {x: this.position.x + ((this.dimensions.x - 2) * this.percentage / 100), y: this.position.y + 2, 
        w: (100 - this.percentage) / 100 * this.dimensions.x, h:this.dimensions.y - 4}
    }

    changeProgress(percentage){
        this.percentage = percentage;
        if(this.isXp){
            this.progressColour = Colour.Blue;
        }
        else{
            if(percentage <= 100 && percentage > 50)
                this.progressColour = Colour.Green;
            else if(percentage > 25)
                this.progressColour = Colour.Yellow;
            else{
                this.progressColour = Colour.Red;          
            }
        }        
    }

    render(){
        context.save(); 

        // Black Border
		this.renderBackground();

        // Coloured progress
		this.renderForeground();
        
        // White Rectangle to make it look nicer
        this.renderProgress();  
        
        // Fix rectangle little bit poking out
        this.renderBackgroundNoFill();

		context.restore();
    }

    renderBackground(){
        context.fillStyle = this.borderColour;
		roundedRectangle(
			context,
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			5,
			true,
			true
		);
    }

    renderBackgroundNoFill(){
        context.fillStyle = this.borderColour;
		roundedRectangle(
			context,
			this.position.x + 1,
			this.position.y + 1,
			this.dimensions.x - 2,
			this.dimensions.y - 2,
			5,
			false,
			true
		);
    }

    renderForeground() {
		context.fillStyle = this.progressColour;
		roundedRectangle(
			context,
			this.position.x + 2,
			this.position.y + 2,
			this.dimensions.x - 4,
			this.dimensions.y - 4,
			5,
			true,
			false
		);
	}

    renderProgress() {
        context.fillStyle = Colour.White;
        context.save();
        context.fillRect(this.whiteRect.x, this.whiteRect.y, this.whiteRect.w, this.whiteRect.h);
        context.restore();
    }
}