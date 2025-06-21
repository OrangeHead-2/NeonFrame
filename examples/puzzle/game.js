import { Engine, Scene, Entity, Component, Loader, Input } from '../../src/core/index.js';

class TileComponent extends Component {
  constructor(x, y, value, size) {
    super();
    this.x = x; this.y = y;
    this.value = value;
    this.size = size;
    this.selected = false;
  }
  render(ctx) {
    ctx.save();
    ctx.fillStyle = this.selected ? '#ff7' : '#2a2';
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.size, this.size);
    ctx.fillStyle = '#000';
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.value, this.x + this.size/2, this.y + this.size/2);
    ctx.restore();
  }
}

class PuzzleScene extends Scene {
  onEnter() {
    super.onEnter();
    this.tiles = [];
    this.size = 4;
    this.tileSize = 100;
    let nums = Array.from({length: this.size*this.size}, (_,i)=>i).sort(()=>Math.random()-0.5);
    for (let y=0; y<this.size; ++y) {
      for (let x=0; x<this.size; ++x) {
        let val = nums[y*this.size+x];
        if (val === 0) continue;
        const e = new Entity('Tile');
        e.addComponent(new TileComponent(x*this.tileSize, y*this.tileSize, val, this.tileSize-4));
        this.add(e);
        this.tiles.push(e);
      }
    }
    this.empty = { x: (this.size-1)*this.tileSize, y: (this.size-1)*this.tileSize };
  }

  onClickTile(tile) {
    // Slide if adjacent to empty
    const dx = Math.abs(tile.x - this.empty.x);
    const dy = Math.abs(tile.y - this.empty.y);
    if ((dx === this.tileSize && dy === 0) || (dx === 0 && dy === this.tileSize)) {
      const old = { x: tile.x, y: tile.y };
      tile.x = this.empty.x;
      tile.y = this.empty.y;
      this.empty = old;
    }
  }

  update(dt) {
    const input = this.engine.input;
    if (input.mouse.pressed) {
      for (const e of this.tiles) {
        const c = e.components[0];
        if (
          input.mouse.x >= c.x && input.mouse.x < c.x + c.size &&
          input.mouse.y >= c.y && input.mouse.y < c.y + c.size
        ) {
          this.onClickTile(c);
          break;
        }
      }
    }
  }

  render(ctx) {
    this.engine.canvas.clear();
    for (const e of this.tiles) e.render(ctx);
  }
}

const engine = new Engine({
  width: 500,
  height: 500,
  parent: document.body,
  background: '#222'
});
engine.setScene(new PuzzleScene());