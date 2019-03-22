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

            stage('Archive the artifacts') {
                dir('./sql/test/reports') {
                    archiveArtifacts "*.*"
                }

                dir('./javascript/reports/test') {
                    archiveArtifacts "*.*"
                }
            } 
            stage('Sonar NodeJS') {
                def sqScannerHome = tool 'sonar-scanner'
                def branchName = env.BRANCH_NAME.capitalize()
                withSonarQubeEnv('Sonar Qube Server') {
                    dir('./javascript') {
                        bat "${sqScannerHome}\\sonar-scanner.bat -Dsonar.host.url=%SONAR_HOST_URL% -Dsonar.login=%SONAR_AUTH_TOKEN% -Dsonar.branch=${branchName} -Dproject.settings=sonar-project-js.properties"
                    }
                }
            }
            stage('Sonar SQL') {
                def sqScannerHome = tool 'sonar-scanner'
                def branchName = env.BRANCH_NAME.capitalize()
                withSonarQubeEnv('Sonar Qube Server') {
                    dir('./sql') {
                        bat "${sqScannerHome}\\sonar-scanner.bat -Dsonar.host.url=%SONAR_HOST_URL% -Dsonar.login=%SONAR_AUTH_TOKEN% -Dsonar.branch=${branchName} -Dproject.settings=sonar-project-js.properties"
                    }
                }
            }
            stage('Sonar Net') {
                def sqScannerMsBuildHome = tool 'sonar-scanner-msbuild'
                def sqScannerHome = tool 'sonar-scanner'
                def msBuildHome = tool 'msbuild'
                def branchName = env.BRANCH_NAME.capitalize()
                withSonarQubeEnv('Sonar Qube Server') {
                    dir('./net/net-nunit') {
                        bat "Nuget.exe restore"
                        bat "${sqScannerMsBuildHome}\\SonarQube.Scanner.MSBuild.exe begin /k:ws.aqt /n:\"AQT - WS - \" /d:sonar.host.url=%SONAR_HOST_URL% /d:sonar.login=%SONAR_AUTH_TOKEN% /d:sonar.branch=${branchName} /d:sonar.inclusions=**/*.cs /d:sonar.cs.opencover.reportsPaths=\"%CD%\\opencover.xml\""
                        bat "\"${msBuildHome}\"\\MSBuild.exe /t:Rebuild"
                        bat "\"%LOCALAPPDATA%\\Apps\\OpenCover\\OpenCover.Console.exe\" -output:\"%CD%\\opencover.xml\" -register:user -target:\"C:\\tools\\net451\\Common7\\IDE\\Extensions\\TestPlatform\\vstest.console.exe\" -targetargs:\"net-nunit.Tests\\bin\\Debug\\net-nunit.Tests.dll\""
                        bat "${sqScannerMsBuildHome}\\SonarQube.Scanner.MSBuild.exe end /d:sonar.login=%SONAR_AUTH_TOKEN%"
                    }
                }
            }
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