from PIL import Image
import json

"""Objects contains information about the objects in the game."""
class __Object():
    def __init__(self):
        self.tilesets = {
            "player"  : Image.open("../public/images/player.gif"),
            "characters" : Image.open("../public/images/characters.gif"),
            "object1" : Image.open("../public/images/object1.gif"),
            "object2" : Image.open("../public/images/object2.gif")
        }
        self.data = self.loadobjects()
        self.names = [e["name"] for e in self.data]
        self.images = []
        self.loadimages()

    def loadobjects(self):
        filen = "../app/data/Objects.js"
        with open(filen, "r") as fileo:
            header = fileo.readline()
            if header != "export default\n":
                self.statusbar.config(text="Not a proper object dictionary!")
                return
            data = fileo.read()
            return json.loads(data)

    def loadimages(self):
        for entry in self.data:
            self.images.append(
                self.tilesets[entry["texture"]].crop(
                    [
                        entry["rect"][0],
                        entry["rect"][1],
                        entry["rect"][0] + entry["rect"][2],
                        entry["rect"][1] + entry["rect"][3],
                    ]
                )
            )

Objects = __Object()
