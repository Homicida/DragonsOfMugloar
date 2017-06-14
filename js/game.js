var gameApi = "http://www.dragonsofmugloar.com/api/game/";
var weatherApi = "http://www.dragonsofmugloar.com/weather/api/report/";
var gameStats = {};
var weatherCode;
var victories = 0;
var defeats = 0;
var winrate;
var dragonStats = {dragon:{scaleThickness: 0, clawSharpness: 0, wingStrength: 0, fireBreath: 0}};
var counter2 = 0;
var counter = 0;

function repeat(){
	counter2 = document.getElementById("counter").value;
	var i = setInterval(function(){
		getGame();
		counter2--;
		if(counter2 <= 0){
			clearInterval(i);
		}
	}, 1000);
}

function getGameApi(gameId){
	return gameApi + gameStats.gameId + "/solution";
}
function getGame(){
	var request = $.ajax({
		url: gameApi,
		type: "GET",
		success: function(data){
			gameStats = data;
		}
	}).done(function(){
		$(".gameId").html(gameStats.gameId);
		$(".knightName").html(gameStats.knight.name);
		$(".knightAttack").html(gameStats.knight.attack);
		$(".knightArmor").html(gameStats.knight.armor);
		$(".knightAgility").html(gameStats.knight.agility);
		$(".knightEndurance").html(gameStats.knight.endurance);
	}).done(function(){
		getWeather();
	}).done(function(){
		if(weatherCode == "NMR"){
			dragon();
		}else if(weatherCode == "HVA"){
			dragonStats = {
				dragon:{
					scaleThickness: 0, 
					clawSharpness: 10, 
					wingStrength: 10, 
					fireBreath: 0
				}
			};
		}else if(weatherCode == "T E" || weatherCode == "FUNDEFINEDG"){
			dragonStats = {
				dragon:{
					scaleThickness: 5, 
					clawSharpness: 5, 
					wingStrength: 5, 
					fireBreath: 5
				}
			};
		}else if(weatherCode == "SRO"){
			dragonStats = {};
		}
		if(weatherCode == "SRO"){
			$(".weatherCode").html(weatherCode);
			$(".scaleThickness").html("-");
			$(".clawSharpness").html("-");
			$(".wingStrength").html("-");
			$(".firebreath").html("-");
		}else{
			$(".weatherCode").html(weatherCode);
			$(".scaleThickness").html(dragonStats.dragon.scaleThickness);
			$(".clawSharpness").html(dragonStats.dragon.clawSharpness);
			$(".wingStrength").html(dragonStats.dragon.wingStrength);
			$(".firebreath").html(dragonStats.dragon.fireBreath);
		}
		play();
	});
}

function getWeather(){
	weather = weatherApi + gameStats.gameId;
	request = $.ajax({
		url: weather,
		async: false,
		type: "GET"
	}).success(function(response, textStatus, jqXHR){
		weatherCode = response.getElementsByTagName("code")[0].innerHTML;
	});
}

function play(){
	var game = getGameApi();
	var request = $.ajax({
		type: "PUT",
		url: game,
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(dragonStats)
	}).done(function(response, textStatus, jqXHR){
		$(".status").html(response.status);
		$(".message").html(response.message);
		counter++;
		
		if(response.status == "Victory"){
			victories++;
		}else if(response.status == "Defeat"){
			defeats++;
		}
		
		$(".victories").html(victories);
		$(".defeats").html(defeats);
		$(".winrate").html(victories/counter*100);
	});
}

