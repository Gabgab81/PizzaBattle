class TurnCycle {
  constructor({ battle, onNewEvent, onWinner }) {
    this.battle = battle;
    this.onWinner = onWinner;
    this.onNewEvent = onNewEvent;
    this.currentTeam = "player"; // or "enemy"
  }

  async turn() {
    //Get the caster
    const casterId = this.battle.activeCombatants[this.currentTeam];
    const caster = this.battle.combatants[casterId];

    const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"];
    const enemy = this.battle.combatants[enemyId];

    const submission = await this.onNewEvent({
      type: "submissionMenu",
      caster,
      enemy,
    });

    //Stop here if we are replacing this Pizza
    if (submission.replacement) {
      await this.onNewEvent({
        type: "replace",
        replacement: submission.replacement,
      });
      await this.onNewEvent({
        type: "textMessage",
        text: `Go get 'em ${submission.replacement.name}`
      });
      this.nextTurn();
      return;
    }

    if (submission.instanceId) {

      //Add to list to persist to player state later
      this.battle.usedInstanceIds[submission.instanceId] = true;

      //Removeing item from state
      this.battle.items = this.battle.items.filter(i => i.instanceId !== submission.instanceId)
    }
    
    const resultingEvents = caster.getReplacedEvents(submission.action.success);
    // console.log({resultingEvents})
    // console.log(submission.action)
    for (let i = 0; i < resultingEvents.length; i++) {
      const event = {
        ...resultingEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      }
      // console.log("In loop", event)
      await this.onNewEvent(event);
    }

    //Did the target die?
    const targetDead = submission.target.hp <= 0;
    // console.log({targetDead})
    if (targetDead) {
      // console.log("inside if targetDead")
      // console.log(submission.target.name)
      await this.onNewEvent({
        type: "textMessage", text: `${submission.target.name} is ruined!`
      });

      if (submission.target.team === "enemy" ) {

        const playerActivePizzaId = this.battle.activeCombatants.player;
        const xp = submission.target.givesXp;

        await this.onNewEvent({
          type: "textMessage", 
          text: `Gained ${xp} XP!`
        });

        await this.onNewEvent({
          type: "giveXp",
          xp,
          combatant: this.battle.combatants[playerActivePizzaId],
        })
      }
      
    }
    // console.log("after if targetDead")
    //Do we have a winning team?
    const winner = this.getWinningTeam();
    if (winner === "player") {
      await this.onNewEvent({
        type: "textMessage",
        text: `Winner!!`
      });
      //END THE BATTLE
      this.onWinner(winner);
      return;
    };
    if (winner === "enemy") {
      await this.onNewEvent({
        type: "textMessage",
        text: `Loser!!`
      });
      this.onWinner(winner);
      return;
    }

    //We have a dead target, but still no winner, so bring in a replacement
    if (targetDead) {
      console.log("inside if targetDead 2")
      const replacement = await this.onNewEvent({
        type: "replacementMenu",
        team: submission.target.team,
      })
      await this.onNewEvent({
        type: "replace",
        replacement: replacement
      });
      await this.onNewEvent({
        type: "textMessage",
        text: `${replacement.name} appear!!`
      });
    }

    //Check for post events
    //{Do things AFTER your original turn submission}
    const postEvents = caster.getPostEvents();
    // console.log({postEvents})
    for (let i=0; i < postEvents.length; i++) {
      const event = {
        ...postEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      }
      await this.onNewEvent(event);
    }

    //Check for status expire
    const expiredEvent = caster.decrementStatus();
    if (expiredEvent) {
      await this.onNewEvent(expiredEvent);
    }

    this.nextTurn();
  }

  nextTurn() {
    console.log(this.currentTeam)
    this.currentTeam = this.currentTeam === 'player' ? "enemy" : "player";
    this.turn();
  }

  getWinningTeam() {
    // console.log("In getWinnerTeam()")
    let aliveTeams = {};
    Object.values(this.battle.combatants).forEach(c => {
      if (c.hp > 0) {
        aliveTeams[c.team] = true;
      }
    });
    if (!aliveTeams["player"]) { return "enemy" };
    if (!aliveTeams["enemy"]) { return "player" };
    return null;
  }

  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: `Your battle with ${this.battle.enemy.name} has stared!!!`,
    })

    //Starting the first turn!
    this.turn();
  }
}