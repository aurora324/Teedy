// pipeline {
//     agent any
//     stages {
//         stage('Clean') {
//             steps {
//                 sh 'mvn clean'
//             }
//         }
//         stage('Compile') {
//             steps {
//                 sh 'mvn compile'
//             }
//         }
//         stage('Test') {
//             steps {
//                 sh 'mvn test -Dmaven.test.failure.ignore=true'
//             }
//         }
//         stage('PMD') {
//             steps {
//                 sh 'mvn pmd:pmd'
//             }
//         }
//         stage('JaCoCo') {
//             steps {
//                 sh 'mvn jacoco:report'
//             }
//         }
//         stage('Javadoc') {
//             steps {
//                 sh 'mvn javadoc:javadoc'
//             }
//         }
//         stage('Site') {
//             steps {
//                 sh 'mvn site'
//             }
//         }
//         stage('Package') {
//             steps {
//                 sh 'mvn package -DskipTests'
//             }
//         }
//     }
//     post {
//         always {
//             archiveArtifacts artifacts: '**/target/site/**/*.*', fingerprint: true
//             archiveArtifacts artifacts: '**/target/**/*.jar', fingerprint: true
//             archiveArtifacts artifacts: '**/target/**/*.war', fingerprint: true
//             junit '**/target/surefire-reports/*.xml'
//         }
//     }
// }



// pipeline {
//     agent any
//     environment {
//         // define environment variable
//         // Jenkins credentials configuration
//         DOCKER_HUB_CREDENTIALS = credentials('ff5be8f9-e6e9-4799-ad45-9a69fc3e1cde') // Docker Hub credentials ID store in Jenkins
//         // Docker Hub Repository's name
//         DOCKER_IMAGE = 'bingqinwang/teedy' // your Docker Hub user name and Repository's name
//         DOCKER_TAG = "${env.BUILD_NUMBER}" // use build number as tag
//     }
//     stages {
//         stage('Build') {
//             steps {
//                 checkout scmGit(
//                     branches: [[name: '*/master']],
//                     extensions: [],
//                     userRemoteConfigs: [[url: 'https://github.com/aurora324/Teedy.git']]
//                     // your github Repository
//                 )
//                 sh 'mvn -B -DskipTests clean package'
//             }
//         }
//         // Building Docker images
//         stage('Building image') {
//             steps {
//                 script {
//                     // assume Dockerfile locate at root
//                     docker.build("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}")
//                 }
//             }
//         }
        
//         // Uploading Docker images into Docker Hub
//         stage('Upload image') {
//             steps {
//                 script {
//                     // sign in Docker Hub
//                     docker.withRegistry('https://registry.hub.docker.com',
//                     env.DOCKER_HUB_CREDENTIALS) {
//                     // push image
//                     docker.image("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}").push()
//                     // ：optional: label latest
//                     docker.image("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}").push('latest')
//                     }
//                 }
//             }
//         }
//         // Running Docker container
//         stage('Run containers') {
//             steps {
//                 script {
//                 // stop then remove containers if exists
//                 sh 'docker stop teedy-container-8081 || true'
//                 sh 'docker rm teedy-container-8081 || true'
//                 // run Container
//                 docker.image("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}").run(
//                 '--name teedy-container-8081 -d -p 8081:8080'
//                 )
//                 // Optional: list all teedy-containers
//                 sh 'docker ps --filter "name=teedy-container"'
//                 }
//             }
//         }
//     }
// }

// pipeline {
//     agent any
//     environment {
//         // Docker Hub credentials ID (just the ID string)
//         DOCKER_HUB_CREDENTIALS_ID = 'ff5be8f9-e6e9-4799-ad45-9a69fc3e1cde'
//         DOCKER_IMAGE = 'bingqinwang/teedy'
//         DOCKER_TAG = "${BUILD_NUMBER}"  // BUILD_NUMBER 是内建环境变量
//     }
//     stages {
//         stage('Build') {
//             steps {
//                 checkout scmGit(
//                     branches: [[name: '*/master']],
//                     extensions: [],
//                     userRemoteConfigs: [[url: 'https://github.com/aurora324/Teedy.git']]
//                 )
//                 sh 'mvn -B -DskipTests clean package'
//             }
//         }

        // stage('Building image') {
        //     steps {
        //         script {
        //             docker.build("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}")
        //         }
        //     }
        // }

        // stage('Upload image') {
        //     steps {
        //         script {
        //             docker.withRegistry('https://registry.hub.docker.com', env.DOCKER_HUB_CREDENTIALS_ID) {
        //                 docker.image("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}").push()
        //                 docker.image("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}").push('latest')
        //             }
        //         }
        //     }
        // }

