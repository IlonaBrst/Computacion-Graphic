# Computación Gráfica - Entrega TP 1
## 17/11/2023

### Miembros del Equipo:
- Ilona Brosset
- Maïwenn Boizumault

### Resumen:
Esta es nuestra entrega para la Práctica 1 de Computación Gráfic. El proyecto se implementa utilizando Three.js y se centra en la creación de atracciones de parque de diversiones, incluyendo una montaña rusa y sillas voladoras.  
Adjunto a este README se encuentra el archivo `main.js`: el archivo JavaScript principal que contiene la implementación de la montaña rusa, las sillas voladoras, cámaras y elementos adicionales.

### Detalles de Implementación:

#### 1. Montaña Rusa:
- **Superficie de Barrido:** La pista de la montaña rusa se genera utilizando la técnica de superficie de barrido. Implementamos la forma utilizando curvas de Bezier cúbicas y la trayectoria utilizando curvas de Catmull-Rom.
- **Tipos de Recorridos:** Se pretendía implementar dos tipos de recorridos seleccionables: uno con autocrucero y otro como un bucle cerrado sin cruces. Ambos deberían contener elevación con tramo inicial ascendente y luego una caída
progresiva.
Sin embargo, hasta ahora no hemos podido implementar ambos, por lo que esta entrega contiene una pista circular por ahora.
- **Carro de la Montaña Rusa:** Modelado utilizando primitivas básicas y superficies de barrido divididas en tres partes para la superficie externa. Se coloca en la montaña rusa.

#### 2. Sillas Voladoras:
- **Generación de Atracción:** La atracción de las sillas voladoras se genera según parámetros que hemos definido, incluyendo el número de sillas y la altura de la estructura.
- **Animación:** Las sillas deben comenzar colgando verticalmente y aumentar gradualmente su ángulo a medida que aumenta la velocidad de rotación. El disco superior se inclina aleatoriamente durante el ciclo de rotación.
Sin embargo, nos encontramos con algunos problemas; el ángulo no dejaba de aumentar, dando como resultado algo bastante descontrolado. Por lo tanto, en esta entrega, no hay aumento de ángulo, pero el disco se inclina.

#### 3. Elementos Adicionales:
- **Entorno:** Se implementa un plano de suelo verde y un fondo celeste que soporta el cielo. Se modeló e instanció un objeto de linterna para admitir fuentes de luz puntual en la siguiente tarea.

#### 4. Cámaras:
- **Cámaras Múltiples:** La tecla 'C' permite cambiar entre diferentes vistas de la cámara, incluyendo vista en primera persona, vista orbital general, vista orbital de la montaña rusa, vista orbital de las sillas voladoras y vista de pasajero desde el carro de la montaña rusa.

### Problemas Conocidos:
- Somos conscientes de un problema menor con la transición de la cámara, que provoca un breve parpadeo. Estamos trabajando en resolver esto en la próxima iteración.
- También somos conscientes, como se mencionó anteriormente, de que faltan algunas características o necesitan mejoras con respecto a la montaña rusa y las sillas voladoras.
- Trabajaremos arduamente para que la próxima entrega sea completa, con la iluminación requerida en la segunda entrega, pero también con todas las funciones de la primera.

### Conclusión:
Disfrutamos mucho trabajando en este proyecto y aprendimos mucho sobre gráficos por computadora y Three.js. ¡Gracias por la oportunidad!
