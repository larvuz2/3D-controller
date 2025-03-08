# Character Model Instructions

## Adding Your Character Model

1. Place your FBX character model file in this directory (`public/assets/models/character/`).
2. The current implementation uses `ybot.fbx`. If you want to use a different filename, update the path in `src/character.js`.

## Model Requirements

- The model should be in FBX format
- Ideally triangulated for better performance
- Include materials/textures if needed
- Properly rigged if you plan to add animations

## Adjusting the Model

If your model doesn't appear correctly, you may need to adjust the following parameters in the `loadCharacterModel` function in `src/character.js`:

```javascript
// Scale the model appropriately - adjust these values based on your model's size
fbx.scale.set(0.01, 0.01, 0.01);

// Position the model relative to the character's center - adjust these values to center your model
fbx.position.set(0, -1, 0);
```

## Adding Animations

To add animations to your character model, you'll need to:

1. Export animations from your 3D software as FBX files
2. Place them in a suitable directory (e.g., `public/assets/animations/`)
3. Load and play them using Three.js AnimationMixer

For more information on animations, refer to the Three.js documentation:
https://threejs.org/docs/#manual/en/introduction/Animation-system 