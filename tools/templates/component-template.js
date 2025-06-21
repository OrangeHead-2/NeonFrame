import { Component } from '../../src/core/component.js';

// Example custom component template for NeonFrame
export class CustomComponent extends Component {
  constructor(options = {}) {
    super();
    this.someSetting = options.someSetting || 0;
  }

  start() {
    // Called on first added to entity
  }

  update(dt) {
    // Main logic here
  }

  render(ctx) {
    // Render if needed
  }

  destroy() {
    // Cleanup
  }
}