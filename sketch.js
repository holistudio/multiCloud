//canvas
let canvasW = 850;
let canvasH = 1100;

//grid
let rows = 3;
let cols = 2;
let cellULCorner = [0,0];
let cellH = canvasH/rows;
let cellW = canvasW/cols;

let k=0;
let l=0;

//cloud circle parameters
let minDia = cellH/5;
let minSpacing = 40*cellW/400;
let maxSpacing = 55*cellW/400;
let maxVert = 15;
let diameterArray =[];
let spacingArray = [];
let verticalPos = [];
var start = {x: 110*cellW/400, y:cellH/2};


function fillHsluv(h, s, l) {
  var rgb = hsluv.hsluvToRgb([h, s, l]);
  fill(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

function strokeHsluv(h, s, l) {
  var rgb = hsluv.hsluvToRgb([h, s, l]);
  stroke(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

function colorHsluv(h, s, l) {
  var rgb = hsluv.hsluvToRgb([h, s, l]);
  return color(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

function setup() {
  createCanvas(canvasW, canvasH);
}

function draw() {
  //generate one or two clouds (50-50 chance)
  for(var i=0; i<round(random(1,2)); i++){
    //randomly choose first diameter
    diameterArray.push(random(minDia,cellH*120/400));
    //second diameter should be greater
    diameterArray.push(random(diameterArray[diameterArray.length-1]*1.1,diameterArray[diameterArray.length-1]*1.75));
    //third diameter can be greater or less than second diameter
    diameterArray.push(random(minDia,diameterArray[diameterArray.length-1]*1.1));
    //fourth diameter should be less than third
    diameterArray.push(random(diameterArray[diameterArray.length-1]*0.5,diameterArray[diameterArray.length-1]*0.8));
  }

  //spacing horizontal and vertical for circles
  for(i=0;i<diameterArray.length-1;i++){
    verticalPos.push(random(maxVert*-1,maxVert));
    spacingArray.push(random(minSpacing,maxSpacing));
  }

  //future conditional spacing algorithm
  //based on first diameter determine spacing
  //spacing should be greater than first radius
  //second radii should be greater than first spacing
  //second spacing should be less than second and third radii
  //third spacing should be less than third and fourth radii

  noStroke();

  //sky
  let skyTypes = ['day','day', 'day','sunset','sunset', 'techno'];
  let skyTypeSel = skyTypes[round(random(skyTypes.length-1))];
  let skyLight;
  let skyColor;

  if(skyTypeSel=='day'){
    skyLight = random(55,95);
    skyColor= colorHsluv(230, random(80,100), skyLight);
  }
  else if(skyTypeSel=='sunset'){
    skyLight = random(25,40);
    skyColor= colorHsluv(random(235,315), random(60,80), skyLight);
  }
  else{
    skyColor= colorHsluv(230, 0,0);
  }
  fill(skyColor);
  rect(cellULCorner[0],cellULCorner[1],cellW,cellH);

  //cloud color
  let cloudLight;
  let cloudHue;
  if (skyLight>75){
    cloudLight=lerp(100,95,(skyLight-55)/40);
  }
  else{
    if(skyTypeSel=='day'){
      cloudLight=lerp(100,85,(skyLight-55)/40);
    }
    else{
      cloudLight=lerp(85,70,(skyLight-25)/15);
    }
  }
  if(skyTypeSel=='day'){
    fillHsluv(230, 0, cloudLight);
  }
  else if(skyTypeSel=='sunset'){
    cloudHue=random(330,355)-round(random(1))*325;
     fillHsluv(cloudHue, random(40,65), cloudLight);
  }
  else{
    noFill();
    stroke(color(255, 255, 255));
  }

  //draw clouds
  let center = {x: start.x+cellULCorner[0], y: start.y+cellULCorner[1]};
  let cloudScale = 1;
  for(i=0; i<diameterArray.length;i++){
    if(i>0 && i%4==0){
      //second cloud
        //vertically above or below
        //scale range between 0.9 and 1.1 of the previous
      start = {x: start.x+(-1*round(random(0,1)))*random(30,50),
               y: start.y+(-1*round(random(0,1)))*random(30,50)};
      cloudScale = random(0.9,1.1);
      center = {x: start.x+cellULCorner[0], y: start.y+cellULCorner[1]};
      if(skyTypeSel=='day'){
        //shade should be lighter if first one is dark and vice versa
        if(cloudLight>85){
        fillHsluv(230, 0, cloudLight-random(10,20));
        }
        else{
          fillHsluv(230, 0, cloudLight+random(10,20));
        }
      }
      else if(skyTypeSel=='sunset'){
        fillHsluv(cloudHue+random(-5,5), random(60,65), cloudLight+random(-10,5));
      }
      else{
        noFill();
      }
    }
    circle(center.x, center.y, cloudScale*diameterArray[i]);
    center.x = center.x+spacingArray[i];
    center.y = start.y+cellULCorner[1]+cloudScale*verticalPos[i];

  }

  if(l<cols){
    //shift to the next cell on the right in the same row
    cellULCorner[0] = cellULCorner[0]+ cellW;
    l++;
  }
  else{
    //shift one row down to the left most cell
    cellULCorner = [0,cellULCorner[1]+cellH];
    l=0;
    k++;
    if(k>=rows){
      noLoop();
    }
  }

  //reset variables for next cell's clouds
  diameterArray =[];
  spacingArray = [];
  verticalPos = [];
  start = {x: 110*cellW/400, y:cellH/2};
}
