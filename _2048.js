var game={
  data:[],//存储所有单元格的数据的二维数组
  RN:4,//总行数
  CN:4,//总列数
  score:0,//保存当前分数
  state:1,//保存游戏状态：运行中，结束，动画播放中...
  RUNNING:1,//运行中
  GAMEOVER:0,//游戏结束
  getGridHTML:function(){//获得所有背景格的html代码
    for(var r=0,arr=[];r<this.RN;r++){
      for(var c=0;c<this.CN;c++){
	    arr.push(""+r+c);
	  }
    }
	return '<div id="g'+arr.join('" class="grid"></div><div id="g')+'" class="grid"></div>';
  },
  getCellHTML:function(){//获得所有前景格的html代码
    for(var r=0,arr=[];r<this.RN;r++){
      for(var c=0;c<this.CN;c++){
	    arr.push(""+r+c);
	  }
    }
	return '<div id="c'+arr.join('" class="cell"></div><div id="c')+'" class="cell"></div>';
  },

  start:function(){
	var panel=document.getElementById("gridPanel");
	panel.innerHTML=this.getGridHTML()+this.getCellHTML();
	//将panel的高度，设置为RN*116+16+"px"
	panel.style.height=this.RN*116+16+"px";
	//将panel的宽度，设置为CN*116+16+"px"
	panel.style.width=this.CN*116+16+"px";
	this.data=[];//清空旧数组
	//r从0开始，到<RN结束，每次+1
	for(var r=0;r<this.RN;r++){
	//  在data中压入一个空数组
	    this.data.push([]);
	//  c从0开始，到<CN结束，每次+1
	    for(var c=0;c<this.CN;c++){
	//      向data中r行，压入一个0
	        this.data[r].push(0);
	    }
	}
	this.score=0;//重新开始游戏时分数重置为0
	this.state=this.RUNNING;//重置游戏状态为运行中
	//找到id为gameOver的div，设置display属性为none
	document.getElementById("gameOver").style.display="none";
	this.randomNum();
	this.randomNum();
	this.updataView();
  },
  //在随机的不重复的位置生成一个2或4
  randomNum:function(){
    if(!this.isFull()){//不满时尝试生成随机数
	for(;;){
	  //在0~RN-1之间生成一个行下标，存在r中
	  var r=Math.floor(Math.random()*this.RN);
	  //在0~CN-1之间生成一个列下标，存在c中
	  var c=Math.floor(Math.random()*this.CN);
	  //如果data中r行c列等于0
	  if(this.data[r][c]==0){
	  //    生成一个0~1随机数
	  //      如果随机数>0.5，就在r行c列放入4
	  //                             否则放入2
	        this.data[r][c]=Math.random()>0.5?4:2;
	  //    退出循环
	        break;
		}
	}
   }
  },
  
  isFull:function(){
    for(var r=0;r<this.RN;r++){
	  for(var c=0;c<this.CN;c++){
	    if(this.data[r][c]==0){
		  return false;
		}
	  }
	}
	return true;
  },
 /***************左移*************************/ 
  moveLeft:function(){//左移所有行
    var before=this.data.toString();//移动前拍照
	for(var r=0;r<this.RN;r++){
	  this.moveLeftInRow(r);
	}
	var after=this.data.toString();//移动后拍照
	if(before!=after){//如果移动前后不相等
	  this.randomNum();//随机生成一个新数
	  this.updataView();//更新界面
	}
  },
  moveLeftInRow:function(r){//左移一行，传入要移动的行号
    for(var c=0;c<this.CN-1;c++){
	  var nextc=this.getNextInRow(r,c);
	  if(nextc==-1){
	    break;
	  }else{
	    if(this.data[r][c]==0){
		  this.data[r][c]=this.data[r][nextc];
		  this.data[r][nextc]=0;
		  c--;
		}else if(this.data[r][c]==this.data[r][nextc]){
		  this.data[r][c]*=2;
		  this.score+=this.data[r][c];//分数
		  this.data[r][nextc]=0;
		}
	  }
	}
  },
  getNextInRow:function(r,c){//找r行c列位置之后，不为0的下一个位置
    for(var nextc=c+1;nextc<this.CN;nextc++){
	  if(this.data[r][nextc]!=0){
	    return nextc;
	  }
	}
	return -1;
  },
 /****************右移************************/ 
  moveRight:function(){//右移所有行，同moveLeft
    var before=this.data.toString();
	for(var r=0;r<this.RN;r++){
	  this.moveRightInRow(r);
	}
	var after=this.data.toString();
	if(before!=after){
	  this.randomNum();
	  this.updataView();
	}
  },
  moveRightInRow:function(r){
    for(var c=this.CN-1;c>0;c--){
	  var prevc=this.getPrevInRow(r,c);
	  if(prevc==-1){
	    break;
	  }
	  else{
		  
	      if(this.data[r][c]==0){
	        this.data[r][c]=this.data[r][prevc];
		    this.data[r][prevc]=0;
		    c++;
	        }
	      else if(this.data[r][c]==this.data[r][prevc]){
	        this.data[r][c]*=2;
			this.score+=this.data[r][c];
		    this.data[r][prevc]=0;
	        }
	      }
	}
  },
  getPrevInRow:function(r,c){
    for(var prevc=c-1;prevc>=0;prevc--){
	  if(this.data[r][prevc]!=0){
	    return prevc;
	  }
	}
	return -1;
  },
 /****************上移************************/ 
  moveUp:function(){//上移所有列
    var before=this.data.toString();
	for(var c=0;c<this.CN;c++){
	  this.moveUpInCol(c);
	}
	var after=this.data.toString();
	if(before!=after){
	  this.randomNum();
	  this.updataView();
	}
  },
  moveUpInCol:function(c){
    for(var r=0;r<this.RN-1;r++){
	  var nextr=this.getNextInCol(r,c);
	  if(nextr==-1){
	    break;
	  }else{
	    if(this.data[r][c]==0){
		  this.data[r][c]=this.data[nextr][c];
		  this.data[nextr][c]=0;
		  r--;
		}else if(this.data[r][c]==this.data[nextr][c]){
		  this.data[r][c]*=2;
		  this.score+=this.data[r][c];
		  this.data[nextr][c]=0;
		}
	  }
	}
  },
  getNextInCol:function(r,c){
    for(var nextr=r+1;nextr<this.RN;nextr++){
	  if(this.data[nextr][c]!=0){
	    return nextr;
	  }
	}
	return -1;
  },
 /****************下移************************/ 
  moveDown:function(){//下移所有列
    var before=this.data.toString();
	for(var c=0;c<this.CN;c++){
	  this.moveDownInCol(c);
	}
	var after=this.data.toString();
	if(before!=after){
	  this.randomNum();
	  this.updataView();
	}
  },
  moveDownInCol:function(c){
    for(var r=this.RN-1;r>0;r--){
	  var prevr=this.getPrevInCol(r,c);
	  if(prevr==-1){
	    break;
	  }else{
	    if(this.data[r][c]==0){
		  this.data[r][c]=this.data[prevr][c];
		  this.data[prevr][c]=0;
		  r++;
		}else if(this.data[r][c]==this.data[prevr][c]){
		  this.data[r][c]*=2;
		  this.score+=this.data[r][c];
		  this.data[prevr][c]=0;
		}
	  }
	}
  },
  getPrevInCol:function(r,c){
    for(var prevr=r-1;prevr>=0;prevr--){
	  if(this.data[prevr][c]!=0){
	    return prevr;
	  }
	}
	return -1;
  },
  //将data数组中每个元素更新到页面div
  updataView:function(){
    for(var r=0;r<this.RN;r++){
		for(var c=0;c<this.CN;c++){
		  var divObj=document.getElementById("c"+r+c);
		  if(this.data[r][c]==0){
		    divObj.innerHTML="";
			divObj.className="cell";
		  }else{
		    divObj.innerHTML=this.data[r][c];
			divObj.className="cell n"+this.data[r][c];
		  }
		}
	}
	var span=document.getElementById("score");
	span.innerHTML=this.score;
	if(this.isGameOver()){
	  //设置当前游戏对象的状态为GAMEOVER
	  this.state=this.GAMEOVER;
	  //找到id为finalScore的span，将游戏的score放入
	  document.getElementById("finalScore").innerHTML=this.score;
	  //找到id为gameOver的div，设置display属性为block
	  document.getElementById("gameOver").style.display="block";
	}
  },
  isGameOver:function(){//判断游戏的状态
    //外层循环遍历行
	//	内层循环遍历列
	//		如果当前元素==0
	//			返回false
	//		否则，如果；列号<CN-1且当前元素==右侧元素
	//			返回false
	//		否则，如果行号<RN-1且当前元素==下方元素
	//			返回false
	//(遍历结束)返回true
	for(var r=0;r<this.RN;r++){
	  for(var c=0;c<this.CN;c++){
	    if(this.data[r][c]==0){
		  return false;
		}else if(c<this.CN-1&&(this.data[r][c]==this.data[r][c+1])){
		  return false;
		}else if(r<this.RN-1&&(this.data[r][c]==this.data[r+1][c])){
		  return false;
		}
	  }
	}
	return true;
  },
}
//当窗口加载后
window.onload=function(){
  game.start();
  /*键盘绑定事件*/
  document.onkeydown=function(){
    if(game.state==game.RUNNING){
		var e=window.event||arguments[0];
		var code=e.keyCode;
		//如果按的是向左的箭头，就调用左移方法
		//左37  上38  右39  下40
		if(code==37){
			game.moveLeft();
		}else if(code==39){
			game.moveRight();
		}else if(code==38){
			game.moveUp();
		}else if(code==40){
			game.moveDown();
		}
	}
  }
}