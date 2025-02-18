pipeline {
    agent any
    tools {
        git 'Default Git' // Use the exact name from Global Tool Configuration
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'git@github.com:Anu18495/New_Backend.git', branch: 'main', credentialsId: 'ff382ef9-be96-4777-b7bd-b34ba8cfa83f'
            }
        }
    }
}
