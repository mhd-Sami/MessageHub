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
                // Pull the latest code from GitHub
                git branch: 'main', credentialsId: 'GitHub-Auth', url: 'https://github.com/mhd-Sami/MessageHub.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                // Install dependencies from the root directory
                bat 'npm install'
            }
        }
        stage('Build Backend') {
            steps {
                // Ensure the backend server can be built without errors
                echo 'Building the backend...'
                withCredentials([file(credentialsId: 'ENV-Secrets', variable: 'ENV_FILE')]) {
                    bat 'copy $ENV_FILE .env'
                    bat 'npm run build --prefix backend'
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
