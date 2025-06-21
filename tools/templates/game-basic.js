import { Engine, Scene, Entity, Component, Loader } from '../../src/core/index.js';

class MainScene extends Scene {
  onEnter() {
    super.onEnter();
    const player = new Entity('Player');
    player.addComponent(new class extends Component {
      update(dt) {
        // player logic here
      }
      render(ctx) {
        ctx.fillStyle = '#0ff';
        ctx.fillRect(100, 100, 32, 32);
      }
    });
    this.add(player);
  }
}

export function createGame() {
  const engine = new Engine({ width: 640, height: 360 });
  engine.setScene(new MainScene());
  return engine;
}