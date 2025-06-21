/**
 * NeonFrame Scene - Base class for game scenes/states
 */
export class Scene {
    constructor() {
        this.engine = null;
        this.entities = [];
        this.loaded = false;
    }

    onEnter() {
        // Override in subclass
        this.loaded = true;
    }

    onExit() {
        // Override in subclass
        this.loaded = false;
    }

    update(dt) {
        for (const entity of this.entities) {
            entity.update(dt);
        }
    }

    render(ctx) {
        this.engine.canvas.clear();
        for (const entity of this.entities) {
            entity.render(ctx);
        }
    }

    add(entity) {
        entity.scene = this;
        this.entities.push(entity);
    }

    remove(entity) {
        this.entities = this.entities.filter(e => e !== entity);
    }
}