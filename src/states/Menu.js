/* globals __DEV__ */
import Phaser from 'phaser'
import {setResponsiveWidth} from '../utils'

export default class extends Phaser.State {
  init ()
  {
      this.step = 0
  }
  preload () {}

  create () {
    // Step 0
    let Title = this.add.text(this.game.world.centerX, 30, 'Hultsvika')
    Title.font = 'Nunito'
    Title.fontSize = 60
    Title.fill = '#000000'
    Title.anchor.setTo(0.5)

    var button = this.add.button(this.game.world.centerX, this.game.world.height-50, 'start-button', this.onEnter, this, 2, 1, 0);
    button.anchor.setTo(0.5);

    var enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    enter.onDown.add(this.onEnter, this);
    space.onDown.add(this.onEnter, this);
  }

  onEnter() {
      this.state.start('Game')
  }

  update () {}

  render () {
    if (__DEV__) {
      //this.game.debug.spriteInfo(player, 32, 32)
    }
  }
}
