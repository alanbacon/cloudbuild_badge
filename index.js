const { Storage } = require("@google-cloud/storage");

/**
 * Auto-generated from cloud-build-badge. To deploy this cloud function, execute
 * the following command:
 *     gcloud functions deploy christmAIs \
 *         --runtime nodejs6 \
 *         --trigger-resource cloud-builds \
 *         --trigger-event google.pubsub.topic.publish
 *
 * @param {object} event Google Cloud Functions event
 * @param {function} callback callback function for handling events
 */

const BUCKET_NAME = "eu.artifacts.pythonbuilds.appspot.com";

exports.setBuildBadge = (event, context) => {
  const pubsubMessage = event.data;
  if (pubsubMessage) {
    buildResource = JSON.parse(
      Buffer.from(pubsubMessage, "base64").toString()
    );
    repoName = buildResource.source.repoSource.repoName;
    branch = buildResource.source.repoSource.branchName;
    status = buildResource.status;

    if (branch && ["master"].includes(branch)) {
      console.log("Creating badge for %s on branch %s", repoName, branch);
      const filename = "build/" + repoName + "-" + branch + ".svg";
      console.log("Filename will be %s", filename);
      const storage = new Storage();

      if (status == "SUCCESS") {
        console.log("Detected build success!");
        storage
          .bucket(BUCKET_NAME)
          .file("build/success.svg")
          .copy(storage.bucket(BUCKET_NAME).file(filename));
        console.log("Switched badge to build success");
        storage
          .bucket(BUCKET_NAME)
          .file(filename)
          .makePublic(function(err, apiResponse) {});
        console.log("Badge set to public");
      }
      if (status == "FAILURE") {
        console.log("Detected build failure!");
        storage
          .bucket(BUCKET_NAME)
          .file("build/failure.svg")
          .copy(storage.bucket(BUCKET_NAME).file(filename));
        console.log("Switched badge to build failure");
        storage
          .bucket(BUCKET_NAME)
          .file(filename)
          .makePublic(function(err, apiResponse) {});
        console.log("Badge set to public");
      }
    }
  }
};