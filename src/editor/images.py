from PIL import Image

"""Images contains images for the editor that aren't used in-game"""

class _Images():
    def __init__(self):
        solidityimg = Image.open("./images/solidity.gif")
        self.solidity1x = [solidityimg.crop((x*16, 0, x*16+16, 16)) 
                           for x in range(solidityimg.width//16)]
        self.solidity = [x.resize((x.width*2, x.height*2), Image.NEAREST)
                         for x in self.solidity1x]

images = _Images()