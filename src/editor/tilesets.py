from PIL import Image

"""Tilesets object contains all the PIL objects that make up the graphics."""
class _Tilesets():
    def __init__(self):
        self.tilesets = [
            Image.open("../public/images/level1.gif"),
            Image.open("../public/images/level2.gif")
        ]
        self.tilesets2x = [x.resize((x.width*2, x.height*2), Image.NEAREST) for x in self.tilesets]
        self.tiles = []
        for tiles in self.tilesets:
            self.tiles.append(
                [tiles.crop((x*16, 0, x*16+16, 16)) for x in range(tiles.width//16)]
            )
        self.tiles2x = []
        for tiles in self.tiles:
            self.tiles2x.append(
                [x.resize((x.width*2, x.height*2), Image.NEAREST) for x in tiles]
            )

tilesets = _Tilesets()
