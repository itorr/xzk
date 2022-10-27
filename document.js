
const width = 1200;



const canvas = document.createElement('canvas');

canvas.width = width;
canvas.height = width;

const ctx = canvas.getContext('2d');

const [ generateBtn, saveBtn ] = document.querySelectorAll('button');


const [ text1El, text2El, tipEl ] = document.querySelectorAll('input[name]');

const outputImageEl = document.querySelector('.output-box img');


const canvasBox = document.createElement('div');
canvasBox.className = 'canvas-box';
document.body.appendChild(canvasBox);
canvasBox.appendChild(canvas);


const measureText = (ctx,text,fontSize)=>{
    const metrics = ctx.measureText(text);

    const width = Math.ceil(metrics.width);
    const height = (metrics.fontBoundingBoxDescent + metrics.fontBoundingBoxAscent) || fontSize;
    // || (metrics.actualBoundingBoxDescent + metrics.actualBoundingBoxAscent )

    // console.log(metrics)
    return {
        metrics,
        width,
        height
    }
}
const textCanvas = document.createElement('canvas');
canvasBox.appendChild(textCanvas);
const generateTextCanvas = (text,fontSize,isBox)=>{
    const ctx = textCanvas.getContext('2d');
    
    const setCtxConfig = ctx=>{
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000';
        ctx.lineCap  = 'round';
        ctx.lineJoin = 'round';
        ctx.textAlign = 'left';
    }
    textCanvas.style.lineHeight = `${fontSize}px`;

    setCtxConfig(ctx);
    const {
        metrics,
        width,
        height
    } = measureText(ctx,text,fontSize);

    let maxWidth;

    if(isBox){
        maxWidth = fontSize
    }

    textCanvas.width = isBox?fontSize:width;
    textCanvas.height = height//fontSize;//height;

    setCtxConfig(ctx);

    ctx.fillText(text,0,height/2,maxWidth);

    return textCanvas
    
}

const perspective = 0.15;
const textGlfxCanvas = fx.canvas();
const generatePerspectiveTextCanvas = textCanvas=>{
    const textMargin = textCanvas.width * perspective;
    const texture = textGlfxCanvas.texture(textCanvas);
    textGlfxCanvas.draw(texture).perspective(
        [
            0,0,
            textCanvas.width,0,
            0,textCanvas.height,
            textCanvas.width,textCanvas.height
        ], 
        [
            0,0,
            textCanvas.width,0,
            textMargin,textCanvas.height,
            textCanvas.width - textMargin,textCanvas.height
        ]
    ).update()
    return textGlfxCanvas
}
let lastGenerateTexts;
const getTexts = _=>{
    const text1 = text1El.value.trim() || text1El.getAttribute('placeholder');
    const text2 = text2El.value.trim();
    const tip = tipEl.value.trim() || tipEl.getAttribute('placeholder');
    return [text1,text2,tip];
}
const generate = _=>{
    const texts = getTexts();
    const [text1,text2,tip] = texts;

    const generateTexts = texts.join(',');

    if(lastGenerateTexts === generateTexts) return;

    lastGenerateTexts = generateTexts;

    ctx.fillStyle = '#FFF';
    ctx.fillRect(0,0,width,width);

    const text1Canvas = generateTextCanvas(text1,1200,1);
    const text1GlfxCanvas = generatePerspectiveTextCanvas(text1Canvas);
    ctx.drawImage(
        text1GlfxCanvas,
        0,0,
        text1GlfxCanvas.width,
        text1GlfxCanvas.height,
        width * 0.2,width * -0.22,
        width * 0.6, width * 1.21
    );
    // ctx.setTransform(1,0,.2,1,0,0);
    // ctx.drawImage(
    //     text1Canvas,
    //     0,0,
    //     text1Canvas.width,text1Canvas.height,
    //     margin,0,
    //     textWidth,textHeight
    // );

    if(text2){
        const text2Canvas = generateTextCanvas(text2,1000,1);
        const text2GlfxCanvas = generatePerspectiveTextCanvas(text2Canvas);
        ctx.save();

        ctx.translate(width,0)
        ctx.rotate(90 * Math.PI / 180);
        ctx.drawImage(
            text2GlfxCanvas,
            0,0,
            text2GlfxCanvas.width,
            text2GlfxCanvas.height,
            width * 0.16,width * -0.22,
            width * 0.6, width * 1.3
        );
        ctx.restore();
    }

    


    ctx.save();

    ctx.font = `bold 120px sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';
    ctx.textAlign = 'center';

    ctx.fillText(
        tip,
        width / 2, width * 0.917,
        width * 0.8
    );
    ctx.restore();

    outputImageEl.src = canvas.toDataURL();

    oninput();
};

const oninput = _=>{
    const texts = getTexts();
    const generateTexts = texts.join(',');

    const haveUpdate = lastGenerateTexts === generateTexts;

    generateBtn.disabled = haveUpdate;
};

generate();

generateBtn.onclick = generate

text1El.oninput = oninput;
text2El.oninput = oninput;
tipEl.oninput = oninput;