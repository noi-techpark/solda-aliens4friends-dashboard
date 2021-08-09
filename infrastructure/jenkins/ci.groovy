pipeline {
    agent {
        dockerfile {
            filename 'infrastructure/docker/7.4/Dockerfile'
            additionalBuildArgs '--build-arg JENKINS_USER_ID=$(id -u jenkins) --build-arg JENKINS_GROUP_ID=$(id -g jenkins) --build-arg WWWGROUP=$(id -g jenkins)'
        }
    }

    stages {
        stage('Backend - Test') {
            steps {
                sh '''
                   php artisan test
                '''
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
