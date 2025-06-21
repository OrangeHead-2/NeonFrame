import { Engine, Scene, Entity, Component, Loader } from '../../src/core/index.js';
import { Body } from '../../src/physics/body.js';
import { World } from '../../src/physics/world.js';
import { loadSprite, Sprite } from '../../src/render/sprite.js';

class PlayerComponent extends Component {
  constructor(sprite) {
    super();
    this.body = new Body({ x: 100, y: 360, width: 32, height: 48, mass: 1, friction: 0.88 });
    this.sprite = sprite;
    this.onGround = false;
  }
  start() {
    this.world = this.entity.scene.world;
    this.world.addBody(this.body);
  }
  update(dt) {
    const input = this.entity.scene.engine.input;
    if (input.isKeyDown('ArrowLeft')) this.body.velocity.x = -180;
    if (input.isKeyDown('ArrowRight')) this.body.velocity.x = 180;
    if (input.isKeyDown('Space') && this.onGround) {
      this.body.velocity.y = -320;
      this.onGround = false;
    }
    // Ground check
    this.onGround = false;
    for (const b of this.world.bodies) {
      if (b !== this.body && b.fixed) {
        const a = this.body.getAABB();
        const ground = b.getAABB();
        if (a.x < ground.x + ground.width &&
            a.x + a.width > ground.x &&
            Math.abs(a.y + a.height - ground.y) < 8) {
          this.onGround = true;
        }
      }
    }
  }
  render(ctx) {
    if (this.sprite && this.sprite.image) {
      ctx.drawImage(this.sprite.image, this.body.position.x, this.body.position.y, this.body.width, this.body.height);
    } else {
      ctx.fillStyle = '#4f9';
      ctx.fillRect(this.body.position.x, this.body.position.y, this.body.width, this.body.height);
    }
  }
  destroy() {
    this.world.removeBody(this.body);
  }
}

class PlatformComponent extends Component {
  constructor(x, y, w, h, sprite) {
    super();
    this.body = new Body({ x, y, width: w, height: h, fixed: true });
    this.sprite = sprite;
    this.x = x; this.y = y; this.w = w; this.h = h;
  }
  start() {
    this.entity.scene.world.addBody(this.body);
  }
  render(ctx) {
    if (this.sprite && this.sprite.image) {
      for (let px = 0; px < this.w; px += this.sprite.width) {
        ctx.drawImage(this.sprite.image, this.x + px, this.y, this.sprite.width, this.sprite.height);
      }
    } else {
      ctx.fillStyle = '#888';
      ctx.fillRect(this.body.position.x, this.body.position.y, this.body.width, this.body.height);
    }
  }
  destroy() {
    this.entity.scene.world.removeBody(this.body);
  }
}

class PlatformerScene extends Scene {
  onEnter() {
    super.onEnter();
    this.world = new World({ gravity: 900, bounds: {x:0, y:0, width:800, height:480} });
    this.platformSprite = this.engine.loader.get('ground') || null;
    // Platforms
    [
      [0, 450, 800, 30],
      [120, 380, 140, 16],
      [340, 310, 120, 16],
      [520, 250, 160, 16],
      [680, 420, 80, 16]
    ].forEach(([x, y, w, h]) => {
      const e = new Entity('Platform');
      e.addComponent(new PlatformComponent(x, y, w, h, this.platformSprite));
      this.add(e);
    });
    // Player
    const playerSprite = this.engine.loader.get('player') || null;
    const player = new Entity('Player');
    player.addComponent(new PlayerComponent(playerSprite));
    this.add(player);
  }
  update(dt) {
    super.update(dt);
    this.world.update(dt);
  }
}

const engine = new Engine({
  width: 800,
  height: 480,
  parent: document.body,
  background: '#222'
});
const loader = engine.loader;
loader.add('ground', 'assets/ground.png');
loader.add('player', 'assets/player.png'); // Optional, fallback to rectangle if not found
loader.onComplete = () => {
  engine.setScene(new PlatformerScene());
};
loader.load();