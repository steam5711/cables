op.name="TimeLineTimeNew";

var exe=op.inTrigger("Exec");
var theTime=op.addOutPort(new CABLES.Port(this,"time"));


exe.onTriggered=function()
{
    theTime.set(gui.scene().timer.getTime());
};

