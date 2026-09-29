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
        always {

            // Publicar reportes HTML (opcional)
            publishHTML target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'prod',
                reportFiles: 'index.html',
                reportName: 'Demo Deploy'
            ]

            // Notificación por email con el resultado del build
            emailext(
                subject: "Pipeline ${currentBuild.currentResult}: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h2>Resultado: ${currentBuild.currentResult}</h2>
                    <p><b>URL del Build:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><b>Pruebas:</b> <a href="${env.BUILD_URL}testReport">Ver resultados</a></p>
                    <p><b>Consola:</b> <a href="${env.BUILD_URL}console">Ver logs</a></p>
                """,
                to: 'juan7.valencia@ucp.edu.co', // Cambiar por el correo del destinatario
                mimeType: 'text/html'
            )

            // Limpiar workspace
            cleanWs()
        }
    }
}