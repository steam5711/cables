
const exe=op.inTrigger("exe");
var arrayIn=op.inArray("array");
var time=op.inValueFloat("time");

var duration=op.inValueFloat("duration");
duration.set(0.1);

var offset=op.inValueFloat("offset");
offset.set(0.0);

var lookAhead=op.inValueFloat("look ahead");
lookAhead.set(3.0);

var trigger=op.outTrigger("trigger");
var triggerLookat=op.outTrigger("transform lookat");
var idx=op.addOutPort(new CABLES.Port(op,"index"));

var vec=vec3.create();
var vecn=vec3.create();
var cgl=op.patch.cgl;

var startTime=CABLES.now();

var animX=new CABLES.Anim();
var animY=new CABLES.Anim();
var animZ=new CABLES.Anim();

var animQX=new CABLES.Anim();
var animQY=new CABLES.Anim();
var animQZ=new CABLES.Anim();
var animQW=new CABLES.Anim();

var animLength=0;
var timeStep=0.1;
function setup()
{
    animX=new CABLES.Anim();
    animY=new CABLES.Anim();
    animZ=new CABLES.Anim();

    animQX=new CABLES.Anim();
    animQY=new CABLES.Anim();
    animQZ=new CABLES.Anim();
    animQW=new CABLES.Anim();

    var i=0;
    var arr=arrayIn.get();
    if(!arr)return;
    timeStep=parseFloat(duration.get());

    for(i=0;i<arr.length;i+=3)
    {
        animX.setValue(i/3*timeStep,arr[i+0]);
        animY.setValue(i/3*timeStep,arr[i+1]);
        animZ.setValue(i/3*timeStep,arr[i+2]);
        animLength=i/3*timeStep;
    }

    for(i=0;i<arr.length/3;i++)
    {
        var t = i*timeStep;
        var nt = (i*timeStep+timeStep)%animLength;

        vec3.set(vec,
            animX.getValue(t),
            animY.getValue(t),
            animZ.getValue(t)
        );
        vec3.set(vecn,
            animX.getValue(nt),
            animY.getValue(nt),
            animZ.getValue(nt)
        );

    // console.log( nt,animLength,vecn );


        vec3.set(vec,vecn[0]-vec[0],vecn[1]-vec[1],vecn[2]-vec[2]);
        vec3.normalize(vec,vec);
        vec3.set(vecn,0,0,1);

        quat.rotationTo(q,vecn,vec);




        animQX.setValue(i*timeStep,q[0]);
        animQY.setValue(i*timeStep,q[1]);
        animQZ.setValue(i*timeStep,q[2]);
        animQW.setValue(i*timeStep,q[3]);


        // t,nt);


    }

}

arrayIn.onChange=duration.onChange=setup;

var q=quat.create();
var qMat=mat4.create();

function render()
{
    if(!arrayIn.get())return;

    var t = (time.get() +parseFloat(offset.get()) )%animLength;
    var nt = (time.get()+timeStep*lookAhead.get()+parseFloat(offset.get()))%animLength;

    vec3.set(vec,
        animX.getValue(t),
        animY.getValue(t),
        animZ.getValue(t)
    );

    idx.set(nt);

    if(triggerLookat.isLinked())
    {
        vec3.set(vecn,
            animX.getValue(nt),
            animY.getValue(nt),
            animZ.getValue(nt)
        );

        cgl.pushModelMatrix();
        mat4.translate(cgl.mMatrix,cgl.mMatrix, vecn);
        triggerLookat.trigger();
        cgl.popModelMatrix();
    }

    cgl.pushModelMatrix();
    mat4.translate(cgl.mMatrix,cgl.mMatrix, vec);

    CABLES.TL.Anim.slerpQuaternion(t,q,animQX,animQY,animQZ,animQW);
    mat4.fromQuat(qMat, q);
    mat4.multiply(cgl.mMatrix,cgl.mMatrix, qMat);

    trigger.trigger();
    cgl.popModelMatrix();

}

exe.onTriggered=render;