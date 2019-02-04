/**
 * The Aspect system is the core game mechanic of Aspect Star. Different
 * objects in the game will behave different ways depending on aspect.
 */
enum Aspect {
  NONE = 0,
  ASPECT_PLUS = 1, // +, or blue aspect
  ASPECT_X = 2, // x, or green aspect
  ASPECT_CIRCLE = 3 // o, or red aspect
}

export default Aspect;
