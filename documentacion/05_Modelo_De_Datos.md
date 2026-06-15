# Modelo de Datos - Evolut

## Entidades Principales

### Tabla: usuarios

| Campo           | Tipo      | Descripción                     |
| --------------- | --------- | ------------------------------- |
| id              | INTEGER   | Identificador único del usuario |
| nombre_completo | VARCHAR   | Nombre completo del usuario     |
| correo          | VARCHAR   | Correo electrónico único        |
| contraseña      | VARCHAR   | Contraseña cifrada              |
| fecha_creacion  | TIMESTAMP | Fecha de registro               |

---

### Tabla: conversaciones

| Campo          | Tipo      | Descripción                            |
| -------------- | --------- | -------------------------------------- |
| id             | INTEGER   | Identificador único de la conversación |
| titulo         | VARCHAR   | Título generado por la IA              |
| fecha_creacion | TIMESTAMP | Fecha de creación                      |
| usuario_id     | INTEGER   | Usuario propietario de la conversación |

---

### Tabla: mensajes

| Campo           | Tipo      | Descripción                                         |
| --------------- | --------- | --------------------------------------------------- |
| id              | INTEGER   | Identificador único del mensaje                     |
| contenido       | TEXT      | Contenido del mensaje                               |
| rol             | VARCHAR   | Indica si el mensaje pertenece al usuario o a la IA |
| fecha_creacion  | TIMESTAMP | Fecha y hora del mensaje                            |
| conversacion_id | INTEGER   | Conversación a la que pertenece el mensaje          |

---

## Relaciones

### Usuarios y Conversaciones

Un usuario puede tener múltiples conversaciones.

Una conversación pertenece a un único usuario.

Relación:

1 Usuario → N Conversaciones

---

### Conversaciones y Mensajes

Una conversación puede contener múltiples mensajes.

Un mensaje pertenece a una única conversación.

Relación:

1 Conversación → N Mensajes

---

## Reglas de Negocio Relacionadas

* El correo electrónico debe ser único.
* La contraseña debe tener mínimo 8 caracteres.
* Los mensajes tendrán un límite máximo de 2000 caracteres.
* Solo el propietario podrá acceder a sus conversaciones.
* Al eliminar una conversación se eliminarán sus mensajes asociados.
