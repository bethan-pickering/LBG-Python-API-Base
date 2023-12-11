pipeline {
    agent any
    stages {
        stage('Init') {
            steps {
                script {
			        if (env.GIT_BRANCH == 'origin/main') {
                        sh '''
                        ssh -i ~/.ssh/id_rsa jenkins@10.200.0.3 << EOF
                        docker stop flask-app || echo "flask-app not running"
                        docker rm flask-app || echo "flask-app not running"
                        docker stop nginx || echo "nginx not running"
                        docker rm nginx || echo "nginx not running"
                        docker rmi stratcastor/python-api || echo "Image does not exist"
                        docker rmi stratcastor/flask-nginx || echo "Image does not exist"
                        docker network create project || echo "network already exists"
                        '''
                    } else if (env.GIT_BRANCH == 'origin/dev') {
                        sh '''
                        ssh -i ~/.ssh/id_rsa jenkins@10.200.0.15 << EOF
                        docker stop flask-app || echo "flask-app not running"
                        docker rm flask-app || echo "flask-app not running"
                        docker stop nginx || echo "nginx not running"
                        docker rm nginx || echo "nginx not running"
                        docker rmi stratcastor/python-api || echo "Image does not exist"
                        docker rmi stratcastor/flask-nginx || echo "Image does not exist"
                        docker network create project || echo "network already exists"
                        '''
                    } else {
                        sh '''
                        echo "Unrecognised branch"
                        '''
                    }
		        }
           }
        }
        stage('Build') {
            steps {
                script {
			        if (env.GIT_BRANCH == 'origin/main') {
                        sh '''
                        echo "Build not required in main"
                        '''
                    } else if (env.GIT_BRANCH == 'origin/dev') {
                        sh '''
                        docker build -t stratcastor/python-api -t stratcastor/python-api:v${BUILD_NUMBER} .   
                        docker build -t stratcastor/flask-nginx -t stratcastor/flask-nginx:v${BUILD_NUMBER} ./nginx             
                        '''
                    } else {
                        sh '''
                        echo "Unrecognised branch"
                        '''
                    }
		        }
           }
        }
        stage('Push') {
            steps {
                script {
			        if (env.GIT_BRANCH == 'origin/main') {
                        sh '''
                        echo "Push not required in main"
                        '''
                    } else if (env.GIT_BRANCH == 'origin/dev') {
                        sh '''
                        docker push stratcastor/python-api
                        docker push stratcastor/python-api:v${BUILD_NUMBER}
                        docker push stratcastor/flask-nginx
                        docker push stratcastor/flask-nginx:v${BUILD_NUMBER}
                        '''
                    } else {
                        sh '''
                        echo "Unrecognised branch"
                        '''
                    }
		        }
           }
        }
        stage('Deploy') {
            steps {
                script {
			        if (env.GIT_BRANCH == 'origin/main') {
                        sh '''
                        ssh -i ~/.ssh/id_rsa jenkins@10.200.0.3 << EOF
                        docker run -d --name flask-app --network project stratcastor/python-api
                        docker run -d -p 80:80 --name nginx --network project stratcastor/flask-nginx
                        '''
                    } else if (env.GIT_BRANCH == 'origin/dev') {
                        sh '''
                        ssh -i ~/.ssh/id_rsa jenkins@10.200.0.15 << EOF
                        docker run -d --name flask-app --network project stratcastor/python-api
                        docker run -d -p 80:80 --name nginx --network project stratcastor/flask-nginx
                        '''
                    } else {
                        sh '''
                        echo "Unrecognised branch"
                        '''
                    }
		        }
            }
        }
        stage('Cleanup') {
            steps {
                script {
                    if (env.GIT_BRANCH == 'origin/dev') {
                        sh '''
                        docker rmi stratcastor/python-api:v${BUILD_NUMBER}
                        docker rmi stratcastor/flask-nginx:v${BUILD_NUMBER}
                        '''
                    }
                }
                sh '''
                docker system prune -f 
                '''
           }
        }
    }
}
