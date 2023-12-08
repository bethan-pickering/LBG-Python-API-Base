pipeline {
    agent any
    stages {
        stage('Init') {
            steps {
                sh '''
                ssh -i ~/.ssh/id_rsa jenkins@10.200.0.3 << EOF
                docker stop flask-app || echo "flask-app not running"
                docker rm flask-app || echo "flask-app not running"
                '''
           }
        }
        stage('Build') {
            steps {
                sh '''
                docker build -t stratcastor/python-api -t stratcastor/python-api:v${BUILD_NUMBER} .                  
                '''
           }
        }
        stage('Push') {
            steps {
                sh '''
                docker push stratcastor/python-api
                docker push stratcastor/python-api:v${BUILD_NUMBER}
                '''
           }
        }
        stage('Deploy') {
            steps {
                sh '''
                ssh -i ~/.ssh/id_rsa jenkins@10.200.0.3 << EOF
                docker run -d -p 80:8080 --name flask-app stratcastor/python-api
                '''
            }
        }
        stage('Cleanup') {
            steps {
                sh '''
                docker system prune -f 
                '''
           }
        }
    }
}
