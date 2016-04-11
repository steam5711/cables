
var rframes=0;
var rframeStart=0;

if(!this.patch.cgl)
{
    console.log(' no cgl!');
}

var patch=this.patch;
var cgl=this.patch.cgl;

this.name='renderer';

var trigger=this.addOutPort(new Port(this,"trigger",OP_PORT_TYPE_FUNCTION));
var width=this.addOutPort(new Port(this,"width",OP_PORT_TYPE_VALUE));
var height=this.addOutPort(new Port(this,"height",OP_PORT_TYPE_VALUE));

var identTranslate=vec3.create();
vec3.set(identTranslate, 0,0,0);
var identTranslateView=vec3.create();
vec3.set(identTranslateView, 0,0,-2);

this.onDelete=function()
{
    cgl.gl.clearColor(0,0,0,0);
    cgl.gl.clear(cgl.gl.COLOR_BUFFER_BIT | cgl.gl.DEPTH_BUFFER_BIT);

    op.patch.removeOnAnimFrame(op);
};

this.onAnimFrame=function(time)
{
    if(cgl.aborted || cgl.canvas.clientWidth===0 || cgl.canvas.clientHeight===0)return;

    if(cgl.canvasWidth==-1)
    {
        cgl.setCanvas(op.patch.config.glCanvasId);
        return;
    }

    if(cgl.canvasWidth!=cgl.canvas.clientWidth || cgl.canvasHeight!=cgl.canvas.clientHeight)
    {
        cgl.canvasWidth=cgl.canvas.clientWidth;
        width.set(cgl.canvasWidth);
        cgl.canvasHeight=cgl.canvas.clientHeight;
        height.set(cgl.canvasHeight);
    }

    if(Date.now()-rframeStart>1000)
    {
        CGL.fpsReport=CGL.fpsReport||[];
        if(patch.loading.getProgress()>=1.0 && rframeStart!==0)CGL.fpsReport.push(rframes);
        rframes=0;
        rframeStart=Date.now();
    }
    

    cgl.renderStart(cgl,identTranslate,identTranslateView);
    trigger.trigger();

    if(CGL.Texture.previewTexture)
    {
        if(!CGL.Texture.texturePreviewer) CGL.Texture.texturePreviewer=new CGL.Texture.texturePreview(cgl);
        CGL.Texture.texturePreviewer.render(CGL.Texture.previewTexture);
    }
    cgl.renderEnd(cgl);
    
    if(!cgl.frameStore.phong)cgl.frameStore.phong={}
    // cgl.frameStore.phong.lights={};
    rframes++;

    
};
