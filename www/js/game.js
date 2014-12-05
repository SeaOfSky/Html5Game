function Game() {
	var self = this;

	// Local game state variables
    this.bottomstage=5;
	this.currentClicks = 0;
	this.bestLevel = 1;
	this.clicksForBest = 0;
	this.totalClicks = 0;
	this.level = 1;
    this.rec=null;

	this.beginGame = function() {
		
	this.updateCounts();
    this.draw();
		
    var c=document.getElementById("myCanvas");
    c.addEventListener('click', function(e){
	var p;
    p = getEventPosition(e);
	var mouse=windowTocanvas(c,p.x,p.y);
	var width=(c.width-(self.level+1)*self.bottomstage)/(self.level);
    var row=width+self.bottomstage;
    var i=mouse.x%(parseInt(row));
	var j=mouse.y%(parseInt(row));
		//alert(width+" "+row+" "+i+" "+j);
	if(i>self.bottomstage&&j>self.bottomstage)
	{
		var index_i=parseInt(mouse.x/(row));
		var index_j=parseInt(mouse.y/(row));
		var index=index_j*self.level+index_i;
		//alert(index_i+" "+index_j+" "+index);
		self.repaint(index_i,index_j,index);
	}
    }, false);
        
	}
	
	this.repaint=function(x,y,index)
	{
		this.currentClicks++;
		this.totalClicks++;
		this.paint(x,y,this.rec[x*this.level+y]);
		//上下左右进行转换颜色
		
		//上
		if(x-1>=0)
			this.paint(x-1,y,this.rec[(x-1)*this.level+y]);
		//下
		if(x+1<this.level)
			this.paint(x+1,y,this.rec[(x+1)*this.level+y]);
		//左
		if(y-1>=0)
			this.paint(x,y-1,this.rec[x*this.level+y-1]);
		//右
		if(y+1<this.level)
			this.paint(x,y+1,this.rec[x*this.level+y+1]);
		if(this.iswin())
		{
			this.gameEnd();
			this.rec=null;
			alert("恭喜你，成功进入下一关！");
			setTimeout(this.draw(),1000);
			//this.draw();
		}
		this.updateCounts();
	}
	
	this.paint=function(i,j,color)
	{
		var c=document.getElementById("myCanvas");
        var cxt=c.getContext("2d");
		var width=(c.width-(this.level+1)*this.bottomstage)/(this.level);
		if(color===1)
		{
			cxt.fillStyle="#5C90FF";
			color=0;
		}
		else if(color===0){
			cxt.fillStyle="#E6AB5E";
			color=1;
		}
		cxt.fillRect(i*(width+this.bottomstage)+this.bottomstage,j*(width+this.bottomstage)+this.bottomstage,width,width);
		this.rec[i*this.level+j]=color;
		
	}
	
	this.gameEnd = function() {
		this.level++;
		if (this.level == this.bestLevel && this.totalClicks < this.clicksForBest) {
			this.clicksForBest = this.totalClicks;
		} 
		if (this.level > this.bestLevel) {
			this.clicksForBest = this.totalClicks;
			this.bestLevel = this.level;
		}
		this.currentClicks=0;
	}
		
	
	this.iswin=function()
	{
		var status=0;
		for(var i=0;i<this.level*this.level;i++)
			status +=this.rec[i];
		if(status===0)
			return true;
		else 
			return false;
	}
	
	this.draw=function()
	{
		var c=document.getElementById("myCanvas");
        var cxt=c.getContext("2d");
		var width=(c.width-(this.level+1)*this.bottomstage)/(this.level);
		
		cxt.clearRect(0,0,c.width,c.height);
		
		cxt.fillStyle="#4D4D4D";
        cxt.fillRect(0,0,c.height,c.width);
		cxt.fillStyle="#E6AB5E";
		this.rec=new Array(this.level*this.level);
		for(var i=0;i<this.level;i++)
			for(var j=0;j<this.level;j++)
			{
				cxt.fillRect(i*(width+this.bottomstage)+this.bottomstage,j*(width+this.bottomstage)+this.bottomstage,width,width);
				this.rec[i*this.level+j]=1;
			}
	}

	this.updateCounts = function() {
		$(".currLevel").html("当前级别: <b>" + this.level + "</b>");
		$(".score").html("当前点击次数: <b>" + this.currentClicks +"</b>");
		$(".best").html("历史最高级别: <b>" + this.bestLevel + "</b> (" + this.clicksForBest + " clicks)");
		$(".total").html("总计点击次数: <b>" + this.totalClicks + "</b>");
	}

	this.onNewGameClick = function() {
        var se=confirm("你确认要重新开始游戏吗？");
        if (se===true)
		{
			this.level=1;
			this.totalClicks=0;
			this.currentClicks=0;
			this.rec=null;
			this.draw();
			this.updateCounts();
		}
	}

	this.onResetLevelClick = function() {
	    var se=confirm("你确认要重新开始这一关吗？");
        if (se===true)
		{
			this.totalClicks=this.totalClicks-this.currentClicks;
			this.currentClicks=0;
			this.rec=null;
			this.draw();
			this.updateCounts();
		}
	}
	
	this.onGameRule=function(){
		alert("如何才算赢：使拼板全部变成蓝色。\
玩法：每个方块一面橙色，一面蓝色。点击一个方块，这个方块的颜色会翻转，并且，与它邻接的方块的颜色也会翻转。");
	}
}

function getEventPosition(ev){
var x, y;
if (ev.layerX || ev.layerX === 0) {
x = ev.layerX;
y = ev.layerY;
} else if (ev.offsetX || ev.offsetX === 0) { // Opera
x = ev.offsetX;
y = ev.offsetY;
}
return {x: x, y: y};

}

function windowTocanvas(canvas, x, y) {
   var bbox = canvas.getBoundingClientRect();
   return {
     x: x - bbox.left * (canvas.width / bbox.width), 
     y: y - bbox.top * (canvas.height / bbox.height)
   };

}