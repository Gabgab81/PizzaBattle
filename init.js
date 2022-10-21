(function (){
    console.log('Hello from init');

    const overword = new Overworld({
        element: document.querySelector(".game-container")
    });

    overword.init();

})();