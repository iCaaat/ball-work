
// 设置画布
 const canvas = document.querySelector('canvas');
 const ctx = canvas.getContext('2d');
 
 const width = canvas.width = window.innerWidth;
 const height = canvas.height = window.innerHeight;
 

 const backgroundImage = new Image();
backgroundImage.src = 'img/background.jpg'; // 这里是背景图片的路径

backgroundImage.onload = function() {
  // 在 canvas 上绘制背景图像
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
};

 // 生成随机数的函数
 
 function random(min,max) {
   const num = Math.floor(Math.random() * (max - min)) + min;
   return num;
 }
 
 // 生成随机颜色
 function randomColor() {
   return (
     "rgb(" +
     random(0, 255) +
     ", " +
     random(0, 255) +
     ", " +
     random(0, 255) +
     ")"
   );
 }

 // Shape构造器
 function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = true;
}

 // Ball构造器，继承Shape
 function Ball(x, y, velX, velY, color, size, exists) {
   Shape.call(this, x, y, velX, velY, exists);
   this.color = color;
   this.size = size;
 }

 Ball.prototype = Object.create(Shape.prototype);
 Ball.prototype.constructor = Ball;

 Ball.prototype.draw = function () {
   ctx.beginPath();
   ctx.fillStyle = this.color;
   ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
   ctx.fill();
 };
 
 Ball.prototype.update = function () {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }
  
    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }
  
    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }
  
    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }
  
    this.x += this.velX;
    this.y += this.velY;
    
  };

  
  Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
      if (this !== balls[j]) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = randomColor();
        }
      }
    }
  };
  

  //定义EvilCircle构造器，继承Shape构造器
  function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, 20, 20, exists);
    this.color = "white";
    this.size = 10;
  }

  EvilCircle.prototype = Object.create(Shape.prototype);
  EvilCircle.prototype.constructor = EvilCircle;

  EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // EvilCircle边界检测
  EvilCircle.prototype.checkBounds = function () {
    // 检查并调整 x 坐标
    if (this.x + this.size >= width) {
      this.x = width - this.size;    // 超出右边界时将 x 调整至边界内
    }
    if (this.x - this.size <= 0) {
      this.x = this.size;            // 超出左边界时将 x 调整至边界内
    }
  
    // 检查并调整 y 坐标
    if (this.y + this.size >= height) {
      this.y = height - this.size;   // 超出下边界时将 y 调整至边界内
    }
    if (this.y - this.size <= 0) {
      this.y = this.size;            // 超出上边界时将 y 调整至边界内
    }
  };

  // EvilCircle移动
  EvilCircle.prototype.setControls = function () {
    window.onkeydown = (e) => {
      switch (e.key) {
        case "a":        // 左移
          this.x -= this.velX;
          break;
        case "d":        // 右移
          this.x += this.velX;
          break;
        case "w":        // 上移
          this.y -= this.velY;
          break;
        case "s":        // 下移
          this.y += this.velY;
          break;
      }
    };
  };

  // EvilCircle与Ball碰撞检测
EvilCircle.prototype.collisionDetect = function () {
  for (const ball of balls) {
    if (ball.exists) {
      const dx = this.x - ball.x;
      const dy = this.y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + ball.size) {
        ball.exists = false;
        ballCount--;
        scoreDisplay.textContent = `还剩多少个球：${ballCount}`;
      }
    }
  }
};
  
  

  let balls = [];

while (balls.length < 25) {
  let size = random(5, 25);
  let ball = new Ball(
    // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomColor(),
    size,
    true
  );
  balls.push(ball);
}


// 创建恶魔圈的对象实例
const evilCircle = new EvilCircle(random(0, width), random(0, height), true);
evilCircle.setControls();

// 获取 <p> 元素引用
const scoreDisplay = document.querySelector('p');

// 初始化小球数量
let ballCount = balls.length;
scoreDisplay.textContent = `还剩多少个球：${ballCount}`;

// 创建小球时增加数量并更新显示
function addBall(ball) {
  balls.push(ball);
  ballCount++;
  scoreDisplay.textContent = `还剩多少个球：${ballCount}`;
}

function loop() {
  // 每次循环之前清空 canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
    
  // 绘制背景
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0, 0.30)";
  ctx.fillRect(0, 0, width, height);

  // 遍历每个小球，只有在小球存在时才调用绘制、更新和碰撞检测
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  // 调用恶魔圈的方法
  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop);
}

  loop();



  
 
 
 