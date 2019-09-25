var SideScroller = SideScroller || {};

SideScroller.Game = function () { };

SideScroller.Game.prototype = {
  preload: function () {
    this.game.time.advancedTiming = true;
  },
  create: function () {

    //game params
    this.levelSpeed = -250;
    this.tileSize = 70;
    this.probCliff = 0.4;
    this.probVertical = 0.4;
    this.probMoreVertical = 0.5;

    this.score = 0;
    this.scoreText = null;

    this.resultText = null;

    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //initiate groups, we'll recycle elements
    this.floors = this.game.add.group();
    this.floors.enableBody = true;

    for (var i = 0; i < 12; i++) {
      //cria o chao
      let newItem = this.floors.create(i * this.tileSize, this.game.world.height - this.tileSize, 'floor');
      newItem.body.immovable = true;
      newItem.body.velocity.x = this.levelSpeed;        //faz o chao se mover 
      this.lastFloor = newItem;
    }


    //keep track of the last element
    this.lastCliff = false;
    this.lastVertical = false;

    this.inimigosGlobuloBranco = this.game.add.group();
    this.inimigosGlobuloBranco.enableBody = true;
    this.inimigosGlobuloBranco.createMultiple(50, 'inimigoGlobuloBranco');

    this.bolsasDeSangue = this.game.add.group();
    this.bolsasDeSangue.enableBody = true;
    this.bolsasDeSangue.createMultiple(50, 'bolsaDesangue');


    //create player
    this.player = this.game.add.sprite(250, 120, 'player'); //controla posicao que personagem nasce
    this.player.scale.setTo(0.8);

    //enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //player gravity
    this.player.body.gravity.y = 1500;

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

  },
  update: function () {
    //collision
    this.game.physics.arcade.collide(this.player, this.floors, this.playerCaiuDoChao, null, this);
    this.game.physics.arcade.collide(this.player, this.inimigosGlobuloBranco, this.playerTocouInimigoGlobuloBranco, null, this);
    this.game.physics.arcade.overlap(this.player, this.bolsasDeSangue, this.coletouBolsaSangue, null, this);

    //only respond to keys and keep the speed if the player is alive
    if (this.player.alive) {

      if (this.player.body.touching.down) {
        this.player.body.velocity.x = -this.levelSpeed;
      }
      else {
        this.player.body.velocity.x = 0;
      }


      if (this.cursors.up.isDown) {
        this.playerJump();
      }
      else if (this.cursors.down.isDown) {
        this.playerDuck();
      }

      if (!this.cursors.down.isDown && this.player.isDucked && !this.pressingDown) {
        //change image and update the body size for the physics engine
        this.player.loadTexture('player');
        this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height);
        this.player.isDucked = false;
      }

      //restart the game if reaching the edge
      if (this.player.x <= -this.tileSize) {
        this.game.state.start('Game');
      }
      if (this.player.y >= this.game.world.height + this.tileSize) {
        this.game.state.start('Game');
      }
    }

    //generate further terrain
    this.generateTerrain();

  },
  generateTerrain: function () {
    var i, delta = 0, block, teste;
    for (i = 0; i < this.floors.length; i++) {
      if (this.floors.getAt(i).body.x <= -this.tileSize) {

        if (Math.random() < this.probCliff && !this.lastCliff && !this.lastVertical) {
          delta = 1;
          this.lastCliff = true;
          this.lastVertical = false;
        }
        else if (Math.random() < this.probVertical && !this.lastCliff) {
          this.lastCliff = false;
          this.lastVertical = true;
          block = this.inimigosGlobuloBranco.getFirstExists(false);
          teste = this.bolsasDeSangue.getFirstExists(false);
          //controla a altura dos objetos blocos de caixa
          block.reset(this.lastFloor.body.x + this.tileSize, this.game.world.height - 2 * this.tileSize);
          teste.reset(this.lastFloor.body.x + this.tileSize, this.game.world.height - 3 * this.tileSize);

          block.body.velocity.x = this.levelSpeed - 100;
          teste.body.velocity.x = this.levelSpeed - 100;
          block.body.immovable = true; // para o bloco nao se mover
          teste.body.immovable = true;

          if (Math.random() < this.probMoreVertical) {
            block = this.inimigosGlobuloBranco.getFirstExists(false);
            teste
            if (block) {
              block.reset(this.lastFloor.body.x + this.tileSize, this.game.world.height - 4 * this.tileSize);
              teste.reset(this.lastFloor.body.x + this.tileSize, this.game.world.height - 5 * this.tileSize);
              block.body.velocity.x = this.levelSpeed;
              teste.body.velocity.x = this.levelSpeed;
              block.body.immovable = true;
              teste.body.immovable = true;
            }
          }

        }
        else {
          this.lastCliff = false;
          this.lastVertical = false;
        }

        //aqui controla a distancia de um bloco para o outro
        this.floors.getAt(i).body.x = this.lastFloor.body.x + this.tileSize + delta * this.tileSize * 1.5;
        this.lastFloor = this.floors.getAt(i);
        break;
      }
    }
  },
  coletouBolsaSangue: function (player, coin) {
    coin.destroy();
    console.log("aaaaaaaaaaa");
    this.score ++;
    this.scoreText.setText('Score: ' + this.score);
  },
  playerCaiuDoChao: function (player, chao) {
    //if hits on the right side, die
    if (player.body.touching.right) {
      //set to dead (this doesn't affect rendering)
      this.player.alive = false;
      //stop moving to the right
      this.player.body.velocity.x = 0;
      //change sprite image
      this.player.loadTexture('playerDead');
      //alert("aqui é quando ele morre");
      //go to gameover after a few miliseconds
      this.game.time.events.add(200, this.gameOver, this);
    }
  }
  ,
  playerTocouInimigoGlobuloBranco: function (player, globuloBranco) {
    //if hits on the right side, die
    if (player.body.touching.right) {

      //set to dead (this doesn't affect rendering)
      this.player.alive = false;

      //stop moving to the right
      this.player.body.velocity.x = 0;

      //change sprite image
      this.player.loadTexture('playerDead');

      this.scoreText.setText(' ');



      //alert("aqui é quando ele morre");
      //go to gameover after a few miliseconds
      this.game.time.events.add(200, this.gameOver, this);


    }
    if (player.body.touching.down) {
      globuloBranco.destroy();
    }
  },
  gameOver: function () {

    if (this.score > localStorage.getItem("maiorPontuacao")) {
      document.getElementById("maiorPontuacao").innerHTML = this.score;

      localStorage.setItem("maiorPontuacao", JSON.stringify({ nome: localStorage.getItem("playerName"), pontos: this.score }));
    }

    gameOver

    document.getElementById('gameOver').style.display = 'flex';
    document.getElementById('gameOver').innerHTML = `
          <h2>você coletou ${this.score} bolsa de sangue e salvou ${this.score * 3} vidas\n A cada bolsa coletada você pode salvar 3 vidas</h2>
          <button onclick='jogarNovamente()'>JOGAR NOVAMENTE</button>
          `;

    //this.game.state.start('Boot');
    this.game.paused = true;

  },
  playerJump: function () {
    if (this.player.body.touching.down) {
      this.player.body.velocity.y -= 700;// aqui controla o pulo
    }


  },
  playerDuck: function () {
    //change image and update the body size for the physics engine
    this.player.loadTexture('playerDuck');
    this.player.body.setSize(this.player.duckedDimensions.width, this.player.duckedDimensions.height);

    //we use this to keep track whether it's ducked or not
    this.player.isDucked = true;
  },
  jogarNovamente: function () {
    this.game.state.start('Boot');
  }
};
