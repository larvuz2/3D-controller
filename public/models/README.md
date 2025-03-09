# Custom 3D Models

This directory is for custom 3D models used in the application.

## Required Models

For the full water pond scene experience, you should add the following models:

1. `island.glb` - A 3D model of an island
2. `tree.glb` - A 3D model of a tree

Place these files in the root of the `public` directory.

## Model Requirements

- Models should be in glTF/GLB format
- Island model should have its base at y=0 (water level)
- Tree model should be designed to sit on top of the island

## Fallback Behavior

If these models are not found, the application will create simple geometric shapes (cylinders and cones) to represent islands and trees. 