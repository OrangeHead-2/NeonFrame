/**
 * NeonFrame Canvas - Handles responsive canvas and scaling
 */
export class Canvas {
    constructor(options = {}) {
        this.width = options.width || 800;
        this.height = options.height || 600;
        this.background = options.background || '#222';

        this.element = document.createElement('canvas');
        this.ctx = this.element.getContext('2d', { alpha: false });

        this.resize();
        window.addEventListener('resize', this.resize.bind(this));

        if (options.parent) {
            options.parent.appendChild(this.element);
        }
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.element.width = this.width * dpr;
        this.element.height = this.height * dpr;
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
        this.clear();
    }

    clear() {
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
}