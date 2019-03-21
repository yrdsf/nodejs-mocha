node {
    try {    
        ws("workspace/${env.JOB_NAME}") {
            stage('Start') {
                notifyBuild('STARTED')
            }
            stage('Clean') {
                step([$class: 'WsCleanup'])
            }
            stage('Checkout') {
                checkout scm
            }
            stage('Install dependencies') {
                dir('./javascript') {
                    bat 'npm install'
                }
                dir('./sql') {
                    bat 'npm install'
                }
            }  
            stage('Test NodeJs') {
                dir('./javascript') {
                    bat 'npm test'
                }
            } 
            stage('Test SQL') {
                dir('./sql') {
                    bat 'npm test'
                }
            } 

            // stage('Sonar') {
            //     withSonarQubeEnv('Sonar Qube Server') {
            //         def branchName = env.BRANCH_NAME.capitalize()
            //         dir('.') {
            //             //sh "dotnet tool install --global dotnet-sonarscanner"
            //             bat "dotnet sonarscanner begin /k:sb.ofertas /n:\"SB - Personalizacion - \" /d:sonar.host.url=%SONAR_HOST_URL% /d:sonar.login=%SONAR_AUTH_TOKEN% /d:sonar.branch=${branchName} /d:sonar.inclusions=**/*.cs"
            //             bat "dotnet restore"
            //             bat "dotnet build"
            //             bat "dotnet sonarscanner end /d:sonar.login=%SONAR_AUTH_TOKEN%"
            //         }
            //     }
            // }
            // stage('Serverless'){
            //     dir('src/Serverless/Sync'){
            //         sh "chmod +x ./build.sh"
            //         sh "./build.sh"
            //         sh "serverless deploy"
            //     }
            // }
        }
    }
    catch(error) {
        currentBuild.result = 'FAILURE'
    }
    stage('Finish') {
        notifyBuild(currentBuild.result)
    }
}

def notifyBuild(String buildStatus = 'STARTED') {
    // default build status in case is not passed as parameter
    buildStatus = buildStatus ?: 'SUCCESS'

    // variables and constants
    def colorName = 'RED'
    def colorCode = '#FF0000'
    def from = 'jenkins@belcorp.biz'
    def subject = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
    def summary = "${subject} (${env.RUN_DISPLAY_URL})"
    def details = "<p>${buildStatus}: Job <a href='${env.RUN_DISPLAY_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>"

    // override default values based on build status
    if (buildStatus == 'STARTED') {
        color = 'YELLOW'
        colorCode = '#FFFF00'
    } else if (buildStatus == 'SUCCESS') {
        color = 'GREEN'
        colorCode = '#00FF00'
    } else {
        color = 'RED'
        colorCode = '#FF0000'
    }

    // send notifications
    slackSend (
        color: colorCode,
        message: summary,
        channel: '#jenkins',
        teamDomain: 'arquitectura-td',
        tokenCredentialId: 'arquitecturatd_slack_credentials')
}