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
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                        // Deploy to Kubernetes
                        bat "kubectl apply -f k8s/ --validate=false"
                        
                        // Wait for deployments
                        bat "kubectl rollout status deployment/frontend-deployment"
                        bat "kubectl rollout status deployment/backend-deployment"
                        bat "kubectl rollout status deployment/mongo-deployment"
                    }
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
            emailext(
                subject: "Jenkins Build Success: ${currentBuild.fullDisplayName}",
                body: """The build was successful.

Job: ${currentBuild.fullDisplayName}
Build Number: ${currentBuild.number}

Check the build details at: ${currentBuild.absoluteUrl}""",
                to: 'dev.thesami@gmail.com,zulkha.dev@gmail.com,muhammadsami2502@gmail.com,zulkhasheikh986@gmail.com',
            )
        }
        failure {
            echo 'Build Failed. Check logs for details.'
            emailext(
                subject: "Jenkins Build Failure: ${currentBuild.fullDisplayName}",
                body: """The build failed.

Job: ${currentBuild.fullDisplayName}
Build Number: ${currentBuild.number}

Check the build details at: ${currentBuild.absoluteUrl}""",
                to: 'dev.thesami@gmail.com,zulkha.dev@gmail.com,muhammadsami2502@gmail.com,zulkhasheikh986@gmail.com',
            )
        }
    }
}
