pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    environment {
        NODE_ENV = 'production'
        DOCKER_REPO = 'thedevsami/messagehub' // Docker Hub repository
    }
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the code from GitHub...'
                git branch: 'main', credentialsId: 'GitHub-Auth', url: 'https://github.com/mhd-Sami/MessageHub.git'
            }
        }
        stage('Prepare Environment') {
            steps {
                echo 'Preparing the environment...'
                withCredentials([file(credentialsId: 'ENV-Secrets', variable: 'ENV_FILE')]) {
                    bat 'copy "%ENV_FILE%" .env'
                }
            }
        }
        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images for frontend and backend...'
                script {
                    // Build backend and frontend Docker images
                    bat 'docker build -t %DOCKER_REPO%:frontend-latest ./frontend'
                    bat 'docker build -t %DOCKER_REPO%:backend-latest .'
                }
            }
        }
        stage('Push Docker Images to Docker Hub') {
            steps {
                echo 'Pushing Docker images to Docker Hub...'
                withCredentials([usernamePassword(credentialsId: 'DockerHub-Auth', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    script {
                        // Log into Docker Hub securely
                        bat "docker login -u %DOCKER_USERNAME% -p %DOCKER_PASSWORD%"

                        // Push the images to Docker Hub
                        bat "docker push %DOCKER_REPO%:frontend-latest"
                        bat "docker push %DOCKER_REPO%:backend-latest"
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Deploy everything
                    bat "kubectl apply -f k8s/"
                    
                    // Wait for everything to be ready
                    bat "kubectl rollout status deployment/frontend-deployment"
                    bat "kubectl rollout status deployment/backend-deployment"
                    bat "kubectl rollout status deployment/mongo-deployment"
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
