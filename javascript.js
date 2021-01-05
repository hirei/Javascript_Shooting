　　var canvas = document.getElementById("canvas"); // Canvasを取得
　　var ctx = canvas.getContext("2d"); // CanvasからContextを取得

　　var key = Array(5);  //配列変数
　　let KEY_RIGHT =0;
　　let KEY_LEFT  =1;
　　let KEY_UP    =2;
　　let KEY_DOWN  =3;
　　let KEY_Z     =4;
　　key[KEY_RIGHT] =0;
　　key[KEY_LEFT]  =0;
　　key[KEY_UP]	   =0;
　　key[KEY_DOWN]  =0;
　　key[KEY_Z]     =0;

　　class Enemy {
    　constructor(x,y,angle,kind){
        this.kind = kind;   //敵の種類
        this.BULLET_NUM = 3;
        this.bullet = Array(this.BULLET_NUM);   //敵の弾の配列

        for(var i = 0;i < 5;i++) {
		　　this.bullet[i] = new Bullet();  //弾を生成
	}

	this.x = x; // X座標
	this.y = y; // Y座標
	this.width = 32; // 幅
	this.height = 32; // 高さ
	this.angle = angle; // 角度
	this.spd = 3; // 速度
	this.cnt = 0; // カウンタ
    　}

    	getBulletNum(){
        	for(var i=0; i<this.BULLET_NUM; i++){
            	　　if(!this.bullet[i].exist){      //この球が存在しないなら
                　　return i;       //iを返す
            　　　}
        }
        return -1;  //異常終了を表す(関数が失敗している)
    }
	  
    shot() {
		if(this.cnt % 20 == 0) { // 20カウントずつ発射
			var num = this.getBulletNum(); // 発射されてない弾の番号を取得
			if(num != -1) {     //異常終了の値ではないなら
				//	弾を登録
				this.bullet[num].enter(this.x, this.y, 4, 4, this.angle, 5);
			}
		}
		//	発射された弾を更新
		for(var i = 0;i < this.BULLET_NUM;i++) {
			if(this.bullet[i].exist) {  //この弾が存在するなら
				this.bullet[i].move();  //弾を動かす(発射)
			}
		}
		//	カウンタを更新
		this.cnt++;
	}



    move(){
        this.x += Math.cos(this.angle) * this.spd;
        this.y += Math.sin(this.angle) * this.spd;
        var rn = Math.floor(Math.random() * (3 - 1) + 1);   //1~3の間のランダムな値
		
        //	壁に当たったら跳ね返る
		if(this.x < this.width / 2 || this.x > canvas.width - this.width / 2) {
			var r = this.angle - Math.PI / rn;
			this.angle = this.angle - 2 * r;
			this.spd *= 1.005;
		}
		else if(this.y < this.height / 2 || this.y > canvas.height - this.height / 2) {
			var r = this.angle - Math.PI * rn;
			this.angle = this.angle - 2 * r;
			this.spd *= 1.005;
		}
    }
    //描画
    draw(ctx){
        switch(this.kind){  //敵の種類の描画
            case 0: ctx.fillStyle = "rgb(0, 255, 255)"; break; // 水色
			case 1: ctx.fillStyle = "rgb(0, 255, 0)"; break; // 緑色
			case 2: ctx.fillStyle = "rgb(255, 255, 0)"; break; // 黄色
        }
        //短形の描画
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        //弾の描画
        for(var i=0; i< this.BULLET_NUM; i++){
            if(this.bullet[i].exist){       //存在するなら
                this.bullet[i].draw(ctx);   //描画する
            }
        }
    }
}

class Bullet {
    constructor(){
        this.exist = false;
        this.x= 0;
        this.y= 0;
        this.width= 0;
        this.height= 0;
        this.angle= 0;
        this.spd= 0;

    }
    enter(x, y, width, height, angle, spd){
        this.exist = true;
        this.x= x;
        this.y= y;
        this.width= width;
        this.height= height;
        this.angle= angle;
        this.spd= spd;
    }
    //動作
    move(){
        this.x += Math.cos(this.angle)*this.spd;
        this.y += Math.sin(this.angle)*this.spd;

        if(this.x<0 || this.x > canvas.width || this.y <0 || this.y> canvas.height){
            this.exist = false;     //弾の存在を消す
        }
    }
    //描画
    draw(ctx){
        ctx.fillStyle= "yellow";
        ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
    }
}


