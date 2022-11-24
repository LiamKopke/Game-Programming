import Entity from "../entities/Entity.js";
import { timer } from "../globals.js";
import Background from "./Background.js";
import Fireball from "../entities/Fireball.js";

export default class Level {
	constructor(tilemap, entities = [], objects = []) {
		this.tilemap = tilemap;
		this.entities = entities;
		this.objects = objects;
		this.background = new Background(this.tilemap.canvasDimensions);
	}

	update(dt) {
		this.cleanUpEntitiesAndObjects();

		timer.update(dt);

		this.tilemap.update(dt);
		this.background.update();

		this.objects.forEach((object) => {
			object.update(dt);
		});

		this.entities.forEach((entity) => {			
			entity.update(dt);			
		});		
	}

	render() {
		this.background.render();
		this.tilemap.render();

		this.objects.forEach((object) => {
			object.render();
		});

		this.entities.forEach((entity) => {
			entity.render();
		});
	}

	cleanUpEntitiesAndObjects() {
		this.entities = this.entities.filter((entity) => !entity.cleanUp);
		this.objects = this.objects.filter((object) => !object.cleanUp);
	}

	/**
	 * @param {Entity} entity
	 */
	addEntity(entity) {
		this.entities.push(entity);
	}

	addObject(object){
		this.objects.push(object);
	}

	addCamera(camera) {
		this.background.addCamera(camera);
	}
}
