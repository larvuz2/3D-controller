# 3D Physics-Based Water Pond Scene with Ghibli-Style Shader

A physics-based 3D scene featuring a realistic water pond with Ghibli-style toon shading, foam effects, naturally moving water, islands topped with trees, and a character that floats half-submerged in the water. Built with Three.js and Rapier physics engine.

![3D Water Pond Scene](https://github.com/larvuz2/3D-controller/raw/main/public/screenshot.png)

## 🌟 Features

- **Ghibli-Style Water Shader**: Beautiful stylized water with toon shading inspired by Studio Ghibli
- **Foam Effects**: Dynamic foam that appears around objects and shores
- **Physics-based Buoyancy**: Character floats realistically in water with simulated buoyancy
- **Islands with Trees**: Multiple islands with trees and vegetation scattered throughout the pond
- **Intuitive Controls**: WASD for movement, Space for jumping
- **Collision Detection**: Accurate collision handling with islands and objects
- **Camera Controls**: Orbit camera that follows the character
- **3D Rendering**: High-quality graphics with Three.js
- **Responsive Design**: Adapts to different screen sizes
- **Performance Optimized**: Efficient rendering and physics calculations
- **Cross-browser Compatible**: Works on all modern browsers

## 🎮 Controls

- **W**: Move forward
- **A**: Move left
- **S**: Move backward
- **D**: Move right
- **Space**: Jump
- **Mouse**: Rotate camera

## 🔧 Tech Stack

- **Frontend Framework**: Vanilla JavaScript
- **3D Rendering**: [Three.js](https://threejs.org/) (v0.160.0)
- **Physics Engine**: [Rapier](https://rapier.rs/) (@dimforge/rapier3d-compat v0.11.2)
- **Custom Shaders**: GLSL shaders for water effects
- **Build Tool**: [Vite](https://vitejs.dev/) (v5.0.0)
- **Deployment**: [Netlify](https://www.netlify.com/)

## 📋 Project Structure

```
3D-controller/
├── public/               # Static assets
│   ├── shaders/          # GLSL shader files
│   │   ├── waterVertexShader.glsl
│   │   └── waterFragmentShader.glsl
│   └── textures/         # Textures for water and other materials
│       └── water/
│           ├── waternormals.jpg
│           └── foam/
│               └── dudvMap.png
├── src/                  # Source code
│   ├── camera.js         # Camera controller
│   ├── character.js      # Character controller with buoyancy
│   ├── environment.js    # Islands, trees, and vegetation setup
│   ├── input.js          # Input handling
│   ├── main.js           # Application entry point
│   ├── physics.js        # Physics world with buoyancy simulation
│   └── scene.js          # Three.js scene with water and sky
├── index.html            # Main HTML file
├── package.json          # Project dependencies
├── vite.config.js        # Vite configuration
└── netlify.toml          # Netlify deployment configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/larvuz2/3D-controller.git
   cd 3D-controller
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to http://localhost:5173

## 🏗️ Building for Production

To build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🌐 Deployment

This project is configured for easy deployment to Netlify. The `netlify.toml` file contains the necessary configuration.

To deploy manually:

```bash
npm run build
npx netlify deploy --prod
```

## 🧠 How It Works

1. The application initializes the Three.js scene with a Ghibli-style water shader and sky
2. Islands with trees and vegetation are created and positioned above the water
3. A character is created with both a visual representation (Three.js) and a physics body (Rapier)
4. Buoyancy forces are applied to objects below the water level to simulate floating
5. Input from the keyboard and mouse is captured and processed
6. The character's position and rotation are updated based on the physics simulation
7. The camera follows the character's movement
8. The scene is rendered with a two-pass approach:
   - First pass: Depth information is captured for the water shader
   - Second pass: The scene is rendered with the water shader using the depth information

## 🎨 Water Shader Details

The water shader implementation is inspired by Studio Ghibli's art style and includes:

- **Toon Shading**: Creates distinct bands of color for a stylized look
- **Dynamic Foam**: Foam appears around objects and shores based on depth differences
- **Wave Animation**: Procedural wave animation for natural water movement
- **Distortion Effects**: Uses a displacement map for realistic water distortion

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- [Three.js](https://threejs.org/) for 3D rendering
- [Rapier](https://rapier.rs/) for physics simulation
- [threejs-water-shader-with-foam](https://github.com/romulolink/threejs-water-shader-with-foam) for water shader inspiration
- [Vite](https://vitejs.dev/) for the build system
- [Netlify](https://www.netlify.com/) for hosting