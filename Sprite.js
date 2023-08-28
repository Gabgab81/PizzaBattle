class Sprite {
    constructor(config){

        //Set up the image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        //Shadow
        this.shadow = new Image;
        this.useShadow = true;
        if (this.useShadow){
            this.shadow.src = "images/characters/shadow.png";
        }
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }

        //Configure Animation & Initial State
        this.animations = config.animations || {
            "idle-down":  [ [0, 0] ],
            "idle-right": [ [0, 1] ],
            "idle-up":    [ [0, 2] ],
            "idle-left":  [ [0, 3] ],
            "walk-down":  [ [1, 0], [0, 0], [3, 0],  [0, 0] ],
            "walk-right": [ [1, 1], [0, 1], [3, 1],  [0, 1] ],
            "walk-up":    [ [1, 2], [0, 2], [3, 2],  [0, 2] ],
            "walk-left":  [ [1, 3], [0, 3], [3, 3],  [0, 3] ]
        }
        this.currentAnimation = "walk-left" //config.currentAnimation || "idle-down";
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 8;
        this.animationFrameProgress = this.animationFrameLimit;

        //Reference the game object
        this.gameObject = config.gameObject;
    }

    get frame() {
      // console.log(this.currentAnimationFrame)
      return this.animations[this.currentAnimation][this.currentAnimationFrame]
    }

    setAnimation(key) {
      if (this.currentAnimation !== key) {
        this.currentAnimation = key;
        this.currentAnimationFrame = 0;
        this.animationFrameProgress = this.animationFrameLimit;
      }
    }

    updateAnimationProgress() {
      //Downtick frame progress
      if(this.animationFrameProgress > 0) {
        this.animationFrameProgress -= 0.6;
        return;
      }
      
      //Reset the counter
      this.animationFrameProgress = this.animationFrameLimit;
      this.currentAnimationFrame += 1;

      if(this.frame === undefined) {
        this.currentAnimationFrame = 0;
      }
    }

    draw(ctx, cameraPerson) {

      // console.log(this.animations[this.currentAnimation][this.currentAnimationFrame])
      const x = this.gameObject.x  - 8 + utils.withGrid(10.5) - cameraPerson.x ;
      const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;

      this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);
      
      // console.log(this.frame)
      const [frameX, frameY] = this.frame;
      // console.log(frameX, frameY)
      this.isLoaded && ctx.drawImage(this.image,
          frameX * 32, frameY * 32, //cut position
          32, 32, //Size of the cut
          x, y, // position of the draw
          32, 32 // size of the draw
      );
      
      this.updateAnimationProgress()
      
    }
}