const canvas=document.querySelector('#canvas');
const ctx=canvas.getContext('2d');
canvas.height=window.innerHeight;
canvas.width=window.innerWidth;
function resizeCanvas(){
    canvas.height=window.innerHeight;
    canvas.width=window.innerWidth;
    init();
}
window.addEventListener('resize',resizeCanvas);

let borderWidth=50;
let keys=new Map();
let p1score=0;
let p2score=0;
let margin=window.innerWidth/10;
let paddleWidth=window.innerWidth/100;
let paddleHeight=window.innerHeight/8;
function rand(min,max)
{
    return (Math.random()*(max-min+1)+min);
}
function abs(val)
{
    if(val<0)
    return -val;
    else
    return val;
}
let velocities=[-3,-2,2,3];

class _paddle{
    constructor(UP_CONTROL,DOWN_CONTROL,X_POS){
        this.up=UP_CONTROL;
        this.down=DOWN_CONTROL;
        this.width=paddleWidth;
        this.height=paddleHeight;
        this.x=X_POS;
        this.yvel=5;
        this.y=(window.innerHeight-this.height)/2;
        this.input='';
    }
    draw(){
        ctx.fillStyle='white';
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    update(){
        if(keys[this.up]&&!keys[this.down]&&this.y-this.yvel>=borderWidth/2)
            this.y-=this.yvel;
        else if(keys[this.down]&&!keys[this.up]&&this.y+this.yvel+this.height<=window.innerHeight-borderWidth/2)
            this.y+=this.yvel;
        this.input='';
        this.draw();
    }
    get ycord(){
        return this.y;
    }
    get xcord(){
        return this.x;
    }
}

let p1=new _paddle('w','s',margin);
let p2=new _paddle('ArrowUp','ArrowDown',window.innerWidth-margin);


class _ball{
    constructor(){
    this.x=window.innerWidth/2; 
    this.radius=10;
    this.y=window.innerHeight/2-this.radius;
    this.xvel=0;
    this.yvel=0;
    this.printIns=true;
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle='rgb(240,240,240)';
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
    update(){
        if(this.y+this.yvel-this.radius<=borderWidth/2)
        this.yvel*=-1;
        if(this.y+this.yvel+this.radius>=window.innerHeight-borderWidth/2)
        this.yvel*=-1;
        if(this.x-this.radius+this.xvel<=p1.x)
        {
            p2score++;
            this.x=window.innerWidth/2;
            this.y=window.innerHeight/2-this.radius;
            this.xvel=0;
            this.yvel=0;
            this.printIns=true;
        }
        else if(this.x+this.radius+this.xvel>=p2.x+paddleWidth)
        {
            p1score++;
            this.x=window.innerWidth/2;
            this.y=window.innerHeight/2-this.radius;
            this.xvel=0;
            this.yvel=0;
            this.printIns=true;
        }
        if(keys[" "]&&this.xvel==0&&this.yvel==0)
            {
                this.xvel=velocities[Math.floor(rand(0,3))];
                this.yvel=velocities[Math.floor(rand(0,3))];
                this.printIns=false;
            }
        if(this.x-this.radius+this.xvel>=p1.x&&this.x-this.radius+this.xvel<=p1.x+paddleWidth)
        {
            if(this.y+this.yvel+this.radius>=p1.y&&this.y+this.yvel-this.radius<=p1.y+paddleHeight)
            this.xvel*=-1;
        }
        
        if(this.x+this.radius+this.xvel>=p2.x&&this.x+this.radius+this.xvel<=p2.x+paddleWidth)
        {
            if(this.y+this.yvel+this.radius>=p2.y&&this.y+this.yvel-this.radius<=p2.y+paddleHeight)
            this.xvel*=-1;
        }
        if(this.printIns)
        {
            ctx.font="40px Century Gothic";
            ctx.fillStyle='white';
            ctx.fillText('Press Space To Start',window.innerWidth/2-200,window.innerHeight-borderWidth-100);
        }
        this.x+=this.xvel;
        this.y+=this.yvel;
        this.draw();
    }
}
let ball=new _ball();

function init(){
    ball=new _ball();
    margin=window.innerWidth/10;
    paddleWidth=window.innerWidth/100;
    paddleHeight=window.innerHeight/8;
    p1=new _paddle('w','s',margin);
    p2=new _paddle('ArrowUp','ArrowDown',window.innerWidth-margin);
}

window.addEventListener('keydown',(e)=>{
    keys[e.key]=true;
});
window.addEventListener('keyup',(e)=>{
    keys[e.key]=false;
});

function draw(){
p1.update();
p2.update();
ball.update();
/******Renders Border******/
ctx.beginPath();
ctx.strokeStyle='rgba(255,255,255,0.5)';
ctx.lineWidth=borderWidth;
ctx.rect(0,0,window.innerWidth,window.innerHeight);
ctx.stroke();
ctx.closePath();
/*************************/
ctx.lineWidth=1;
ctx.font = "40px Century Gothic";
ctx.fillStyle='white';
ctx.fillText(`P1 Score : ${p1score}`,window.innerWidth/2-111,borderWidth+window.innerHeight/10);
ctx.fillText(`P2 Score : ${p2score}`,window.innerWidth/2-111,borderWidth+window.innerHeight/10+50);
}

function animate(){
    ctx.fillStyle='black';
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    draw();
    requestAnimationFrame(animate);
}
animate();