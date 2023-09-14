class TurnCycle {
  constructor({ battle, onNewEvent }) {
    this.battle = battle;
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
    const resultingEvents = submission.action.success;
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

    this.currentTeam = this.currentTeam === 'player' ? "enemy" : "player";
    this.turn();
  }

  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: "The battle is starting!",
    })

    //Starting the first turn!
    this.turn();
  }
}