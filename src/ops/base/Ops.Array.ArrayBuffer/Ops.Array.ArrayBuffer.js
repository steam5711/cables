
var exec=op.inTriggerButton("exec");
var val=op.inValue("Value");
var arrOut=op.outArray("Result");

var arr=[];

var maxLength=op.inValue("Max Length",100);
var inReset=op.inTriggerButton("Reset");
arrOut.set(arr);

maxLength.onChange=reset;
inReset.onTriggered=reset;
reset();

function reset()
{
    arr.length=Math.abs(Math.floor(maxLength.get()))||0;
    for(var i=0;i<arr.length;i++) arr[i]=0;
    arrOut.set(null);
    arrOut.set(arr);
}

exec.onTriggered=function()
{
    for(var i=1;i<arr.length;i++)arr[i-1]=arr[i];
    arr[arr.length-1]=val.get();
    arrOut.set(null);
    arrOut.set(arr);
};