class Player{
    constructor(){
        this.cnt =0;
        this.residue = 3;   //体力
        this.deffect = false;   //当たり判定
        this.x = canvas.width/2;    //横座標
        this.y = canvas.height*3/4; //縦座標
        this.width = 24;    //横の大きさ
        this.height = 36;   //縦の大きさ

        this.BULLET_NUM =5;
        this.bullet =Array(this.BULLET_NUM);
        for(var i=0; i< this.BULLET_NUM; i++){
            this.bullet[i] = new Bullet();
        }
    }

    move(key){
        var diagonal =1.0; //斜めの補正
        var hori =false;
        var vert =false;

        if(key[KEY_RIGHT] == 1 || key[KEY_LEFT] == 1){  //横移動
            hori =true;
        }
        if(key[KEY_UP] == 1 || key[KEY_DOWN] == 1) {    //縦移動
			vert = true;
		}
        if(hori && vert){   //斜め移動
            diagonal = Math.sqrt(2.0); //√２
        }

        //移動後の座標
        var mx = this.x + (key[KEY_RIGHT] - key[KEY_LEFT]) * 6 / diagonal;
        var my = this.y + (key[KEY_DOWN] - key[KEY_UP]) * 6 / diagonal;

        if(!(mx < this.width / 2 || mx > canvas.width - this.width / 2)) {
			this.x = mx;
		}
		if(!(my < this.height / 2 || my > canvas.height - this.height / 2)) {
			this.y = my;
		}

    }
    //描画
    draw(ctx) {
        if(!(this.deffect && this.cnt % 2 ==0)){
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        }

        for(var i = 0;i < this.BULLET_NUM;i++) {
			if(this.bullet[i].exist) {      //存在するなら
				this.bullet[i].move();
				this.bullet[i].draw(ctx);
			}
		}

        if(this.cnt >100){
            this.cnt = 0;
            this.deffect = false;
        }
        this.cnt++; //高速でカウンタ上がってる
    }

    getBulletNum(){
        for(var i=0; i<this.BULLET_NUM; i++){
            if(!this.bullet[i].exist){  //存在しないなら
                return i;   //iを返す
            }
        }
        return -1;  //異常終了(関数がうまくいってない)
    }

    shot(key){
        var num;
        if(key[KEY_Z] ==1){     //Zキーが押されたなら
            num =this.getBulletNum();
            if(num != -1){  //-1(異常終了の値)でないなら
                this.bullet[num].enter(this.x,this.y, 4, 36, -Math.PI/2,10);
                key[KEY_Z]++;
            }
        }
    }
}

var player = new Player();
let ENEMY_NUM = 8;
var enemy = Array(ENEMY_NUM);
var kind = [1,0,0,0,2,0,0,1];

//	Enemyの初期化
for(var i = 0;i < ENEMY_NUM;i++) {
	enemy[i] = new Enemy(canvas.width * (i + 1) / 9, canvas.height / 4, Math.PI * 5 / 6 - Math.PI * 2 / 3 * i / 7, kind[i]);
}

var score =0;
var gameover = false;
var cnt = 0;

requestAnimationFrame(main);

