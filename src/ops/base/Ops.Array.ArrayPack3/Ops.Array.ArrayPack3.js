const exe = op.inTrigger("Trigger in");
const inArr1=op.inArray("Array 1");
const inArr2=op.inArray("Array 2");
const inArr3=op.inArray("Array 3");

const exeOut = op.outTrigger("Trigger out");
const outArr=op.outArray("Array out");
const outNum=op.outValue("Num Points");

var showingError = false;

var arr=[];
var emptyArray=[];

exe.onTriggered = update;


function update()
{
    var array1=inArr1.get();
    var array2=inArr2.get();
    var array3=inArr3.get();

    if(!array1 && !array2 && !array3 )
    {
        outArr.set(null);
        return;
    }

    var arrlen=0;

    if(!array1 || !array2 || !array3)
    {
        if(array1) arrlen=array1.length;
            else if(array2) arrlen=array2.length;
            else if(array3) arrlen=array3.length;

        if(emptyArray.length!=arrlen)
            for(var i=0;i<arrlen;i++) emptyArray[i]=0;

        if(!array1)array1=emptyArray;
        if(!array2)array2=emptyArray;
        if(!array3)array3=emptyArray;
    }

    if((array1.length !== array2.length) || (array2.length !== array3.length))
    {
        if(!showingError)
        {
            op.uiAttr({error:"Arrays do not have the same length !"});
            showingError = true;
        }
        return;
    }

    if(showingError)
    {
        showingError = false;
        op.uiAttr({error:null});
    }

    arr.length = array1.length;
    for(var i=0;i<array1.length;i++)
    {
        arr[i*3+0] = array1[i];
        arr[i*3+1] = array2[i];
        arr[i*3+2] = array3[i];

    }

    outArr.set(null);
    outArr.set(arr);
    outNum.set(arr.length/3);

    exeOut.trigger();
}

