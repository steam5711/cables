const

    inWidth = op.inValueInt("Width", 256),
    inHeight = op.inValueInt("Height", 256),
    tfilter = op.inSwitch("Filter", ["nearest", "linear"], "nearest"),
    wrap = op.inValueSelect("Wrap", ["repeat", "mirrored repeat", "clamp to edge"], "repeat"),
    inColor = op.inValueBool("Color", false),
    inPixel = op.inDropDown("Pixel Format", CGL.Texture.PIXELFORMATS, CGL.Texture.PFORMATSTR_RGBA8UB),

    inSeed = op.inFloat("Seed", 1),
    inOutR = op.inBool("Channel R", true),
    inMinR = op.inFloat("Min R", 0),
    inMaxR = op.inFloat("Max R", 1),
    inOutG = op.inBool("Channel G", true),
    inMinG = op.inFloat("Min G", 0),
    inMaxG = op.inFloat("Max G", 1),
    inOutB = op.inBool("Channel B", true),
    inMinB = op.inFloat("Min B", 0),
    inMaxB = op.inFloat("Max B", 1),
    outTex = op.outTexture("Texture"),
    outNumPixel = op.outNumber("Total Pixel");

const cgl = op.patch.cgl;

inSeed.onChange =
    inWidth.onChange =
    inHeight.onChange =
    inPixel.onChange =
    inMinR.onChange =
    inMaxR.onChange =
    inMinG.onChange =
    inMaxG.onChange =
    inMinB.onChange =
    inMaxB.onChange =
    inOutR.onChange =
    inOutB.onChange =
    inOutG.onChange =
    tfilter.onChange =
    wrap.onChange =
    inColor.onChange = update;

update();

function update()
{
    const isFp = inPixel.get() == CGL.Texture.PFORMATSTR_RGBA32F;
    if (!isFp)
    {
        if (
            inMinR.get() < 0.0 || inMinR.get() > 1.0 ||
            inMinG.get() < 0.0 || inMinG.get() > 1.0 ||
            inMinB.get() < 0.0 || inMinB.get() > 1.0 ||
            inMaxR.get() < 0.0 || inMaxR.get() > 1.0 ||
            inMaxG.get() < 0.0 || inMaxG.get() > 1.0 ||
            inMaxB.get() < 0.0 || inMaxB.get() > 1.0) op.setUiError("nonfprange", "Non floating point textures have to be between 0 and 1");
        else op.setUiError("nonfprange", null);
    }
    else op.setUiError("nonfprange", null);

    inMinG.setUiAttribs({ "greyout": !inColor.get() });
    inMaxG.setUiAttribs({ "greyout": !inColor.get() });
    inMinB.setUiAttribs({ "greyout": !inColor.get() });
    inMaxB.setUiAttribs({ "greyout": !inColor.get() });

    let width = Math.ceil(inWidth.get());
    let height = Math.ceil(inHeight.get());

    if (width < 1)width = 1;
    if (height < 1)height = 1;

    let pixels;
    const num = width * 4 * height;

    const minR = inMinR.get();
    const diffR = inMaxR.get() - minR;

    const minG = inMinG.get();
    const diffG = inMaxG.get() - minG;

    const minB = inMinB.get();
    const diffB = inMaxB.get() - minB;

    Math.randomSeed = inSeed.get();

    if (isFp)
    {
        pixels = new Float32Array(num);

        if (inColor.get())
        {
            for (let i = 0; i < num; i += 4)
            {
                pixels[i + 0] = minR + Math.seededRandom() * diffR;
                pixels[i + 1] = minG + Math.seededRandom() * diffG;
                pixels[i + 2] = minB + Math.seededRandom() * diffB;
                pixels[i + 3] = 1;
            }
        }
        else
        {
            for (let i = 0; i < num; i += 4)
            {
                let c = minR + Math.seededRandom() * diffR;
                pixels[i + 0] = pixels[i + 1] = pixels[i + 2] = c;
                pixels[i + 3] = 1;
            }
        }
    }
    else
    {
        pixels = new Uint8Array(num);

        if (inColor.get())
        {
            for (let i = 0; i < num; i += 4)
            {
                pixels[i + 0] = (minR + Math.seededRandom() * diffR) * 255;
                pixels[i + 1] = (minG + Math.seededRandom() * diffG) * 255;
                pixels[i + 2] = (minB + Math.seededRandom() * diffB) * 255;
                pixels[i + 3] = 255;
            }
        }
        else
        {
            for (let i = 0; i < num; i += 4)
            {
                pixels[i + 0] =
                pixels[i + 1] =
                pixels[i + 2] = (minR + Math.seededRandom() * diffR) * 255;
                pixels[i + 3] = 255;
            }
        }
    }

    if (!inOutR.get()) for (let i = 0; i < num; i += 4)pixels[i + 0] = 0.0;
    if (!inOutG.get()) for (let i = 0; i < num; i += 4)pixels[i + 1] = 0.0;
    if (!inOutB.get()) for (let i = 0; i < num; i += 4)pixels[i + 2] = 0.0;

    let cgl_filter = CGL.Texture.FILTER_NEAREST;
    if (tfilter.get() == "linear") cgl_filter = CGL.Texture.FILTER_LINEAR;
    // else if (tfilter.get() == "mipmap") cgl_filter = CGL.Texture.FILTER_MIPMAP;
    // else if (tfilter.get() == "Anisotropic") cgl_filter = CGL.Texture.FILTER_ANISOTROPIC;

    let cgl_wrap = CGL.Texture.WRAP_REPEAT;
    if (wrap.get() == "mirrored repeat") cgl_wrap = CGL.Texture.WRAP_MIRRORED_REPEAT;
    if (wrap.get() == "clamp to edge") cgl_wrap = CGL.Texture.WRAP_CLAMP_TO_EDGE;

    let tex = new CGL.Texture(cgl, { "isFloatingPointTexture": isFp, "name": "noisetexture" });

    tex.initFromData(pixels, width, height, cgl_filter, cgl_wrap);

    // outTex.set(CGL.Texture.getEmptyTexture(op.patch.cgl, isFp));
    outNumPixel.set(width * height);
    outTex.setRef(tex);
}
