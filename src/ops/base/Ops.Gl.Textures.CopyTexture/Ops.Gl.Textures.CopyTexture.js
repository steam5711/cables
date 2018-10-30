
var inTexture=op.inTexture("Texture");
var render=op.inTrigger('render');
var useVPSize=op.addInPort(new CABLES.Port(op,"use original size",CABLES.OP_PORT_TYPE_VALUE,{ display:'bool' }));
var width=op.inValueInt("width");
var height=op.inValueInt("height");

var tfilter=op.inValueSelect("filter",['nearest','linear','mipmap']);
var twrap=op.inValueSelect("wrap",['clamp to edge','repeat','mirrored repeat']);
var fpTexture=op.inValueBool("HDR");

var trigger=op.outTrigger('trigger');
var texOut=op.outTexture("texture_out");

var outRatio=op.outValue("Aspect Ratio");

texOut.set(null);
var cgl=op.patch.cgl;
var effect=null;
var tex=null;

var w=8,h=8;
var prevViewPort=[0,0,0,0];
var reInitEffect=true;

var bgFrag=''
    .endl()+'UNI float a;'
    .endl()+'UNI sampler2D tex;'
    .endl()+'IN vec2 texCoord;'
    .endl()+'void main()'
    .endl()+'{'
    .endl()+'   vec4 col=texture2D(tex,texCoord);'
    .endl()+'   outColor= col;'
    .endl()+'}';
var bgShader=new CGL.Shader(cgl,'imgcompose bg');
bgShader.setSource(bgShader.getDefaultVertexShader(),bgFrag);
var textureUniform=new CGL.Uniform(bgShader,'t','tex',0);

var selectedFilter=CGL.Texture.FILTER_LINEAR;
var selectedWrap=CGL.Texture.WRAP_CLAMP_TO_EDGE;


function initEffect()
{
    if(effect)effect.delete();
    if(tex)tex.delete();

    effect=new CGL.TextureEffect(cgl,{"isFloatingPointTexture":fpTexture.get()});

    tex=new CGL.Texture(cgl,
        {
            "name":"copytexture",
            "isFloatingPointTexture":fpTexture.get(),
            "filter":selectedFilter,
            "wrap":selectedWrap,
            "width": Math.floor(width.get()),
            "height": Math.floor(height.get()),
        });

    effect.setSourceTexture(tex);
    texOut.set(null);
    reInitEffect=false;
}

fpTexture.onChange=function()
{
    reInitEffect=true;
};

function updateResolution()
{
    if(!effect)initEffect();
    if(!inTexture.get())return;

    if(useVPSize.get())
    {
        w=inTexture.get().width;
        h=inTexture.get().height;
    }
    else
    {
        w=Math.floor(width.get());
        h=Math.floor(height.get());
    }

    if((w!=tex.width || h!= tex.height) && (w!==0 && h!==0))
    {
        height.set(h);
        width.set(w);
        tex.filter=CGL.Texture.FILTER_LINEAR;
        tex.setSize(w,h);
        outRatio.set(w/h);
        effect.setSourceTexture(tex);
    }

    if(texOut.get())
        if(!texOut.get().isPowerOfTwo() )
        {
            if(!op.uiAttribs.hint)
                op.uiAttr(
                    {
                        hint:'texture dimensions not power of two! - texture filtering will not work.',
                        warning:null
                    });
        }
        else
        if(op.uiAttribs.hint)
        {
            op.uiAttr({hint:null,warning:null}); //todo only when needed...
        }

}


function updateSizePorts()
{
    if(useVPSize.get())
    {
        width.setUiAttribs({hidePort:true,greyout:true});
        height.setUiAttribs({hidePort:true,greyout:true});
    }
    else
    {
        width.setUiAttribs({hidePort:false,greyout:false});
        height.setUiAttribs({hidePort:false,greyout:false});
    }
}

useVPSize.onChange=function()
{
    updateSizePorts();
    if(useVPSize.get())
    {
        width.onChange=null;
        height.onChange=null;
    }
    else
    {
        width.onChange=updateResolution;
        height.onChange=updateResolution;
    }
    updateResolution();
};


var doRender=function()
{
    
    if(!effect || reInitEffect)
    {
        initEffect();
    }
    var vp=cgl.getViewPort();
    prevViewPort[0]=vp[0];
    prevViewPort[1]=vp[1];
    prevViewPort[2]=vp[2];
    prevViewPort[3]=vp[3];

    updateResolution();

    if(!inTexture.get())return;

    cgl.currentTextureEffect=effect;
    effect.setSourceTexture(tex);

    effect.startEffect();



    // render background color...
    cgl.setShader(bgShader);
    cgl.currentTextureEffect.bind();
    cgl.setTexture(0, inTexture.get().tex );
    
    cgl.currentTextureEffect.finish();
    cgl.setPreviousShader();

    texOut.set(effect.getCurrentSourceTexture());

    effect.endEffect();

    cgl.setViewPort(prevViewPort[0],prevViewPort[1],prevViewPort[2],prevViewPort[3]);

    cgl.currentTextureEffect=null;
    
    trigger.trigger();
};


function onWrapChange()
{
    if(twrap.get()=='repeat') selectedWrap=CGL.Texture.WRAP_REPEAT;
    if(twrap.get()=='mirrored repeat') selectedWrap=CGL.Texture.WRAP_MIRRORED_REPEAT;
    if(twrap.get()=='clamp to edge') selectedWrap=CGL.Texture.WRAP_CLAMP_TO_EDGE;

    reInitEffect=true;
    updateResolution();
}

twrap.set('clamp to edge');
twrap.onChange=onWrapChange;

function onFilterChange()
{
    if(tfilter.get()=='nearest') selectedFilter=CGL.Texture.FILTER_NEAREST;
    if(tfilter.get()=='linear')  selectedFilter=CGL.Texture.FILTER_LINEAR;

    reInitEffect=true;
    updateResolution();
}

tfilter.set('linear');
tfilter.onChange=onFilterChange;

useVPSize.set(true);
render.onTriggered=doRender;

width.set(640);
height.set(360);
updateSizePorts();