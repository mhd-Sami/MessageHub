pipeline {
    agent any
    tools {
        nodejs 'NodeJS' // Ensure this matches the name configured in Global Tool Configuration
    }
    environment {
        NODE_ENV = 'production'
        DOCKER_REPO = 'messagehub' // Docker Hub repository
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
                    bat "docker build -t %env.DOCKER_REPO%/frontend:latest ./frontend" // Tag the frontend image with 'frontend'
                    bat "docker build -t %env.DOCKER_REPO%/backend:latest ." // Tag the backend image with 'backend'

                }
            }
        }
        stage('Push Docker Images to Docker Hub') {
            steps {
                echo 'Pushing Docker images to Docker Hub...'
                withCredentials([usernamePassword(credentialsId: 'DockerHub-Auth', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    script {
                        // Log into Docker Hub
                        bat "docker login -u %DOCKER_USERNAME% -p %DOCKER_PASSWORD%"

                        // Push the images to Docker Hub
                         // Push the frontend image to Docker Hub
                        bat "docker push %env.DOCKER_REPO%/frontend:latest"

                        // Push the backend image to Docker Hub
                        bat "docker push %env.DOCKER_REPO%/backend:latest"

                    }
                }
            }
        }
        stage('Set up Minikube and kubectl') {
            steps {
                echo 'Setting up Minikube and kubectl...'
                script {
                    // Set up Minikube
                    bat 'minikube start'

                    // Set up kubectl to use Minikube context
                    bat 'kubectl config use-context minikube'
                }
            }
        }
        stage('Deploy to Minikube') {
            steps {
                echo 'Deploying to Minikube...'
                script {
                    // Deploy using Kubernetes manifests
                    bat 'kubectl apply -f k8s/'
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
            echo 'Build and Deployment Completed Successfully!'
        }
        failure {
            echo 'Build and Deployment Failed. Check logs for details.'
        }
    }
}
