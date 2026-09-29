pipeline {
    agent any

    // Requiere el plugin NodeJS con una instalación llamada "node22"
    // en Administrar Jenkins > Tools.
    tools {
        nodejs 'node22'
    }

    environment {
        CI = 'true'
    }

    options {
        timestamps()
        skipDefaultCheckout()
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
                sh 'node -v && npm -v'
                sh 'npm ci'
            }
        }

        stage('Pruebas unitarias') {
            steps {
                sh 'npm run test:ci'
            }
            post {
                always {
                    junit 'reports/junit.xml'
                    archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/**', fingerprint: true
                }
            }
        }

        stage('Deploy simulado') {
            steps {
                sh 'mkdir -p prod && cp -r dist/* prod/'
                sh 'ls -la prod'
                echo 'Deploy simulado exitoso: archivos copiados a prod/'
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