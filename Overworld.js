class Overworld {
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    init(){
        console.log("Hello from Overworld");

        //Draw the background
        const image = new Image();
        image.src = "images/maps/DemoLower.png"
        image.onload = () => {
            this.ctx.drawImage(image, 0, 0);
        }
        
        //Draw the hero
        const x = 5;
        const y = 6;
        const hero = new Image();
        hero.src = "images/characters/people/hero.png"
        hero.onload = () => {
            this.ctx.drawImage(
                hero, 
                0, //left cut 
                0, //top cut
                32, //width cut
                32, //heigth cut
                x * 16 - 8, //x position on the map (multiple with one block, soustract for center)
                y * 16 - 18, //y position on the map
                32, //size(width) of the image on the map
                32 //size(heigth) of the image on the map
                );
        }

        //Draw the shadow of the hero

        const shadow = new Image();
        shadow.src = "images/characters/shadow.png"
        shadow.onload = () => {
            this.ctx.drawImage(
                shadow, 
                0, //left cut 
                0, //top cut
                32, //width cut
                32, //heigth cut
                x * 16 - 8, //x position on the map (multiple with one block, soustract for center)
                y * 16 - 18, //y position on the map
                32, //size(width) of the image on the map
                32 //size(heigth) of the image on the map
                );
        }

    }
}