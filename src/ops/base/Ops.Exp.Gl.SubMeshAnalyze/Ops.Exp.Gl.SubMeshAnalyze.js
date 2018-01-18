
var inGeom=op.inObject("geometry");
var outtest=op.outValue("test");

var outGeom=op.outObject("Result");

var faceGroups=[];

inGeom.onChange=function()
{
    var geom=inGeom.get();
    if(!geom)return;

    var verts=geom.vertices;
    var faces=geom.verticesIndices;

    function changeVertIndex(from,to)
    {
        for(var i=0;i<faces.length;i++)
        {
            if(faces[i]==from)
            {
                faces[i]=to;
            }
        }
    }

    // find dupes
    for(var i=0;i<verts.length/3;i++)
    {
        for(var j=0;j<verts.length/3;j++)
        {
            if(i!=j)
            {
                if(
                    verts[i*3+0]==verts[j*3+0] && 
                    verts[i*3+1]==verts[j*3+1] && 
                    verts[i*3+2]==verts[j*3+2] )
                {
                    changeVertIndex(j,i);
                }
            }
        }
    }

    var groupCounter=0;
    faceGroups.length=faces.length/3;

    for(var i=0;i<faceGroups.length;i++)
    {
        faceGroups[i]=-1;
    }

    function setFaceGroupByVertIndex(idx,group)
    {
        for(var i=0;i<faces.length/3;i++)
        {
            if(faceGroups[i]!=group)
            {
                if(faces[i*3+0]==idx || faces[i*3+1]==idx || faces[i*3+2]==idx )
                {
                    faceGroups[i]=group;

                    if( faces[i*3+0]!=idx ) setFaceGroupByVertIndex( faces[i*3+0], group);
                    if( faces[i*3+1]!=idx ) setFaceGroupByVertIndex( faces[i*3+1], group);
                    if( faces[i*3+2]!=idx ) setFaceGroupByVertIndex( faces[i*3+2], group);
                }
            }
        }
    }

    for(var i=0;i<faces.length/3;i++)
    {
        if( faceGroups[i] == -1 )
        {
            setFaceGroupByVertIndex( faces[i*3+0], groupCounter);
            setFaceGroupByVertIndex( faces[i*3+1], groupCounter);
            setFaceGroupByVertIndex( faces[i*3+2], groupCounter);
            groupCounter++;
        }
    }

    var tc=[];
    tc.length=verts.length/3*2;
    groupCounter-=1;

    for(var i=0;i<faceGroups.length;i++)
    {
        var tcY=faceGroups[i] / groupCounter;
        // if(tcY==0)tcY=1;
        
        if(tcY!=tcY)
        {
            console.log("tcy ",tcY,faceGroups[i]);
        }
        
        tc[faces[i*3+0]*2+0]=0.0;
        tc[faces[i*3+0]*2+1]=tcY;

        tc[faces[i*3+1]*2+0]=0.0;
        tc[faces[i*3+1]*2+1]=tcY;

        tc[faces[i*3+2]*2+0]=0.0;
        tc[faces[i*3+2]*2+1]=tcY;
    }

    console.log(tc);
    geom.setTexCoords(tc);

    console.log('groups',groupCounter);
    console.log('faces',faces.length/3);

    outGeom.set(geom);

    outtest.set(geom.vertices.length);
};








