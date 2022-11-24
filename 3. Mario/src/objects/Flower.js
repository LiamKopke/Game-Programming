import Powerup from "./Powerup.js";

export default class Flower extends Powerup {
	constructor(dimensions, position) {
		super(dimensions, position);

        this.currentFrame = 1;
	}

    onConsume(player) {
        if(this.wasConsumed) return;
		super.onConsume();

        player.flower();
	}
}


