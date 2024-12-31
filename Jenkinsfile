pipeline {
    agent any
    tools {
        nodejs 'NodeJS' // Ensure this matches the name configured in Global Tool Configuration
    }
    environment {
        NODE_ENV = 'production' 
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'GitHub-Auth', url: 'https://github.com/mhd-Sami/MessageHub.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        stage('Prepare Environment') {
            steps {
                withCredentials([file(credentialsId: 'ENV-Secrets', variable: 'ENV_FILE')]) {
                    bat 'copy "%ENV_FILE%" .env'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("messagehub-backend:${env.BUILD_ID}")
                }
            }
        }
        stage('Run Docker Container') {
            steps {
                script {
                    dockerImage.run('-d -p 5000:5000 --env-file .env')
                }
            }
        }
    }
    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Build Completed Successfully!'
        }
        failure {
            echo 'Build Failed. Check logs for details.'
        }
    }
}