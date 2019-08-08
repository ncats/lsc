pipeline {
    options {
        skipDefaultCheckout()
        timestamps()
    }
    parameters {
        string(name: 'BUILD_VERSION', defaultValue: '', description: 'The build version to deploy (optional)')
    }
    agent {
        label 'internal-build.ncats'
    }
    triggers {
        pollSCM('H/5 * * * *')
    }
    environment {
        PROJECT_NAME = "PLEASE UPDATE WITH DEPLOYMENT NAME"
        TYPE = "web"
        DOCKER_REPO_NAME = "PLEASE UPDATE THE DOCKER REPOSITORY NAME"
    }
    stages {
        stage('Clean') {
            steps {
                cleanWs()
            }
        }
        stage('Build Version'){
            when { expression { return !params.BUILD_VERSION } }
            steps{
                script {
                    BUILD_VERSION_GENERATED = VersionNumber(
                        versionNumberString: 'v${BUILD_YEAR, XX}.${BUILD_MONTH, XX}${BUILD_DAY, XX}.${BUILDS_TODAY}',
                        projectStartDate:    '1970-01-01',
                        skipFailedBuilds:    true)
                    currentBuild.displayName = BUILD_VERSION_GENERATED
                    env.VERSION = BUILD_VERSION_GENERATED
                    env.BUILD = 'true'
                }
            }
        }
        stage('Build - Docker') {
            when { expression { return env.BUILD == 'true' }}
            steps {
                retry(3) {
                    sshagent (credentials: ['PLEASE UPDATE THE CREDENTIALS']) {
                        nodejs(configId: 'kw-npmrc', nodeJSInstallationName: 'Default Node.js') {
                            withEnv([
                                "IMAGE_NAME=PLEASE UPDATE WITH DEPLOYMENT NAME",
                                "BUILD_VERSION=" + (params.BUILD_VERSION ?: env.VERSION)
                            ]) {
                                checkout scm
                                script {
                                    def build = new org.labshare.Build()
                                    build.buildNodeJS()
                                    
                                    docker.build("${env.IMAGE_NAME}", "--no-cache --build-arg SOURCE_FOLDER=./${env.BUILD_VERSION} .")

                                    docker.withRegistry('PLEASE UPDATE THE DOCKER REPOSITORY NAME', 'PLEASE UPDATE THE DOCKER REGISTRY CREDENTIAL') {
                                        docker.image("${env.IMAGE_NAME}").push("${BUILD_VERSION}")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
 
        stage('Deploy - CI') {
            agent {
                label 'PLEASE UPDATE THE LABEL OF THE TARGET SERVER'
            }
            steps {
                configFileProvider([
                    configFile(fileId: 'PLEASE UPDATE WITH DEPLOYMENT NAME-ci-docker-config', targetLocation: 'app.conf'),
                    configFile(fileId: 'PLEASE UPDATE WITH DEPLOYMENT NAME-ci-docker-compose.yml', targetLocation: 'docker-compose.yml')
                ]) {
                    withAWS(credentials:'aws-jenkins-build') {
                        //env.DOCKER_LOGIN=""
                        sh '''
                        export DOCKER_LOGIN="`aws ecr get-login --no-include-email --region us-east-1`"
                        $DOCKER_LOGIN
                        '''
                        ecrLogin()
                        withEnv([
                            "IMAGE_NAME=PLEASE UPDATE WITH DEPLOYMENT NAME",
                            "BUILD_VERSION=" + (params.BUILD_VERSION ?: env.VERSION)
                        ]) {
                            script {
                                def docker = new org.labshare.Docker()
                                docker.deployDockerUI()
                            }
                        }
                    }
                }
            }
        }
    }
}