	gcloud functions deploy setBuildBadge       	\
    	--runtime nodejs8                           \
    	--trigger-resource cloud-builds             \
    	--trigger-event google.pubsub.topic.publish \


    docker build -t run_python_tests ./runTests
    docker tag run_python_tests eu.gcr.io/pythonbuilds/run_python_tests
	docker push eu.gcr.io/pythonbuilds/run_python_tests	