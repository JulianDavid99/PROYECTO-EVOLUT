# Diseño de Base de Datos - Evolut

## Tabla usuarios

| Campo           | Tipo PostgreSQL | Restricción     |
| --------------- | --------------- | --------------- |
| id              | SERIAL          | PRIMARY KEY     |
| nombre_completo | VARCHAR(100)    | NOT NULL        |
| correo          | VARCHAR(100)    | UNIQUE NOT NULL |
| contraseña      | VARCHAR(255)    | NOT NULL        |
| fecha_creacion  | TIMESTAMP       | NOT NULL        |

---

## Tabla conversaciones

| Campo          | Tipo PostgreSQL | Restricción |
| -------------- | --------------- | ----------- |
| id             | SERIAL          | PRIMARY KEY |
| titulo         | VARCHAR(150)    | NOT NULL    |
| fecha_creacion | TIMESTAMP       | NOT NULL    |
| usuario_id     | INTEGER         | FOREIGN KEY |

---

## Tabla mensajes

| Campo           | Tipo PostgreSQL | Restricción |
| --------------- | --------------- | ----------- |
| id              | SERIAL          | PRIMARY KEY |
| contenido       | TEXT            | NOT NULL    |
| rol             | VARCHAR(20)     | NOT NULL    |
| fecha_creacion  | TIMESTAMP       | NOT NULL    |
| conversacion_id | INTEGER         | FOREIGN KEY |

---

## Relaciones

Usuario (1) → (N) Conversaciones

Conversación (1) → (N) Mensajes

---

## Reglas relevantes

* El correo electrónico debe ser único.
* La contraseña debe tener mínimo 8 caracteres.
* Los mensajes tendrán un límite máximo de 2000 caracteres.
* Solo el propietario podrá acceder a sus conversaciones.
* Al eliminar una conversación se eliminarán sus mensajes asociados.
