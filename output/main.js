// ALIASES
var Application = PIXI.Application, Container = PIXI.Container, loader = PIXI.loader, resources = PIXI.loader.resources, TextureCache = PIXI.utils.TextureCache, Sprite = PIXI.Sprite, Rectangle = PIXI.Rectangle, TextStyle = PIXI.TextStyle;
// CREATING A PIXI APP
var app = new Application({
    width: 512,
    height: 512,
    antialias: true,
    transparent: false,
    resolution: 1
});
document.body.appendChild(app.view);
var KNIGHT_FRAME_LIST_LEFT = [
    "images/knight_run left_0.png",
    "images/knight_run left_1.png",
    "images/knight_run left_2.png",
    "images/knight_run left_3.png",
    "images/knight_run left_4.png",
    "images/knight_run left_5.png",
];
var KNIGHT_FRAME_LIST_RIGHT = [
    "images/knight_run right_0.png",
    "images/knight_run right_1.png",
    "images/knight_run right_2.png",
    "images/knight_run right_3.png",
    "images/knight_run right_4.png",
    "images/knight_run right_5.png",
];
var FOOD = [
    "images/Food.png"
];
var BASE = [
    "images/layer-22.png"
];
var GAME_OVER = [
    "images/OVER.png"
];
// LOADER
loader
    .add([
    KNIGHT_FRAME_LIST_LEFT,
    KNIGHT_FRAME_LIST_RIGHT,
    FOOD,
    BASE,
    GAME_OVER,
])
    .load(setup);
// SETUP
var score, gameScene, gameOverScene, gameOver, message, base, knight, food, shrimp, shrimps, texture, rectangle, state, baseHit, knightAnim, run;
function setup() {
    gameScene = new Container();
    app.stage.addChild(gameScene);
    // CREATE THE BASE
    base = new Sprite(resources["images/layer-22.png"].texture);
    base.y = 475;
    gameScene.addChild(base);
    // CREATE THE KNIGHT SPRITE
    knight = new Sprite(resources["images/knight_run left_0.png"].texture);
    knight.x = 220;
    knight.y = 400;
    gameScene.addChild(knight);
    // CREATE THE FOOD SPRITES
    var numberOfShrimps = 5, speed = 2, direction = 1;
    // ARRAY TO STORE SHRIMPS
    shrimps = [];
    for (var i = 1; i < numberOfShrimps; i++) {
        // GET SHRIMP FROM SPRITESHEET
        texture = TextureCache["images/Food.png"];
        rectangle = new Rectangle(111, 111, 16, 16);
        texture.frame = rectangle;
        shrimp = new Sprite(texture);
        // SET RANDOM POSITION X,Y OF FLYING SHRIMPS
        var x = randomInt(0, app.stage.width - shrimp.width);
        var y = randomInt(0, app.stage.height - shrimp.height);
        // SHRIMPS START POSITION
        shrimp.x = x;
        shrimp.y = y - 1024;
        shrimp.vy = speed * direction;
        // PUSH SHRIMPS TO GAME SCENE
        shrimps.push(shrimp);
        gameScene.addChild(shrimp);
    }
    // CREATE GAME OVER SCENE
    // gameOverScene = new Sprite(resources["images/over.png"]);
    // app.stage.addChild(gameOverScene);
    //
    // gameOverScene.visible = false;
    // KEYBOARD
    var left = keyboard(37), right = keyboard(39), refresh = keyboard(116);
    // LEFT ARROW
    left.press = function () {
        knight.x -= 15;
        setInterval(w * 500);
    };
    // RIGHT ARROW
    right.press = function () {
        knight.x += 15;
        setInterval(w * 500);
    };
    // REFRESH ON F5
    refresh.press = function () {
        location.reload();
    };
    // SET THE GAME STATE
    state = play;
    // START THE GAME LOOP
    app.ticker.add(function (delta) { return gameLoop(delta); });
}
function gameLoop(delta) {
    // UPDATE GAME STATE
    state(delta);
}
function play(delta) {
    // PREVENT OF GETTING KNIGHT THROUGH WALL
    contain(knight, { x: 1, width: 512, height: 512 });
    // SET THE BASEHIT TO FALSE BEFORE CHECKING COLLISION
    // baseHit: boolean = false;
    // FlyingFood
    shrimps.forEach(function (shrimp) {
        shrimp.y += 3;
        var score = 0;
        if (hitTestRectangle(shrimp, knight)) {
            var x = randomInt(0, app.stage.width - shrimp.width);
            shrimp.x = x;
            shrimp.y = -90;
        }
        if (hitTestRectangle(shrimp, base)) {
            var x = randomInt(0, app.stage.width - shrimp.width);
            shrimp.x = x;
            shrimp.y = -90;
            // baseHit = true;
        }
    });
    // if (baseHit) {
    //     state = end;
    //     gameOverScene.visible = true;
    // }
}
// class Knight {
//     private sprite = new Sprite();
//     private isDead: boolean;
// }
function end() {
    gameScene.visible = false;
    gameOverScene.visible = true;
}
function hitTestRectangle(r1, r2) {
    //Define the variables we'll need to calculate
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
    //hit will determine whether there's a collision
    hit: boolean = false;
    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;
    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;
    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {
            //There's definitely a collision happening
            hit = true;
        }
        else {
            //There's no collision on the y axis
            hit = false;
        }
    }
    else {
        //There's no collision on the x axis
        hit = false;
    }
    //`hit` will be either `true` or `false`
    return hit;
}
;
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// KEYBOARD
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press)
                key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };
    // The `upHandler`
    key.upHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release)
                key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };
    // Attach event listeners
    window.addEventListener("keydown", key.downHandler.bind(key), false);
    window.addEventListener("keyup", key.upHandler.bind(key), false);
    return key;
}
function contain(sprite, container) {
    var collision = undefined;
    //Left
    if (sprite.x < container.x) {
        sprite.x = container.x;
        collision = "left";
    }
    //Right
    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right";
    }
    return collision;
}
