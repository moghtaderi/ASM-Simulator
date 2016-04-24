const ipcRenderer = require('electron').ipcRenderer;


// var attribute = {
//   multiplier : 1.0,    //increases probability when higher - minimum is 1
//   weight : 0.5,    //increases when primed; affects probability
// };
//
// function attribute
//
// attribute.probability() = this.multiplier * this.weight;

class attribute {
   constructor(weight, multiplier){
      this.weight = weight;
      this.multiplier = multiplier;
   }

   get probability(){
      return this.calcProbability();
   }

   calcProbability() {
      return this.weight * this.multiplier;
   }
}

var dominantAttributeWeights = [];
var secondartAttributeWeights = [];


var attributeCount = 50;
var primingMethod = 'Word';
var resistanceLevel = 80;
var attributeWeightRep = 'Decimals';
var attributeWeightIncrement = 0.354;
// var weightDirstibution = 'Randomized';
var decayTime = 5;
var decayTimeMultiplier = 20;


var dominantMeaning = 'Air';
var secondaryMeaning = 'Heir';
var baseline = 0.74;
var selectionThreshold = 0.6;


//numNodes:int - number of nodes in each array
//ratio: double - arr1/arr2
function randomInit(numNodes,ratio,arr1,arr2)
{
  for(i=0;i < numNodes;i++) {
    arr1[i].weight=Math.random();
    if(arr1[i].weight/ratio>1)
      arr2[i].weight=arr1[i].weight*ratio;
    else arr2[i].weight=arr1[i].weight/ratio;
  }
}

function generateArray(count) {

   dominantAttributeWeights = [];
   secondartAttributeWeights = [];

   for (var i = 0; i < count; i++) {
      dominantAttributeWeights.push(i);
      secondartAttributeWeights.push(i*2);
   }
}

function reloadAttributes(){
   var dominantMeaning = document.getElementById('dominantMeaning');
   var secondaryMeaning = document.getElementById('secondaryMeaning');
   dominantMeaning.innerHTML = '';
   secondaryMeaning.innerHTML = '';
   for (var i = 0; i < attributeCount; i++) {
      dominantMeaning.innerHTML +=   '<div class="w-clearfix attribute"><div class="attributeweight">'+dominantAttributeWeights[i]+'</div></div>';
      secondaryMeaning.innerHTML +=  '<div class="w-clearfix attribute"><div class="attributeweight">'+secondartAttributeWeights[i]+'</div></div>';
   }
}

function showParameters(){
   ipcRenderer.send('showSettings', {attributeCount : attributeCount,
                                      primingMethod : primingMethod,
                                    resistanceLevel : resistanceLevel,
                                 attributeWeightRep : attributeWeightRep,
                           attributeWeightIncrement : attributeWeightIncrement,
                                 // weightDirstibution : weightDirstibution,
                                          decayTime : decayTime,
                                decayTimeMultiplier : decayTimeMultiplier});
}

function showTutorial(){
   ipcRenderer.send('showTutorial');
}

function showDataIO(){
   ipcRenderer.send('showDataPage', {dominantMeaning : dominantMeaning,
                                    secondaryMeaning : secondaryMeaning,
                                            baseline : baseline,
                                  selectionThreshold : selectionThreshold});
}

ipcRenderer.on('new-Settings', function (event, args) {
   attributeCount = args.attributeCount;
   primingMethod = args.primingMethod;
   resistanceLevel = args.resistanceLevel;
   attributeWeightRep = args.attributeWeightRep;
   attributeWeightIncrement = args.attributeWeightIncrement;
   // weightDirstibution = args.weightDirstibution;
   decayTime = args.decayTime;
   decayTimeMultiplier = args.decayTimeMultiplier;
   generateArray(attributeCount);
   reloadAttributes();
});

ipcRenderer.on('new-Data', function (event, args) {
   dominantMeaning = args.dominantMeaning;
   secondaryMeaning = args.secondaryMeaning;
   baseline = args.baseline;
   selectionThreshold = args.selectionThreshold;

   document.getElementById('dominantMeaningTicker').innerHTML = 'Dominant Meaning/Spelling: &nbsp;'+dominantMeaning;
   document.getElementById('secondaryMeaningTicker').innerHTML = 'Secondary Meaning/Spelling: &nbsp;'+secondaryMeaning;

   var adjustedBaseline;
   var adjustedMeaning;
   if(baseline<0.5){
      adjustedBaseline = 100*(1-baseline);
      adjustedMeaning = 'Secondary';
   }else{
      adjustedBaseline = 100*baseline;
      adjustedMeaning = 'Dominant';
   }

   document.getElementById('currentSelection').innerHTML = 'Current Selection: &nbsp;'+adjustedMeaning+' - '+adjustedBaseline+'%';

   generateArray(attributeCount);
   reloadAttributes();
});

window.onload = function () {
   // first function to get called...
   generateArray(attributeCount);
   reloadAttributes();
};
