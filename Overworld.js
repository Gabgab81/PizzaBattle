class Overworld {
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    startGameLoop(){
      const step = () => {

        //Clear off the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Establish the camera person
        const cameraPerson = this.map.gameObjects.hero

        //Update all object
        Object.values(this.map.gameObjects).forEach(object => {
          object.update({
              arrow: this.directionInput.direction,
              map: this.map,
          });
        })

        //Draw Lower Layer
        this.map.drawLowerImage(this.ctx, cameraPerson);

        //Draw Game Objects
        Object.values(this.map.gameObjects).sort((a, b) => {
          return a.y - b.y;
        }).forEach(object => {
          object.sprite.draw(this.ctx, cameraPerson);
        })

        //Draw Upper Layer
        this.map.drawUpperImage(this.ctx, cameraPerson);
        // console.log("outside")
        // console.log(this.map.isPaused)
        if (!this.map.isPaused) {
          // console.log("inside")
          setTimeout(() => {
            requestAnimationFrame(() => {
              step();
            })
          }, 1)
        }
          
      }
      step();
    }

    bindActionInput() {
      new KeyPressListener("Enter", () => {
        //Is there a person here to talk to?
        this.map.checkActionCutscene()
      })

      new KeyPressListener("Escape", () => {
        //Open pause menu
        if (!this.map.isCutscenePlaying) {
          this.map.startCutscene([
            { type: "pause" }
          ])
        }
      })
    }

    bindHeroPositionCheck() {
      document.addEventListener("PersonWalkingComplete", e => {
        if (e.detail.whoId === 'hero') {
          //Hero's position has changed
          this.map.checkForFootstepCutscene();
        }
      });
    }

    startMap(mapConfig) {
      this.map = new OverworldMap(mapConfig);
      this.map.overworld = this;
      this.map.mountObjects();
    }

    init(){

      this.hub = new Hub();
      this.hub.init(document.querySelector(".game-container"));
  
      this.startMap(window.OverworldMaps.DemoRoom);

      this.bindActionInput();
      this.bindHeroPositionCheck();

      this.directionInput = new DirectionInput();
      this.directionInput.init();

      this.startGameLoop();
      
      // this.map.startCutscene([
        
      //   { type: "battle", enemyId: "beth" }
      //   // { type: "changeMap", map: "DemoRoom"}
      //   // { type: "textMessage", text: "Welcome in Pizza Legend???"}
      // ])

        
    }
}