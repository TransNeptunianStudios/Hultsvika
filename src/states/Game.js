/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import {setResponsiveWidth} from '../utils'

var isoGroup, player;

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    // Create a group for our tiles, so we can use Group.sort
    isoGroup = this.game.add.group();

    // Set the global gravity for IsoArcade.
    this.game.physics.isoArcade.gravity.setTo(0, 0, -500);

    // Let's make a load of cubes on a grid, but do it back-to-front so they get added out of order.
    var cube;
    for (var xx = 1024; xx > 0; xx -= 140) {
        for (var yy = 1024; yy > 0; yy -= 140) {

            // Create a cube using the new game.add.isoSprite factory method at the specified position.
            // The last parameter is the group you want to add it to (just like game.add.sprite)
            cube = this.game.add.isoSprite(xx, yy, 0, 'cube', 0, isoGroup);
            cube.anchor.set(0.5);

            // Enable the physics body on this cube.
            this.game.physics.isoArcade.enable(cube);

            // Collide with the world bounds so it doesn't go falling forever or fly off the screen!
            cube.body.collideWorldBounds = true;

            // Add a full bounce on the x and y axes, and a bit on the z axis.
            cube.body.bounce.set(1, 1, 0.2);

            // Add some X and Y drag to make cubes slow down after being pushed.
            cube.body.drag.set(100, 100, 0);
        }
    }

    // Create another cube as our 'player', and set it up just like the cubes above.
    player = this.game.add.isoSprite(128, 128, 0, 'cube', 0, isoGroup);
    player.tint = 0x86bfda;
    player.anchor.set(0.5);
    this.game.physics.isoArcade.enable(player);
    player.body.collideWorldBounds = true;

    // Set up our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.SPACEBAR
    ]);
    var space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    space.onDown.add(function () {
        player.body.velocity.z = 300;
    }, this);

    // Make the camera follow the player.
    this.game.camera.follow(player);
  }

  update () {
    // Move the player at this speed.
    var speed = 100;

    if (this.cursors.up.isDown) {
        player.body.velocity.y = -speed;
    }
    else if (this.cursors.down.isDown) {
        player.body.velocity.y = speed;
    }
    else {
        player.body.velocity.y = 0;
    }

    if (this.cursors.left.isDown) {
        player.body.velocity.x = -speed;
    }
    else if (this.cursors.right.isDown) {
        player.body.velocity.x = speed;
    }
    else {
        player.body.velocity.x = 0;
    }

    // Our collision and sorting code again.
    this.game.physics.isoArcade.collide(isoGroup);
    this.game.iso.topologicalSort(isoGroup);
  }

  render () {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
