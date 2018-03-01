// inputs
var executePort = op.inFunctionButton('Execute');
executePort.onTriggered = update;
var eventInPort = op.inObject('Event In');

//outputs
var nextPort = op.outFunction('Next');
var eventOutPort = op.outObject('Event Out');

function update() {
    var event = eventInPort.get();
    if(event && event.preventDefault) {
        event.preventDefault();
        op.log('prevent default', event);
    }
    eventOutPort.set(event);
    nextPort.trigger();
}

