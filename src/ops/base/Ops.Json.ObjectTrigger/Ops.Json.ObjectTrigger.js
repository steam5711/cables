var inObj=op.inObject("Object");
var inTrigger=op.inFunctionButton("Trigger");

var outObj=op.outObject("Result");

inTrigger.onTriggered=function()
{
    outObject.set(inObject.get());
};
