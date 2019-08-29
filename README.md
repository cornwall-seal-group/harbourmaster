# Harbourmaster

Provides an API to access the minio instance including all seal images

## Bucket folder structure

Each bucket has a particular folder structure with subfolders to separate the different images.

```
seal-images/
    LF1/
        originals/ # is where all the original images are stored, unaltered
        pd_{iteration}/ # is where all prediction images are stored that have been found from the Pattern Detection (pd) model iteration
    LF28/
        originals/
        pd_{iteration}/
    ...
```

## Methods

### Get all buckets

`https://{server}/harbourmaster/api/v1/buckets`

### Get all files in a bucket

`https://{server}/harbourmaster/api/v1/bucket/{bucketName}/files`

### Get all files for a pattern detection iteration for a seal (in a bucket)

`https://{server}/harbourmaster/api/v1/bucket/{bucketName}/files/{iterationId}`