function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    window.isKeyDown = {};

    if(!gameover){
    player.shot(key);
    player.move(key);
    player.draw(ctx);
    }
    for(var i = 0;i < ENEMY_NUM;i++) {
        enemy[i].shot();    // 敵が撃つ
		enemy[i].move();    // 敵を移動
		enemy[i].draw(ctx); // 敵を描画
	}
    if(!gameover){
        //敵とプレイヤーの当たり判定
        for(var i=0; i< ENEMY_NUM;i++){
            if(!player.deffect && Math.abs(player.x - enemy[i].x)< (player.width + enemy[i].width)/2 && 
                Math.abs(player.y - enemy[i].y)< (player.height + enemy[i].height)/2){
                    player.cnt = 0;
                    player.residue--;
                    player.deffect = true;
            }
        }

        //プレイヤーと敵の弾の当たり判定
        for(var i=0; i< ENEMY_NUM; i++){
            for(var j = 0;j<enemy[i].BULLET_NUM;j++){
                if(enemy[i].bullet[j].exist){
                    if(!player.deffect&& Math.abs(player.x - enemy[i].bullet[j].x)< (player.width + enemy[i].bullet[j].width)/2 && 
                        Math.abs(player.y - enemy[i].bullet[j].y)< (player.height + enemy[i].bullet[j].height)/2){
                            player.cnt = 0;
                            player.residue--;
                            player.deffect = true;
                    }   
                }
            }
        }

        //プレイヤーの弾と敵の当たり判定
        for(var i = 0;i < player.BULLET_NUM;i++) {
            if(player.bullet[i].exist) {
                for(var j = 0;j < ENEMY_NUM;j++) {
                    if(Math.abs(player.bullet[i].x - enemy[j].x) < (player.bullet[i].width + enemy[j].width) / 2 &&
                        Math.abs(player.bullet[i].y - enemy[j].y) < (player.bullet[i].height + enemy[j].height) / 2) {
                        enemy[j].x = canvas.width / 12 + Math.random() * canvas.width * 5 / 6; // ランダムなX座標に設定
                        enemy[j].y = canvas.height / 8; // Y座標を設定
                        enemy[j].angle = Math.PI * 2 * Math.random(); // ランダムな角度に設定
                        player.bullet[i].exist = false; // プレイヤーの弾を消す
                        switch(enemy[j].kind){
                            case 0: score+= 100; break;
                            case 1: score+= 200; break;
                            case 2: score+= 300; break;


                        }
                    }
                }
            }
        }
    }
    //残機が0になったら
    if(player.residue ==0){
        gameover = true;    //gameoverを起動する
        for(var i=0;i<player.BULLET_NUM;i++){
            player.bullet[i].exist = false;     //playerの弾の存在を消す
        }
    }

    //プレイヤーの残機を表示
    for(var i=0; i<player.residue;i++){
        ctx.fillStyle = "rgb(255, 0, 0)";
		ctx.fillRect(10 + i * 40, 60, player.width, player.height);
    }
    //スコアの表示
    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText("SCORE: "+ score,10,40);

    //	ゲームオーバー後の内容
	if(gameover) {
		//	GAME OVERと表示する
		ctx.font = "bold 60px sans-serif";
		ctx.fillStyle = "rgb(255, 100, 100)";
		ctx.fillText("GAME OVER...", canvas.width / 6, canvas.height / 2);
		
		//	Press Enter to Continueと表示する
		ctx.font = "bold 40px sans-serif";
		ctx.fillStyle = "rgba(255, 255, 255, " + (Math.sin(Math.PI * 2 * cnt / 200)) + ")";
		ctx.fillText("Press Enter to Continue", canvas.width / 6, canvas.height * 2 / 3);
		
		//	カウンタを更新
		cnt++;
		//	カウンタを200でリセットする
		if(cnt == 100) cnt = 0;	
	}

    requestAnimationFrame(main);
}


document.addEventListener("keydown", e =>{
    var keyCode = e.keyCode;
    switch(keyCode){
        case 39: key[KEY_RIGHT]=1; break;
        case 37: key[KEY_LEFT]=1; break;
        case 38: key[KEY_UP]=1; break;
        case 40: key[KEY_DOWN]=1; break; 
        case 90: key[KEY_Z]++; break;
        case 13:
            if(gameover){
                gameover =false;
                player.residue =3;
                player.deffect = false;
                player.x =canvas.width/2;
                player.y =canvas.height*3/4;
                score =0;

                for(var i=0; i< ENEMY_NUM; i++){
                    enemy[i] = new Enemy(canvas.width * (i + 1) / 9, canvas.height / 4, Math.PI * 5 / 6 - Math.PI * 2 / 3 * i / 7, kind[i]);
                }
            }
            break;
    }
});

document.addEventListener("keyup", e =>{
    var keyCode = e.keyCode;
    switch(keyCode){
        case 39: key[KEY_RIGHT]=0; break;
        case 37: key[KEY_LEFT]=0; break;
        case 38: key[KEY_UP]=0; break;
        case 40: key[KEY_DOWN]=0; break;
        case 90: key[KEY_Z]=0; break; 
    }
});