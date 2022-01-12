const
    array = op.inArray("array"),
    index = op.inValueInt("index"),
    value = op.outValue("value");

array.ignoreValueSerialize = true;

index.onChange = array.onChange = update;

function update()
{
    if (array.get())
    {
        let input = array.get()[index.get()];
        if (isNaN(input))
        {
            value.set(0);
            return;
        }
        value.set(input);
    }
}
