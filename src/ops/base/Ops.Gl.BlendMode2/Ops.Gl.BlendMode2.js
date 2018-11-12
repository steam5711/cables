var exec=op.inTrigger("Render");
var inBlend=op.inValueSelect("Blendmode",
    [
        'None',
        'Normal',
        'Add',
        'Subtract',
        'Multiply'
    ],'Normal');
var inPremul=op.inValueBool("Premultiplied");
var next=op.outTrigger("Next");

var cgl=op.patch.cgl;
var blendMode=0;

inBlend.onChange=update;
update();

function update()
{
    if(inBlend.get()=="Normal")blendMode=CGL.BLEND_NORMAL;
    else if(inBlend.get()=="Add")blendMode=CGL.BLEND_ADD;
    else if(inBlend.get()=="Subtract")blendMode=CGL.BLEND_SUB;
    else if(inBlend.get()=="Multiply")blendMode=CGL.BLEND_MUL;
    else blendMode=CGL.BLEND_NONE;
}

exec.onTriggered=function()
{
    cgl.pushBlendMode(blendMode,inPremul.get());
    next.trigger();
    cgl.popBlendMode();
    
	cgl.gl.blendEquationSeparate( cgl.gl.FUNC_ADD, cgl.gl.FUNC_ADD );
	cgl.gl.blendFuncSeparate( cgl.gl.SRC_ALPHA, cgl.gl.ONE_MINUS_SRC_ALPHA, cgl.gl.ONE, cgl.gl.ONE_MINUS_SRC_ALPHA );
};