function dragon(){
	dragonStats = {dragon:{scaleThickness: 0, clawSharpness: 0, wingStrength: 0, fireBreath: 0}};
	var max = Math.max(gameStats.knight.attack, gameStats.knight.armor, gameStats.knight.agility, gameStats.knight.endurance);
	if(max == gameStats.knight.attack){
		dragonStats.dragon.scaleThickness = gameStats.knight.attack + 2;
		var min = Math.min(gameStats.knight.armor, gameStats.knight.agility, gameStats.knight.endurance);
		if(min == gameStats.knight.armor){
			dragonStats.dragon.clawSharpness = gameStats.knight.armor;
			dragonStats.dragon.wingStrength = gameStats.knight.agility - 1;
			dragonStats.dragon.fireBreath = gameStats.knight.endurance - 1;
		}else if(min == gameStats.knight.agility){
			dragonStats.dragon.clawSharpness = gameStats.knight.armor - 1;
			dragonStats.dragon.wingStrength = gameStats.knight.agility;
			dragonStats.dragon.fireBreath = gameStats.knight.endurance - 1;
		}else if(min == gameStats.knight.endurance){
			dragonStats.dragon.clawSharpness = gameStats.knight.armor - 1;
			dragonStats.dragon.wingStrength = gameStats.knight.agility - 1;
			dragonStats.dragon.fireBreath = gameStats.knight.endurance;
		}
	}else if(max == gameStats.knight.armor){
		var min = Math.min(gameStats.knight.attack, gameStats.knight.agility, gameStats.knight.endurance);
		dragonStats.dragon.clawSharpness = gameStats.knight.armor + 2;
		if(min == gameStats.knight.attack){
			dragonStats.dragon.scaleThickness = gameStats.knight.attack;
			dragonStats.dragon.wingStrength = gameStats.knight.agility - 1;
			dragonStats.dragon.fireBreath = gameStats.knight.endurance - 1;
		}else if(min == gameStats.knight.agility){
			dragonStats.dragon.scaleThickness = gameStats.knight.attack - 1;
			dragonStats.dragon.wingStrength = gameStats.knight.agility;
			dragonStats.dragon.fireBreath = gameStats.knight.endurance - 1;
		}else if(min == gameStats.knight.endurance){
			dragonStats.dragon.scaleThickness = gameStats.knight.attack - 1;
			dragonStats.dragon.wingStrength = gameStats.knight.agility - 1;
			dragonStats.dragon.fireBreath = gameStats.knight.endurance;
		}
	}else if(max == gameStats.knight.agility){
		var min = Math.min(gameStats.knight.attack, gameStats.knight.armor, gameStats.knight.endurance);
		dragonStats.dragon.wingStrength = gameStats.knight.agility + 2;
		if(min == gameStats.knight.attack){
			dragonStats.dragon.scaleThickness = gameStats.knight.attack;
			dragonStats.dragon.clawSharpness = gameStats.knight.armor - 1;
			dragonStats.dragon.fireBreath = gameStats.knight.endurance - 1;
		}else if(min == gameStats.knight.armor){
			dragonStats.dragon.scaleThickness = gameStats.knight.attack - 1;
			dragonStats.dragon.clawSharpness = gameStats.knight.armor;
			dragonStats.dragon.fireBreath = gameStats.knight.endurance - 1;
		}else if(min == gameStats.knight.endurance){
			dragonStats.dragon.scaleThickness = gameStats.knight.attack - 1;
			dragonStats.dragon.clawSharpness = gameStats.knight.armor - 1;
			dragonStats.dragon.fireBreath = gameStats.knight.endurance;
		}
	}else if(max == gameStats.knight.endurance){
		var min = Math.min(gameStats.knight.attack, gameStats.knight.armor, gameStats.knight.agility);
		dragonStats.dragon.fireBreath = gameStats.knight.endurance + 2;
		if(min == gameStats.knight.attack){
			dragonStats.dragon.scaleThickness = gameStats.knight.attack;
			dragonStats.dragon.clawSharpness = gameStats.knight.armor - 1;
			dragonStats.dragon.wingStrength = gameStats.knight.agility - 1;
		}else if(min == gameStats.knight.armor){
			dragonStats.dragon.scaleThickness = gameStats.knight.attack - 1;
			dragonStats.dragon.clawSharpness = gameStats.knight.armor;
			dragonStats.dragon.wingStrength = gameStats.knight.agility - 1;
		}else if(min == gameStats.knight.agility){
			dragonStats.dragon.scaleThickness = gameStats.knight.attack - 1;
			dragonStats.dragon.clawSharpness = gameStats.knight.armor - 1;
			dragonStats.dragon.wingStrength = gameStats.knight.agility;
		}
	}
}