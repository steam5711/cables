CABLES.WEBAUDIO.createAudioContext(op);

const analyser = audioContext.createAnalyser();
analyser.smoothingTimeConstant = 0.3;
analyser.fftSize = 256;

const refresh=op.addInPort(new Port(op,"refresh",OP_PORT_TYPE_FUNCTION));
const audioIn = CABLES.WEBAUDIO.createAudioInPort(op, "Audio In", analyser);
const anData=op.inValueSelect("Data",["Frequency","Time Domain"],"Frequency");

const next=op.outFunction("Next");
const audioOutPort = CABLES.WEBAUDIO.createAudioOutPort(op, "Audio Out", analyser);
const avgVolume=op.addOutPort(new Port(op, "average volume",OP_PORT_TYPE_VALUE));
const fftOut=op.addOutPort(new Port(op, "fft",OP_PORT_TYPE_ARRAY));

var fftBufferLength = analyser.frequencyBinCount;
var fftDataArray = new Uint8Array(fftBufferLength);
var getFreq=true;
var array=null;

anData.onChange=function() {
    if(anData.get()=="Frequency")getFreq=true;
    if(anData.get()=="Time Domain")getFreq=false;
};

refresh.onTriggered = function()
{
    analyser.minDecibels = -90;
    analyser.maxDecibels = 0;

    if(!fftDataArray)
    {
        op.log("fftDataArray is null, returning.");
        return;
    }
    var values = 0;

    for (var i = 0; i < fftDataArray.length; i++) values += fftDataArray[i];

    var average = values / fftDataArray.length;

    avgVolume.set(average/128);
    try
    {
        if(getFreq) analyser.getByteFrequencyData(fftDataArray);
            else analyser.getByteTimeDomainData(fftDataArray);    
    }
    catch(e) { op.log(e); }

    fftOut.set(null);
    fftOut.set(fftDataArray);

    next.trigger();
};

