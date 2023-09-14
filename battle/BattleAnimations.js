window.BattleAnimations = {
  async spin(event, onComplete) {
    // console.log(event.caster.team)
    // console.log(event.caster.pizzaElement)
    const element = event.caster.pizzaElement;
    const animationClassName = event.caster.team === "player" ? "battle-spin-right" : "battle-spin-left";
    element.classList.add(animationClassName);

    //Remove class when animation is fully complete
    element.addEventListener("animationend", () => {
      element.classList.remove(animationClassName);
    }, { once: true });

    //Continue battle right around when the pizzas collide
    await utils.wait(100);
    onComplete();
  }
}