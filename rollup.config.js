import { terser } from "rollup-plugin-terser";

export default [
  // Standard build
  {
    input: "src/index.js",
    output: [
      {
        file: "dist/neonframe.js",
        format: "esm",
        sourcemap: true
      },
      {
        file: "dist/neonframe.min.js",
        format: "esm",
        plugins: [terser()],
        sourcemap: true
      }
    ],
    plugins: []
  },
  // Module builds (physics, audio, ui)
  {
    input: "src/physics/index.js",
    output: [
      { file: "dist/modules/physics.min.js", format: "esm", plugins: [terser()] }
    ]
  },
  {
    input: "src/audio/index.js",
    output: [
      { file: "dist/modules/audio.min.js", format: "esm", plugins: [terser()] }
    ]
  },
  {
    input: "src/ui/index.js",
    output: [
      { file: "dist/modules/ui.min.js", format: "esm", plugins: [terser()] }
    ]
  }
];