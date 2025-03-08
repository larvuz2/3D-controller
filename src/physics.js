// Import Rapier physics engine
import RAPIER from '@dimforge/rapier3d-compat';

// Variables to store physics world and objects
let world = null;
let groundCollider = null;

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
  
  // Create a ground plane
  const groundColliderDesc = RAPIER.ColliderDesc.cuboid(50.0, 0.1, 50.0);
  groundCollider = world.createCollider(groundColliderDesc);
  
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
 */
export function updatePhysics(physics) {
  // Step the physics simulation (default time step is 1/60)
  physics.world.step();
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
    default:
      throw new Error(`Unsupported collider shape: ${shape}`);
  }
  
  const collider = physics.world.createCollider(colliderDesc, rigidBody);
  return collider;
} 