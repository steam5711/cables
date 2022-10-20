// inputs
let executePort = op.inTriggerButton("Execute");
executePort.onTriggered = update;
let eventInPort = op.inObject("Event In");

// outputs
let nextPort = op.outTrigger("Next");
let eventOutPort = op.outObject("Event Out");

function update()
{
    let event = eventInPort.get();
    if (event && event.stopPropagation)
    {
        event.stopPropagation();
        op.log("Stopped Propa", event);
    }
    eventOutPort.set(event);
    nextPort.trigger();
}
