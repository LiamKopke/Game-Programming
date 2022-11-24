import { SoundName, StateName } from "../enums.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	sounds,
	stateMachine
} from "../globals.js";
import State from "../../lib/State.js";
import { roundedRectangle } from "../../lib/DrawingHelpers.js";

/**
 * Displays the game over screen along with the final score.
 */
export default class GameOverState extends State {
	constructor() {
		super();

		this.score = 0;
	}

	enter(parameters) {
		this.score = parameters.score;
		this.scene = parameters.scene;
	}

	update(dt) {
		this.scene.update(dt);

		if (keys.Enter) {
			keys.Enter = false;
			stateMachine.change(StateName.TitleScreen);
		}
	}

	render() {
		this.scene.render();
		context.fillStyle = 'rgb(255, 255, 255, 0.75)';
		roundedRectangle(
			context,
			CANVAS_WIDTH / 2 - 150,
			CANVAS_HEIGHT / 2 - 65,
			300,
			130,
			5,
			true,
			false
		);

		context.save();
		context.font = '20px Joystix';
		context.fillStyle = 'blueviolet';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
		context.fillText(`Your Score: ${this.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
		context.fillText('Press Enter', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
		context.restore();
	}
}
