# Patrones de diseño: aprender a detectar antes de implementar

Un patrón no es una receta que debés insertar porque reconocés su nombre. Es una
solución conocida para una presión de diseño que ya podés describir y demostrar.

## Diagnóstico en cinco preguntas

1. ¿Qué cambio concreto está resultando costoso o riesgoso?
2. ¿Qué parte varía y cuál debería permanecer estable?
3. ¿Una función, un módulo o composición simple resolverían el problema?
4. ¿Quién necesita extender el comportamiento y con qué frecuencia?
5. ¿El costo de la abstracción es menor que el costo actual del cambio?

Si no podés responder la primera pregunta con un ejemplo real, todavía no necesitás
un patrón. Implementar uno demasiado pronto es construir una autopista donde aún no
existe tránsito.

## Familias

- [Creacionales](creational.md): controlan cómo nacen objetos válidos y compatibles.
- [Estructurales](structural.md): organizan colaboraciones entre componentes existentes.
- [De comportamiento](behavioral.md): distribuyen decisiones, estados y mensajes.

Cada ficha contiene señales, un caso de negocio, el costo y una alternativa sencilla.
Los laboratorios ejecutables implementan únicamente los patrones que sus problemas
justifican.
