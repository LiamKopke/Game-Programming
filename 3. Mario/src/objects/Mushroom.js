import Powerup from "./Powerup.js";

export default class Mushroom extends Powerup {
	constructor(dimensions, position) {
		super(dimensions, position);

        this.currentFrame = 0;
	}

    onConsume(player) {
        if(this.wasConsumed) return;
		super.onConsume(player);

        player.mushroom();  
	}
}
