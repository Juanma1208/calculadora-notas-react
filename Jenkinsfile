pipeline {
    agent any

    // Requiere el plugin "NodeJS" con una instalación llamada "node22"
    // configurada en Administrar Jenkins > Tools.
    tools {
        nodejs 'node22'
    }

    environment {
        CI = 'true'
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Instalar dependencias') {
            steps {
                script {
                    if (isUnix()) { sh 'npm ci' } else { bat 'npm ci' }
                }
            }
        }

        stage('Pruebas unitarias') {
            steps {
                script {
                    if (isUnix()) { sh 'npm run test:ci' } else { bat 'npm run test:ci' }
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'reports/junit.xml'
                    archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    if (isUnix()) { sh 'npm run build' } else { bat 'npm run build' }
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/**', fingerprint: true
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completado: pruebas OK y build generado.'
        }
        failure {
            echo 'El pipeline ha fallado. Revisa los resultados de las pruebas.'
        }
    }
}
