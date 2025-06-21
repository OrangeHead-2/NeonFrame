import { Engine, Scene, Entity, Component, Loader, Input } from '../../src/core/index.js';

class PlayerComponent extends Component {
  constructor() {
    super();
    this.x = 50;
    this.y = 50;
    this.speed = 150;
  }
  update(dt) {
    const input = this.entity.scene.engine.input;
    if (input.isKeyDown('ArrowUp')) this.y -= this.speed * dt;
    if (input.isKeyDown('ArrowDown')) this.y += this.speed * dt;
    if (input.isKeyDown('ArrowLeft')) this.x -= this.speed * dt;
    if (input.isKeyDown('ArrowRight')) this.x += this.speed * dt;
  }
  render(ctx) {
    ctx.fillStyle = '#fa0';
    ctx.fillRect(this.x, this.y, 32, 32);
  }
}

class MainScene extends Scene {
  onEnter() {
    super.onEnter();
    const player = new Entity('Player');
    player.addComponent(new PlayerComponent());
    this.add(player);
  }
}

export function createAdvancedGame() {
  const engine = new Engine({ width: 800, height: 480 });
  engine.setScene(new MainScene());
  return engine;
}