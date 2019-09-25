var SideScroller = SideScroller || {};

//loading the game assets
SideScroller.Preload = function () { };

SideScroller.Preload.prototype = {
  preload: function () {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(1);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.image('player', 'assets/images/player.png');
    this.load.image('playerDuck', 'assets/images/player_duck.png');
    this.load.image('playerDead', 'assets/images/player_dead.png');
    this.load.image('bolsaDesangue', 'assets/images/bolsaDesangue.png');
    this.load.image('floor', 'assets/images/floor.png');
    this.load.image('yellowBlock', 'assets/images/yellow-block.png');
    this.load.image('inimigoGlobuloBranco', 'assets/images/inimigoGlobuloBranco.png');
    this.load.audio('coin', 'assets/audio/coin.wav');
  },
  create: function () {
    
    // var nome;
    // do {
    //   nome = prompt("Por favor digite seu lindo nome");
    // } while (nome == null || nome == "");

    // localStorage.setItem("playerName", nome);
    this.state.start('Game');
  }
};