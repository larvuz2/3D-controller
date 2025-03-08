/**
 * Input handling module for capturing keyboard and mouse input
 */

// Input state object to track key presses and mouse movement
const inputState = {
  forward: false,  // W key
  backward: false, // S key
  left: false,     // A key
  right: false,    // D key
  jump: false,     // Space key
  mouseX: 0,       // Mouse X movement
  mouseY: 0,       // Mouse Y movement
  pointerLocked: false // Whether pointer is locked
};

/**
 * Initialize input handling
 */
export function initInput() {
  console.log('Initializing input handling');
  
  // Keyboard event listeners
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  
  // Mouse event listeners
  window.addEventListener('mousemove', handleMouseMove);
  
  // Pointer lock event listeners
  document.addEventListener('pointerlockchange', handlePointerLockChange);
  
  // Add click event listener to canvas to request pointer lock
  const canvas = document.querySelector('canvas');
  if (canvas) {
    canvas.addEventListener('click', () => {
      if (!inputState.pointerLocked) {
        canvas.requestPointerLock();
      }
    });
    
    console.log('Added click event listener to canvas for pointer lock');
  } else {
    console.warn('Canvas not found for pointer lock');
  }
  
  console.log('Input handling initialized');
}

/**
 * Handle key down events
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyDown(event) {
  updateKeyState(event.code, true);
}

/**
 * Handle key up events
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyUp(event) {
  updateKeyState(event.code, false);
}

/**
 * Update the key state based on the key code
 * @param {string} code - The key code
 * @param {boolean} pressed - Whether the key is pressed
 */
function updateKeyState(code, pressed) {
  switch (code) {
    case 'KeyW':
      inputState.forward = pressed;
      break;
    case 'KeyS':
      inputState.backward = pressed;
      break;
    case 'KeyA':
      inputState.left = pressed;
      break;
    case 'KeyD':
      inputState.right = pressed;
      break;
    case 'Space':
      inputState.jump = pressed;
      break;
  }
}

/**
 * Handle mouse movement events
 * @param {MouseEvent} event - The mouse event
 */
function handleMouseMove(event) {
  if (inputState.pointerLocked) {
    // Use movementX/Y for better cross-browser support
    inputState.mouseX = event.movementX || 0;
    inputState.mouseY = event.movementY || 0;
  }
}

/**
 * Handle pointer lock change events
 */
function handlePointerLockChange() {
  inputState.pointerLocked = document.pointerLockElement !== null;
  console.log(`Pointer lock: ${inputState.pointerLocked ? 'acquired' : 'released'}`);
}

/**
 * Get the current input state
 * @returns {Object} The current input state
 */
export function getInputState() {
  // Return a copy of the input state to prevent external modification
  return { ...inputState };
}

/**
 * Reset the mouse movement values
 * This should be called after processing mouse movement to prevent continuous rotation
 */
export function resetMouseMovement() {
  inputState.mouseX = 0;
  inputState.mouseY = 0;
} 