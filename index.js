function drawApp() {

	var theCanvas = document.getElementById("canvas");
	var context = theCanvas.getContext("2d");
	var gaugeA = document.getElementById("gaugeA");
	var gContextA = gaugeA.getContext("2d");
	var information = document.getElementById("information");
	var iContext = information.getContext("2d");
	var floorN = document.getElementById("floor");
	var wallIcon = document.getElementById("wallIcon");
	var stock = document.getElementById("stock");
	var gameStart = document.getElementById("start");
	gameStart.addEventListener('click', startUp, false);
	var level = document.getElementById("level");
	level.addEventListener('change', levelChenged, false);
	var speedc = document.getElementById("speed");
	speedc.addEventListener('change', speedChanged, false);
	var levelD = document.getElementById("levelD");

	var gameLevel = "EASY";
	var healLate = 3;
	var animeSpeed = 0;
	var gameStarted = false;
	var bonusLate = 3;
	var clearNowFloor = false;
	var floor = 0;
	var wallStock = 5;
	var burnStock = 9;
	var spaceShip = new Image();
	var tileSheet = new Image();
	var counter = 0;
	var animationFrames = [1,2,3,4,5,6,7,8];
	var frameIndex = 0;
	var sourceX = (animationFrames[frameIndex] % 8) * 32;
	var sourceY = Math.floor(animationFrames[frameIndex] / 8) * 32;
	var startPositionX = 5;
	var startPositionY = 5;
	var speed = 2;
	var tileLength = 32;
	var x = (startPositionX - 1) * tileLength;
	var y = (startPositionY - 1) * tileLength;
	var dx = 0;
	var dy = 0;
	var direction = 2;	//north:0, east:1, south: 2, west:3
	var rotation = directionDecide(direction);
	var interval;
	var gInterval;
	var energy = 80;

	function levelChenged(e) {
		if(!gameStarted){
			gameLevel = e.target.value;
			if(gameLevel == "EASY") {
				bonusLate = 3;
				healLate = 3;
			} else if(gameLevel == "NORMAL") {
				bonusLate =2;
				healLate = 2;
			}else if(gameLevel == "HARD"){
				bonusLate = 1;
				healLate = 1;
			}
		}
	}


	function speedChanged(e){

		animeSpeed = e.target.value;
		if(animeSpeed > 22) {
			if (!(speed == 8)) {
				x -= (x % tileLength);
				y -= (y % tileLength);
				speed = 8;
			}
		} else if(animeSpeed > 11) {
			if(!(speed == 4)){
				x -= (x % tileLength);
				y -= (y % tileLength);
				speed = 4;
			}
		} else {
			if(!(speed == 2)){
				x -= (x % tileLength);
				y -= (y % tileLength);
				speed = 2;
			}
		}
		if(gameStarted){
			if(!clearNowFloor){
				clearInterval(interval);
				interval = setInterval(drawScreen, 33-animeSpeed);
			}
		}
	}

	function drawGauge() {
		gContextA.fillStyle = "#aaaaaa";
		gContextA.fillRect(0,0,gaugeA.width,gaugeA.height);
		gContextA.strokeStyle = "#000000";
		gContextA.strokeRect(0,0,gaugeA.width,gaugeA.height);
		gContextA.strokeRect(9, (gaugeA.height/2) - 1, 82, 2);
		gContextA.strokeStyle = "red";
		if(energy < 80) gContextA.strokeStyle = "brown";
		gContextA.beginPath();
		gContextA.moveTo(10, gaugeA.height/2);
		gContextA.lineTo(10 + energy, gaugeA.height/2);
		gContextA.closePath();
		gContextA.stroke();
		if(energy < 80) energy += healLate;
		else clearInterval(gInterval);
		if(energy >80) energy = 80;
	}


	function directionDecide(direction) {
		if(direction == 0) return 0;			//north
		else if(direction == 1) return 90;		//east
		else if(direction == 2) return 180;		//south
		else if(direction == 3) return 270;		//west

	}

	var mouseX;
	var mouseY;


	function onMouseMove(e) {
		mouseX = e.clientX - theCanvas.getBoundingClientRect().left;
		mouseY = e.clientY - theCanvas.getBoundingClientRect().top;
	}

	function onMouseClick(e) {
		if(gameStarted && !clearNowFloor){
			var col = Math.floor(mouseX / tileLength);
			var row = Math.floor(mouseY / tileLength);
			if((energy == 80 && wallStock > 0)&& tileMap[row][col] == 1) {
				tileMap[row][col] = 26;
				energy = 0;
				wallStock--;
				clearInterval(gInterval);
				gInterval = setInterval(drawGauge, 50);
			} else if(burnStock > 0 && tileMap[row][col] == 26) {
				tileMap[row][col] = 1;
				burnStock--;
			} else {
				//壁を配置できない
			}
		}
	}

	var mapIndexOffset = -1;
	var mapRows = 10;
	var mapCols = 10;

	var tileMap = [
	[32,32,32,32,32,32,32,32,32,32],
	[32,1,1,1,1,1,1,1,1,32],
	[32,1,1,1,1,1,1,1,1,32],
	[32,1,1,1,1,1,1,1,1,32],
	[32,1,1,1,1,1,1,1,1,32],
	[32,1,1,1,1,1,1,1,1,32],
	[32,1,1,1,1,1,1,1,1,32],
	[32,1,1,1,1,1,1,1,1,32],
	[32,1,1,1,1,1,1,1,1,32],
	[32,32,32,32,32,32,32,32,32,32]
	];

	var tileSheet2 = new Image();
	tileSheet2.src = "y7rPH.png";
	tileSheet2.addEventListener('load', eventShipLoaded, false);

	function eventShipLoaded(){
		drawScreen();
	}

	function drawTileMap(){
		//tilemap
		for (var rowCtr=0; rowCtr<mapRows; rowCtr++) {
			for (var colCtr=0; colCtr<mapCols; colCtr++) {
				var tileId = tileMap[rowCtr][colCtr] + mapIndexOffset;
				context.drawImage(tileSheet2, 0, 0, tileLength,tileLength,colCtr*tileLength, rowCtr*tileLength, tileLength,tileLength);
                sourceX = (tileId % 8) * tileLength;
				sourceY = Math.floor(tileId / 8) *tileLength;
                context.drawImage(tileSheet2, sourceX, sourceY, tileLength,tileLength,colCtr*tileLength, rowCtr*tileLength, tileLength,tileLength);
			}
		}
	}

	function drawInformation(){
		iContext = information.getContext("2d");
		iContext.fillStyle = "#444444";
		iContext.strokeStyle = "#000000";
		iContext.fillRect(0, 0, information.width, information.height);
		iContext.strokeRect(0, 0, information.width, information.height);
		floorN.innerHTML = "Floor: " + floor;
		levelD.innerHTML = "Level: " + gameLevel;
		iContext = wallIcon.getContext("2d");
		var tileIdw = 25;
		var Xw = (tileIdw % 8) * tileLength;
		var Yw = Math.floor(tileIdw / 8) *tileLength;
		iContext.drawImage(tileSheet2, Xw, Yw, tileLength,tileLength,0, 0, tileLength,tileLength);
		stock = document.getElementById("stock");
		stock.innerHTML = "x" + wallStock;
		tileIdw = 19;
		Xw = (tileIdw % 8) * tileLength;
		Yw = Math.floor(tileIdw / 8) *tileLength;
		iContext.drawImage(tileSheet2, Xw, Yw, tileLength,tileLength,52, 0, tileLength,tileLength);
		stock = document.getElementById("burnStock");
		stock.innerHTML = "x" + burnStock;
	}

	function drawScreen(){
		drawTileMap();
		drawInformation();


		sourceX = (animationFrames[frameIndex] % 8) * tileLength;
		sourceY = Math.floor(animationFrames[frameIndex] / 8) * tileLength;

		if (x % tileLength == 0 || y % tileLength == 0)
		{
			//	The unit decide the direction.
			decide();
		}
		rotation = directionDecide(direction);

		context.save();
		context.setTransform(1,0,0,1,0,0);
		context.translate(x+(tileLength / 2), y+(tileLength / 2));
		var angleInRadians = rotation * Math.PI / 180;
		context.rotate(angleInRadians);

		x = x+dx;
		y = y+dy;

		context.drawImage(tileSheet2, sourceX, sourceY, tileLength, tileLength, -(tileLength / 2), -(tileLength / 2), tileLength,tileLength );

		context.restore();

		if(y <= 0 || x <= 0 || y >= theCanvas.height - tileLength || x >= theCanvas.width - tileLength) {
			alert("clear!");
			clearNowFloor = true;
			clearInterval(interval);
		}

		frameIndex++;
		if (frameIndex == animationFrames.length) frameIndex = 0;

	}

	function startUp() {
		if(!gameStarted) {
			gameStarted = true;
			gameStart.value = "Next Floor";
		} else if(!clearNowFloor){
			alert("You have not cleared this floor yet! ");
			return;
		}
		floor++;
		clearNowFloor = false;
        energy = 80;
		if(floor % 5 == 0){
			alert("You got Clear Bonus!!");
			wallStock += (floor/5) * bonusLate;
			burnStock += Math.floor((floor/5) / 2) * bonusLate;
		}
		startPositionX = 0;
		startPositionY = 0;
		makeMap();
		while((startPositionX < 2) || (startPositionY < 2) || (tileMap[startPositionY-1][startPositionX-1] != 1)) {
			startPositionX = Math.floor(Math.random() * 9);
			startPositionY = Math.floor(Math.random() * 9);
		}
		x = (startPositionX - 1) * tileLength;
		y = (startPositionY - 1) * tileLength;
		clearInterval(gInterval);
		gInterval = setInterval(drawGauge, 5);
		clearInterval(interval);
		interval = setInterval(drawScreen, 33-animeSpeed);
	}

	function makeMap() {
		var setGoal = false;
		var setWallCount = (10 * (3/bonusLate)) + Math.floor(Math.random() * 20 * floor/bonusLate);
		for(var rowCtr=0; rowCtr<mapRows; rowCtr++){
			for(var colCtr=0; colCtr<mapCols; colCtr++){
				if(rowCtr == 0 || colCtr == 0 || rowCtr == mapRows-1 || colCtr == mapCols-1){
					tileMap[rowCtr][colCtr] = 32;
					if((rowCtr == 0 || rowCtr == mapRows - 1) && (colCtr == 0 || colCtr == mapCols-1))continue;
					if(!setGoal && (Math.random() > .9 || (rowCtr == mapRows-1 && colCtr == mapCols-2))) {
						tileMap[rowCtr][colCtr] = 1;
						setGoal = true;
					}
				} else if(setWallCount > 0 && Math.random() > .7){
					tileMap[rowCtr][colCtr] = 26;
					setWallCount--;
				} else {
					tileMap[rowCtr][colCtr] = 1;
				}
			}
		}
	}

	function decide() {
        var xx,yy,xxx,yyy;
		if(direction == 0) {dx = 0;	dy = -speed; xx=x;	yy=y + (tileLength - 1);	xxx= x;	yyy = y; }
		else if(direction == 1) {dx = speed;		dy = 0;	xx=x;	yy=y;	xxx = x + (tileLength - 1);	yyy = y;}
		else if(direction == 2) {dx = 0;		dy = speed;	xx=x + (tileLength - 1);	yy=y;	xxx = x;	yyy = y + (tileLength - 1);}
		else if(direction == 3) {dx = -speed;	dy = 0;	xx=x + (tileLength - 1);	yy=y + (tileLength - 1);	xxx = x;	yyy = y;}

		if(tileMap[Math.floor(yyy / tileLength)][Math.floor(xxx / tileLength)] != 1) {
			dx /= -1;
			dy /= -1;
			if(tileMap[Math.floor(yyy / tileLength) + (dy / speed)][Math.floor(xxx / tileLength) + (dx / speed)] != 1) {
				dx = 0;
				dy = 0;
			}
		}else if(tileMap[Math.floor(yy / tileLength) + (dy / speed)][Math.floor(xx / tileLength) + (dx / speed)] != 1){
			if (Math.random() >= .4) direction++;
			else {direction --; }
			if (direction > 3) direction = 0;
			if (direction < 0) direction = 3;
			dx = 0;
			dy = 0;
		}

	}



	theCanvas.addEventListener('mousemove', onMouseMove, false);
	theCanvas.addEventListener('click', onMouseClick, false);


}
