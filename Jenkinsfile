pipeline {
    agent any
    stages {
        stage('Clone Repo') {
            steps {
                git 'https://github.com/Anu18495/New_Backend.git'
            }
        }
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                sshagent(['aws-ec2-key']) {
                    sh 'scp -r * ec2-user@your-ec2-instance:/var/www/html/'
                }
            }
        }
    }
}

