import { readFileSync } from 'fs';

interface Root {
    cameraDirection: number;  //equal
    cameraIpAddress: string;  //equal
    carDirection: string;     //equal
    carFrame: CarFrame;       //decode image,size
    carNumber: string;        // equal
    cleanFrame: CleanFrame;   //decode image, size
    country: string;  //equal
    direction: number;    //equal
    eventTime: string;  //valid
    generalFrame: GeneralFrame;  //decode image , size
    hasNoPlate: boolean; // equal , ignore if yes 
    isWrong: boolean;  // equal
    lpPictureFrame: LpPictureFrame; // decode and size 
    lpShape: number;  // equal
    perspectiveTracks: PerspectiveTrack[]; // ignore
    probability: number; // valid, 0.8<= p <= 1
    roadLine: number; // equal 
    speed: number; // equal , если не равно, выдаем разницу
    speedDebug: SpeedDebug; // +
    speedFrame: SpeedFrame; // decode , size
    speedLimit: number;  // equal
    violationId: number;  // equal
  }
  
  interface CarFrame {
    content: string;
    ext: string;
  }
  
  interface CleanFrame {
    content: string;
    ext: string;
  }
  
  interface GeneralFrame {
    content: string;
    ext: string;
  }
  
  interface LpPictureFrame {
    content: string;
    ext: string;
  }
  
  interface PerspectiveTrack {
    frameNum: number;
    time: number;
    x: number;
    y: number;
  }
  
  interface SpeedDebug {
    cameraHeight: number; // equal
    lpBoundingBox: LpBoundingBox; // equal
    lpHeight: number; // equal
    scale: number; // equal
    timestampDif: number; // equal
  }
  
  interface LpBoundingBox {
    leftBottom: LeftBottom;
    leftTop: LeftTop;
    rightBottom: RightBottom;
    rightTop: RightTop;
  }
  
  interface LeftBottom {
    x: number;
    y: number;
  }
  
  interface LeftTop {
    x: number;
    y: number;
  }
  
  interface RightBottom {
    x: number;
    y: number;
  }
  
  interface RightTop {
    x: number;
    y: number;
  }
  
  interface SpeedFrame {
    content: string;
    ext: string;
  }
  
  function parseJSONFromFile(filePath: string): Root {
    const fileContent = readFileSync(filePath, 'utf8');
    const jsonObject = JSON.parse(fileContent) as Root;
    return jsonObject;
  }

function compareJSONObjects(obj1: Root, obj2: Root): string[] {
  const variablesWithDifferentValues: string[] = [];

  if (parsedData1.cameraDirection !== parsedData2.cameraDirection) {
    variablesWithDifferentValues.push('cameraDirection');
    console.log("camera direction is not equal")
    variablesWithDifferentValues.push("hello")
  }
  
  if (parsedData1.cameraIpAddress !== parsedData2.cameraIpAddress) {
    variablesWithDifferentValues.push('cameraIpAddress');
  }
  
  if (parsedData1.carDirection !== parsedData2.carDirection) {
    variablesWithDifferentValues.push('carDirection');
  }
  
  if (parsedData1.carNumber !== parsedData2.carNumber) {
    variablesWithDifferentValues.push('carNumber');
  }
  
  if (parsedData1.country !== parsedData2.country) {
    variablesWithDifferentValues.push('country');
  }
  
  if (parsedData1.direction !== parsedData2.direction) {
    variablesWithDifferentValues.push('direction');
  }
  
  if (parsedData1.isWrong !== parsedData2.isWrong) {
    variablesWithDifferentValues.push('isWrong');
  }
  
  if (parsedData1.lpShape !== parsedData2.lpShape) {
    variablesWithDifferentValues.push('lpShape');
  }
  
  if (parsedData1.roadLine !== parsedData2.roadLine) {
    variablesWithDifferentValues.push('roadLine');
  }
  
  if (parsedData1.speedLimit !== parsedData2.speedLimit) {
    variablesWithDifferentValues.push('speedLimit');
  }
  
  if (parsedData1.violationId !== parsedData2.violationId) {
    variablesWithDifferentValues.push('violationId');
  }
  
  if (parsedData1.probability > 0.8 || parsedData1.probability > 1) {
    variablesWithDifferentValues.push('probability');
  }

  return variablesWithDifferentValues;
}


const filePath1 = '/Users/developer/Documents/ConfigureTests/fromNode.json';
const filePath2 = '/Users/developer/Documents/ConfigureTests/rightExample.json';

const parsedData1 = parseJSONFromFile(filePath1);
const parsedData2 = parseJSONFromFile(filePath2);

const variablesWithDifferentValues = compareJSONObjects(parsedData1, parsedData2);
console.log(variablesWithDifferentValues);