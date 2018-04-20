//5. Paralelizar un algoritmo que calcule el valor promedio de N elementos almacenados en un vector. Ejecutar con 2 y 4 Threads.

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

//Dimension por defecto de las matrices
int N, P, *vector, tot = 0, prom;
pthread_mutex_t prom_calc_lock;

//Para calcular tiempo
double dwalltime()
{
  double sec;
  struct timeval tv;

  gettimeofday(&tv, NULL);
  sec = tv.tv_sec + tv.tv_usec / 1000000.0;
  return sec;
}

void *prom_calc(void *ptr);

int main(int argc, char *argv[])
{
  int i, check = 1;
  double timetick;

  //Controla los argumentos al programa
  if ((argc != 3) || ((N = atoi(argv[1])) <= 0) || ((P = atoi(argv[2])) <= 0))
  {
    printf("\nUsar: %s n\n  n: Dimension del vector N\n", argv[0]);
    printf("\nUsar: %s P\n  P: cantidad de hilos\n", argv[0]);
    exit(1);
  }

  int ids[P];
  pthread_t threads[P];
  pthread_mutex_init(&prom_calc_lock, NULL);

  //Aloca memoria para las matrices
  vector = (int *)malloc(sizeof(int) * N);
  //Inicializa el vector con todos sus valores en 1
  for (i = 0; i < N; i++)
  {
    vector[i] = 1;
  }
  
  //Realiza la búsqueda
  timetick = dwalltime();
  for (int i = 0; i < P; i++)
  {
    ids[i] = i;
    pthread_create(&threads[i], NULL, prom_calc, &ids[i]);
  }
  for (int i = 0; i < P; i++)
  {
    pthread_join(threads[i], NULL);
  }
  prom = tot / N;
  printf("Tiempo en segundos %f\n", dwalltime() - timetick);

  printf("prom %d \n", prom);

  free(vector);
  return (0);
}

void *prom_calc(void *ptr)
{
  int *p, id;
  p = (int *)ptr;
  id = *p;

  int i, totLoc=0;
  for (i = (N / P * id); i < (N / P * (id + 1)); i++)
  {
    totLoc = totLoc + vector[i];
  }
  pthread_mutex_lock(&prom_calc_lock);
  tot = tot + totLoc;
  pthread_mutex_unlock(&prom_calc_lock);
  pthread_exit(0);
}
