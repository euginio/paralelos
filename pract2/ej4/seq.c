// 3. Paralelizar la búsqueda del mínimo y el máximo valor en un vector de N elementos. Ejecutar
// con 2 y 4 Threads.

#include <stdio.h>
#include <stdlib.h>

//Dimension por defecto de las matrices
int N;
double *vector;
int prom;

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
  int i;
  int check = 1;
  double timetick;

  //Controla los argumentos al programa
  if ((argc != 2) || ((N = atoi(argv[1])) <= 0))
  {
    printf("\nUsar: %s n\n  n: Dimension del vector N\n", argv[0]);
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
  int tot = 0;
  timetick = dwalltime();
  for (i = 0; i < N; i++)
  {
    tot = tot + vector[i];
  }
  prom = tot / vector.length;
  printf("Tiempo en segundos %f\n", dwalltime() - timetick);
  printf("prom %d \n", prom);

  free(vector);
  return (0);
}