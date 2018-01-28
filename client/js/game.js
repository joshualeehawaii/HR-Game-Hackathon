var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer', {
  preload: preload,
  create: create,
  update: update,
});

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('battery', 'assets/battery.png');
  game.load.image('astroid', 'assets/astroid.png');
  game.load.image('dude', 'assets/dude.png');
  game.load.image('lander', 'assets/lander.png');
}

var player;
var platforms;
var cursors;
var astroids;
var batterys;
var score = 0;
var scoreText;

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // BACKGROUND
  var sky = game.add.sprite(0, 0, 'sky');
  sky.alpha = 0.3;

  // PLATFORMS
  platforms = game.add.group();
  platforms.enableBody = true;

  // GROUND
  var ground = platforms.create(0, game.world.height - 55, 'ground');
  ground.scale.setTo(1, 1);
  ground.body.immovable = true;

  // //Two ledges.
  // var ledge = platforms.create(400, 400, 'ground');
  // ledge.body.immovable = true;
  // ledge = platforms.create(-150, 250, 'ground');
  // ledge.body.immovable = true;

  // PLAYER
  player = game.add.sprite(800, 1, 'dude');
  player.scale.setTo(0.3, 0.3);
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  // BATTERY
  batterys = game.add.group();
  batterys.enableBody = true;
  batterys.scale.setTo(1, 1);
  var battery = batterys.create(300, 345, 'battery');

  // LANDER
  landers = game.add.group();
  landers.enableBody = true;
  landers.scale.setTo(0.3, 0.3);
  var lander = landers.create(400, 500, 'lander');

  // ASTROIDS
  astroids = game.add.group();
  astroids.enableBody = true;
  astroids.scale.setTo(0.2, 0.2);
  for (var j = 0; j < 2; j++) {
    //Create a astroid inside of the 'astroids' group.
    var astroid = astroids.create(j * 200, 0, 'astroid');
    astroid.body.gravity.y = 40;
  }

  // SCORE
  scoreText = game.add.text(16, 25, 'Collect Battery', {
    font: '15pt Courier',
    fill: 'white',
    stroke: 'gray',
    strokeThickness: 2,
  });

  // CONTROLS
  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  //Collide the player and the batterys with the platforms.
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(batterys, platforms);

  //Checks to see if the player overlaps with any of the batterys, if he does call the collectbattery function.
  game.physics.arcade.overlap(player, batterys, collectbattery, null, this);

  game.physics.arcade.overlap(player, astroids, die, null, this);

  //Reset the players velocity (movement).
  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    //Move to the left.
    player.body.velocity.x = -150;

    player.animations.play('left');
  } else if (cursors.right.isDown) {
    //Move to the right.
    player.body.velocity.x = 150;

    player.animations.play('right');
  } else {
    //Stand still.
    player.animations.stop();

    player.frame = 4;
  }

  //Allow the player to jump if they are touching the ground.
  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -350;
  }
}

function collectbattery(player, battery) {
  //Removes the battery from the screen.
  battery.kill();

  //Add and update the score.
  score = 'Battery Collected';
  scoreText.text = score;
}

function die(player, astroid) {
  //Player dies and restarts the game.
  player.kill();
  astroid.kill();

  //Add and update the score.
  score = 'Battery Collected';
  scoreText.text = score;
}

function fallingAstroids() {
  //Here we'll create 12 of them evenly spaced apart.
  for (var k = 0; k < 12; k++) {
    //Create a astroid inside of the 'astroids' group.
    var astroid = astroids.create(k * 70, 0, 'astroid');

    //Let gravity do its thing.
    astroid.body.gravity.y = 100;
  }
}
