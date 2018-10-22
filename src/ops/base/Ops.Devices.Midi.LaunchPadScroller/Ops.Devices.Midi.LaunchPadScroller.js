var eventIn=op.addInPort(new Port(op,"Event Input",OP_PORT_TYPE_OBJECT));

var exec=this.addInPort(new Port(this,"exec",OP_PORT_TYPE_FUNCTION));
var offsetX=this.addInPort(new Port(this,"Offset X",OP_PORT_TYPE_VALUE));

var img=[
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,2,2,2,2,2,0,0,2,2,2,2,2,0,0,2,2,0,0,0,3,3,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,1,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,2,2,0,0,0,0,2,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,3,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,0,0,0,0,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,2,2,2,2,0,0,0,0,2,0,0,0,0,0,2,2,2,0,0,3,3,3,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
];

var width=img.length/8;

function setPixel(x,y,val)
{
    if(val==1)val=120;
    else if(val==2)val=127;
    else if(val==4)val=20;
    eventIn.get().output.send( [0x90, x+y*16, val] );
}

exec.onTriggered=function()
{
    if(!eventIn.get())return;
    var start=Math.round(Math.min(width-8,offsetX.get()));
    var end=Math.round(Math.min(width,offsetX.get()+8));

    for(var x=start;x<end;x++)
        for(var y=0;y<8;y++)
            setPixel(x-start,y,img[ x+y*width ]);

};



