# Environment Models

This directory contains 3D models for the environment assets used in the scene.

## Required Models

To fully implement the water scene with islands and trees, you should add the following GLB files to this directory:

- `island.glb` - A 3D model of an island that will be placed above the water
- `tree.glb` - A 3D model of a tree that will be placed on the islands

## Model Sources

You can obtain these models from various sources:

1. Create your own models using Blender or other 3D modeling software
2. Download free models from sites like:
   - [Sketchfab](https://sketchfab.com/features/free-3d-models)
   - [TurboSquid](https://www.turbosquid.com/Search/3D-Models/free)
   - [CGTrader](https://www.cgtrader.com/free-3d-models)
   - [Poly Pizza](https://poly.pizza/)

## Model Requirements

For best results, ensure your models:

- Are exported in GLB format (preferred) or GLTF format
- Have reasonable polygon counts for web performance
- Are properly UV mapped if they use textures
- Have their origin point at the bottom center for easy positioning
- Are oriented with Y-axis up

## Fallback Behavior

If the specified model files are not found, the application will automatically fall back to using procedurally generated islands and trees. 