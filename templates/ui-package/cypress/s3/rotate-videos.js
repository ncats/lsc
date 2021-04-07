/* Configuration */
const {BUCKET_NAME, REGION, LIMIT} = require('./config');

/* Import AWS SDK */
const AWS = require('@aws-sdk/client-s3');
const {log} = console;

/* Create a S3 client service object */
const s3 = new AWS.S3({
    region: REGION
});
const bucketParams = {Bucket: BUCKET_NAME};

/* Helper functions */
const mapToKey = p => arr => arr.map(i => i[p]);
const mapToTitle = mapToKey('Key');
const sortBy = (arr, p) => arr.sort((i, j) => (i[p] < j[p] ? 1 : -1));

const getFilesByDate = async () => {
    /* Fetch objects from desired S3 bucket */
    const files = await s3.listObjectsV2(bucketParams);
    log(`Fetched metadata for "${BUCKET_NAME}" bucket files`);

    /* Results by last modified date (descendant order) */
    const orderedByDate = sortBy(files.Contents, 'LastModified');

    log(`Bucket contains ${orderedByDate.length} file(s).`);

    return orderedByDate;
};

const rotateFiles = async (files, limit) => {
    /* Oldest files beyond count limit will be deleted */
    const deleteFiles = files.slice(limit);

    if (deleteFiles.length > 0) {
        log(`Deleting ${deleteFiles.length} file(s):`);
        log(mapToTitle(deleteFiles));

        const response = await s3.deleteObjects({
            ...bucketParams,
            Delete: {
                Objects: deleteFiles.map(item => ({
                    Key: item.Key
                }))
            }
        });
        if (!response.Errors) {
            log(`Successfully deleted ${response.Deleted.length} files.`);
        } else {
            log(response.Errors);
            /* Propagate error to CLI invocations */
            throw new Error('Could not perform delete operation');
        }
    } else {
        log(`File count does not exceed limit. Skipping delete step. `);
    }
};

const run = async () => {
    log(`File Count Limit set to ${LIMIT}`);
    let files = await getFilesByDate();
    await rotateFiles(files, LIMIT);
};

run();
