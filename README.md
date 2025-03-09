# 3D Physics-Based Character Controller

A physics-based 3D character controller built with Three.js and Rapier physics engine. This project demonstrates how to create a responsive character that moves with WASD controls and jumps with the space bar, all while respecting realistic physics constraints.

![3D Character Controller](https://github.com/larvuz2/3D-controller/raw/main/public/screenshot.png)

## 🌟 Features

- **Physics-based Movement**: Realistic character movement using the Rapier physics engine
- **Intuitive Controls**: WASD for movement, Space for jumping
- **Collision Detection**: Accurate collision handling with the environment
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
- **Build Tool**: [Vite](https://vitejs.dev/) (v5.0.0)
- **Deployment**: [Netlify](https://www.netlify.com/)

## 📋 Project Structure

```
3D-controller/
├── public/               # Static assets
├── src/                  # Source code
│   ├── camera.js         # Camera controller
│   ├── character.js      # Character controller
│   ├── environment.js    # Environment setup
│   ├── input.js          # Input handling
│   ├── main.js           # Application entry point
│   ├── physics.js        # Physics world setup
│   └── scene.js          # Three.js scene setup
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

1. The application initializes the Three.js scene and Rapier physics world
2. A character is created with both a visual representation (Three.js) and a physics body (Rapier)
3. Input from the keyboard and mouse is captured and processed
4. The physics simulation applies forces to the character based on input
5. The character's position and rotation are updated based on the physics simulation
6. The camera follows the character's movement
7. The scene is rendered at each animation frame

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
- [Vite](https://vitejs.dev/) for the build system
- [Netlify](https://www.netlify.com/) for hosting