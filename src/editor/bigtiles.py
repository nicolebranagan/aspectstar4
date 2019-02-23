from PIL import Image

"""Bigtiles handles a set of 32x32 tiles"""

class Bigtiles():
    def __init__(self, length, key):
        self.length = length
        self.key = key

        self._bigtiles = {}
        self._drawcache = {}
        self._fullcache = None
        self._null = [0 for i in range(0, 2*2)]
        self._nulldraw = Image.new("RGB", (16*2, 16*2))
        self._lasttiles = None

    def get(self, i, x, y):
        if i in self._bigtiles:
            return self._bigtiles[i][x+2*y]
        else:
            return 0
    
    def set(self, i, x, y, j):
        if i not in self._bigtiles:
            self._bigtiles[i] = [0 for i in range(0, 2*2)]
        if i >= self.length:
            self.length = i + 1
        self._bigtiles[i][x+2*y] = j
        self._drawcache.pop(i, None)
        self._fullcache = None
    
    def drawtile(self, tiles, i):
        if i not in self._bigtiles:
            return self._nulldraw
        if i in self._drawcache:
            if self._lasttiles is tiles:
                return self._drawcache[i]
        img = Image.new("RGB", (16*2, 16*2))

        def drawTile(x, y, j):
            img.paste(tiles[j], box=(x*16, y*16))

        for k in range(0,4):
            drawTile(k % 2, k // 2, self._bigtiles[i][k])
        
        self._drawcache[i] = img
        return img
    
    def drawtile2x(self, tiles, i):
        img = self.drawtile(tiles, i)
        return img.resize((img.width*2, img.height*2), Image.NEAREST)
    
    def draw(self, tiles):
        if self._fullcache is not None:
            if self._lasttiles is tiles:
                return self._fullcache

        img = Image.new("RGB", (16*2*self.length, 16*2))

        for i in range(0, self.length):
            img.paste(self.drawtile(tiles, i), box=(i*32, 0))

        self._fullcache = img
        self._lasttiles = tiles
        return img
    
    def serialize(self):
        out = {}
        out["key"] = self.key
        out["bigtiles"] = []
        for i in range(0, self.length):
            if i in self._bigtiles:
                out["bigtiles"].append(self._bigtiles[i])
            else:
                out["bigtiles"].append(-1)
        return out
    
    @staticmethod
    def deserialize(indict):
        inarray = indict["bigtiles"]
        bigtile = Bigtiles(len(inarray), indict["key"])
        for i in range(0, len(inarray)):
            if inarray[i] == -1:
                continue
            bigtile._bigtiles[i] = inarray[i]
        return bigtile
