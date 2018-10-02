from bigtiles import Bigtiles
from level import Level
from tilesets import tilesets

"""A worldfile is a class which contains a world. This class also handles
   serialization and deserialization.
   
   Arguments:
   * bigtiles: An array of Bigtiles objects
   * levels: An array of Level objects
   """

class Worldfile():
    def __init__(self, bigtiles, levels):
        self.bigtiles = bigtiles
        self.levels = levels

    def serialize(self):
        bigtiles = [i.serialize() for i in self.bigtiles]
        levels = [i.serialize() for i in self.levels]
        attributes = [i.attributes for i in self.levels]
        return {
            "Bigtiles": bigtiles,
            "Levels": levels,
            "Attributes": attributes
        }

    def get_or_create_level(self, index):
        while index >= len(self.levels):
            self.levels.append(Level(64, 16))
        return self.levels[index]   
    
    @staticmethod
    def deserialize(bigtiles, levels, attributes):
        bigtiles = [Bigtiles.deserialize(i, tilesets.tiles[0]) for i in bigtiles]
        levels = [Level.deserialize(val, attributes[i]) for i, val in enumerate(levels)]
        return Worldfile(bigtiles, levels)
    
    @staticmethod
    def new():
        return Worldfile(
            [Bigtiles(
                16, tilesets.tiles[0],
                [0 for _ in range(0, 256)])],
            [Level(64,16)]
        )
