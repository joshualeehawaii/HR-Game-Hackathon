var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer', {
  preload: preload,
  create: create,
  update: update,
});

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('battery', 'assets/battery.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

var player;
var platforms;
var cursors;

var batterys;
var score = 0;
var scoreText;

function create() {
  //Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //Background
  game.add.sprite(0, 0, 'sky');

  //The platforms group contains the ground and the 2 ledges we can jump on
  platforms = game.add.group();

  //Physics for any object that is created in this group
  platforms.enableBody = true;

  //Create the ground.
  var ground = platforms.create(0, game.world.height - 64, 'ground');

  //Scale it to fit the width of the game.S
  ground.scale.setTo(2, 2);

  //This stops it from falling away when you jump on it.
  ground.body.immovable = true;

  //Two ledges.
  var ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;

  ledge = platforms.create(-150, 250, 'ground');
  ledge.body.immovable = true;

  //The player and its settings
  player = game.add.sprite(32, game.world.height - 150, 'dude');

  //Physics on the player
  game.physics.arcade.enable(player);

  //Player physics properties: slight bounce.
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  //Two animations, walking left and right.
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  //batterys to collect.
  batterys = game.add.group();

  //Physics for any battery that is created in this group.
  batterys.enableBody = true;

  //12 of them evenly spaced apart
  for (var i = 0; i < 1; i++) {
    //Create a battery inside of the 'batterys' group.
    var battery = batterys.create(i * 70, 0, 'battery');

    //Let gravity do its thing
    battery.body.gravity.y = 300;

    //This just gives each battery a slightly random bounce value.
    battery.body.bounce.y = 0.7 + Math.random() * 0.2;
  }

  //The score.
  scoreText = game.add.text(16, 25, 'Collect Battery', {
    font: '15pt Courier',
    fill: 'white',
    stroke: '#119f4e',
    strokeThickness: 2,
  });

  //Our controls.
  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  //Collide the player and the batterys with the platforms.
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(batterys, platforms);

  //Checks to see if the player overlaps with any of the batterys, if he does call the collectbattery function.
  game.physics.arcade.overlap(player, batterys, collectbattery, null, this);

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
