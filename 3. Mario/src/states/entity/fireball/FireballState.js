import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Fireball from "../../../entities/Fireball.js";
import Direction from "../../../enums/Direction.js";
import { getRandomPositiveInteger } from "../../../../lib/RandomNumberHelpers.js";
import { timer } from "../../../globals.js";

export default class FireballState extends State {
    constructor(fireball, direction) {
        super();

        this.fireball = fireball;

        let currentFrame = getRandomPositiveInteger(0, Fireball.SPRITES_HEIGHT - 1) * 4;
        let chance = Math.random();
        if(chance < 0.5) currentFrame++;

        this.animation = new Animation([currentFrame], 1);

        if(direction === Direction.Left){
            this.fireball.velocity.x = -75;
        }
        else if(direction === Direction.Right){
            this.fireball.velocity.x = 75;
        }


        timer.wait(2, () => {this.fireball.isDead = true});
    }

    enter() {
        this.fireball.currentAnimation = this.animation;
    }
}
