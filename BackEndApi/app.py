from flask import Flask, Response, request, jsonify
from io import BytesIO
import base64
from flask_cors import CORS, cross_origin
import os
import sys
import cv2
import numpy as np


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
                colorFound = False
                colEnd = colStart + 100
                #Get Center of cube face
                (cX, cY) = (colEnd, rowEnd)
                #Each Rubik Cube Piece will be 100X100 pixels 

                #slice image to only get  middle
                t1 = image[rowStart:cY, colStart:cX]
                (h,w) = t1.shape[:2]
                t2 = t1[25:75, 25:75]
                for colors in colorBounds:            
                    lower = colorBounds[colors][0]
                    upper = colorBounds[colors][1]

                    mask = cv2.inRange(t2, lower, upper)
                    detected_output = cv2.bitwise_and(t2, t2, mask=mask)
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
