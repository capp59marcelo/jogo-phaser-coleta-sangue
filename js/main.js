var SideScroller = SideScroller || {};

SideScroller.game = new Phaser.Game(746, 420, Phaser.AUTO, '');

SideScroller.game.state.add('Boot', SideScroller.Boot);
SideScroller.game.state.add('Preload', SideScroller.Preload);
SideScroller.game.state.add('Game', SideScroller.Game);

SideScroller.game.state.start('Boot');


var maiorPontuacao = JSON.parse(localStorage.getItem("maiorPontuacao"));
document.getElementById("pontos").innerHTML = maiorPontuacao.pontos ;
document.getElementById("nome").innerHTML = maiorPontuacao.nome ;