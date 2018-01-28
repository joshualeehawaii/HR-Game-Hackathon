var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer', {
  preload: preload,
  create: create,
  update: update,
});

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('battery', 'assets/battery.png');
  game.load.image('dude', 'assets/dude.png');
  game.load.image('lander', 'assets/lander.png');
}

var player;
var platforms;
var cursors;
var batterys;
var score = 0;
var scoreText;

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  var sky = game.add.sprite(0, 0, 'sky');
  sky.alpha = 0.3;

  // PLATFORMS
  platforms = game.add.group();
  platforms.enableBody = true;
  var ground = platforms.create(0, game.world.height - 55, 'ground');
  ground.scale.setTo(1, 1);
  ground.body.immovable = true;

  // PLAYERS
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

  // LANDERS
  landers = game.add.group();
  landers.enableBody = true;
  landers.scale.setTo(0.3, 0.3);
  var lander = landers.create(400, 500, 'lander');

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
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(batterys, platforms);
  game.physics.arcade.overlap(player, batterys, collectbattery, null, this);
  game.physics.arcade.overlap(player, batterys, null, this);

  // RESET VELOCITY
  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    player.body.velocity.x = -150;
    player.animations.play('left');
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 150;
    player.animations.play('right');
  } else {
    player.animations.stop();
    player.frame = 4;
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -350;
  }
}

function collectbattery(player, battery) {
  battery.kill();

  // UPDATE SCORE
  score = 'Battery Collected';
  scoreText.text = score;
}
