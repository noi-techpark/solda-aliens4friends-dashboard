pipeline {
    options {
        ansiColor('xterm')
    }
	agent {

		// FIXME The container started but didn't run the expected command.
		// Please double check your ENTRYPOINT does execute the command passed
		// as docker run argument, as required by official docker images (see
		// https://github.com/docker-library/official-images#consistency for
		// entrypoint consistency requirements). Alternatively you can force
		// image entrypoint to be disabled by adding option `--entrypoint=''`.
		dockerfile {
			filename 'infrastructure/docker/Dockerfile'
			additionalBuildArgs '--target jenkinsci --build-arg JENKINS_USER_ID=$(id -u jenkins) --build-arg JENKINS_GROUP_ID=$(id -g jenkins)'
			args '--entrypoint=""'
		}
	}
	stages {
		stage('Backend - Test') {
			steps {
				sh """
					cp .env.default .env
					composer install
					php artisan key:generate
					php artisan test --without-tty
				"""
			}
		}
		stage('Frontend - Test') {
			steps {
				sh '''
					npm install
					npm run prod
				'''
			}
		}
	}
}
