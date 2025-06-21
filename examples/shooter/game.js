import { Engine, Scene, Entity, Component, Loader, Input } from '../../src/core/index.js';

class BulletComponent extends Component {
  constructor(x, y, dir) {
    super();
    this.x = x; this.y = y;
    this.dir = dir;
    this.speed = 420;
    this.life = 2;
  }
  update(dt) {
    this.x += Math.cos(this.dir) * this.speed * dt;
    this.y += Math.sin(this.dir) * this.speed * dt;
    this.life -= dt;
    if (this.life <= 0) this.entity.active = false;
  }
  render(ctx) {
    ctx.save();
    ctx.fillStyle = '#ff3';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}

class PlayerComponent extends Component {
  constructor() {
    super();
    this.x = 400; this.y = 240;
    this.speed = 240;
    this.shootCooldown = 0;
  }
  update(dt) {
    const input = this.entity.scene.engine.input;
    if (input.isKeyDown('ArrowUp')) this.y -= this.speed * dt;
    if (input.isKeyDown('ArrowDown')) this.y += this.speed * dt;
    if (input.isKeyDown('ArrowLeft')) this.x -= this.speed * dt;
    if (input.isKeyDown('ArrowRight')) this.x += this.speed * dt;
    // Shooting
    this.shootCooldown -= dt;
    if (input.mouse.pressed && this.shootCooldown <= 0) {
      const dx = input.mouse.x - this.x, dy = input.mouse.y - this.y;
      const dir = Math.atan2(dy, dx);
      const bullet = new Entity('Bullet');
      bullet.addComponent(new BulletComponent(this.x, this.y, dir));
      this.entity.scene.add(bullet);
      this.shootCooldown = 0.16;
    }
  }
  render(ctx) {
    ctx.save();
    ctx.fillStyle = '#39f';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 20, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}

class ShooterScene extends Scene {
  onEnter() {
    super.onEnter();
    const player = new Entity('Player');
    player.addComponent(new PlayerComponent());
    this.add(player);
  }
}

const engine = new Engine({
  width: 800,
  height: 480,
  parent: document.body,
  background: '#181818'
});
engine.setScene(new ShooterScene());