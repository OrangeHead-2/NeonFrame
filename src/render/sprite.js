/**
 * NeonFrame Sprite - Handles image-based rendering
 */
export class Sprite {
    constructor(image, width = null, height = null) {
        this.image = image;
        this.width = width || image.width;
        this.height = height || image.height;
    }
}

export function loadSprite(src, callback) {
    const img = new window.Image();
    img.onload = () => {
        callback(new Sprite(img));
    };
    img.src = src;
}