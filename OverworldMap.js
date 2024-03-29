class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};
    this.cutsceneSpaces = config.cutsceneSpaces || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;
  }

  drawLowerImage(ctx, cameraPerson) {
      ctx.drawImage(
        this.lowerImage, 
        utils.withGrid(10.5) - cameraPerson.x,
        utils.withGrid(6) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    )
  }

  isSpaceTaken(currentX, currentY, direction) {
    const {x, y} = utils.nextPosition(currentX, currentY, direction);
    // console.log("*******")
    // console.log(x, y)
    // console.log("*******")
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount

      object.mount(this);
    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    //Start a loop of async events
    //await each one
    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      const result = await eventHandler.init();
      if (result === "LOST_BATTLE") {
        break;
      };
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  checkActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {

      const relevantScenario = match.talking.find(scenario => {
        return (scenario.required || []).every(sf => {
          return playerState.storyFlags[sf];
        })
      })

      relevantScenario && this.startCutscene(relevantScenario.events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }

  removeWall(x, y) {
    delete this.walls[`${x},${y}`]
  }

  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x, y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }

}

window.OverworldMaps = {
    DemoRoom: {
      lowerSrc: "images/maps/DemoLower.png",
      upperSrc: "images/maps/DemoUpper.png",
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(5),
          y: utils.withGrid(6),
        }),
        npcA: new Person({
          x: utils.withGrid(7),
          y: utils.withGrid(9),
          src: "images/characters/people/npc1.png",
          behaviorLoop: [
            { type: "stand", direction: "left", time: 800 },
            { type: "stand", direction: "up", time: 300 },
            { type: "stand", direction: "right", time: 1200 },
            { type: "stand", direction: "down", time: 1500 },
          ],
          talking: [
            {
              required: ["TALKED_TO_ERIO"],
              events: [
                { type: "textMessage", text: "Isn't Erio the coolest?", faceHero: "npcA"},
              ]
            },
            {
              events: [
                // { type: "textMessage", text: "Have you met Erio?", faceHero: "npcA"},
                { type: "textMessage", text: "My pizza is better than yours!!", faceHero: "npcA"},
                { type: "battle", enemyId: "beth"},
                { type: "addStoryFlag", flag: "DEFEATED_BETH"},
                { type: "textMessage", text: "It's not possible!! You cheated!!!", faceHero: "npcA"},
              ]
            }
          ]
        }),
        npcB: new Person({
          x: utils.withGrid(8),
          y: utils.withGrid(5),
          src: "images/characters/people/npc2.png",
          // behaviorLoop: [
          //   { type: "walk", direction: "left" },
          //   { type: "stand", direction: "up", time: 800 },
          //   { type: "walk", direction: "up" },
          //   { type: "walk", direction: "right" },
          //   { type: "walk", direction: "down" },
          // ]
          talking: [
            {
              events: [
                // { type: "textMessage", text: "Have you met ERio?", faceHero: "npcB"},
                // { type: "textMessage", text: "You dare to challenge me???", faceHero: "npcB"},
                // { type: "battle", enemyId: "erio"},
              ]
            }
          ]
        })
      },
      walls : {
        //"16, 16": true
        [utils.asGridCoord(7, 6)]: true,
        [utils.asGridCoord(8, 6)]: true,
        [utils.asGridCoord(7, 7)]: true,
        [utils.asGridCoord(8, 7)]: true
      },
      cutsceneSpaces: {
        [utils.asGridCoord(7, 4)]: [
          {
            events: [

              // { who: "npcB", type: "walk", direction: "left" },
              // { who: "npcB", type: "stand", direction: "up" },
              // { type: "textMessage", text: "Stop!!!!" },
              // { who: "npcB", type: "walk", direction: "right" },
              // { who: "npcB", type: "stand", direction: "down" },
              // { who: "hero", type: "walk", direction: "down" },
              // { who: "hero", type: "walk", direction: "left" },
            ]
          }
        ],
        [utils.asGridCoord(5, 10)]: [
          {
            events: [
              { type: "changeMap", map: "Kitchen" },
              { who: "hero", type: "stand", direction: "up" },
            ]
          }
        ]
      }
    },
    Kitchen: {

      lowerSrc: "images/maps/KitchenLower.png",
      upperSrc: "images/maps/KitchenUpper.png",
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(5),
          y: utils.withGrid(10),
          direction: "up",
        }),
        npcB: new Person({
          x: utils.withGrid(10),
          y: utils.withGrid(8),
          src: "images/characters/people/erio.png",
          talking: [
            {
              events: [
                { type: "textMessage", text: "Fuck off!!!!", faceHero: "npcB"},
                { type: "addStoryFlag", flag: "TALKED_TO_ERIO"},
                // { type: "battle", enemyId: "erio"},
              ]
            }
          ]
        }),
      },
      cutsceneSpaces: {
        [utils.asGridCoord(5, 10)]: [
          {
            events: [
              { type: "changeMap", map: "DemoRoom" },
              { who: "hero", type: "stand", direction: "up" },
            ]
          }
        ]
      }
    }
}