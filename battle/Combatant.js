class Combatant {
  constructor(config, battle) {
    Object.keys(config).forEach(key =>{
      this[key] = config[key];
    })

    this.battle = battle;
  }

  get hpPercent() {
    const percent = this.hp / this.maxHp * 100;
    return percent > 0 ? percent : 0;
  }

  get xpPercent() {
    return this.xp / this.maxXp * 100;
  }

  get isActive() {
    return this.battle.activeCombatants[this.team] === this.id;
  }

  createElement() {
    // console.log(this.id)
    this.hubElement = document.createElement("div");
    this.hubElement.classList.add("Combatant");
    this.hubElement.setAttribute("data-combatant", this.id);
    this.hubElement.setAttribute("data-team", this.team);
    this.hubElement.innerHTML = (`
    <p class="Combatant_name">${this.name}</p>
    <p class="Combatant_level"></p>
    <div class="Combatant_character_crop">
      <img class="Combatant_character" alt="${this.name}" scr="./${this.src}" />
    </div>
    <img class="Combatant_type" src="./${this.icon}" alt="${this.type}" />
    <svg viewBox="0 0 26 3" class="Combatant_life-container">
      <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
      <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
    </svg>
    <svg viewBox="0 0 26 2" class="Combatant_xp-container">
      <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
      <rect x=0 y=1 width="0%" height=2 fill="#ffc934" />
    </svg>
    <p class="Combatant_status"></p>
    `);

    this.pizzaElement = document.createElement("img");
    this.pizzaElement.classList.add("Pizza");
    this.pizzaElement.setAttribute("src", this.src);
    this.pizzaElement.setAttribute("alt", this.name);
    this.pizzaElement.setAttribute("data-team", this.team);

    this.hpFills = this.hubElement.querySelectorAll(".Combatant_life-container > rect");
    this.xpFills = this.hubElement.querySelectorAll(".Combatant_xp-container > rect");
  }

  update(changes={}) {
    Object.keys(changes).forEach(key => {
      this[key] = changes[key];
    });

    //Update active flag to show the correct pizza & hub
    this.hubElement.setAttribute("data-active", this.isActive)
    this.pizzaElement.setAttribute("data-active", this.isActive)

    //Update HP & XP percent fills
    this.hpFills.forEach(rect => rect.style.width = `${this.hpPercent}%`)
    this.xpFills.forEach(rect => rect.style.width = `${this.xpPercent}%`)

    //Update level on screen
    this.hubElement.querySelector(".Combatant_level").innerText = this.level;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.hubElement);
    container.appendChild(this.pizzaElement);
    this.update();
  }
}