//         stage('Run containers') {
//             steps {
//                 script {
//                     sh 'docker stop teedy-container-8081 || true'
//                     sh 'docker rm teedy-container-8081 || true'
//                     docker.image("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}").run(
//                         '--name teedy-container-8081 -d -p 8081:8080'
//                     )
//                     sh 'docker ps --filter "name=teedy-container"'
//                 }
//             }
//         }
//     }
// }

// pipeline {
//     agent any

//     environment {
//         DEPLOYMENT_NAME = "hello-node"
//         CONTAINER_NAME  = "docs"
//         IMAGE_NAME      = "sismics/docs:latest"
//         // 清除代理设置，避免干扰 kubectl
//         HTTP_PROXY      = ""
//         HTTPS_PROXY     = ""
//         http_proxy      = ""
//         https_proxy     = ""
//     }

//     stages {
//         stage('Start Minikube') {
//             steps {
//                 sh '''
//                     if ! minikube status | grep -q "Running"; then
//                         echo "Starting Minikube..."
//                         minikube start
//                     else
//                         echo "Minikube already running."
//                     fi
//                 '''
//             }
//         }

//         stage('Set Image') {
//             steps {
//                 sh '''
//                 echo "Setting image for deployment..."
//                 unset http_proxy
//                 unset https_proxy
//                 kubectl set image deployment/${DEPLOYMENT_NAME} ${CONTAINER_NAME}=${IMAGE_NAME}
//                 '''
//             }
//         }

//         stage('Verify') {
//             steps {
//                 sh "kubectl rollout status deployment/${DEPLOYMENT_NAME}"
//                 sh "kubectl get pods"
//             }
//         }
//     }
// }


// pipeline {
//     agent any

//     environment {
//         DEPLOYMENT_NAME = "hello-node"
//         CONTAINER_NAME  = "docs"
//         IMAGE_NAME      = "sismics/docs:latest"
//         HTTP_PROXY      = ""
//         HTTPS_PROXY     = ""
//         http_proxy      = ""
//         https_proxy     = ""
//         NO_PROXY        = "localhost,127.0.0.1"
//     }

//     stages {
//         stage('Start Minikube') {
//             steps {
//                 sh '''
//                     echo "Checking Minikube..."
//                     unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
//                     if ! minikube status | grep -q "Running"; then
//                         echo "Starting Minikube..."
//                         minikube start --force
//                     else
//                         echo "Minikube already running."
//                     fi
//                 '''
//             }
//         }

//         stage('Set Image') {
//             steps {
//                 sh '''
//                     echo "Setting image for deployment..."
//                     unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
//                     kubectl set image deployment/${DEPLOYMENT_NAME} ${CONTAINER_NAME}=${IMAGE_NAME}
//                 '''
//             }
//         }

//         stage('Verify') {
//             steps {
//                 sh '''
//                     echo "Verifying rollout..."
//                     unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
//                     kubectl rollout status deployment/${DEPLOYMENT_NAME}
//                     kubectl get pods
//                 '''
//             }
//         }
//     }
// }


pipeline {
    agent any

    environment {
        DEPLOYMENT_NAME = "hello-node"
        CONTAINER_NAME  = "docs"
        IMAGE_NAME      = "sismics/docs:v1.11"
        HTTP_PROXY = ""
        HTTPS_PROXY = ""
        http_proxy = ""
        https_proxy = ""
    }

    stages {
        stage('Start Minikube') {
            steps {
                sh '''
                    unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
                    echo "Checking Minikube..."
                    if ! minikube status | grep -q "Running"; then
                        minikube start --force
                    else
                        echo "Minikube already running."
                    fi
                '''
            }
        }

        stage('Load Docker Image') {
            steps {
                sh '''
                    unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
                    minikube image load ${IMAGE_NAME}
                '''
            }
        }

        stage('Set Image') {
            steps {
                sh '''
                    unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
                    echo "Setting image for deployment..."
                    if ! kubectl get deployment ${DEPLOYMENT_NAME}; then
                        kubectl create deployment ${DEPLOYMENT_NAME} --image=${IMAGE_NAME}
                    else
                        kubectl set image deployment/${DEPLOYMENT_NAME} ${CONTAINER_NAME}=${IMAGE_NAME}
                    fi
                '''
            }
        }

        stage('Force Cleanup Old Pods') {
            steps {
                sh '''
                    unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
                    echo "Force deleting old pods to unblock rollout..."
                    kubectl delete pod -l app=hello-node --grace-period=0 --force || true
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                    unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
                    echo "Verifying deployment..."
                    kubectl rollout status deployment/${DEPLOYMENT_NAME}
                    kubectl get pods
                '''
            }
        }
    }
}

