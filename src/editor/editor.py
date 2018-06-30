import tkinter as tk 
from tkinter import filedialog
from PIL import ImageTk, Image
from enum import Enum
import math
import json
import os
import sys

from collections import defaultdict
from tilesets import tilesets
from images import images
from bigtiles import Bigtiles
from level import Level
from worldfile import Worldfile
from objects import Objects

class SolidityType(Enum):
    EMPTY = 0
    SOLID = 1
    OPEN_TOP = 2
    DEATH = 3

class EditorMode(Enum):
    TILE_EDIT = 0
    OBJECT_EDIT = 1

class Editor(tk.Frame):
    def __init__(self, master=None):
        tk.Frame.__init__(self, master)
        self.master = master
        self.pack()

        self.openworldfile(Worldfile.new())
        self.buildGUI()
        self.mode = EditorMode.TILE_EDIT
    
    def openworldfile(self, wf, redraw=False):
        self.worldfile = wf
        self.level = 0
        self.selected_tile = 0
        self.selected_bigtile = 0
        self.tileset = 0
        self.bigtiles = wf.bigtiles[0]
        self.currentlevel = wf.levels[0]

        if (redraw):
            self.selectTile(0)
            self.selectBigtile(0)
            self.drawroom()
            self.buildBigTileset()
    
    def buildGUI(self):
        commandbar = tk.Frame(self)
        commandbar.grid(row=0, column=0, columnspan=2)

        def openfile():
            filen = filedialog.askopenfilename(
                defaultextension=".js",
                initialfile="Worldfile.js",
                initialdir="../app/data/",
                filetypes=(("Javascript files", "*.js"),
                           ("All files", "*")),
                title="Open")
            if filen != () and filen != "":
                with open(filen, "r") as fileo:
                    header = fileo.readline()
                    if header != "export default\n":
                        print(header)
                        self.statusbar.config(text="Not a proper worldfile!")
                        return
                    data = fileo.read()
                    wf = Worldfile.deserialize(json.loads(data))
                    self.openworldfile(wf, True)
        loadbutton = tk.Button(commandbar, text="Open", command=openfile)
        loadbutton.grid(row=0, column=0)
        
        def savefile():
            filen = filedialog.asksaveasfilename(
                defaultextension=".js",
                initialfile="Worldfile.js",
                initialdir="../app/data/",
                filetypes=(("Javascript files", "*.js"),
                           ("All files", "*")),
                title="Save")
            if filen != () and filen != "":
                with open(filen, "w") as fileo:
                    fileo.seek(0)
                    fileo.write("export default\n"+
                                json.dumps(
                                    self.worldfile.serialize(), indent=2, sort_keys=True
                                )+"\n")
                    fileo.truncate()
        savebutton = tk.Button(commandbar, text="Save", command=savefile)
        savebutton.grid(row=0, column=1)

        tilegrid = tk.Frame(self, width=256)
        tilegrid.grid(row=1, column=0, sticky=tk.N)

        modepanel = tk.Frame(tilegrid)
        modepanel.pack()
        
        def changemode(mode):
            def f():
                self.statusbar.config(text="Switching to " + mode.name + " mode")
                self.mode = mode
                self.deselectobj()
            return f

        tk.Button(
            modepanel,
            text="Tile Editor",
            command=changemode(EditorMode.TILE_EDIT)
        ).grid(row=0, column=0)
        tk.Button(
            modepanel,
            text="Object Editor",
            command=changemode(EditorMode.OBJECT_EDIT)
        ).grid(row=0, column=1)

        scrolltiles = tk.Scrollbar(tilegrid, orient=tk.HORIZONTAL)
        self.tilecanvas = tk.Canvas(
            tilegrid, scrollregion=(0, 0, 32*255, 32), height=32,
            xscrollcommand=scrolltiles.set
        )
        self.tilecanvas.img = self.tilecanvas.create_image(
            0, 0, anchor=tk.NW
        )
        self.tilecanvas.pack(fill=tk.X)
        scrolltiles.pack(fill=tk.X)
        scrolltiles.config(command=self.tilecanvas.xview)
        self.buildTileset(0)
        
        def clickTilecanvas(e):
            x = math.floor(self.tilecanvas.canvasx(e.x) / 32)
            self.selectTile(x)
        self.tilecanvas.bind("<Button-1>", clickTilecanvas)

        tileframe = tk.Frame(tilegrid)
        tileframe.pack()

        tk.Label(tileframe, text="Current tile:").grid(row=0, column=0)
        self.selectedtile = tk.Label(tileframe)
        
        self.selectedtile.grid(row=1, column=0)

        def setSolid(solid):
            # All this because python thought it was cool not to have to
            # declare variables, it seems...
            def inner():
                self.bigtiles.key[self.selected_tile] = solid.value
                self.soliditylabel.config(text="Solidity: " + solid.name)
            return inner

        self.soliditylabel = tk.Label(tileframe, text="Solidity")
        self.soliditylabel.grid(row=0, column=1)
        soliditypanel = tk.Frame(tileframe)
        soliditypanel.grid(row=1, column=1)
        self.currentsolid = tk.Label(soliditypanel)
        self.currentsolid.pack(side=tk.LEFT)
        self.solidityimg = {}
        for i in SolidityType:
            solid = i
            self.solidityimg[i] = ImageTk.PhotoImage(images.solidity[i.value])
            tk.Button(
                soliditypanel, image=self.solidityimg[i],
                command = setSolid(solid)
            ).pack(side=tk.LEFT)
        self.selectTile(7)

        scrollbigtiles = tk.Scrollbar(tilegrid, orient=tk.HORIZONTAL)
        self.bigtilecanvas = tk.Canvas(
            tilegrid, scrollregion=(0, 0, 16*255, 32), height=32,
            xscrollcommand=scrollbigtiles.set
        )
        self.bigtilecanvas.img = self.bigtilecanvas.create_image(
            0, 0, anchor=tk.NW
        )
        self.bigtilecanvas.pack(fill=tk.X)
        scrollbigtiles.pack(fill=tk.X)
        scrollbigtiles.config(command=self.bigtilecanvas.xview)
        self.buildBigTileset(0)

        def clickBigtilecanvas(e):
            x = math.floor(self.bigtilecanvas.canvasx(e.x) / 32)
            self.selectBigtile(x)
        self.bigtilecanvas.bind("<Button-1>", clickBigtilecanvas)

        bigtileframe = tk.Frame(tilegrid)
        bigtileframe.pack()

        tk.Label(bigtileframe, text="Current bigtile:").grid(row=0, column=0)
        self.selectedbigtile = tk.Canvas(bigtileframe, width=64, height=64)
        self.selectedbigtile.image = self.selectedbigtile.create_image(0, 0, anchor=tk.NW)
        self.selectBigtile(0)
        self.selectedbigtile.grid(row=1, column=0)
        
        def clickBigtile(e):
            x = math.floor(self.selectedbigtile.canvasx(e.x) / 32)
            y = math.floor(self.selectedbigtile.canvasy(e.y) / 32)
            self.bigtiles.set(
                self.selected_bigtile,
                x, y,
                self.selected_tile)
            self.selectBigtile()
        self.selectedbigtile.bind("<Button-1>", clickBigtile)
        self.selectedbigtile.bind("<B1-Motion>", clickBigtile)

        def rclickBigtile(e):
            x = math.floor(self.selectedbigtile.canvasx(e.x) / 32)
            y = math.floor(self.selectedbigtile.canvasy(e.y) / 32)
            self.selectTile(
                self.bigtiles.get(self.selected_bigtile, x, y)
            )
        self.selectedbigtile.bind("<Button-3>", rclickBigtile)
        self.selectedbigtile.bind("<Button-2>", rclickBigtile)

        bigtileoptions = tk.Frame(bigtileframe)
        bigtileoptions.grid(row=0, rowspan=2, column=1)
        tk.Button(bigtileoptions,
                  text="Refresh bigtile list",
                  command=self.buildBigTileset).pack()
        tk.Button(bigtileoptions,
                  text="Refresh room",
                  command=self.drawroom).pack()


        tk.Label(tilegrid, text="Current object:").pack()
        objectselectframe = tk.Frame(tilegrid)
        objectselectframe.pack()

        selectedobj = tk.StringVar()
        objoptions = ["#" + str(Objects.data.index(e)) + ": " + e["name"] for e in Objects.data ]
        selectedobj.set(objoptions[0])
        option = tk.OptionMenu(objectselectframe, selectedobj, *objoptions)
        option.grid(row=0, column=1)

        def getobj():
            data = selectedobj.get()
            return objoptions.index(data)

        objdetails = tk.Frame(tilegrid)
        objdetails.pack()

        # Details for moving platform
        platformframe = tk.Frame(objdetails)
        platformframe.grid(row=0, column=0, sticky="nsew")

        tk.Label(platformframe, text="Platform Options").pack()
        platformvert_var = tk.IntVar() 
        platformvert = tk.Checkbutton(platformframe, text="Vertical", variable=platformvert_var)
        platformvert.pack()

        platformlengthframe = tk.Frame(platformframe)
        platformlengthframe.pack()
        tk.Label(platformlengthframe, text="Travel Distance").grid(row=0, column=0)
        platformtravelentry = tk.Entry(platformlengthframe, width=3)
        platformtravelentry.insert(0, "40")
        platformtravelentry.grid(row=0, column=1)

        def getplatformdata():
            return [
                True if (platformvert_var.get() == 1) else False,
                int(platformtravelentry.get())
            ]
        platformframe.getdata = getplatformdata

        # Details for nothing
        nullframe = tk.Frame(objdetails)
        nullframe.grid(row=0, column=0, sticky="nsew")
        tk.Label(nullframe, text="No Options").pack()
        nullframe.getdata = lambda: []

        options = defaultdict(lambda: nullframe, {
            "platform" : platformframe,
        })
        def getcorrectoptions(*data):
            objtype = Objects.data[getobj()]["type"]
            options[objtype].tkraise()
        selectedobj.trace("w", getcorrectoptions)
        getcorrectoptions()
        def getoptiondata():
            objtype = Objects.data[getobj()]["type"]
            return options[objtype].getdata()

        # Right panel

        rightpanel = tk.Frame(self)
        rightpanel.grid(row=1, column=1)

        levelpanel = tk.Frame(rightpanel)
        levelpanel.grid(row=1, column=0)
        levelxscroll = tk.Scrollbar(levelpanel, orient=tk.HORIZONTAL)
        levelyscroll = tk.Scrollbar(levelpanel)
        levelxscroll.grid(row=1, column=0, sticky=tk.W + tk.E)
        levelyscroll.grid(row=0, column=1, sticky=tk.N + tk.S)
        self.levelcanvas = tk.Canvas(
            levelpanel, width=20*32, height=20*32,
            xscrollcommand=levelxscroll.set,
            yscrollcommand=levelyscroll.set)
        levelxscroll.config(command=self.levelcanvas.xview)
        levelyscroll.config(command=self.levelcanvas.yview)
        self.levelcanvas.grid(row=0, column=0)
        self.levelcanvas.image = self.levelcanvas.create_image(0, 0, anchor=tk.NW)

        self.drawroom()

        def clickLevel(e):
            if (self.mode == EditorMode.TILE_EDIT):
                x = math.floor(self.levelcanvas.canvasx(e.x) / 32)
                y = math.floor(self.levelcanvas.canvasy(e.y) / 32)
                self.currentlevel.set(
                    x, y,
                    self.selected_bigtile)
                #self.drawroom()
                self.drawtile(x, y, self.selected_bigtile)
            elif (self.mode == EditorMode.OBJECT_EDIT):
                x = self.levelcanvas.canvasx(e.x)
                y = self.levelcanvas.canvasx(e.y)
                for obj in self.currentlevel.objects:
                    if (abs(obj[1] - x) < 8 and abs(obj[2] - y) < 8):
                        self.selectobj(obj)
                        return
                x = math.floor(self.levelcanvas.canvasx(e.x) / 8) * 8
                y = math.floor(self.levelcanvas.canvasy(e.y) / 8) * 8
                self.currentlevel.addobj(getobj(), x, y, *getoptiondata())
                self.levelcanvas.img = ImageTk.PhotoImage(self.currentlevel.drawobj(x, y, getobj()))
                self.levelcanvas.itemconfig(
                    self.levelcanvas.image,
                    image=self.levelcanvas.img,
                )
                self.selectobj([getobj(), x, y])

        def deleteObj(*args):
            print(self.selectedobj)
            if (self.selectedobj is None):
                return
            x = self.selectedobj[1]
            y = self.selectedobj[2]
            for obj in self.currentlevel.objects:
                if obj[0] == self.selectedobj[0] and obj[1] == self.selectedobj[1] and obj[2] == self.selectedobj[2]:
                    self.currentlevel.delobj(obj)
                    self.deselectobj()
                    self.drawroom()
                    return
            self.statusbar.config(text="Couldn't find object")

        self.levelcanvas.bind("<Button-1>", clickLevel)
        self.levelcanvas.bind("<B1-Motion>", clickLevel)
        self.master.bind("<BackSpace>", deleteObj)
        self.master.bind("<Delete>", deleteObj)

        def rclickLevel(e):
            if (self.mode == EditorMode.OBJECT_EDIT):
                return
            x = math.floor(self.levelcanvas.canvasx(e.x) / 32)
            y = math.floor(self.levelcanvas.canvasy(e.y) / 32)
            self.selectBigtile(self.currentlevel.get(x, y))
        self.levelcanvas.bind("<Button-3>", rclickLevel)
        self.levelcanvas.bind("<Button-2>", rclickLevel)

        self.selectobjectbox = self.levelcanvas.create_rectangle((0, 0, 16, 16), outline='blue', width=0.0)

        self.statusbar = tk.Label(self, text="Loaded successfully!", bd=1,
                                  relief=tk.SUNKEN, anchor=tk.W)
        self.statusbar.grid(row=3, column=0, columnspan=4, sticky=tk.W+tk.E)
    
    def buildTileset(self, tiles):
        self.tiles = ImageTk.PhotoImage(tilesets.tilesets2x[tiles])
        self.tilecanvas.itemconfig(
            self.tilecanvas.img, image=self.tiles
        )

    def buildBigTileset(self, tiles=-1):
        #TODO: Handle different sets of bigtiles
        self.bigtilesimg = ImageTk.PhotoImage(self.bigtiles.draw())
        self.bigtilecanvas.itemconfig(
            self.bigtilecanvas.img, image=self.bigtilesimg
        )
    
    def selectTile(self, i):
        self.selected_tile = i
        self.selectedtile.img = ImageTk.PhotoImage(tilesets.tiles2x[self.tileset][i])
        self.selectedtile.config(image=self.selectedtile.img)

        solidity = SolidityType(self.bigtiles.key[self.selected_tile])
        self.currentsolid.config(image=self.solidityimg[solidity])
        self.soliditylabel.config(text="Solidity: "+solidity.name)

    def selectBigtile(self, i=-1):
        if i == -1:
            i = self.selected_bigtile
        else:
            self.selected_bigtile = i
        self.selectedbigtile.img = ImageTk.PhotoImage(self.bigtiles.drawtile2x(i))
        self.selectedbigtile.itemconfig(
            self.selectedbigtile.image, 
            image=self.selectedbigtile.img)

    def drawroom(self):
        self.levelcanvas.img = ImageTk.PhotoImage(self.currentlevel.draw(self.bigtiles))
        self.levelcanvas.itemconfig(
            self.levelcanvas.image,
            image=self.levelcanvas.img,
        )
        self.levelcanvas.config(
            scrollregion=(0, 0, self.levelcanvas.img.width(), self.levelcanvas.img.height())
        )
    
    def drawtile(self, x, y, i):
        self.levelcanvas.img = ImageTk.PhotoImage(self.currentlevel.draw(self.bigtiles))
        self.levelcanvas.itemconfig(
            self.levelcanvas.image,
            image=self.levelcanvas.img,
        )
        return
        tileimg = self.bigtiles.drawtile(i)
        print((x*32, y*32, x*32 + 32, y*32 + 32))
        self.levelcanvas.img.paste(tileimg, box=(x*32, y*32, x*32 + 32, y*32 + 32))

    def selectobj(self, obj):
        self.levelcanvas.itemconfig(
            self.selectobjectbox,
            width=2.0,
        )
        self.selectedobj = obj
        dictentry = Objects.data[obj[0]]
        width = dictentry["rect"][2]
        height = dictentry["rect"][3]
        self.levelcanvas.coords(
            self.selectobjectbox,
            obj[1] - width // 2, 
            obj[2] - height,
            obj[1] + width // 2,
            obj[2]
        )
    
    def deselectobj(self, obj):
        self.levelcanvas.itemconfig(
            self.selectobjectbox,
            width=0.0,
        )
        self.selectedobj = None

root = tk.Tk()
Editor(root).mainloop()
