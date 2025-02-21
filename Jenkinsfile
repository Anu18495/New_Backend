pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                script {
                    // Use Jenkins credentials to securely access the GitHub Personal Access Token
                    withCredentials([string(credentialsId: 'github-token', variable: 'GH_TOKEN')]) {
                        // Set the GitHub token in the environment to authenticate the git commands
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

