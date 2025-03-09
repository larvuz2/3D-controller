// Import Rapier physics engine
import RAPIER from '@dimforge/rapier3d-compat';

// Variables to store physics world and objects
let world = null;
let groundCollider = null;

// Water physics constants
const WATER_LEVEL = 0; // Water level at y=0
const BUOYANCY_FORCE = 20; // Buoyancy force to counteract gravity
const WATER_DRAG = 2; // Drag coefficient for water resistance

/**
 * Initialize the Rapier physics world
 * @returns {Object} The physics world and objects
 */
export async function initPhysics() {
  console.log('Initializing Rapier physics engine');
  
  // Initialize Rapier
  await RAPIER.init();
  console.log('Rapier initialized successfully');
  
  // Create a new physics world with gravity
  world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
  
  // Create a ground plane (deep underwater)
  const groundColliderDesc = RAPIER.ColliderDesc.cuboid(50.0, 0.1, 50.0);
  groundCollider = world.createCollider(groundColliderDesc);
  groundCollider.setTranslation(0, -10, 0); // Move ground deep underwater
  
  console.log('Ground collider created');
  
  return {
    world,
    groundCollider,
    RAPIER
  };
}

/**
 * Update the physics simulation
 * @param {Object} physics - The physics world and objects
 * @param {Object} character - The character object (optional)
 */
export function updatePhysics(physics, character = null) {
  // Step the physics simulation (default time step is 1/60)
  physics.world.step();
  
  // Apply buoyancy to the character if provided
  if (character) {
    applyBuoyancy(physics, character.rigidBody);
  }
}

/**
 * Apply buoyancy force to objects below water level
 * @param {Object} physics - The physics world and objects
 * @param {Object} rigidBody - The rigid body to apply buoyancy to
 */
function applyBuoyancy(physics, rigidBody) {
  // Get the current position of the rigid body
  const position = rigidBody.translation();
  
  // Check if the object is below water level
  if (position.y < WATER_LEVEL) {
    // Calculate how deep the object is submerged
    const submergedDepth = WATER_LEVEL - position.y;
    
    // Apply upward buoyancy force proportional to submersion depth
    const upwardForce = { x: 0, y: BUOYANCY_FORCE * submergedDepth, z: 0 };
    rigidBody.applyImpulse(upwardForce, true);
    
    // Apply water resistance (drag)
    const velocity = rigidBody.linvel();
    const dragForce = {
      x: -velocity.x * WATER_DRAG,
      y: -velocity.y * WATER_DRAG,
      z: -velocity.z * WATER_DRAG
    };
    rigidBody.applyImpulse(dragForce, true);
  }
}

/**
 * Create a rigid body in the physics world
 * @param {Object} physics - The physics world and objects
 * @param {Object} position - The position of the rigid body
 * @param {boolean} isStatic - Whether the body is static or dynamic
 * @returns {Object} The created rigid body
 */
export function createRigidBody(physics, position, isStatic = false) {
  const bodyDesc = isStatic 
    ? physics.RAPIER.RigidBodyDesc.fixed() 
    : physics.RAPIER.RigidBodyDesc.dynamic();
  
  bodyDesc.setTranslation(position.x, position.y, position.z);
  
  const rigidBody = physics.world.createRigidBody(bodyDesc);
  return rigidBody;
}

/**
 * Create a collider attached to a rigid body
 * @param {Object} physics - The physics world and objects
 * @param {Object} rigidBody - The rigid body to attach the collider to
 * @param {string} shape - The shape of the collider ('box', 'sphere', 'capsule')
 * @param {Object} size - The dimensions of the collider
 * @returns {Object} The created collider
 */
export function createCollider(physics, rigidBody, shape, size) {
  let colliderDesc;
  
  switch (shape) {
    case 'box':
      colliderDesc = physics.RAPIER.ColliderDesc.cuboid(
        size.width / 2, 
        size.height / 2, 
        size.depth / 2
      );
      break;
    case 'sphere':
      colliderDesc = physics.RAPIER.ColliderDesc.ball(size.radius);
      break;
    case 'capsule':
      colliderDesc = physics.RAPIER.ColliderDesc.capsule(
        size.height / 2, 
        size.radius
      );
      break;
    case 'cylinder':
      colliderDesc = physics.RAPIER.ColliderDesc.cylinder(
        size.height / 2,
        size.radius
      );
      break;
    default:
      throw new Error(`Unsupported collider shape: ${shape}`);
  }
  
  const collider = physics.world.createCollider(colliderDesc, rigidBody);
  return collider;
} 