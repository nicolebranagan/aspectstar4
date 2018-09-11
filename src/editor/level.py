from PIL import Image, ImageDraw
from objects import Objects

"""A level class consists of a level. A level is a grid of Bigtiles"""
class Level():
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.grid = [0 for i in range(0, width*height)]
        self.modified = []
        self.img = None
        self.objects = []
        self.attributes = {
            "name": "",
            "background": 0,
            "tileset": 0,
            "bigtileset": 0,
            "start": [100, 287]
        }

    def set(self, x, y, i):
        self.grid[x+y*self.width] = i
        self.modified.append((x, y, i))
    
    def get(self, x, y):
        return self.grid[x+y*self.width]

    def addobj(self, *data):
        self.objects.append(list(data))

    def delobj(self, obj):
        self.objects.remove(obj)
        self.img = None
    
    def draw(self, bigtiles):
        if (self.img is None):
            self.img = self.draw_full(bigtiles)
        else:
            for mod in self.modified:
                self.img.paste(bigtiles.drawtile(mod[2]), box=(mod[0]*32, mod[1]*32))
        self.modified = []
        return self.img

    def drawobj(self, x, y, i, img=None):
        obj = Objects.data[i]
        width = obj["rect"][2]
        height = obj["rect"][3]
        if (img is None):
            img = self.img
        img.paste(
            Objects.images[i],
            box=(
                x - width // 2, 
                y - height
            )
        )
        draw = ImageDraw.Draw(img)
        draw.text(self.attributes.get('start'), 'X')
        return img

    def draw_full(self, bigtiles):
        img = Image.new("RGBA", (32*self.width, 32*self.height))

        def paste(x, y, j):
            img.paste(bigtiles.drawtile(j), box=(x*32, y*32))

        for i in range(0, len(self.grid)):
            paste(i % self.width, i // self.width, self.grid[i])
        
        for i in self.objects:
            self.drawobj(i[1], i[2], i[0], img)
    
        return img

    def serialize(self):
        return {
            "grid": self.grid,
            "width": self.width,
            "height": self.height,
            "objects": self.objects,
            "attributes": self.attributes
        }

    @staticmethod
    def deserialize(indict):
        lvl = Level(indict["width"], indict["height"])
        lvl.grid = indict["grid"]
        lvl.objects = indict["objects"]
        lvl.attributes = indict["attributes"]
        return lvl
