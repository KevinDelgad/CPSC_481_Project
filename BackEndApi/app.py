from flask import Flask, Response, request, jsonify
from io import BytesIO
import base64
from flask_cors import CORS, cross_origin
import os
import sys
import cv2
import numpy as np
from rubik.cube import Cube
from rubik.solve import Solver


app = Flask(__name__)
cors = CORS(app)

facecolors = {"front": [],
                "top": [],
                "back": [],
                "bottom": [],
                "left": [],
                "right": []}

def imageNaming():
    file_path= 'images/image0.jpg'
    
    if(checkFullImage()):
        clearPhotos()

    for num in range(6):
        if(os.path.isfile(file_path)):
            file_path = "images/image" + str(num) + ".jpg"
        else:
            break

    return file_path


def checkFullImage():
    if(os.path.isfile("images/image5.jpg")):
        return True
    return False

def clearPhotos():
    for num in range(6):
        os.remove("images/image" + str(num) + ".jpg")

def getColors():
    colorBounds = {"red" : [np.array([39, 14, 0], dtype="uint8"), np.array([95, 120, 255], dtype="uint8")],
                "yellow ": [np.array([10, 127, 130], dtype="uint8"), np.array([30, 230, 230], dtype="uint8")],
                "orange": [np.array([4, 140, 173], dtype="uint8"), np.array([80, 180, 250],dtype="uint8")],
                "blue" : [np.array([121, 118, 0], dtype='uint8'), np.array([255, 255, 100],  dtype='uint8')],
                "green" : [np.array([3, 0, 20], dtype='uint8'), np.array([26, 255, 120], dtype='uint8')],
                "white" : [np.array([120, 120, 160], dtype='uint8'), np.array([255, 255, 255], dtype='uint8')]
                }

    for picture in range(6):
        image = cv2.imread('images/image' + str(picture) + '.jpg')
        for rowStart in range(0, 300, 100):
            rowEnd = rowStart + 100
            for colStart in range(0, 300, 100):
                #colorFound = False
                colEnd = colStart + 100
                #Get Center of cube face
                (cX, cY) = (colEnd, rowEnd)
                #Each Rubik Cube Piece will be 100X100 pixels 

                #slice image to only get  middle
                t1 = image[rowStart:cY, colStart:cX]
                #(h,w) = t1.shape[:2]
                t2 = t1[25:75, 25:75]
                for colors in colorBounds:            
                    lower = colorBounds[colors][0]
                    upper = colorBounds[colors][1]

                    mask = cv2.inRange(t2, lower, upper)
                    #detected_output = cv2.bitwise_and(t2, t2, mask=mask)
                    found = cv2.countNonZero(mask)
                    firstKey = list(facecolors)[picture]
                    if(found > 60):
                        facecolors[firstKey].append(colors)
                        break
                    if(colors == "white"):
                        facecolors[firstKey].append("black")

@app.route("/image", methods=['GET', 'POST'])
def image():
    if(request.method == "POST"):
        bytesOfImage = request.get_data()
        file_path = imageNaming()
        with open(file_path, 'wb') as out:
            out.write(bytesOfImage)
        if(checkFullImage()):
            getColors()
            tempcolors = dict(facecolors)
            facecolors.update({"front": [],
                "top": [],
                "back": [],
                "bottom": [],
                "left": [],
                "right": []})
            print(facecolors)
            print(tempcolors)
            return jsonify(tempcolors)
        return "Image read"


def fetch_cube_state_as_str(json_orientation):
    string_orientation = ""
    other_faces = ["left", "front", "right", "back"]
    
    start_index = 0
    end_index = 3

    for square in json_orientation["top"]:
        string_orientation += square[0].upper()

    while (end_index <= 9):
        for face in other_faces:
            color_set = json_orientation[face][start_index:end_index]
            for color in color_set:
                string_orientation += color[0].upper()
        
        start_index += 3
        end_index += 3
    
    for square in json_orientation["bottom"]:
        string_orientation += square[0].upper()

    return string_orientation

def convert_solver_moves(solver_moves):
    legend = {
        "U": "Turn the upper face clockwise (90 degrees)",
        "Ui": "Turn the upper face counterclockwise (90 degrees)",
        "B": "Turn the back face clockwise (90 degrees)",
        "Bi": "Turnthe back face counterclockwise (90 degrees)",
        "E": "Turn the Equatorial slice clockwise (90 degrees)",
        "Ei": "Turn the Equatorial slice counterclockwise (90 degrees)",
        "L": "Turn the Left face clockwise (90 degrees)",
        "Li": "Turn the Left face counterclockwise (90 degrees)",
        "R": "Turn the Right face clockwise (90 degrees)",
        "Ri": "Turn the Right face counterclockwise (90 degrees)",
        "D": "Turn the Down face clockwise (90 degrees)",
        "Di": "Turn the Down face counterclockwise (90 degrees)",
        "F": "Turn the Front face clockwise (90 degrees)",
        "Fi": "Turn the Front face counterclockwise (90 degrees)",
        "S": "Turn the middle vertical slice clockwise (90 degrees)",
        "Si": "Turn the middle vertical slice counterclockwise (90 degrees)",
        "X": "Rotate the entire cube around the X-axis clockwise (viewed from the front)",
        "Xi": "Rotate the entire cube around the X-axis counterclockwise (viewed from the front)",
        "Z": "Rotate the entire cube around the Z-axis clockwise (viewed from the front)",
        "Zi": "Rotate the entire cube around the Z-axis counterclockwise (viewed from the front)"
    }

    converted_moves = []

    for move in solver_moves:
        converted_moves.append(legend[move])
    
    return converted_moves

@app.route("/steps", methods=['GET', 'POST'])
def steps():
    if request.method == "POST":
        json_orientation = request.json["imageValues"]
        print(json_orientation)
        string_orientation = fetch_cube_state_as_str(json_orientation)

        cube = Cube(string_orientation)
        print(cube)
        solver = Solver(cube)
        solver.solve()

        raw_moves = solver.moves
        converted_moves = convert_solver_moves(raw_moves)

        steps = {
            "raw_moves": raw_moves,
            "converted_moves": converted_moves
        }

        return jsonify(steps)
