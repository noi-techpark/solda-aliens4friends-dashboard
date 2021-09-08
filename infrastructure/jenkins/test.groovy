pipeline {
    agent any

    options {
        ansiColor('xterm')
    }

    environment {
		COMPOSE_PROJECT_NAME = "solda-dashboard"
        DOCKER_IMAGE = '755952719952.dkr.ecr.eu-west-1.amazonaws.com/solda-dashboard'
        DOCKER_TAG = "test-$BUILD_NUMBER"
		ANSIBLE_LIMIT = "test"

		APP_NAME = "Aliens4Friends"
		APP_ENV = "production"
		APP_DEBUG = true
		APP_URL = "https://dashboard.solda.testingmachine.eu"
		SERVER_PORT = 1077

        // Generate a new one with 'php artisan key:generate'
        APP_KEY = credentials('eu.testingmachine.aliens4friends.dashboard.appkey')

		DB_DATABASE = "a4f"
		DB_USERNAME = "a4f"
		DB_PASSWORD = credentials('eu.testingmachine.aliens4friends.dashboard.dbpassword')

		WWWGROUP = 0
		WWWUSER = 0
    }

    stages {
        stage('Configure') {
            steps {
                sh """
                    rm -f .env
                    echo 'COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME}' >> .env
                    echo 'DOCKER_IMAGE=${DOCKER_IMAGE}' >> .env
                    echo 'DOCKER_TAG=${DOCKER_TAG}' >> .env

					echo 'APP_NAME=${APP_NAME}' >> .env
					echo 'APP_ENV=${APP_ENV}' >> .env
					echo 'APP_DEBUG=${APP_DEBUG}' >> .env
					echo 'APP_URL=${APP_URL}' >> .env
					echo 'SERVER_PORT=${SERVER_PORT}' >> .env
                    echo 'APP_KEY=${APP_KEY}' >> .env
					echo 'DB_DATABASE=${DB_DATABASE}' >> .env
					echo 'DB_USERNAME=${DB_USERNAME}' >> .env
					echo 'DB_PASSWORD=${DB_PASSWORD}' >> .env
					echo 'WWWGROUP=${WWWGROUP}' >> .env
					echo 'WWWUSER=${WWWUSER}' >> .env
				"""
			}
		}
		stage('Test') {
            steps {
                sh '''
                    docker network create authentication || true
					docker-compose --no-ansi build --pull --build-arg WWWGROUP=$(id -g jenkins)
                    docker-compose --no-ansi run --rm --no-deps \
                        -e WWWUSER=$(id -u jenkins) \
                        -u $(id -u jenkins):$(id -g jenkins) \
                        --entrypoint 'bash -c' \
                        laravel.test \
                            'composer install && php artisan test'
                '''
            }
        }
        stage('Build') {
            steps {
                sh '''
                    aws ecr get-login --region eu-west-1 --no-include-email | bash
                    docker-compose --no-ansi -f infrastructure/docker/docker-compose.build.yml build --pull
                    docker-compose --no-ansi -f infrastructure/docker/docker-compose.build.yml push
                '''
            }
        }
        stage('Deploy') {
            steps {
               sshagent(['jenkins-ssh-key']) {
                    sh """
                        cd infrastructure/ansible
                        ansible-galaxy install -f -r requirements.yml
                        ansible-playbook --limit=${ANSIBLE_LIMIT} deploy.yml --extra-vars "release_name=${BUILD_NUMBER}"
                    """
                }
            }
        }
	}
}
