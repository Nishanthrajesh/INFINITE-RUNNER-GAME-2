var jumpmp3,diemp3,scoremp3;
var flag = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var applausesound;

var obstacle;


var gameOverImg,restartImg



function preload()
{
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");

  bgImg = loadImage("backgroundImg.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpmp3=loadSound("jump.mp3");
  diemp3=loadSound("die.mp3");
  scoremp3=loadSound("checkPoint.mp3");
  
  
}

function setup() 
{
  createCanvas(600,600);
  
  trex = createSprite(150,380);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.09;
  
  ground = createSprite(200,480,400,20);
  ground.addImage("ground",groundImage);
  ground.x = width/2;
  
  gameOver = createSprite(60,160);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/5-48,height/3);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,480,400,5);
  invisibleGround.visible = false;

  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
   
  trex.setCollider("circle",0,0,250);
  score = 0;
  
}

function draw() 
{
  
  background(bgImg);

  text("Score: "+ score,230,ground.y-410);

  camera.x = trex.x

   spawnObstacles();
  
  if(gameState === PLAY)
  {
    gameOver.visible = false
    restart.visible = false
    trex.x = 50

    ground.velocityX = -(4+score/600);

    if(score%500===0 && score>0)
      {
        scoremp3.play();
      }
       
    score = score + Math.round(frameCount/60);
    
    if (ground.x < 0)
    {
      ground.x = width/2;
      ground.width = ground.width*5
    }

    if(keyDown("space")&& trex.y >= 415)
    {
        trex.velocityY = -10;
        jumpmp3.play();
    }

    trex.velocityY = trex.velocityY + 1

    spawnClouds();

    if(obstaclesGroup.isTouching(trex))
    {
       diemp3.play();
      gameState = END;
    }
  }
  if (gameState === END)
  {
     ground.velocityX = 0;
     trex.velocityY = 0
     trex.changeAnimation("collided", trex_collided);
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     cloudsGroup.destroyEach();
     obstaclesGroup.destroyEach();
     ground.visible = false;
     trex.visible = false;
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);

     if(score >= 10000)
     {
      textFont("Arial Black");
      fill("black")
      textSize(38)
      text("Great Job",-230,345)
     }

     textFont("Arial Black");
     fill("black")
     textSize(38)
     text("Your total score : " + score,-230,300)
     text("Try Again",-230,400)
  }

  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnObstacles()
{
 if (frameCount % 60 === 0)
 {
    obstacle = createSprite(600,ground.y-20,30,30);
   obstacle.velocityX = -(6+score/150);

    var rand = Math.round(random(1,6));
    switch(rand)
    {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
         
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() 
{

  if (frameCount % 60 === 0) 
  {
     cloud = createSprite(600,60,40,10);
    cloud.y = Math.round(random(10,60));

    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -9;
    

    cloud.lifetime = 600;
    

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

   cloudsGroup.add(cloud);
  }
}

