// Bindings go here


$(document).ready(function(){
	var game = new Game();
	game.beginGame();

	$('#id_btnrestartGame').click(function(){
		game.onNewGameClick();
	});

	$('#id_btnresetLevel').click(function(){
		game.onResetLevelClick();
	});

	$('#id_btnGameRule').click(function(){
		game.onGameRule();
	});

});
