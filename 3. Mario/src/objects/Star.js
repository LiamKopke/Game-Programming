import Powerup from "./Powerup.js";
import { timer } from "../globals.js";

export default class Star extends Powerup {
	constructor(dimensions, position) {
		super(dimensions, position);

        this.currentFrame = 2;
	}

    onConsume(player) {
        if(this.wasConsumed) return;
		super.onConsume();

        player.star();

        timer.wait(5, () => { player.normal() });
	}
}
