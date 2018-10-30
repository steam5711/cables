var cgl=op.patch.cgl;

var render=op.inTrigger('render');
var trigger=op.outTrigger('trigger');

var inInvert=op.inValueBool("Invert");
var inBlackWhite=op.inValueBool("Black White");



var threshold=op.addInPort(new CABLES.Port(op,"amthresholdount",CABLES.OP_PORT_TYPE_VALUE,{display:'range'}));
threshold.set(0.5);

var shader=new CGL.Shader(cgl);


var srcFrag=''

    .endl()+'IN vec2 texCoord;'
    .endl()+'uniform sampler2D tex;'
    .endl()+'uniform float threshhold;'

    .endl()+'uniform sampler2D text;'

    .endl()+'void main()'
    .endl()+'{'
    .endl()+'   vec4 col = texture2D(text, texCoord );'

    .endl()+'   float gray = dot(vec3(0.2126,0.7152,0.0722), col.rgb );'

    .endl()+'   #ifndef INVERT'
    .endl()+'       if(gray < threshhold) col.r=col.g=col.b=col.a=0.0;'
    .endl()+'   #ifdef BLACKWHITE'
    .endl()+'       else col.r=col.g=col.b=col.a=1.0;'
    .endl()+'   #endif'

    .endl()+'   #endif'
    .endl()+'   #ifdef INVERT'
    .endl()+'       if(gray > threshhold) col.r=col.g=col.b=col.a=0.0;'
    .endl()+'   #ifdef BLACKWHITE'
    .endl()+'       else col.r=col.g=col.b=col.a=1.0;'
    .endl()+'   #endif'
    .endl()+'   #endif'

    .endl()+'   outColor= col;'
    .endl()+'}';


shader.setSource(shader.getDefaultVertexShader(),srcFrag);
var textureUniform=new CGL.Uniform(shader,'t','tex',0);

var unThreshold=new CGL.Uniform(shader,'f','threshhold',threshold);

inBlackWhite.onChange=function()
{
    if(inInvert.get()) shader.define('BLACKWHITE');
        else shader.removeDefine('BLACKWHITE');
};

inInvert.onChange=function()
{
    if(inInvert.get()) shader.define('INVERT');
        else shader.removeDefine('INVERT');
};


render.onTriggered=function()
{
    if(!CGL.TextureEffect.checkOpInEffect(op)) return;


// unThreshold.setValue( threshold.get() );


    cgl.setShader(shader);


    cgl.currentTextureEffect.bind();
    cgl.setTexture(0, cgl.currentTextureEffect.getCurrentSourceTexture().tex );
    

    cgl.currentTextureEffect.finish();

    cgl.setPreviousShader();
    trigger.trigger();
};
