pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                script {
                    // Use the correct GitHub PAT stored as a secret text
                    withCredentials([string(credentialsId: 'github-token', variable: 'GH_TOKEN')]) {
                        // Use GH_TOKEN in your git commands
                        sh '''
                            git config --global credential.helper store
                            echo "https://$GH_TOKEN@github.com" > ~/.git-credentials
                            git clone https://github.com/Anu18495/New_Backend.git
                            cd New_Backend
                            git config --global user.email "Anu18495@users.noreply.github.com"
                            git config --global user.name "Anu18495"
                        '''
                    }
                }
            }
        }
    }
}

