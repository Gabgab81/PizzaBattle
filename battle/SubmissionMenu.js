class SubmissionMenu {
  constructor( { caster, enemy, onComplete, items } ) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;

    let quantityMap = {};
    items.forEach(item => {
      if (item.team === caster.team) {

        let existing = quantityMap[item.actionId];
        if (existing) {
          existing.quantity += 1;
        } else {
          quantityMap[item.actionId] = {
            actionId: item.actionId,
            quantity: 1,
            instanceId: item.instanceId,
          }
        }
        
      }
    });
    this.items = Object.values(quantityMap);
    // console.log(this.items)
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
        ...this.items.map(item => {
          const action = Actions[item.actionId];
          console.log(item)
          return {
            label: action.name,
            description: action.description,
            right: () => {
              console.log("right")
              // return "x"+item.quantity;
              return `x${item.quantity}`;
            },
            handler: () => {
              // console.log(`Using ${action.name}`)
              this.menuSubmit(action, item.instanceId)
            }
          }
        }),
        backOption,
      ]
    }
  }

  menuSubmit(action, instanceId = null) {

    this.keyboardMenu?.end();

    this.onComplete({
      action,
      target: action.targetType === "friendly" ? this.caster : this.enemy,
      instanceId,
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