window.Actions = {
  damage1: {
    name: "Whomp!",
    // type:
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      { type: "animation", animation: 'spin' },
      { type: "stateChange", damage: 10 },
    ]
  }
}