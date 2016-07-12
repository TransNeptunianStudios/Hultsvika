/* globals __DEV__ */
import Phaser from 'phaser'
import Isometric from '../libs/phaser-plugin-isometric'
import {setResponsiveWidth} from '../utils'

var isoGroup, player;

export default class extends Phaser.State {
  init () {
    // Add and enable the plug-in.
    this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));
    // In order to have the camera move, we need to increase the size of our world bounds.
    this.world.setBounds(0, 0, 2048, 1024);

    // Start the IsoArcade physics system.
    this.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

    // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
    // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
    // When using camera following, it's best to keep the Y anchor set to 0, which will let the camera
    // cover the full size of your world bounds.
    this.game.iso.anchor.setTo(0.5, 0);
  }
  preload () {}

  create () {
    // Create a group for our tiles, so we can use Group.sort
    isoGroup = this.add.group();

    // Set the global gravity for IsoArcade.
    this.physics.isoArcade.gravity.setTo(0, 0, -500);

    // Let's make a load of cubes on a grid, but do it back-to-front so they get added out of order.
    var tent;
    for (var xx = 1024; xx > 0; xx -= 140) {
        for (var yy = 1024; yy > 0; yy -= 140) {

            // Create a cube using the new game.add.isoSprite factory method at the specified position.
            // The last parameter is the group you want to add it to (just like game.add.sprite)
            tent = this.add.isoSprite(xx, yy, 0, 'tent1', 0, isoGroup);
            tent.anchor.set(0.5);

            // Enable the physics body on this cube.
            this.physics.isoArcade.enable(tent);

            // Collide with the world bounds so it doesn't go falling forever or fly off the screen!
            tent.body.collideWorldBounds = true;

            // Add a full bounce on the x and y axes, and a bit on the z axis.
            tent.body.bounce.set(1, 1, 0.2);

            // Add some X and Y drag to make cubes slow down after being pushed.
            tent.body.drag.set(100, 100, 0);
        }
    }

    // Create another cube as our 'player', and set it up just like the cubes above.
    //var realPlayer = new Visitor(128, 128, 0, 'cube', 0, isoGroup);

    player = this.add.isoSprite(128, 128, 0, 'cube', 0, isoGroup);
    player.tint = 0x86bfda;
    player.anchor.set(0.5);
    this.physics.isoArcade.enable(player);
    player.body.collideWorldBounds = true;

    // Set up our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.SPACEBAR
    ]);
    var space = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    space.onDown.add(function () {
        player.body.velocity.z = 300;
    }, this);

    // Make the camera follow the player.
    this.camera.follow(player);
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
    this.physics.isoArcade.collide(isoGroup);
    this.game.iso.topologicalSort(isoGroup);
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(player, 32, 32)
    }
  }
}
