var connection=op.inObject("Connection");
var evnt=op.inValueString("Event");

var next=op.outTrigger("Trigger");

connection.onChange=function()
{
    var conn=connection.get();
    if(!conn)return;

    conn.on("event",function(r)
    {
        console.log(r);
        if(r==evnt.get()) next.trigger();
    });
};

