(function (){
    console.log('Hello from init');

    const overlord = new Overworld({
        element: document.querySelector(".game-container")
    });

    overlord.init();

})();