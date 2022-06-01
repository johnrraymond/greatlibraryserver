import os
import json
from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse


def nft(request):

    path = request.path
    
    path = os.path.normpath(path)
    ds = path.split(os.sep)
    
    datamine = ds[2]
    serial = ds[3]


    metadata = {
        "description": "Bookmark for " + datamine,
        'image': "https://www.nftbooks.art/art?type=bookmark&curserial_num=" + serial + "&datamine=" + datamine,
        "name": datamine + " Bookmark: " + serial,
    }

    return JsonResponse(metadata)


def getmetadata(datamine):
    f = open("/home/john/" + datamine + "/metadata.json", "r")
    metadata = f.read()
    f.close()
    return metadata


def getusage(datamine):
    f = open("/home/john/" + datamine + "/README.txt", "r")
    metadata = f.read()
    f.close()
    return metadata

def usage(request):
    
        path = request.path
        
        path = os.path.normpath(path)
        ds = path.split(os.sep)
        
        datamine = ds[2]

        return HttpResponse(getusage(datamine), content_type='text/pain')

def contractMetadata(request):

    path = request.path
    
    path = os.path.normpath(path)
    ds = path.split(os.sep)
    
    datamine = ds[2]


    metadata = getmetadata(datamine)

    return JsonResponse(metadata)
