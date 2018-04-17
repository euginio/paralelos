// 2. Paralelizar un algoritmo que cuente la cantidad de veces que un elemento X aparece dentro
// de un vector de N elementos enteros. Al finalizar, la cantidad de ocurrencias del elemento X
// debe quedar en una variable llamada ocurrencias. Ejecutar con 2 y 4 threads.

#include <stdio.h>
#include <stdlib.h>

//Dimension por defecto de las matrices
int N, x;
double *vector;
int tot = 0;

//Para calcular tiempo
double dwalltime()
{
  double sec;
  struct timeval tv;

  gettimeofday(&tv, NULL);
  sec = tv.tv_sec + tv.tv_usec / 1000000.0;
  return sec;
}

int main(int argc, char *argv[])
{
  int i, j, k;
  int check = 1;
  double timetick;

  //Controla los argumentos al programa
  if ((argc != 3) || ((N = atoi(argv[1])) <= 0) || ((x = atoi(argv[2])) <= 0))
  {
    printf("\nUsar: %s n\n  n: Dimension del vector N\n", argv[0]);
    printf("\nUsar: %s x\n  x: valor a buscar en el vector\n", argv[0]);
    exit(1);
  }

  //Aloca memoria para las matrices
  vector = (double *)malloc(sizeof(double) * N);
  //Inicializa el vector con todos sus valores en 1
  for (i = 0; i < N; i++)
  {
    vector[i] = 1;
  }
  //Realiza la búsqueda
  timetick = dwalltime();
  for (i = 0; i < N; i++)
  {
    if (vector[i] == x)
    {
      tot = tot + 1;
    }
  }
  printf("Tiempo en segundos %f\n", dwalltime() - timetick);

  printf("tot %d \n", tot);

  free(vector);
  return (0);
}
