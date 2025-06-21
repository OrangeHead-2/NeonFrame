/**
 * NeonFrame Component - Base class for entity components
 */
export class Component {
    constructor() {
        this.entity = null;
        this.enabled = true;
    }

    start() {}
    update(dt) {}
    render(ctx) {}
    destroy() {}
}