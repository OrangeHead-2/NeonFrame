/**
 * NeonFrame Entity - Game object container
 */
export class Entity {
    constructor(name = 'Entity') {
        this.name = name;
        this.components = [];
        this.scene = null;
        this.active = true;
    }

    addComponent(component) {
        component.entity = this;
        this.components.push(component);
        if (component.start) component.start();
        return component;
    }

    getComponent(type) {
        return this.components.find(c => c instanceof type);
    }

    update(dt) {
        if (!this.active) return;
        for (const c of this.components) {
            if (c.enabled && c.update) c.update(dt);
        }
    }

    render(ctx) {
        if (!this.active) return;
        for (const c of this.components) {
            if (c.enabled && c.render) c.render(ctx);
        }
    }

    destroy() {
        for (const c of this.components) {
            if (c.destroy) c.destroy();
        }
        this.active = false;
    }
}