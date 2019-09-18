# Harbourmaster

Provides an API to access the seal images stored on the server instance

## Folder structure

Each folder has a particular structure with subfolders to separate the different images.

```
seal-images/
    LF1/
        originals/ # is where all the original images are stored, unaltered
        bottling-left/ # is where all bottling left images are stored
        uncategorised/
        ...
    LF28/
        originals/
        bottling-left/
        bottling-right/
        uncategorised/
        ...
    ...
```

The album parser will upload all images into the `originals` folder of each seal.

The Pelican microservice when used will submit all these images to the trained pose classifier model and will move the images to the appropriate `pose` folder if a successful match is found. If a match isn't found then the image is put in the `uncategorised` folder.

## Methods

### Get all seals

`https://{server}/harbourmaster/api/v1/seals`

### Get all images for a seal

`https://{server}/harbourmaster/api/v1/seals/{seal}`


### Get all images for a seal for a particular pose

`https://{server}/harbourmaster/api/v1/seal/{seal}/poses/{pose}`

### Get all uploaded albums

This lists all albums that have been submitted

`https://{server}/harbourmaster/api/v1/albums`


### Get the upload details for a particular album

`https://{server}/harbourmaster/api/v1/albums/{album}`


## Running with forever

To run the app using forever run:

```
export NODE_ENV=prod && nohup forever start -c "node src/index.js" ./
```
