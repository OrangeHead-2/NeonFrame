/**
 * NeonFrame Engine - Main Game Loop and Engine Manager
 * Handles initialization, main loop, and core services.
 */
import { Canvas } from './canvas.js';
import { Scene } from './scene.js';
import { Input } from './input.js';
import { Loader } from './loader.js';
import { Time } from './time.js';

export class Engine {
    constructor(options = {}) {
        this.options = Object.assign({
            width: 800,
            height: 600,
            parent: document.body,
            background: '#222',
            autoStart: true,
        }, options);

        this.canvas = new Canvas(this.options);
        this.input = new Input(this.canvas.element);
        this.loader = new Loader();
        this.time = new Time();
        this.currentScene = null;
        this.running = false;

        if (this.options.autoStart) {
            this.start();
        }
    }

    setScene(scene) {
        if (this.currentScene) {
            this.currentScene.onExit();
        }
        this.currentScene = scene;
        this.currentScene.engine = this;
        this.currentScene.onEnter();
    }

    start() {
        if (this.running) return;
        this.running = true;
        this._lastFrame = performance.now();
        requestAnimationFrame(this.loop.bind(this));
    }

    stop() {
        this.running = false;
    }

    loop(now) {
        if (!this.running) return;
        const delta = this.time.update(now);
        this.input.update();

        if (this.currentScene) {
            this.currentScene.update(delta);
            this.currentScene.render(this.canvas.ctx);
        }

        requestAnimationFrame(this.loop.bind(this));
    }
}