import Runner from './Runner';

/* Master interface
 * All classes that implement "Runner" must have a reference to a class that
 * implements "Master". This allows themselves to add or remove their own reference
 * from their parent as is necessary.
 * */

export default interface Master {
    addRunner(runner : Runner) : void
    removeRunner(runner : Runner) : void
}
