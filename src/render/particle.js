/**
 * NeonFrame Particle System - Simple particle emitter
 */
import { Vector2 } from '../math/vector2.js';

export class Particle {
    constructor(x, y, vx, vy, life, color) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(vx, vy);
        this.life = life;
        this.maxLife = life;
        this.color = color || '#fff';
    }

    update(dt) {
        this.position.add(this.velocity.clone().multiplyScalar(dt));
        this.life -= dt;
    }

    render(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export class ParticleSystem {
    constructor(x, y, emitRate = 10, color = '#fff') {
        this.position = new Vector2(x, y);
        this.emitRate = emitRate;
        this.color = color;
        this.particles = [];
        this.emitTimer = 0;
    }

    emit() {
        for (let i = 0; i < this.emitRate; ++i) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 50 + 50;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            this.particles.push(new Particle(
                this.position.x, this.position.y, vx, vy, Math.random() * 0.5 + 0.5, this.color
            ));
        }
    }

    update(dt) {
        this.emitTimer += dt;
        if (this.emitTimer >= 0.1) {
            this.emit();
            this.emitTimer = 0;
        }
        this.particles = this.particles.filter(p => p.life > 0);
        for (const p of this.particles) p.update(dt);
    }

    render(ctx) {
        for (const p of this.particles) p.render(ctx);
    }
}