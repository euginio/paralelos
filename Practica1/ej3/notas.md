3. Describir brevemente cómo funciona el algoritmo multBloques.c que resuelve la 
multiplicación de matrices cuadradas de N*N utilizando una técnica de
multiplicación por bloques. Ejecutar el algoritmo utilizando distintos tamaños de
matrices y distintos tamaño de bloque. Comparar los tiempos con respecto a la
multiplicación de matrices optimizada del ejercicio 1. Según el tamaño de las
matrices y de bloque elegido 

¿Cuál es más rápido? 
    cuando N y r son iguales (ej 32x32)
¿Por qué? 
¿Cuál sería el tamaño de bloque óptimo para un determinado tamaño de matriz?
    El que aproveche mejor el tamaño del buffer

-------------
## notas
Siempre que hablan de dimensión de una matriz o tamaño de la misma se refiere al tamaño del lado (no a la cantidad de elementos)

## Preguntas


## parametros 
1. Cantidad de bloques por dimension (por lado) (N)
2. Dimension de cada bloque (tamaño del lado del bloque) (r)

{
a1,a2,a3,a4,a5,a6,
b1, ...
c1, ...
d1, ...
e1, ...
f1, ...
}
dim matriz = 6 // n
cant de bloques por dimension = 2|3 // 
dimension de cada bloque = 3|2 // r


 int n = N*r; //dimension de la matriz -> 6


 int sizeMatrix=n*n; //cantidad total de datos matriz -> 36
 int sizeBlock=r*r; //cantidad total de datos del bloque -> 3*3|2*2