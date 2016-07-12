import Phaser from 'phaser'
import Isometric from '../libs/phaser-plugin-isometric'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#4DBD33'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    WebFont.load({
      google: {
        families: ['Nunito']
      },
      active: this.fontsLoaded
    })

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')

    this.load.image('cube', './assets/images/cube.png')

    this.game.time.advancedTiming = true;

    // Add and enable the plug-in.
    this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));
    // In order to have the camera move, we need to increase the size of our world bounds.
    this.game.world.setBounds(0, 0, 2048, 1024);

    // Start the IsoArcade physics system.
    this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

    // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
    // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
    // When using camera following, it's best to keep the Y anchor set to 0, which will let the camera
    // cover the full size of your world bounds.
    this.game.iso.anchor.setTo(0.5, 0);
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }

}
