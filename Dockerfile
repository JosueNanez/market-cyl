# Usar una imagen base de Java (por ejemplo, OpenJDK 11)
FROM openjdk:17

# Establecer el directorio de trabajo en el contenedor
#WORKDIR /usr/app

# Copiar el archivo JAR compilado a la imagen Docker (asegúrate de tener el JAR generado antes)
COPY "./target/Market_CYL-1.0.jar" "app.jar"

# Exponer el puerto 8080 (puerto predeterminado de Spring Boot)
EXPOSE 8080

ENTRYPOINT [ "java", "-jar", "app.jar" ]

# Comando para ejecutar la aplicación
#CMD ["java", "-jar", "your-app-name.jar"]
