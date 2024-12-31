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
        stage('Start Backend') {
            steps {
                echo 'Starting the backend...'
                bat 'start /B npm start'
                bat 'timeout /T 20' // Wait for 10 seconds (adjust as needed)
            }
        }
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'build/**', onlyIfSuccessful: true
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