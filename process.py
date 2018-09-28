# process.py
#
# Converts .terra files to images

from pixelgrid import *
import tkinter as tk
import json
import csv
import time

def rgb(hex_color):
    split = (hex_color[1:3], hex_color[3:5], hex_color[5:7])
    return tuple([int(x, 16) for x in split])

designation = "src/public/images/"
    
tk.Tk() # Initialize Tk system

# Editor images

pixelgrid = PixelGrid([(0,0,0)])
with open("src/images/editor-tiles.terra", "r") as fileo:
    pixelgrid.load(json.load(fileo))
filen = "src/editor/images/solidity.gif"
pixelgrid.changepage(0)
pixelgrid.getTkStrip(2, True).write(filen, format='gif')

# Game images

pixelgrid = PixelGrid([(0,0,0)])
with open("src/images/system.terra", "r") as fileo:
    pixelgrid.load(json.load(fileo))
filen = designation + "system.gif"
pixelgrid.changepage(0)
pixelgrid.getTkImage(1, False).write(filen, format='gif')

pixelgrid = PixelGrid([(0,0,0)])
with open("src/images/aspectstarside.terra", "r") as fileo:
    pixelgrid.load(json.load(fileo))
filen = designation + "player.gif"
pixelgrid.changepage(0)
pixelgrid.getTkImage(1, False).write(filen, format='gif')

pixelgrid = PixelGrid([(0,0,0)])
with open("src/images/particle.terra", "r") as fileo:
    pixelgrid.load(json.load(fileo))
filen = designation + "particle.gif"
pixelgrid.changepage(0)
pixelgrid.getTkImage(1, False).write(filen, format='gif')
filen = designation + "particle2.gif"
pixelgrid.changepage(1)
pixelgrid.getTkImage(1, False).write(filen, format='gif')

with open("src/images/characters.terra", "r") as fileo:
    pixelgrid.load(json.load(fileo))
filen = designation + "characters.gif"
pixelgrid.changepage(0)
pixelgrid.getTkImage(1, False).write(filen, format='gif')

with open("src/images/palace.terra", "r") as fileo:
    pixelgrid.load(json.load(fileo))
filen = designation + "level1.gif"
pixelgrid.changepage(0)
pixelgrid.getTkStrip(2, False).write(filen, format='gif')

with open("src/images/palace-objects.terra", "r") as fileo:
    pixelgrid.load(json.load(fileo))
filen = designation + "object1.gif"
pixelgrid.changepage(0)
pixelgrid.getTkImage(1, False).write(filen, format='gif')

with open("src/images/background.terra", "r") as fileo:
    pixelgrid.load(json.load(fileo))
filen = designation + "background.gif"
pixelgrid.changepage(0)
pixelgrid.getTkImage(1, True).write(filen, format='gif')
