class SubmissionMenu {
  constructor( { caster, enemy, onComplete } ) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;
  }

  getPages() {

    const backOption = {
      label: "Go back",
      description: "Return to previous page",
      handler: () => {
        this.keyboardMenu.setOptions(this.getPages().root)
      }
    }

    return {
      root: [
        {
          label: "Attack",
          description: "Choose an attack",
          handler: () => {
            //Do something when chosen...
            console.log('Go to attacks page');
            this.keyboardMenu.setOptions( this.getPages().attacks )
          }
        },
        {
          label: "Items",
          description: "Choose an item",
          // disabled: true,
          handler: () => {
            //Go to item page...
            this.keyboardMenu.setOptions( this.getPages().items )
          }
        },
        {
          label: "Swap",
          description: "Change to another pizza",
          handler: () => {
            //See pizza option
          }
        },
      ],
      attacks: [
        // {
        //   label: "My first attack",
        //   description: "Does this...",
        //   handler: () => {
        //     //Submit this move
        //     console.log("Weaving blade")
        //   }
        // },
        ...this.caster.actions.map(key => {
          const action = Actions[key];
          return {
            label: action.name,
            description: action.description,
            handler: () => {
              // console.log(`Using ${action.name}`)
              this.menuSubmit(action)
            }
          }
        }),
        backOption
      ],
      items: [
        //items will go there...
        backOption,
      ]
    }
  }

  menuSubmit(action, instanceId = null) {

    this.keyboardMenu?.end();

    this.onComplete({
      action,
      target: action.targetType === "friendly" ? this.caster : this.enemy,
    })
  }

  decide() {
    //To do: Enemy randomly decide what to do...
    this.menuSubmit(Actions[ this.caster.actions[0] ])
  }

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(this.getPages().root)
  }

  init(container) {

    if(this.caster.isPlayerControlled) {
      // console.log('Hello from submissionMenu')
      this.showMenu(container);
    } else {
      this.decide();
    }
    
  }
}