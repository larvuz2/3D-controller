# 3D Physics-Based Water Pond Scene with Stylized Water

A physics-based 3D scene featuring a realistic water pond with stylized water, naturally moving waves, islands topped with trees, and a character that floats half-submerged in the water. Built with Three.js and Rapier physics engine.

![3D Water Pond Scene](https://github.com/larvuz2/3D-controller/raw/main/public/screenshot.png)

## 🌟 Features

- **Stylized Water Surface**: Beautiful water with realistic wave movement using Three.js Water class
- **Interactive GUI**: Adjust water properties in real-time with parameter sliders
- **Physics-based Buoyancy**: Character floats realistically in water with simulated buoyancy
- **Islands with Trees**: Multiple islands with trees loaded from GLB models
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
- **GUI Controls**: [dat.GUI](https://github.com/dataarts/dat.gui) (v0.7.9)
- **Build Tool**: [Vite](https://vitejs.dev/) (v5.0.0)
- **Deployment**: [Netlify](https://www.netlify.com/)

## 📋 Project Structure

```
3D-controller/
├── public/               # Static assets
│   ├── assets/           # Environment assets
│   │   └── models/       # GLB model files for islands and trees
│   ├── shaders/          # GLSL shader files
│   └── textures/         # Textures for water and other materials
│       └── water/
│           └── waternormals.jpg
├── src/                  # Source code
│   ├── camera.js         # Camera controller
│   ├── character.js      # Character controller with buoyancy
│   ├── environment.js    # Islands, trees, and environment setup
│   ├── gui.js            # GUI controls for water parameters
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

### Adding Custom Models

To add your own island and tree models:

1. Create or download GLB models for islands and trees
2. Place them in the `public/assets/models/` directory:
   - Island model: `public/assets/models/island.glb`
   - Tree model: `public/assets/models/tree.glb`
3. Restart the development server to see your models in the scene

If no models are found, the application will use procedurally generated islands and trees.

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

1. The application initializes the Three.js scene with a stylized water surface and sky
2. Islands with trees are loaded from GLB models or generated procedurally
3. A character is created with both a visual representation (Three.js) and a physics body (Rapier)
4. Buoyancy forces are applied to objects below the water level to simulate floating
5. Input from the keyboard and mouse is captured and processed
6. The character's position and rotation are updated based on the physics simulation
7. The camera follows the character's movement
8. The water surface is animated with realistic wave movement
9. GUI controls allow real-time adjustment of water properties

## 🌊 Water Implementation Details

The water implementation uses the `Water` class from Three.js examples and includes:

- **Realistic Wave Movement**: Natural wave animation using time-based uniforms
- **Water Normals**: Uses a normal map texture for detailed wave patterns
- **Adjustable Properties**: Wave speed, distortion scale, and water color can be adjusted via GUI
- **Reflections**: Simulates reflections based on the scene's lighting
- **Performance Optimized**: Efficient shader implementation for smooth performance

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
- [dat.GUI](https://github.com/dataarts/dat.gui) for GUI controls
- [Vite](https://vitejs.dev/) for the build system
- [Netlify](https://www.netlify.com/) for hosting 