import Particle from "../../../../lib/Particle.js";
import State from "../../../../lib/State.js";
import { context, timer, CANVAS_HEIGHT } from "../../../globals.js";
import Animation from "../../../../lib/Animation.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";

export default class PlayerDyingState extends State {
	constructor(player, tilemap) {
		super();
        
		this.player = player;
        this.tilemap = tilemap;
		this.particles = [];        
		this.animation = new Animation([4], 1);
	}

	enter() {
		for (let i = 0; i < 150; i++) {
			this.particles.push(new Particle(
				this.player.position.x + this.player.dimensions.x / 2,
				this.player.position.y + this.player.dimensions.y / 2,
				{ r: 120, g: 5, b: 35 },
				1,
				100
			));
		}
        this.player.currentAnimation = this.animation;
        this.player.stop();
	}

	update(dt) {
		this.particles.forEach((particle) => {
			particle.update(dt);
		});

		this.particles = this.particles.filter((particle) => particle.isAlive);

        this.player.position.y += 1;

        if(this.player.position.y > CANVAS_HEIGHT){
            this.player.isDead = true;
        }
	}

	render() {
		this.particles.forEach((particle) => {
			particle.render(context);
		});
	}
}
